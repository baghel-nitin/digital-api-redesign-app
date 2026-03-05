import { useState, useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Select from 'react-select'
import type { MultiValue } from 'react-select'
import { motion } from 'framer-motion'
import {
  ChevronRight,
  Settings,
  Zap,
  Loader2,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Save,
  HelpCircle,
  Eye,
  EyeOff,
  X,
} from 'lucide-react'
import { AVAILABLE_GATEWAYS, GATEWAY_LOGOS } from '../constants/gateways'

const REGIONS = ['Southern Asia', 'East Asia', 'Europe West', 'US East', 'US West']
const COUNTRIES = ['India', 'United States', 'United Kingdom', 'Germany', 'Australia', 'Singapore']
const VISIBILITY_OPTIONS = ['Public', 'Private', 'Partner']

const BUSINESS_AREAS = [
  { id: 'doodleblue-innovation', name: 'DoodleBlue Innovation' },
  { id: 'acme-corp', name: 'Acme Corp' },
]

type FieldType = 'text' | 'password' | 'select' | 'multiselect' | 'toggle'

interface FormFieldDef {
  id: string
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  tooltip?: string
  options?: string[]
  colSpan?: 1 | 2
}

const GATEWAY_FIELDS: Record<string, FormFieldDef[]> = {
  HELIX_GATEWAY: [
    { id: 'connectionType', label: 'Connection Type', type: 'select', required: true, options: ['NOT_APPLICABLE'], colSpan: 1 },
    { id: 'name', label: 'Name', type: 'text', required: true, placeholder: 'e.g. MYCOMPANY-HELIX-PROD', tooltip: 'Unique identifier for this gateway instance', colSpan: 1 },
    { id: 'defaultImportApiVisibilities', label: 'Default Import API Visibilities', type: 'multiselect', required: false, placeholder: 'Select visibility options...', options: VISIBILITY_OPTIONS, colSpan: 1 },
    { id: 'region', label: 'Region', type: 'select', required: true, placeholder: 'Select region...', options: REGIONS, colSpan: 1 },
    { id: 'country', label: 'Country', type: 'select', required: true, placeholder: 'Select country...', options: COUNTRIES, colSpan: 1 },
    { id: 'apiDeploymentEnabled', label: 'API Deployment Enabled', type: 'toggle', required: false, colSpan: 1 },
  ],
  AZURE: [
    { id: 'connectionType', label: 'Connection Type', type: 'select', required: true, options: ['SHARED_ACCESS_SIGNATURE', 'SERVICE_PRINCIPAL', 'MANAGED_IDENTITY'], colSpan: 1 },
    { id: 'name', label: 'Name', type: 'text', required: true, placeholder: 'e.g. MYCOMPANY-AZURE-PROD-INSTANCE', colSpan: 1 },
    { id: 'resourceApiManagementUrl', label: 'Resource API Management URL', type: 'text', required: true, placeholder: 'https://myapi.management.azure.com', colSpan: 1 },
    { id: 'serviceResourceName', label: 'Service Resource Name', type: 'text', required: true, placeholder: 'e.g. my-apim-service', colSpan: 1 },
    { id: 'subscriptionId', label: 'Subscription ID', type: 'text', required: true, placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', colSpan: 1 },
    { id: 'credentialsIdentifier', label: 'Credentials Identifier', type: 'text', required: true, placeholder: 'Client ID or App ID', colSpan: 1 },
    { id: 'credentialsPrimaryKey', label: 'Credentials Primary Key', type: 'password', required: true, placeholder: '••••••••••••••••', colSpan: 1 },
    { id: 'resourceGroup', label: 'Resource Group', type: 'text', required: true, placeholder: 'e.g. my-resource-group', colSpan: 1 },
    { id: 'defaultImportApiVisibilities', label: 'Default Import API Visibilities', type: 'multiselect', required: false, options: VISIBILITY_OPTIONS, colSpan: 1 },
    { id: 'region', label: 'Region', type: 'select', required: true, options: REGIONS, colSpan: 1 },
    { id: 'country', label: 'Country', type: 'select', required: true, options: COUNTRIES, colSpan: 1 },
    { id: 'apiDeploymentEnabled', label: 'API Deployment Enabled', type: 'toggle', required: false, colSpan: 1 },
  ],
  AWS: [
    { id: 'connectionType', label: 'Connection Type', type: 'select', required: true, options: ['ACCESS_KEY', 'IAM_ROLE'], colSpan: 1 },
    { id: 'name', label: 'Name', type: 'text', required: true, placeholder: 'e.g. MYCOMPANY-AWS-PROD', colSpan: 1 },
    { id: 'accessKeyId', label: 'Access Key ID', type: 'text', required: true, placeholder: 'AKIA...', colSpan: 1 },
    { id: 'secretAccessKey', label: 'Secret Access Key', type: 'password', required: true, placeholder: '••••••••••••••••', colSpan: 1 },
    { id: 'region', label: 'AWS Region', type: 'select', required: true, options: ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-south-1'], colSpan: 1 },
    { id: 'defaultImportApiVisibilities', label: 'Default Import API Visibilities', type: 'multiselect', required: false, options: VISIBILITY_OPTIONS, colSpan: 1 },
  ],
}

function getFieldsForGateway(gatewayId: string): FormFieldDef[] {
  return GATEWAY_FIELDS[gatewayId] ?? GATEWAY_FIELDS.HELIX_GATEWAY
}

function isValidUrl(s: string): boolean {
  try {
    new URL(s)
    return true
  } catch {
    return false
  }
}

const selectStyles = {
  control: (base: Record<string, unknown>, state: { isFocused?: boolean }) => ({
    ...base,
    minHeight: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: state.isFocused ? 'var(--primary)' : 'var(--border)',
    backgroundColor: 'var(--bg-elevated)',
    boxShadow: state.isFocused ? '0 0 0 2px var(--primary-light)' : 'none',
    color: 'var(--text-primary)',
  }),
  menu: (base: Record<string, unknown>) => ({ ...base, zIndex: 50, backgroundColor: 'var(--bg-surface)' }),
  option: (base: Record<string, unknown>, state: { isFocused?: boolean }) => ({
    ...base,
    backgroundColor: state.isFocused ? 'var(--bg-elevated)' : 'transparent',
    color: 'var(--text-primary)',
    fontSize: 13,
  }),
  singleValue: (base: Record<string, unknown>) => ({ ...base, color: 'var(--text-primary)' }),
  input: (base: Record<string, unknown>) => ({ ...base, color: 'var(--text-primary)' }),
  placeholder: (base: Record<string, unknown>) => ({ ...base, color: 'var(--text-muted)' }),
}

interface FormFieldProps {
  field: FormFieldDef
  value: string | string[] | boolean
  onChange: (id: string, value: string | string[] | boolean) => void
  error?: string
  showPassword: Record<string, boolean>
  togglePassword: (id: string) => void
}

function FormFieldComp({ field, value, onChange, error, showPassword, togglePassword }: FormFieldProps) {
  const inputBaseClass = `h-10 w-full rounded-lg border border-[var(--border)] px-3 text-sm bg-[var(--bg-elevated)] text-[var(--text-primary)] outline-none transition-all duration-150 placeholder:text-[var(--text-muted)]/50 ${
    error ? 'border-red-400 focus:ring-2 focus:ring-red-400/20' : 'border-[var(--border)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15'
  }`

  return (
    <div className={field.colSpan === 2 ? 'col-span-2' : ''}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <label className="text-sm font-medium text-[var(--text-primary)]">
          {field.label}
          {field.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {field.tooltip && (
          <span title={field.tooltip} className="cursor-help">
            <HelpCircle size={13} className="text-[var(--text-muted)]/60 hover:text-[var(--text-muted)]" />
          </span>
        )}
      </div>
      {field.type === 'text' && (
        <input
          type="text"
          value={(value as string) || ''}
          onChange={(e) => onChange(field.id, e.target.value)}
          onBlur={() => {}}
          placeholder={field.placeholder}
          className={inputBaseClass}
        />
      )}
      {field.type === 'password' && (
        <div className="relative">
          <input
            type={showPassword[field.id] ? 'text' : 'password'}
            value={(value as string) || ''}
            onChange={(e) => onChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={`${inputBaseClass} pr-10`}
          />
          <button
            type="button"
            onClick={() => togglePassword(field.id)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            {showPassword[field.id] ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      )}
      {field.type === 'select' && (
        <select
          value={(value as string) || ''}
          onChange={(e) => onChange(field.id, e.target.value)}
          className={inputBaseClass}
        >
          <option value="">{field.placeholder ?? 'Select...'}</option>
          {(field.options ?? []).map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )}
      {field.type === 'multiselect' && (
        <Select
          isMulti
          options={(field.options ?? []).map((o) => ({ value: o, label: o }))}
          value={((value as string[]) || []).map((v) => ({ value: v, label: v }))}
          onChange={(opts: MultiValue<{ value: string; label: string }>) => onChange(field.id, opts.map((o) => o.value))}
          placeholder={field.placeholder}
          classNamePrefix="rs"
          styles={selectStyles}
        />
      )}
      {field.type === 'toggle' && (
        <div className="flex items-center gap-3 h-10">
          <button
            type="button"
            role="switch"
            aria-checked={!!value}
            onClick={() => onChange(field.id, !value)}
            className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 ${
              value ? 'bg-[var(--primary)] border-[var(--primary)]' : 'bg-[var(--bg-elevated)] border-[var(--border)]'
            }`}
          >
            <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-4' : 'translate-x-0.5'} mt-0.5`} />
          </button>
          <span className="text-xs text-[var(--text-muted)]">{value ? 'Enabled' : 'Disabled'}</span>
        </div>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
          <XCircle size={12} />
          {error}
        </p>
      )}
    </div>
  )
}

export function AddGatewayInstance() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [selectedGateway, setSelectedGateway] = useState(() => searchParams.get('gateway') ?? '')
  const [selectedBusinessArea, setSelectedBusinessArea] = useState('')
  const [formData, setFormData] = useState<Record<string, string | string[] | boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<null | 'success' | 'failed'>(null)
  const [testMessage, setTestMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({})

  const activeGateways = AVAILABLE_GATEWAYS.filter((g) => !g.comingSoon)
  const comingSoonGateways = AVAILABLE_GATEWAYS.filter((g) => g.comingSoon)
  const selectedGatewayData = AVAILABLE_GATEWAYS.find((g) => g.id === selectedGateway)
  const fields = useMemo(() => getFieldsForGateway(selectedGateway), [selectedGateway])

  const updateField = (id: string, value: string | string[] | boolean) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
    setErrors((prev) => { const n = { ...prev }; delete n[id]; return n })
  }

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    if (!selectedGateway) errs.gateway = 'Please select a gateway'
    if (!selectedBusinessArea) errs.businessArea = 'Please select a business area'
    fields.forEach((field) => {
      const v = formData[field.id]
      if (field.required) {
        if (v === undefined || v === '' || (Array.isArray(v) && v.length === 0)) {
          errs[field.id] = `${field.label} is required`
        }
      }
      if (field.type === 'text' && field.id.toLowerCase().includes('url') && v && typeof v === 'string') {
        if (!isValidUrl(v)) errs[field.id] = 'Please enter a valid URL'
      }
    })
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const isFormValid = useMemo(() => {
    if (!selectedGateway || !selectedBusinessArea) return false
    for (const field of fields) {
      if (field.required) {
        const v = formData[field.id]
        if (v === undefined || v === '' || (Array.isArray(v) && v.length === 0)) return false
      }
    }
    return true
  }, [selectedGateway, selectedBusinessArea, fields, formData])

  const handleTestConnection = async () => {
    if (!validate()) return
    setTesting(true)
    setTestResult(null)
    await new Promise((r) => setTimeout(r, 1200))
    setTestResult('success')
    setTestMessage('Connection established successfully!')
    setTesting(false)
  }

  const handleSave = async () => {
    if (!validate() || !isFormValid) return
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    navigate('/api-service-hub/environments')
  }

  const togglePassword = (id: string) => {
    setShowPassword((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-8">
      <nav className="mb-4 flex items-center gap-2 text-sm">
        <Link
          to="/api-service-hub/environments"
          className="text-[var(--text-muted)] transition-colors duration-150 hover:text-[var(--text-primary)]"
        >
          Manage API Environments
        </Link>
        <ChevronRight size={14} className="text-[var(--text-muted)]/50" />
        <span className="font-medium text-[var(--text-primary)]">Add Gateway Instance</span>
      </nav>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Add Gateway Instance</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Connect a new API gateway to your environment. Fill in the credentials and configure connection settings below.
          </p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2 text-xs text-[var(--text-muted)]">
          <span className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-bold text-white">1</span>
            Select Gateway
          </span>
          <div className="h-px w-8 bg-[var(--border)]" />
          <span className="flex items-center gap-1.5">
            <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${selectedGateway ? 'bg-[var(--primary)] text-white' : 'border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-muted)]'}`}>
              2
            </span>
            Configure
          </span>
          <div className="h-px w-8 bg-[var(--border)]" />
          <span className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] text-[10px] font-bold text-[var(--text-muted)]">3</span>
            Test & Save
          </span>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
            Select Gateway <span className="text-red-500">*</span>
          </label>
          <p className="mb-2 text-xs text-[var(--text-muted)]">Choose the gateway provider you want to connect</p>
          <select
            value={selectedGateway}
            onChange={(e) => { setSelectedGateway(e.target.value); setTestResult(null); setFormData({}); setErrors({}) }}
            className="h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 text-sm text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
          >
            <option value="">Select a gateway type...</option>
            <optgroup label="Available">
              {activeGateways.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </optgroup>
            <optgroup label="Coming Soon">
              {comingSoonGateways.map((g) => (
                <option key={g.id} value={g.id} disabled>{g.name} — Soon</option>
              ))}
            </optgroup>
          </select>
          {errors.gateway && <p className="mt-1 text-xs text-red-500">{errors.gateway}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
            Select Business Area <span className="text-red-500">*</span>
          </label>
          <p className="mb-2 text-xs text-[var(--text-muted)]">Associate this gateway with a business domain</p>
          <select
            value={selectedBusinessArea}
            onChange={(e) => setSelectedBusinessArea(e.target.value)}
            className="h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 text-sm text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
          >
            <option value="">Select business area...</option>
            {BUSINESS_AREAS.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
          {errors.businessArea && <p className="mt-1 text-xs text-red-500">{errors.businessArea}</p>}
        </div>
      </div>

      {!selectedGateway && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-surface)] p-12 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--bg-elevated)]">
            <Settings size={22} className="text-[var(--text-muted)]/50" />
          </div>
          <p className="text-sm font-medium text-[var(--text-muted)]">Select a gateway above to configure connection settings</p>
        </div>
      )}

      {selectedGateway && selectedGatewayData && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-surface)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--bg-elevated)]/50 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-surface)]">
                <img
                  src={GATEWAY_LOGOS[selectedGateway]}
                  alt=""
                  className="h-5 w-5 object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">Configure Gateway</h3>
                <p className="text-xs text-[var(--text-muted)]">{selectedGatewayData.name} · Fill in your credentials</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing || !isFormValid}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-150 ${
                testing ? 'cursor-wait bg-[var(--bg-elevated)] text-[var(--text-muted)]' : 'bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90'
              } ${!isFormValid ? 'opacity-50 cursor-not-allowed hover:translate-y-0' : ''}`}
            >
              {testing && <Loader2 size={14} className="animate-spin" />}
              {testResult === 'success' && !testing && <CheckCircle size={14} className="text-emerald-300" />}
              {testResult === 'failed' && !testing && <XCircle size={14} className="text-red-300" />}
              {!testResult && !testing && <Zap size={14} />}
              {testing && 'Testing...'}
              {testResult === 'success' && !testing && 'Connected!'}
              {testResult === 'failed' && !testing && 'Failed — Retry'}
              {!testResult && !testing && 'Test Connection'}
            </button>
          </div>

          {testResult && (
            <div className={`mx-6 mt-4 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${
              testResult === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-600'
            }`}>
              {testResult === 'success' ? <CheckCircle size={15} /> : <XCircle size={15} />}
              {testMessage}
              <button type="button" onClick={() => setTestResult(null)} className="ml-auto opacity-60 hover:opacity-100">
                <X size={13} />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-x-8 gap-y-5 p-6 sm:grid-cols-2">
            {fields.map((field, i) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <FormFieldComp
                  field={field}
                  value={formData[field.id] ?? (field.type === 'toggle' ? false : field.type === 'multiselect' ? [] : '')}
                  onChange={updateField}
                  error={errors[field.id]}
                  showPassword={showPassword}
                  togglePassword={togglePassword}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="sticky bottom-0 left-0 right-0 mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] bg-[var(--background)]/95 py-4 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => navigate('/api-service-hub/environments')}
          className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
        >
          <ArrowLeft size={16} strokeWidth={1.75} />
          Back to Environments
        </button>
        <div className="flex items-center gap-3">
          {!isFormValid && selectedGateway && (
            <p className="text-xs text-[var(--text-muted)]">Fill in all required fields to save</p>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !isFormValid}
            className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-150 ${
              saving || !isFormValid ? 'cursor-not-allowed bg-[var(--primary)]/50 text-white/80' : 'bg-[var(--primary)] text-white shadow-sm hover:bg-[var(--primary)]/90'
            }`}
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {!saving && <Save size={14} strokeWidth={1.75} />}
            {saving ? 'Saving...' : 'Save Gateway Instance'}
          </button>
        </div>
      </div>
    </div>
  )
}
