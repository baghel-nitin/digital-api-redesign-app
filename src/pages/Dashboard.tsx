import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Globe,
  GitBranch,
  Database,
  Package,
  Wifi,
  ArrowLeftRight,
  FileText,
  ShoppingBag,
  Bot,
  BarChart3,
  Shield,
  Users,
  BookOpen,
  Server,
  Code2,
  Activity,
  PieChart,
  ArrowRight,
  Check,
  Circle,
  X,
  Zap,
} from 'lucide-react'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } }
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }

const USER_NAME = 'Alex'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

const QUICK_STATS = [
  { label: 'Active Gateways', value: '1', icon: Server, iconColor: 'text-blue-400', iconBg: 'bg-blue-500/15' },
  { label: 'APIs Registered', value: '50', icon: Code2, iconColor: 'text-violet-400', iconBg: 'bg-violet-500/15' },
  { label: 'API Calls Today', value: '2.4k', icon: Activity, iconColor: 'text-emerald-400', iconBg: 'bg-emerald-500/15' },
  { label: 'Plan Usage', value: '100%', icon: PieChart, iconColor: 'text-red-400', iconBg: 'bg-red-500/15' },
]

const ONBOARDING_STEPS = [
  { id: 1, label: 'Connect a gateway', key: 'gateway' },
  { id: 2, label: 'Register first API', key: 'apis' },
  { id: 3, label: 'Set up dev portal', key: 'portal' },
  { id: 4, label: 'Invite team member', key: 'team' },
]

function SectionHeader({
  title,
  subtitle,
  count,
}: {
  title: string
  subtitle: string
  count: number
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-1 self-stretch shrink-0 rounded-full bg-[var(--primary)]" />
        <div>
          <h2 className="text-[15px] font-semibold text-[var(--text-primary)]">{title}</h2>
          <p className="mt-0.5 text-xs text-[var(--text-muted)]">{subtitle}</p>
        </div>
      </div>
      <span className="shrink-0 self-start rounded-full bg-[var(--bg-elevated)] px-2.5 py-1 text-xs font-medium text-[var(--text-muted)]">
        {count} {count === 1 ? 'tool' : 'tools'}
      </span>
    </div>
  )
}

type CardStatus = 'active' | 'idle' | 'coming-soon' | 'beta'

function FeatureCard({
  card,
  isCurrentPage,
}: {
  card: {
    id: string
    title: string
    description: string
    icon: React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>
    path: string
    status: CardStatus
    statusLabel?: string
    quickAction: string
  }
  isCurrentPage: boolean
}) {
  const Icon = card.icon
  const isComingSoon = card.status === 'coming-soon'

  return (
    <motion.div variants={item}>
      <Link
        to={card.path}
        className={`group relative flex flex-col gap-3 rounded-xl border bg-[var(--bg-surface)] p-5 transition-all duration-200 ${
          isCurrentPage
            ? 'border-[var(--primary)]/60 ring-2 ring-[var(--primary)]/10'
            : 'border-[var(--border)] hover:border-[var(--primary)]/40 hover:shadow-[0_0_0_1px_rgba(79,111,255,0.15)]'
        } ${!isComingSoon ? 'hover:-translate-y-0.5' : 'hover:translate-y-0'}`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 transition-colors group-hover:bg-[var(--primary)]/15">
            <Icon size={20} className="text-[var(--primary)]" strokeWidth={1.75} />
          </div>
          {card.status === 'active' && card.statusLabel && (
            <span className="flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {card.statusLabel}
            </span>
          )}
          {card.status === 'idle' && card.statusLabel && (
            <span className="rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-muted)]">
              {card.statusLabel}
            </span>
          )}
          {card.status === 'coming-soon' && (
            <span className="rounded-full border border-slate-400/20 bg-slate-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Coming Soon
            </span>
          )}
          {card.status === 'beta' && (
            <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-400">
              Beta
            </span>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">{card.title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">{card.description}</p>
        </div>
        {!isComingSoon && (
          <div className="flex items-center gap-1 text-xs font-semibold text-[var(--primary)] opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 -translate-y-1">
            {card.quickAction}
            <ArrowRight size={12} strokeWidth={2} />
          </div>
        )}
      </Link>
    </motion.div>
  )
}

const SECTIONS = [
  {
    id: 'service-hub',
    title: 'API Service Hub',
    subtitle: 'Register, manage, and organize all your APIs in one place',
    count: 4,
    cards: [
      {
        id: 'api-environments',
        title: 'API Environments',
        description: 'Connect AWS, Azure, Kong and more. 1 gateway active.',
        icon: Globe,
        path: '/api-service-hub/environments',
        status: 'active' as CardStatus,
        statusLabel: '1 connected',
        quickAction: 'Manage',
      },
      {
        id: 'api-sources',
        title: 'API Sources',
        description: 'Import APIs from OpenAPI specs, Postman, or live endpoints.',
        icon: GitBranch,
        path: '/api-service-hub/sources',
        status: 'idle' as CardStatus,
        statusLabel: 'Not configured',
        quickAction: 'Set up',
      },
      {
        id: 'api-estate',
        title: 'API Estate',
        description: 'See all 50 registered APIs, their status, and ownership.',
        icon: Database,
        path: '/api-service-hub/estate',
        status: 'idle' as CardStatus,
        statusLabel: '50 APIs',
        quickAction: 'View',
      },
      {
        id: 'api-products',
        title: 'API Products',
        description: 'Bundle APIs into products and control who can access them.',
        icon: Package,
        path: '/api-service-hub/products',
        status: 'idle' as CardStatus,
        statusLabel: 'Not configured',
        quickAction: 'Set up',
      },
    ],
  },
  {
    id: 'gateway',
    title: 'API Gateway',
    subtitle: 'Connect and configure your gateway instances',
    count: 2,
    cards: [
      {
        id: 'api-federator',
        title: 'API Federator',
        description: 'Unify APIs from multiple gateways into a single endpoint.',
        icon: Wifi,
        path: '/api-gateway/federator',
        status: 'idle' as CardStatus,
        statusLabel: 'Not configured',
        quickAction: 'Configure',
      },
      {
        id: 'api-migrator',
        title: 'API Migrator',
        description: 'Move APIs between AWS, Azure or Kong without downtime.',
        icon: ArrowLeftRight,
        path: '/api-gateway/migrator',
        status: 'coming-soon' as CardStatus,
        quickAction: '',
      },
    ],
  },
  {
    id: 'experience',
    title: 'API Experience',
    subtitle: 'Build developer portals and API marketplaces',
    count: 2,
    cards: [
      {
        id: 'dev-portal',
        title: 'Basic Dev Portal',
        description: 'Give developers a branded portal to discover and test your APIs.',
        icon: FileText,
        path: '/api-experience/dev-portal',
        status: 'idle' as CardStatus,
        statusLabel: 'Not set up',
        quickAction: 'Open',
      },
      {
        id: 'marketplace',
        title: 'Advanced API Marketplace',
        description: 'Monetize APIs with plans, subscriptions, and usage billing.',
        icon: ShoppingBag,
        path: '/api-experience/marketplace',
        status: 'coming-soon' as CardStatus,
        quickAction: '',
      },
    ],
  },
  {
    id: 'copilot',
    title: 'API Copilot',
    subtitle: 'AI-powered tools to accelerate API development',
    count: 1,
    cards: [
      {
        id: 'api-pilot',
        title: 'API Pilot',
        description: 'Design and document APIs with AI assistance.',
        icon: Bot,
        path: '/api-copilot',
        status: 'beta' as CardStatus,
        statusLabel: undefined,
        quickAction: 'Try it',
      },
    ],
  },
  {
    id: 'analytics',
    title: 'API Analytics',
    subtitle: 'Monitor performance, usage, and errors in real-time',
    count: 1,
    cards: [
      {
        id: 'traffic',
        title: 'Traffic Overview',
        description: 'API traffic and usage metrics at a glance.',
        icon: BarChart3,
        path: '/api-analytics',
        status: 'idle' as CardStatus,
        statusLabel: 'View',
        quickAction: 'Open',
      },
    ],
  },
  {
    id: 'access',
    title: 'Access Control',
    subtitle: 'Manage teams, roles, and permissions',
    count: 2,
    cards: [
      {
        id: 'groups',
        title: 'Groups',
        description: 'Manage user groups and access policies.',
        icon: Users,
        path: '/access-control/groups',
        status: 'idle' as CardStatus,
        statusLabel: 'Manage',
        quickAction: 'Open',
      },
      {
        id: 'users',
        title: 'Users',
        description: 'Manage users and permissions.',
        icon: Shield,
        path: '/access-control/users',
        status: 'idle' as CardStatus,
        statusLabel: 'Manage',
        quickAction: 'Open',
      },
    ],
  },
]

export function Dashboard() {
  const location = useLocation()
  const [onboardingDismissed, setOnboardingDismissed] = useState(false)

  const hasGateway = true
  const hasAPIs = true
  const hasPortal = false
  const hasTeam = false
  const stepDone = { gateway: hasGateway, apis: hasAPIs, portal: hasPortal, team: hasTeam }
  const completedSteps = ONBOARDING_STEPS.filter((s) => stepDone[s.key as keyof typeof stepDone]).length
  const totalSteps = ONBOARDING_STEPS.length
  const showOnboarding = !onboardingDismissed && completedSteps < totalSteps

  return (
    <div className="space-y-10">
      <header className="mb-8">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              {getGreeting()}, {USER_NAME} 👋
            </h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Here&apos;s what&apos;s happening across your API ecosystem today.
            </p>
          </div>
          <a
            href="#"
            className="flex shrink-0 items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
          >
            <BookOpen size={14} strokeWidth={1.75} />
            View Docs
          </a>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {QUICK_STATS.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3"
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${stat.iconBg}`}>
                  <Icon size={16} className={stat.iconColor} strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-bold leading-tight text-[var(--text-primary)]">{stat.value}</p>
                  <p className="text-[11px] leading-tight text-[var(--text-muted)]">{stat.label}</p>
                </div>
              </div>
            )
          })}
        </div>
      </header>

      {showOnboarding && (
        <div className="mb-6 flex items-center gap-5 rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 p-5">
          <div className="relative h-14 w-14 shrink-0">
            <svg className="h-14 w-14 -rotate-90" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="22" fill="none" stroke="var(--border-subtle)" strokeWidth="4" />
              <circle
                cx="28"
                cy="28"
                r="22"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 22}
                strokeDashoffset={2 * Math.PI * 22 * (1 - completedSteps / totalSteps)}
                className="transition-all duration-500"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[var(--primary)]">
              {completedSteps}/{totalSteps}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              Complete your setup — {Math.round((completedSteps / totalSteps) * 100)}% done
            </h3>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">Connect your first gateway to start managing APIs</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {ONBOARDING_STEPS.map((step) => {
                const done = stepDone[step.key as keyof typeof stepDone]
                return (
                  <span
                    key={step.id}
                    className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-medium ${
                      done
                        ? 'border-emerald-500/20 bg-emerald-500/15 text-emerald-400 line-through'
                        : 'border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-muted)]'
                    }`}
                  >
                    {done ? <Check size={10} className="text-emerald-400" strokeWidth={2} /> : <Circle size={10} strokeWidth={2} />}
                    {step.label}
                  </span>
                )
              })}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOnboardingDismissed(true)}
            className="shrink-0 rounded-lg p-1 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
            aria-label="Dismiss"
          >
            <X size={16} strokeWidth={1.75} />
          </button>
        </div>
      )}

      {SECTIONS.map((section) => (
        <motion.section
          key={section.id}
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          <SectionHeader title={section.title} subtitle={section.subtitle} count={section.count} />
          <div
            className={`grid gap-4 ${
              section.cards.length >= 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2'
            }`}
          >
            {section.id === 'service-hub' && !hasGateway && (
              <div className="col-span-full">
                <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-[var(--primary)]/20 bg-[var(--primary)]/5 p-6 sm:flex-row">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/15">
                    <Zap size={22} className="text-[var(--primary)]" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1 text-center sm:text-left">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">Start by connecting your API gateway</h3>
                    <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                      Choose from AWS, Azure, Kong, Mulesoft and more — or use Helix Gateway for a managed solution.
                    </p>
                  </div>
                  <Link
                    to="/api-service-hub/environments"
                    className="flex shrink-0 items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white transition-colors hover:opacity-90"
                  >
                    Connect Gateway
                    <ArrowRight size={14} strokeWidth={2} />
                  </Link>
                </div>
              </div>
            )}
            {section.cards.map((card) => (
              <FeatureCard
                key={card.id}
                card={card}
                isCurrentPage={location.pathname === card.path || (card.path !== '/dashboard' && location.pathname.startsWith(card.path))}
              />
            ))}
          </div>
        </motion.section>
      ))}
    </div>
  )
}
