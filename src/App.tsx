import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { ManageEnvironments } from './pages/ManageEnvironments'
import { EditGatewayInstance } from './pages/EditGatewayInstance'
import { AddGatewayInstance } from './pages/AddGatewayInstance'
import { PlaceholderPage } from './pages/PlaceholderPage'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="api-service-hub/environments" element={<ManageEnvironments />} />
            <Route path="api-service-hub/environments/new" element={<AddGatewayInstance />} />
            <Route path="api-service-hub/environments/edit/:id" element={<EditGatewayInstance />} />
            <Route path="api-service-hub" element={<PlaceholderPage />} />
            <Route path="api-service-hub/sources" element={<PlaceholderPage />} />
            <Route path="api-service-hub/estate" element={<PlaceholderPage />} />
            <Route path="api-service-hub/products" element={<PlaceholderPage />} />
            <Route path="api-gateway" element={<PlaceholderPage />} />
            <Route path="api-gateway/federator" element={<PlaceholderPage />} />
            <Route path="api-gateway/migrator" element={<PlaceholderPage />} />
            <Route path="api-experience" element={<PlaceholderPage />} />
            <Route path="api-experience/dev-portal" element={<PlaceholderPage />} />
            <Route path="api-experience/marketplace" element={<PlaceholderPage />} />
            <Route path="api-copilot" element={<PlaceholderPage />} />
            <Route path="api-analytics" element={<PlaceholderPage />} />
            <Route path="access-control" element={<PlaceholderPage />} />
            <Route path="access-control/groups" element={<PlaceholderPage />} />
            <Route path="access-control/users" element={<PlaceholderPage />} />
            <Route path="support" element={<PlaceholderPage />} />
            <Route path="administration" element={<PlaceholderPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
