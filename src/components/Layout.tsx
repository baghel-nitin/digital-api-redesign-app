import { useState, useEffect, useCallback, useRef } from 'react'
import { Outlet, Link, useLocation, NavLink } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import {
  LayoutDashboard,
  Layers,
  Network,
  Compass,
  Bot,
  BarChart3,
  Shield,
  MessageCircle,
  Settings,
  ChevronDown,
  ChevronRight,
  ChevronFirst,
  Sun,
  Moon,
  User,
  Menu,
  X,
} from 'lucide-react'

const SIDEBAR_COLLAPSED_KEY = 'sidebar-collapsed'

const SIDEBAR_MAIN = [
  { label: 'Helix Dashboard', path: '/dashboard', icon: LayoutDashboard },
  {
    label: 'API Service Hub',
    icon: Layers,
    children: [
      { label: 'API Environments', path: '/api-service-hub/environments' },
      { label: 'API Sources', path: '/api-service-hub/sources' },
      { label: 'API Estate', path: '/api-service-hub/estate' },
      { label: 'API Products', path: '/api-service-hub/products' },
    ],
  },
  {
    label: 'API Gateway',
    icon: Network,
    children: [
      { label: 'API Environments', path: '/api-service-hub/environments' },
      { label: 'API Federator', path: '/api-gateway/federator' },
      { label: 'API Migrator', path: '/api-gateway/migrator' },
    ],
  },
  { label: 'API Experience', path: '/api-experience', icon: Compass },
  {
    label: 'API Copilot',
    icon: Bot,
    children: [{ label: 'API Pilot', path: '/api-copilot' }],
  },
  { label: 'API Analytics', path: '/api-analytics', icon: BarChart3 },
  {
    label: 'Access Control',
    icon: Shield,
    children: [
      { label: 'Groups', path: '/access-control/groups' },
      { label: 'Users', path: '/access-control/users' },
    ],
  },
]

const SIDEBAR_OTHER = [
  { label: 'Support', path: '/support', icon: MessageCircle },
  { label: 'Administration', path: '/administration', icon: Settings },
]

function Breadcrumb() {
  const loc = useLocation()
  const path = loc.pathname
  if (path === '/dashboard' || path === '/') return null
  const segments: { label: string; path: string }[] = []
  if (path.startsWith('/api-service-hub/environments/edit/')) {
    segments.push({ label: 'Manage API Environments', path: '/api-service-hub/environments' })
    segments.push({ label: 'Update Gateway Instance', path: '' })
  } else if (path === '/api-service-hub/environments/new') {
    segments.push({ label: 'Manage API Environments', path: '/api-service-hub/environments' })
    segments.push({ label: 'Add Gateway Instance', path: '' })
  } else if (path === '/api-service-hub/environments') {
    segments.push({ label: 'Manage API Environments', path: path })
  }
  if (segments.length === 0) return null
  return (
    <nav className="flex items-center gap-1.5 text-sm">
      <Link to="/dashboard" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
        Home
      </Link>
      {segments.map((s, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="h-4 w-4 text-[var(--text-muted)]" strokeWidth={1.75} />
          {i === segments.length - 1 ? (
            <span className="font-semibold text-[var(--primary)]">{s.label}</span>
          ) : (
            <Link to={s.path} className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">
              {s.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}

function TrialBanner({ daysLeft = 13 }: { daysLeft?: number }) {
  const isUrgent = daysLeft <= 3

  return (
    <div
      className={`trial-banner flex max-w-min items-center gap-1.5 sm:gap-2 rounded-full overflow-hidden shrink-0 whitespace-nowrap transition-colors duration-300 text-white ${
        isUrgent
          ? 'bg-gradient-to-r from-red-500 to-orange-600'
          : 'bg-gradient-to-r from-amber-500 to-orange-500'
      } px-3 py-1 text-[11px] sm:px-4 sm:py-1.5 sm:text-xs`}
    >
      <span className="hidden sm:inline" aria-hidden>
        {isUrgent ? '🚨' : '⏰'}
      </span>
      <span className="sm:hidden font-medium">{daysLeft}d left</span>
      <span className="hidden sm:inline lg:hidden font-medium">
        Trial expires in {daysLeft} days
      </span>
      <span className="hidden lg:inline font-medium">
        Your Free Trial Expires in {daysLeft} Days
      </span>
      <button
        type="button"
        className={`rounded-full font-bold shrink-0 whitespace-nowrap bg-white transition-all duration-150 hover:scale-105 active:scale-95 px-2 py-0.5 text-[10px] sm:px-3 sm:py-0.5 sm:text-[11px] ${
          isUrgent ? 'text-red-500 hover:bg-red-50' : 'text-orange-500 hover:bg-orange-50'
        }`}
      >
        Upgrade
      </button>
    </div>
  )
}

function useMedia(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })
  useEffect(() => {
    const m = window.matchMedia(query)
    setMatches(m.matches)
    const on = () => setMatches(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [query])
  return matches
}

export function Layout() {
  const isMobile = useMedia('(max-width: 767px)')
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    try {
      const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY)
      if (saved === 'true' || saved === 'false') return saved !== 'true'
      if (typeof window !== 'undefined' && window.matchMedia('(min-width: 768px) and (max-width: 1024px)').matches) return false
      return true
    } catch {
      return true
    }
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedByHover, setExpandedByHover] = useState(false)
  const [expandReady, setExpandReady] = useState(sidebarOpen)
  const expandableKeys = ['API Service Hub', 'API Gateway', 'API Copilot', 'Access Control', 'Administration']
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(expandableKeys.map((k) => [k, false]))
  )
  const [tooltip, setTooltip] = useState<{ label: string; top: number } | null>(null)
  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hoveredItemRef = useRef<HTMLElement | null>(null)
  const hoveredLabelRef = useRef<string | null>(null)
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(!sidebarOpen))
    } catch {}
  }, [sidebarOpen])

  useEffect(() => {
    if (sidebarOpen) {
      const t = setTimeout(() => setExpandReady(true), 100)
      return () => clearTimeout(t)
    } else {
      setExpandReady(false)
    }
  }, [sidebarOpen])

  useEffect(() => {
    if (!isMobile) setMobileMenuOpen(false)
  }, [isMobile])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  // Keep only the section that contains the current route open (accordion)
  useEffect(() => {
    const path = location.pathname
    let openKey: string | null = null
    for (const item of SIDEBAR_MAIN) {
      if ('children' in item && item.children?.some((c) => path === c.path || path.startsWith(c.path + '/'))) {
        openKey = item.label
        break
      }
    }
    setExpanded(() =>
      Object.fromEntries(expandableKeys.map((k) => [k, k === openKey]))
    )
  }, [location.pathname])

  const handleToggle = useCallback(() => {
    setExpandedByHover(false)
    setSidebarOpen((prev) => !prev)
  }, [])

  const handleSidebarMouseEnter = useCallback(() => {
    if (!isMobile && !sidebarOpen) {
      setSidebarOpen(true)
      setExpandedByHover(true)
    }
  }, [isMobile, sidebarOpen])

  const handleSidebarMouseLeave = useCallback(() => {
    if (expandedByHover) {
      setSidebarOpen(false)
      setExpandedByHover(false)
    }
  }, [expandedByHover])

  const handleSidebarLinkClick = useCallback(() => {
    setExpandedByHover(false)
  }, [])

  const showTooltip = useCallback((label: string, el: HTMLElement) => {
    hoveredItemRef.current = el
    hoveredLabelRef.current = label
    if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current)
    tooltipTimerRef.current = setTimeout(() => {
      const item = hoveredItemRef.current
      const l = hoveredLabelRef.current
      if (item && l) {
        const rect = item.getBoundingClientRect()
        setTooltip({ label: l, top: rect.top + rect.height / 2 })
      }
      tooltipTimerRef.current = null
    }, 300)
  }, [])

  const hideTooltip = useCallback(() => {
    if (tooltipTimerRef.current) {
      clearTimeout(tooltipTimerRef.current)
      tooltipTimerRef.current = null
    }
    hoveredItemRef.current = null
    hoveredLabelRef.current = null
    setTooltip(null)
  }, [])

  const collapsed = !sidebarOpen
  const showLabels = sidebarOpen && expandReady
  const isDarkSidebar = theme === 'dark'

  return (
    <div className="flex min-h-screen bg-[var(--bg-base)]">
      {/* Mobile backdrop */}
      {isMobile && mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      {/* Sidebar — hover to expand when collapsed (desktop); no icon when collapsed */}
      <aside
        data-collapsed={collapsed}
        onMouseEnter={!isMobile ? handleSidebarMouseEnter : undefined}
        onMouseLeave={!isMobile ? handleSidebarMouseLeave : undefined}
        className={`sidebar sidebar-transition fixed left-0 top-0 bottom-0 z-50 flex flex-col shrink-0 overflow-visible will-change-[width] ${collapsed ? 'sidebar--collapsed' : ''} ${isMobile ? 'sidebar--mobile' : ''} ${isMobile && mobileMenuOpen ? 'sidebar--mobile-open' : ''}`}
        style={{
          width: isMobile ? 260 : sidebarOpen ? 260 : 64,
          minHeight: '100vh',
          background: isDarkSidebar ? '#0d0f18' : '#FFFFFF',
          borderRight: isMobile && !mobileMenuOpen ? 'none' : isDarkSidebar ? '1px solid #2a2d3a' : '1.5px solid #E5E8F0',
          transform: isMobile ? (mobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)') : undefined,
        }}
      >
        {/* Inner wrapper: clips content; click on any link clears hover-expand so sidebar stays open */}
        <div
          className="flex min-h-full min-w-0 flex-1 flex-col overflow-hidden"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest('a')) handleSidebarLinkClick()
          }}
        >
          {/* Header: D logo + DigitalAPI wordmark + collapse toggle (theme-aware) */}
          <div
            className={`sidebar-header flex h-16 shrink-0 items-center border-b transition-all duration-250 ${
              collapsed ? 'justify-center px-2' : 'justify-between px-4'
            } ${isDarkSidebar ? 'border-[#2a2d3a]' : 'border-[#E5E8F0]'}`}
          >
            <Link
              to="/dashboard"
              className="flex min-w-0 shrink-0 items-center overflow-hidden"
              style={{ gap: 10 }}
              onMouseEnter={(e) => collapsed && showTooltip('DigitalAPI', e.currentTarget)}
              onMouseLeave={hideTooltip}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#4F6FFF] text-base font-black text-white select-none">
                D
              </div>
              {!collapsed && (
                <span
                  className={`sidebar-wordmark origin-left whitespace-nowrap overflow-hidden font-bold text-[15px] tracking-tight transition-all duration-200 ease-out opacity-100 max-w-[160px] ${isDarkSidebar ? 'text-[#e5e7eb]' : 'text-[#111827]'}`}
                  style={{ transitionDelay: '100ms' }}
                >
                  DigitalAPI
                </span>
              )}
            </Link>
            {!collapsed && (
              <button
                type="button"
                onClick={handleToggle}
                aria-label="Collapse sidebar"
                title="Collapse sidebar"
                className={`flex h-8 w-8 shrink-0 cursor-pointer select-none items-center justify-center rounded-lg border outline-none transition-all duration-150 active:scale-95 focus:outline-none focus:ring-0 focus-visible:ring-0 ${
                  isDarkSidebar
                    ? 'border-[#2a2d3a] bg-[#1a1d27] text-[#6b7280] hover:bg-[#1c1f2e] hover:text-[#e5e7eb]'
                    : 'border-[#E5E8F0] bg-[#F4F6FB] text-[#6B7280] hover:bg-[#E8ECF5] hover:text-[#374151]'
                }`}
              >
                <ChevronFirst size={15} strokeWidth={2} className="transition-transform duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] rotate-0" />
              </button>
            )}
          </div>

          <nav className="sidebar-nav flex min-h-0 pt-0 flex-1 flex-col overflow-y-auto overflow-x-hidden py-5 px-3 transition-all duration-250">
          <div className={`sidebar-section ${collapsed ? 'collapsed' : ''}`} style={{ padding: '16px 20px 8px', marginTop: collapsed ? 20 : 0 }}>
            <div className={`uppercase ${isDarkSidebar ? 'text-[#4b5563]' : 'text-[#9CA3AF]'}`} style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.10em' }}>MAIN</div>
          </div>
          <ul className="sidebar-nav-list space-y-2 w-full">
            {SIDEBAR_MAIN.map((item) => {
              const hasChildren = 'children' in item && item.children
              const Icon = item.icon
              const isExp = hasChildren && expanded[item.label]
              const hoverBg = isDarkSidebar ? 'hover:bg-[#1c1f2e]' : 'hover:bg-[#F4F6FB]'
              const hoverText = isDarkSidebar ? 'group-hover:text-[#e5e7eb]' : 'group-hover:text-[#111827]'
              const mutedColor = isDarkSidebar ? '#6b7280' : '#374151'
              const activeBg = isDarkSidebar ? 'bg-[#162035]' : 'bg-[#EEF2FF]'
              const activeText = isDarkSidebar ? 'text-[#4d8ef0]' : 'text-[#2563EB]'
              const accentBar = isDarkSidebar ? '#4d8ef0' : '#2563EB'

              if (hasChildren && item.children) {
                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      className={`nav-item sidebar-nav-item group relative flex items-center rounded-lg gap-2.5 px-2.5 py-1.5 h-9 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-1 ${hoverBg} ${isDarkSidebar ? 'text-[#6b7280]' : 'text-[#374151]'}`}
                      onClick={() => setExpanded((prev) => ({ ...prev, [item.label]: !prev[item.label] }))}
                      onMouseEnter={(e) => collapsed && showTooltip(item.label, e.currentTarget)}
                      onMouseLeave={hideTooltip}
                    >
                      <Icon className={`nav-icon shrink-0 ${hoverText} transition-colors duration-150`} style={{ width: 18, height: 18, color: mutedColor }} strokeWidth={1.75} />
                      <span className={`nav-label sidebar-nav-label flex-1 text-left ${hoverText} whitespace-nowrap overflow-hidden transition-all duration-200 ${showLabels ? '' : 'collapsed'}`} style={{ fontSize: 13, fontWeight: 500, color: mutedColor }}>
                        {item.label}
                      </span>
                      <ChevronDown
                        className={`nav-chevron sidebar-nav-chevron shrink-0 transition-transform duration-250 ease-[cubic-bezier(0.4,0,0.2,1)] ${showLabels ? '' : 'collapsed'}`}
                        style={{ width: 14, height: 14, color: isDarkSidebar ? '#4b5563' : '#9CA3AF', transform: isExp ? 'rotate(-180deg)' : 'rotate(0deg)' }}
                        strokeWidth={1.75}
                      />
                    </button>
                    <div
                      className="sidebar-submenu"
                      style={{ maxHeight: isExp && showLabels ? 400 : 0 }}
                      data-expanded={isExp && showLabels}
                    >
                      <div className="sidebar-submenu-inner">
                        {item.children.map((child, idx) => (
                          <NavLink
                            key={child.path + child.label}
                            to={child.path}
                            className={({ isActive: a }) =>
                              `sidebar-submenu-item block rounded-lg px-3 transition-colors duration-150 ${isDarkSidebar ? 'hover:bg-[#1c1f2e] hover:text-[#e5e7eb]' : 'hover:bg-[#F4F6FB] hover:text-[#374151]'} ${a ? `${activeBg} font-semibold ${activeText}` : isDarkSidebar ? 'text-[#6b7280]' : 'text-[#6B7280]'}`
                            }
                            style={{
                              height: 36,
                              margin: '4px 8px 4px 28px',
                              fontSize: 13,
                              fontWeight: 400,
                              lineHeight: '34px',
                              animationDelay: isExp && showLabels ? `${idx * 30}ms` : undefined,
                            }}
                          >
                            {child.label}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </li>
                )
              }
              return (
                <li key={item.label}>
                  <NavLink
                    to={item.path!}
                    className={({ isActive: a }) =>
                      `nav-item sidebar-nav-item relative flex items-center rounded-lg gap-2.5 px-2.5 py-1.5 h-9 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-1 ${hoverBg} ${a ? `${activeText} font-semibold` : isDarkSidebar ? 'text-[#6b7280]' : 'text-[#374151]'} ${a ? activeBg : ''} ${a && collapsed ? `${activeBg} ring-1 ring-[#2563EB]/20` : ''}`
                    }
                    onMouseEnter={(e) => collapsed && showTooltip(item.label, e.currentTarget)}
                    onMouseLeave={hideTooltip}
                  >
                    {({ isActive: a }) => (
                      <>
                        {a && !collapsed && (
                          <span
                            className="sidebar-accent-bar absolute left-[-10px] top-1.5 bottom-1.5 w-[3px] rounded-r-full"
                            style={{ backgroundColor: accentBar, transformOrigin: 'center' }}
                          />
                        )}
                        <Icon className="nav-icon shrink-0 transition-colors duration-150" style={{ width: 18, height: 18, color: a ? (isDarkSidebar ? '#4d8ef0' : '#2563EB') : mutedColor }} strokeWidth={1.75} />
                        <span className={`nav-label sidebar-nav-label flex-1 whitespace-nowrap overflow-hidden transition-all duration-200 ${showLabels ? '' : 'collapsed'}`} style={{ fontSize: 13, fontWeight: a ? 600 : 500, color: a ? (isDarkSidebar ? '#4d8ef0' : '#2563EB') : mutedColor }}>
                          {item.label}
                        </span>
                      </>
                    )}
                  </NavLink>
                </li>
              )
            })}
          </ul>

          <div className={`sidebar-section ${collapsed ? 'collapsed' : ''}`} style={{ padding: collapsed ? 0 : '20px 20px 8px', marginTop: collapsed ? 20 : 0 }}>
            <div className={`uppercase ${isDarkSidebar ? 'text-[#4b5563]' : 'text-[#9CA3AF]'}`} style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.10em' }}>OTHER</div>
          </div>
          <ul className="sidebar-nav-list space-y-2 w-full">
            {SIDEBAR_OTHER.map((item) => {
              const Icon = item.icon
              const hoverBg = isDarkSidebar ? 'hover:bg-[#1c1f2e]' : 'hover:bg-[#F4F6FB]'
              const mutedColor = isDarkSidebar ? '#6b7280' : '#374151'
              const activeBg = isDarkSidebar ? 'bg-[#162035]' : 'bg-[#EEF2FF]'
              const activeText = isDarkSidebar ? 'text-[#4d8ef0]' : 'text-[#2563EB]'
              const accentBar = isDarkSidebar ? '#4d8ef0' : '#2563EB'
              return (
                <li key={item.label}>
                  <NavLink
                    to={item.path}
                    className={({ isActive: a }) =>
                      `nav-item sidebar-nav-item relative flex items-center rounded-lg gap-2.5 px-2.5 py-1.5 h-9 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-1 ${hoverBg} ${a ? `${activeText} font-semibold` : ''} ${a ? activeBg : ''} ${a && collapsed ? `!${activeBg} ring-1 ring-[#2563EB]/20` : ''} ${!a ? (isDarkSidebar ? 'text-[#6b7280]' : 'text-[#374151]') : ''}`
                    }
                    onMouseEnter={(e) => collapsed && showTooltip(item.label, e.currentTarget)}
                    onMouseLeave={hideTooltip}
                  >
                    {({ isActive: a }) => (
                      <>
                        {a && !collapsed && (
                          <span
                            className="sidebar-accent-bar absolute left-[-10px] top-1.5 bottom-1.5 w-[3px] rounded-r-full"
                            style={{ backgroundColor: accentBar, transformOrigin: 'center' }}
                          />
                        )}
                        <Icon className="nav-icon shrink-0 transition-colors duration-150" style={{ width: 18, height: 18, color: a ? (isDarkSidebar ? '#4d8ef0' : '#2563EB') : mutedColor }} strokeWidth={1.75} />
                        <span className={`nav-label sidebar-nav-label flex-1 whitespace-nowrap overflow-hidden transition-all duration-200 ${showLabels ? '' : 'collapsed'}`} style={{ fontSize: 13, fontWeight: a ? 600 : 500, color: a ? (isDarkSidebar ? '#4d8ef0' : '#2563EB') : mutedColor }}>
                          {item.label}
                        </span>
                      </>
                    )}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className={`sidebar-bottom-card shrink-0 ${collapsed ? 'collapsed' : ''}`}>
          <div className="p-3">
            <div className={`rounded-xl border p-[14px] ${isDarkSidebar ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-[#F4F6FB] border-[#E5E8F0]'}`}>
              <p className={`text-[13px] font-semibold ${isDarkSidebar ? 'text-[#e5e7eb]' : 'text-[#111827]'}`}>Need help?</p>
              <p className={`mt-1 text-[12px] ${isDarkSidebar ? 'text-[#6b7280]' : 'text-[#6B7280]'}`}>Check our docs or contact support.</p>
              <button
                type="button"
                className={`mt-2 flex h-8 w-full items-center justify-center rounded-lg border bg-transparent text-xs font-medium transition ${isDarkSidebar ? 'border-[#2a2d3a] text-[#e5e7eb] hover:bg-[#1c1f2e]' : 'border-[#E5E8F0] text-[#374151] hover:bg-[#E8ECF5]'}`}
              >
                View Docs
              </button>
            </div>
          </div>
        </div>
        </div>
      </aside>

      {/* Spacer for fixed sidebar (hidden on mobile when overlay) */}
      {!isMobile && <div className="shrink-0" style={{ width: sidebarOpen ? 260 : 64 }} />}

      {tooltip && collapsed && (
        <div
          className="sidebar-tooltip fixed z-[100] rounded-lg shadow-lg"
          style={{
            left: 72,
            top: tooltip.top,
            transform: 'translateY(-50%)',
            background: isDarkSidebar ? '#1F2937' : '#FFFFFF',
            padding: '6px 12px',
            fontSize: 12,
            fontWeight: 500,
            borderRadius: 8,
            color: isDarkSidebar ? '#FFFFFF' : '#111827',
            border: isDarkSidebar ? 'none' : '1px solid #E5E8F0',
            pointerEvents: 'none',
          }}
        >
          <span
            className="absolute left-0 top-1/2 -translate-y-1/2"
            style={{
              marginLeft: -6,
              width: 0,
              height: 0,
              borderTop: '6px solid transparent',
              borderBottom: '6px solid transparent',
              borderRight: `6px solid ${isDarkSidebar ? '#1F2937' : '#FFFFFF'}`,
            }}
            aria-hidden
          />
          {tooltip.label}
        </div>
      )}

      <div className="flex flex-1 flex-col min-w-0">
        <header className="relative sticky top-0 z-10 flex h-14 sm:h-[65px] items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--bg-surface)] px-4 sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {isMobile && (
              <button
                type="button"
                onClick={() => setMobileMenuOpen((o) => !o)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" strokeWidth={1.75} /> : <Menu className="h-5 w-5" strokeWidth={1.75} />}
              </button>
            )}
            <div className="min-w-0 flex-1">
              <Breadcrumb />
            </div>
          </div>
          {/* Trial banner — centered in the middle of the header */}
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <TrialBanner daysLeft={13} />
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">Business Domain</p>
              <p className="text-[13px] font-semibold text-[var(--text-primary)]">DoodleBlue Innovation</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] text-white">
              <User className="h-4 w-4" strokeWidth={1.75} />
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" strokeWidth={1.75} /> : <Sun className="h-4 w-4" strokeWidth={1.75} />}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-[1280px] p-8">
            <Outlet />
          </div>
        </main>

        <footer className="border-t border-[var(--border)] py-3 px-8 text-center text-sm text-[var(--text-muted)]">
          ©2026 Copyright DigitalAPI
        </footer>
      </div>

      <a
        href="#"
        className="fixed bottom-6 right-6 z-30 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)] text-white shadow-lg transition hover:scale-105"
        aria-label="Chat"
      >
        <MessageCircle className="h-5 w-5" strokeWidth={1.75} />
      </a>
    </div>
  )
}
