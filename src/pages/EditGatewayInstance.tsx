import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Select from 'react-select'
import type { MultiValue } from 'react-select'
import { PencilLine } from 'lucide-react'

const VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public' },
  { value: 'internal', label: 'Internal' },
]

const selectStyles = {
  control: (base: Record<string, unknown>, state: { isFocused?: boolean }) => ({
    ...base,
    minHeight: 44,
    borderRadius: 'var(--radius-lg)',
    borderWidth: 1.5,
    borderColor: state.isFocused ? 'var(--primary)' : 'var(--border)',
    backgroundColor: 'white',
    boxShadow: state.isFocused ? '0 0 0 3px var(--primary-light)' : 'none',
    transition: '150ms',
  }),
  multiValue: (base: Record<string, unknown>) => ({
    ...base,
    backgroundColor: 'var(--primary-light)',
    borderRadius: 9999,
    padding: '2px 8px',
  }),
  multiValueLabel: (base: Record<string, unknown>) => ({
    ...base,
    color: 'var(--primary)',
    fontSize: 12,
  }),
  multiValueRemove: (base: Record<string, unknown>) => ({
    ...base,
    color: 'var(--primary)',
  }),
  menu: (base: Record<string, unknown>) => ({
    ...base,
    backgroundColor: 'white',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
  }),
  option: (base: Record<string, unknown>, state: { isFocused?: boolean }) => ({
    ...base,
    backgroundColor: state.isFocused ? 'var(--bg-elevated)' : 'transparent',
    color: 'var(--text-primary)',
    fontSize: 13,
  }),
  input: (base: Record<string, unknown>) => ({ ...base, color: 'var(--text-primary)' }),
  placeholder: (base: Record<string, unknown>) => ({ ...base, color: 'var(--text-muted)' }),
}

function ConnectedBadge() {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-semibold"
      style={{
        background: 'var(--success-light)',
        color: 'var(--success)',
        borderColor: 'rgba(16,185,129,0.2)',
      }}
    >
      <span className="status-pulse h-[7px] w-[7px] rounded-full bg-[var(--success)]" />
      Connected
    </span>
  )
}

const inputClass =
  'h-11 w-full rounded-[10px] border-[1.5px] border-[var(--border)] bg-white px-3 text-[14px] text-[var(--text-primary)] transition focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]'
const labelClass = 'mb-1.5 block text-[13px] font-medium text-[var(--text-secondary)]'

export function EditGatewayInstance() {
  const { id: _instanceId } = useParams<{ id: string }>()
  const [name, setName] = useState('DOODLEBLUE-INNOVATION-DEFAULT-VIRTUAL-GATEWAY-INSTANCE')
  const [connectionType, setConnectionType] = useState('NOT_APPLICABLE')
  const [gateway, setGateway] = useState('VIRTUAL')
  const [businessArea, setBusinessArea] = useState('doodleblue-innovation')
  const [region, setRegion] = useState('Southern Asia')
  const [country, setCountry] = useState('India')
  const [visibilities, setVisibilities] = useState<MultiValue<{ value: string; label: string }>>([
    { value: 'public', label: 'Public' },
    { value: 'internal', label: 'Internal' },
  ])

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-[22px] font-bold text-[var(--text-primary)]">Edit Gateway Instance</h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Select Gateway</label>
          <select value={gateway} onChange={(e) => setGateway(e.target.value)} className={inputClass}>
            <option value="VIRTUAL">VIRTUAL</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Select Business Area</label>
          <select value={businessArea} onChange={(e) => setBusinessArea(e.target.value)} className={inputClass}>
            <option value="doodleblue-innovation">doodleblue-innovation</option>
          </select>
        </div>
      </div>

      <div className="mt-6 rounded-[16px] border border-[var(--border)] bg-white p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-[15px] font-semibold text-[var(--text-primary)]">Configure Gateway</h2>
            <ConnectedBadge />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-[8px] border-[1.5px] border-[var(--border)] bg-white px-4 py-2 text-[13px] font-medium text-[var(--text-primary)] transition hover:border-[var(--primary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)]"
            >
              Re-Test Connection
            </button>
            <button
              type="button"
              className="rounded-[8px] bg-[var(--primary)] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[var(--primary-hover)] hover:-translate-y-px hover:shadow-md"
            >
              Update
            </button>
          </div>
        </div>
        <div className="my-5 border-t border-[var(--border)]" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Connection Type</label>
              <select value={connectionType} onChange={(e) => setConnectionType(e.target.value)} className={inputClass}>
                <option value="NOT_APPLICABLE">NOT_APPLICABLE</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Default Import API Visibilities</label>
              <Select
                isMulti
                options={VISIBILITY_OPTIONS}
                value={visibilities}
                onChange={setVisibilities}
                placeholder="Select visibilities..."
                classNamePrefix="rs"
                styles={selectStyles}
              />
            </div>
          </div>
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="Instance name"
              />
            </div>
            <div>
              <p className={labelClass}>Region and Country</p>
              <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-[var(--text-muted)]">Region :</label>
                  <select value={region} onChange={(e) => setRegion(e.target.value)} className={inputClass}>
                    <option value="Southern Asia">Southern Asia</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-[var(--text-muted)]">Country :</label>
                  <select value={country} onChange={(e) => setCountry(e.target.value)} className={inputClass}>
                    <option value="India">India</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Link
        to="/api-service-hub/environments"
        className="inline-flex items-center gap-2 text-[13px] font-medium text-[var(--text-secondary)] hover:text-[var(--primary)]"
      >
        <PencilLine className="h-4 w-4" strokeWidth={1.75} />
        Back to Environments
      </Link>
    </div>
  )
}
