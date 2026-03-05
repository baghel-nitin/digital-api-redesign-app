import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Cloud, Pencil, Plus, Check, AlertTriangle, XCircle, ArrowRight, MoreHorizontal, Server, Bell, Loader2, Eye, Copy, Trash2 } from 'lucide-react'
import { AVAILABLE_GATEWAYS, GATEWAY_LOGOS } from '../constants/gateways'

const MOCK_INSTANCES = [
  {
    id: '69a6b2f1a9be934294d6937d',
    name: 'DOODLEBLUE-INNOVATION-DEFAULT-VIRTUAL-GATEWAY-INSTANCE',
    gatewayId: 'HELIX_GATEWAY',
    businessDomain: 'DoodleBlue Innovation',
    status: 'Active',
    lastUpdated: '2026-03-03T15:37:45',
    lastPingMinutesAgo: 2,
    region: 'Southern Asia',
    country: 'India',
    type: 'Virtual',
  },
]

function formatRelativeTime(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000))
  const diffHours = Math.floor(diffMs / (60 * 60 * 1000))
  const diffMins = Math.floor(diffMs / (60 * 1000))
  if (diffDays >= 1) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  if (diffHours >= 1) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffMins >= 1) return `${diffMins} min ago`
  return 'Just now'
}

function splitInstanceName(name: string): { bizName: string; suffix: string } {
  const parts = name.split('-')
  if (parts.length <= 2) return { bizName: name, suffix: '' }
  const bizName = parts.slice(0, 2).join('-')
  const suffix = parts.slice(2).join('-')
  return { bizName, suffix }
}

const QUOTA_STATUS = {
  normal: {
    bar: 'linear-gradient(90deg, #2563EB, #60A5FA)',
    icon: Check,
    iconClass: 'text-[var(--success)]',
    textClass: 'text-[var(--text-muted)]',
    showCTA: false,
  },
  warning: {
    bar: 'linear-gradient(90deg, #F59E0B, #FBBF24)',
    icon: AlertTriangle,
    iconClass: 'text-amber-500',
    textClass: 'text-amber-600',
    showCTA: false,
  },
  danger: {
    bar: 'linear-gradient(90deg, #EF4444, #F87171)',
    icon: XCircle,
    iconClass: 'text-red-500',
    textClass: 'text-red-500',
    showCTA: true,
  },
} as const

function getFooterMessage(used: number, total: number, quotaType: string): string {
  const type = quotaType.toLowerCase()
  if (used >= total) return `${used} of ${total} ${type} used — upgrade to add more`
  if (total && used / total >= 0.8) return `${used} of ${total} ${type} used — running low`
  return `${used} of ${total} ${type} used on your current plan`
}

function QuotaCard({
  label,
  used,
  total,
  quotaType,
}: {
  label: string
  used: number
  total: number
  quotaType: 'APIs' | 'gateways'
}) {
  const [width, setWidth] = useState(0)
  const pct = total ? (used / total) * 100 : 0
  const status: keyof typeof QUOTA_STATUS = pct >= 100 ? 'danger' : pct >= 80 ? 'warning' : 'normal'
  const config = QUOTA_STATUS[status]
  const Icon = config.icon
  const footerMessage = getFooterMessage(used, total, quotaType)

  useEffect(() => {
    const t = setTimeout(() => setWidth(Math.min(pct, 100)), 100)
    return () => clearTimeout(t)
  }, [pct])

  return (
    <div className="rounded-[14px] border border-[var(--border)] bg-[var(--bg-surface)] p-5">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-[var(--text-secondary)]">{label}</span>
        <span className="flex items-center gap-1.5 text-[14px] font-bold text-[var(--text-primary)]">
          {status !== 'normal' && <Icon className={`h-4 w-4 ${config.iconClass}`} strokeWidth={2} />}
          {used} / {total}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--bg-elevated)]">
        <motion.div
          className="h-full rounded-full"
          style={{ background: config.bar }}
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <span className={`text-[12px] ${config.textClass}`}>{footerMessage}</span>
        {config.showCTA && (
          <Link
            to="#"
            className="inline-flex shrink-0 items-center gap-1 text-[12px] font-semibold text-[var(--primary)] hover:underline"
            title="Upgrade to Pro for unlimited APIs"
          >
            Upgrade
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </Link>
        )}
      </div>
    </div>
  )
}

function GatewayProviderCard({
  id,
  name,
  comingSoon,
  isRecommended,
  onNotify,
  isNotified,
}: {
  id: string
  name: string
  comingSoon: boolean
  isRecommended?: boolean
  onNotify?: () => void
  isNotified?: boolean
}) {
  const logo = GATEWAY_LOGOS[id]

  if (comingSoon) {
    return (
      <div className="group relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 transition-all duration-200 hover:border-[var(--border)] hover:shadow-sm min-h-[120px] cursor-pointer">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center">
          {logo ? (
            <img src={logo} alt={name} className="h-10 w-10 object-contain" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
          ) : (
            <Cloud className="h-10 w-10 text-[var(--text-secondary)]" strokeWidth={1.5} />
          )}
        </div>
        <span className="text-center text-xs font-semibold text-[var(--text-primary)]">{name}</span>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl bg-[var(--bg-surface)]/90 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
          {logo && <img src={logo} alt="" className="h-7 w-7 object-contain opacity-50" />}
          <span className="rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-primary)]">
            Coming Soon
          </span>
          {isNotified ? (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
              <Check className="h-3 w-3" strokeWidth={2} />
              Notified
            </span>
          ) : (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onNotify?.() }}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--primary)] underline-offset-2 transition-colors duration-150 hover:underline hover:text-[var(--primary)]/80"
            >
              <Bell className="h-3 w-3" strokeWidth={1.75} />
              Notify me
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <Link
      to={`/api-service-hub/environments/edit/new?gateway=${id}`}
      className="relative flex flex-col items-center rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 text-center transition-all duration-180 hover:border-[var(--primary)]/50 hover:shadow-[0_0_0_1px_rgba(79,111,255,0.15),0_4px_12px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 min-h-[120px]"
    >
      {isRecommended && (
        <>
          <div className="absolute -top-px left-3 right-3 h-0.5 rounded-full bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent" />
          <span className="absolute top-2 right-2 rounded bg-[var(--primary)]/10 px-1.5 py-0.5 text-[9px] font-bold text-[var(--primary)]">
            NATIVE
          </span>
        </>
      )}
      <div className="flex h-10 w-10 items-center justify-center shrink-0">
        {logo ? (
          <img src={logo} alt={name} className="h-10 w-10 object-contain" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        ) : (
          <Cloud className="h-10 w-10 text-[var(--text-secondary)]" strokeWidth={1.5} />
        )}
      </div>
      <span className="mt-2 text-[13px] font-semibold text-[var(--text-primary)]">{name}</span>
    </Link>
  )
}

export function ManageEnvironments() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [domainFilter, setDomainFilter] = useState<string>('all')
  const [moreOpenId, setMoreOpenId] = useState<string | null>(null)
  const [notified, setNotified] = useState<string[]>([])
  const [testResultById, setTestResultById] = useState<Record<string, 'success' | 'fail'>>({})
  const [testingId, setTestingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [instances, setInstances] = useState<typeof MOCK_INSTANCES>(MOCK_INSTANCES)

  const activeCount = AVAILABLE_GATEWAYS.filter((g) => !g.comingSoon).length
  const sortedGateways = [...AVAILABLE_GATEWAYS].sort((a, b) => (a.comingSoon === b.comingSoon ? 0 : a.comingSoon ? 1 : -1))
  const gatewayNameById: Record<string, string> = Object.fromEntries(AVAILABLE_GATEWAYS.map((g) => [g.id, g.name]))

  const handleAddInstance = () => {
    navigate('/api-service-hub/environments/new')
  }

  const handleNotify = (providerName: string) => {
    setNotified((prev) => (prev.includes(providerName) ? prev : [...prev, providerName]))
  }

  const handleTest = async (instanceId: string) => {
    setTestingId(instanceId)
    setTestResultById((prev) => { const n = { ...prev }; delete n[instanceId]; return n })
    await new Promise((r) => setTimeout(r, 800))
    setTestResultById((prev) => ({ ...prev, [instanceId]: 'success' }))
    setTestingId(null)
    setTimeout(() => setTestResultById((prev) => { const n = { ...prev }; delete n[instanceId]; return n }), 3000)
  }

  const handleDuplicate = (instanceId: string) => {
    const inst = instances.find((i) => i.id === instanceId)
    if (!inst) return
    setInstances((prev) => [...prev, { ...inst, id: `${inst.id}-copy-${Date.now()}`, name: `${inst.name}-COPY` }])
    setMoreOpenId(null)
  }

  const handleDelete = (instanceId: string) => {
    setInstances((prev) => prev.filter((i) => i.id !== instanceId))
    setConfirmDeleteId(null)
    setMoreOpenId(null)
  }

  const filteredInstances = instances.filter((inst) => {
    const matchSearch =
      !search ||
      inst.name.toLowerCase().includes(search.toLowerCase()) ||
      (gatewayNameById[inst.gatewayId]?.toLowerCase().includes(search.toLowerCase())) ||
      (inst.region?.toLowerCase().includes(search.toLowerCase())) ||
      (inst.country?.toLowerCase().includes(search.toLowerCase()))
    const matchDomain = domainFilter === 'all' || (inst as { businessDomain?: string }).businessDomain === domainFilter
    return matchSearch && matchDomain
  })

  const businessDomains = Array.from(new Set(instances.map((i) => (i as { businessDomain?: string }).businessDomain).filter(Boolean))) as string[]

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Manage API Environments</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Connect, configure, and oversee all your API gateway instances from one place
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddInstance}
          className="flex shrink-0 items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Add Instance
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <QuotaCard label="APIs Left" used={45} total={50} quotaType="APIs" />
        <QuotaCard label="Gateway Left" used={10} total={10} quotaType="gateways" />
      </div>

      <section id="add-new-instance">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-[15px] font-semibold text-[var(--text-primary)]">Add New Instance</h2>
          <span className="rounded-full bg-[var(--primary)]/10 px-2 py-0.5 text-xs font-medium text-[var(--primary)]">
            {activeCount} available
          </span>
        </div>
        <p className="mt-1 text-[13px] text-[var(--text-muted)]">
          Connect your existing API gateway or try Helix Gateway — DigitalAPI&apos;s built-in solution. Click any provider to begin setup.
        </p>
        <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3">
          {sortedGateways.filter((g) => !g.comingSoon).map((gw) => (
            <GatewayProviderCard
              key={gw.id}
              id={gw.id}
              name={gw.name}
              comingSoon={false}
              isRecommended={gw.id === 'HELIX_GATEWAY'}
            />
          ))}
        </div>
        {sortedGateways.some((g) => g.comingSoon) && (
          <>
            <div className="mt-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-[var(--border)]" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Coming Soon</span>
              <span className="h-px flex-1 bg-[var(--border)]" />
            </div>
            <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3">
              {sortedGateways.filter((g) => g.comingSoon).map((gw) => (
                <GatewayProviderCard
                  key={gw.id}
                  id={gw.id}
                  name={gw.name}
                  comingSoon
                  onNotify={() => handleNotify(gw.name)}
                  isNotified={notified.includes(gw.name)}
                />
              ))}
            </div>
          </>
        )}
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-[15px] font-semibold text-[var(--text-primary)]">Existing Instances</h2>
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="h-9 w-[180px] rounded-[10px] border border-[var(--border)] bg-[var(--bg-elevated)] px-3 text-[13px] text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]"
          >
            <option value="all">All domains</option>
            {businessDomains.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" strokeWidth={1.75} />
          <input
            type="search"
            placeholder="Search by name, gateway type, or region..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-[10px] border border-[var(--border)] bg-[var(--bg-surface)] py-0 pl-9 pr-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)]/50 transition focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]"
          />
        </div>

        {instances.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-elevated)]/30 py-12 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)]/10">
              <Server className="h-6 w-6 text-[var(--primary)]" strokeWidth={1.75} />
            </div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">No instances yet</h3>
            <p className="mt-1 max-w-[240px] text-xs text-[var(--text-muted)]">
              Connect your first API gateway above to start managing your environments from one place.
            </p>
            <button type="button" onClick={handleAddInstance} className="mt-4 rounded-lg bg-[var(--primary)] px-4 py-2 text-xs font-medium text-white hover:opacity-90">
              + Add First Instance
            </button>
          </div>
        ) : filteredInstances.length === 0 ? (
          <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/30 py-8 text-center text-sm text-[var(--text-muted)]">
            {search ? (
              <>No instances found for &quot;<strong className="text-[var(--text-primary)]">{search}</strong>&quot;</>
            ) : (
              'No instances match the selected domain.'
            )}
          </div>
        ) : (
          <ul className="mt-3 space-y-2">
            {filteredInstances.map((inst) => {
              const { bizName, suffix } = splitInstanceName(inst.name)
              const logo = inst.gatewayId && GATEWAY_LOGOS[inst.gatewayId]
              return (
                <li
                  key={inst.id}
                  className="flex flex-col gap-3 rounded-[12px] border border-[var(--border)] bg-[var(--bg-surface)] p-4 transition-all duration-150 hover:border-[var(--primary)]/30 hover:shadow-[0_2px_12px_rgba(0,0,0,0.3)] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-elevated)]">
                      {logo ? (
                        <img src={logo} alt="" className="h-8 w-8 object-contain" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                      ) : (
                        <Cloud className="h-5 w-5 text-[var(--text-secondary)]" strokeWidth={1.75} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{bizName}</p>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--success-light)] px-2 py-0.5 text-[11px] font-semibold text-[var(--success)]">
                          <span className="status-pulse h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
                          Active
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-[var(--text-muted)]">{suffix || inst.name}</p>
                      <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                        Last ping: {inst.lastPingMinutesAgo}min ago · Updated {formatRelativeTime(inst.lastUpdated)}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {inst.type && (
                          <span className="rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--text-muted)]">
                            {inst.type}
                          </span>
                        )}
                        {inst.region && (
                          <span className="rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--text-muted)]">
                            {inst.region}
                          </span>
                        )}
                        {inst.country && (
                          <span className="rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--text-muted)]">
                            {inst.country}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:shrink-0">
                    <button
                      type="button"
                      disabled={testingId === inst.id}
                      onClick={() => handleTest(inst.id)}
                      className={`flex h-8 items-center justify-center rounded-lg border px-3 text-xs font-medium transition-all duration-150 ${
                        testingId === inst.id
                          ? 'cursor-wait border-[var(--border)] opacity-60'
                          : testResultById[inst.id] === 'success'
                            ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400'
                            : testResultById[inst.id] === 'fail'
                              ? 'border-red-500/30 bg-red-500/15 text-red-400'
                              : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)]/30 hover:bg-[var(--primary)]/5 hover:text-[var(--primary)]'
                      }`}
                    >
                      {testingId === inst.id && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" strokeWidth={1.75} />}
                      {testResultById[inst.id] === 'success' && !testingId && <Check className="mr-1.5 h-3.5 w-3.5" strokeWidth={2} />}
                      {testResultById[inst.id] === 'fail' && !testingId && <XCircle className="mr-1.5 h-3.5 w-3.5" strokeWidth={2} />}
                      {testingId === inst.id && 'Testing...'}
                      {testResultById[inst.id] === 'success' && !testingId && 'Connected'}
                      {testResultById[inst.id] === 'fail' && !testingId && 'Failed'}
                      {!testResultById[inst.id] && testingId !== inst.id && 'Test'}
                    </button>
                    <Link
                      to={`/api-service-hub/environments/edit/${inst.id}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-secondary)] transition hover:bg-[var(--bg-elevated)]"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" strokeWidth={1.75} />
                    </Link>
                    <div className="relative">
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] transition hover:bg-[var(--bg-elevated)]"
                        aria-label="More"
                        onClick={() => setMoreOpenId(moreOpenId === inst.id ? null : inst.id)}
                      >
                        <MoreHorizontal className="h-4 w-4" strokeWidth={1.75} />
                      </button>
                      {moreOpenId === inst.id && (
                        <>
                          <div className="fixed inset-0 z-10" aria-hidden onClick={() => setMoreOpenId(null)} />
                          <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] py-1 shadow-lg">
                            <button
                              type="button"
                              onClick={() => { navigate(`/api-service-hub/environments/edit/${inst.id}`); setMoreOpenId(null) }}
                              className="flex w-full items-center px-3 py-1.5 text-left text-xs text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                            >
                              <Eye className="mr-2 h-3.5 w-3.5" strokeWidth={1.75} />
                              View details
                            </button>
                            <button
                              type="button"
                              onClick={() => { navigate(`/api-service-hub/environments/edit/${inst.id}`); setMoreOpenId(null) }}
                              className="flex w-full items-center px-3 py-1.5 text-left text-xs text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                            >
                              <Pencil className="mr-2 h-3.5 w-3.5" strokeWidth={1.75} />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => { handleTest(inst.id); setMoreOpenId(null) }}
                              className="flex w-full items-center px-3 py-1.5 text-left text-xs text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                            >
                              Test Connection
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDuplicate(inst.id)}
                              className="flex w-full items-center px-3 py-1.5 text-left text-xs text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                            >
                              <Copy className="mr-2 h-3.5 w-3.5" strokeWidth={1.75} />
                              Duplicate
                            </button>
                            <div className="my-1 border-t border-[var(--border)]" />
                            <button
                              type="button"
                              onClick={() => { setConfirmDeleteId(inst.id); setMoreOpenId(null) }}
                              className="flex w-full items-center px-3 py-1.5 text-left text-xs text-red-400 hover:bg-red-500/15"
                            >
                              <Trash2 className="mr-2 h-3.5 w-3.5" strokeWidth={1.75} />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {confirmDeleteId && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40" aria-hidden onClick={() => setConfirmDeleteId(null)} />
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-xl">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">Delete this instance?</h3>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              This will permanently remove the gateway instance and cannot be undone. Any connected APIs may stop working.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(confirmDeleteId)}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                Delete Instance
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
