import { useLocation } from 'react-router-dom'

const TITLES: Record<string, string> = {
  '/api-service-hub': 'API Service Hub',
  '/api-service-hub/sources': 'API Sources',
  '/api-service-hub/estate': 'API Estate',
  '/api-service-hub/products': 'API Products',
  '/api-gateway': 'API Gateway',
  '/api-gateway/federator': 'API Federator',
  '/api-gateway/migrator': 'API Migrator',
  '/api-experience': 'API Experience',
  '/api-experience/dev-portal': 'Basic Dev Portal',
  '/api-experience/marketplace': 'Advanced API Marketplace',
  '/api-copilot': 'API Copilot',
  '/api-analytics': 'API Analytics',
  '/access-control': 'Access Control',
  '/access-control/groups': 'Groups',
  '/access-control/users': 'Users',
  '/support': 'Support',
  '/administration': 'Administration',
}

export function PlaceholderPage() {
  const loc = useLocation()
  const path = loc.pathname
  const title = TITLES[path] ?? path.slice(1).replace(/\//g, ' / ')
  return (
    <div>
      <h1 className="text-xl font-bold text-[var(--text-primary)]">{title}</h1>
      <p className="mt-2 text-[14px] text-[var(--text-secondary)]">This section is under development.</p>
    </div>
  )
}
