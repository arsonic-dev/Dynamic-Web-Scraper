import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, RefreshCw, AlertCircle } from 'lucide-react'
import Sidebar from '@/components/dashboard/Sidebar'
import { getHistory, type HistoryResponse, type JobStatus, type DataType } from '@/services/api'
import { cn, formatDate } from '@/lib/utils'

const STATUS_STYLE: Record<JobStatus, string> = {
    pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    running: 'text-blue-400   bg-blue-400/10   border-blue-400/20',
    completed: 'text-green-400  bg-green-400/10  border-green-400/20',
    failed: 'text-red-400    bg-red-400/10    border-red-400/20',
}

export default function JobHistory() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [data, setData] = useState<HistoryResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [cursor, setCursor] = useState<string | undefined>(undefined)
    const [prevStack, setPrevStack] = useState<string[]>([])
    const [statusFilter, setStatusFilter] = useState<JobStatus | ''>('')
    const [typeFilter, setTypeFilter] = useState<DataType | ''>('')

    const fetchHistory = async (cur?: string) => {
        setLoading(true); setError(null)
        try {
            const res = await getHistory({
                limit: 10,
                cursor: cur,
                status: statusFilter || undefined,
                data_type: typeFilter || undefined,
            })
            setData(res)
        } catch {
            setError('Failed to load job history. Make sure the backend is running.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchHistory(undefined); setCursor(undefined); setPrevStack([]) }, [statusFilter, typeFilter]) // eslint-disable-line

    const nextPage = () => {
        if (!data?.next_cursor) return
        setPrevStack((s) => [...s, cursor ?? ''])
        setCursor(data.next_cursor ?? undefined)
        fetchHistory(data.next_cursor ?? undefined)
    }
    const prevPage = () => {
        const stack = [...prevStack]
        const prev = stack.pop() ?? undefined
        setPrevStack(stack); setCursor(prev)
        fetchHistory(prev)
    }

    // Skeleton rows
    const Skeleton = () => (
        <tr>
            {[...Array(6)].map((_, i) => (
                <td key={i} className="px-4 py-3">
                    <div className="h-4 bg-[#27272a] rounded animate-pulse" style={{ width: `${60 + i * 10}%` }} />
                </td>
            ))}
        </tr>
    )

    return (
        <div className="flex h-screen bg-[#0d0d10] overflow-hidden">
            <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top bar */}
                <header className="h-16 border-b border-[#1c1c20] flex items-center justify-between px-5 shrink-0">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-zinc-400 hover:text-white">
                            <Menu className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-white font-semibold">Job History</h1>
                            <p className="text-zinc-500 text-xs hidden sm:block">
                                {data ? `${data.total_count} total jobs` : 'Loading...'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => fetchHistory(cursor)}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs text-zinc-400 hover:text-white glass rounded-lg border border-[#27272a] hover:border-[#3f3f46] transition-colors"
                    >
                        <RefreshCw className={cn('w-3.5 h-3.5', loading && 'animate-spin')} /> Refresh
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto p-5">
                    {/* Filters */}
                    <div className="flex flex-wrap gap-3 mb-5">
                        {/* Status filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as JobStatus | '')}
                            className="bg-[#18181b] border border-[#3f3f46] rounded-xl px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-[#7c3aed] transition-colors"
                        >
                            <option value="">All Statuses</option>
                            {(['pending', 'running', 'completed', 'failed'] as JobStatus[]).map((s) => (
                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                            ))}
                        </select>

                        {/* Data type filter */}
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value as DataType | '')}
                            className="bg-[#18181b] border border-[#3f3f46] rounded-xl px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-[#7c3aed] transition-colors"
                        >
                            <option value="">All Types</option>
                            {(['products', 'jobs', 'articles', 'custom'] as DataType[]).map((t) => (
                                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                            ))}
                        </select>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="glass border border-red-500/20 rounded-xl p-5 flex items-center gap-3 mb-5">
                            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                            <p className="text-red-300 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Table */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="glass rounded-2xl border border-[#27272a] overflow-hidden"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-[#27272a] bg-[#18181b]">
                                        {['Job ID', 'URL', 'Type', 'Status', 'Records', 'Quality', 'Created'].map((h) => (
                                            <th key={h} className="px-4 py-3 text-left text-xs font-medium text-zinc-400 whitespace-nowrap">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        [...Array(5)].map((_, i) => <Skeleton key={i} />)
                                    ) : !data?.jobs?.length ? (
                                        <tr>
                                            <td colSpan={7} className="py-16 text-center text-zinc-500 text-sm">
                                                No jobs found. Submit your first scraping job from the Dashboard.
                                            </td>
                                        </tr>
                                    ) : (
                                        data.jobs.map((job, i) => (
                                            <motion.tr
                                                key={job.job_id}
                                                initial={{ opacity: 0, x: -8 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.04 }}
                                                className="border-b border-[#1c1c20] hover:bg-[#18181b] transition-colors"
                                            >
                                                <td className="px-4 py-3 font-mono text-xs text-zinc-500">{job.job_id.slice(0, 12)}…</td>
                                                <td className="px-4 py-3 max-w-[180px]">
                                                    <a href={job.url} target="_blank" rel="noreferrer" className="text-[#7c3aed] hover:underline truncate block max-w-[160px]">
                                                        {job.url.replace(/^https?:\/\/(www\.)?/, '')}
                                                    </a>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="px-2 py-0.5 rounded-md bg-[#27272a] text-zinc-300 text-xs capitalize">{job.data_type}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={cn('px-2 py-0.5 rounded-full text-xs border capitalize', STATUS_STYLE[job.status])}>
                                                        {job.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-zinc-300">{job.records_extracted.toLocaleString()}</td>
                                                <td className="px-4 py-3">
                                                    {job.data_quality_score != null
                                                        ? <span className="text-[#a78bfa] font-semibold">{job.data_quality_score.toFixed(1)}%</span>
                                                        : <span className="text-zinc-600">—</span>
                                                    }
                                                </td>
                                                <td className="px-4 py-3 text-zinc-500 text-xs whitespace-nowrap">{formatDate(job.created_at)}</td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {data && (data.next_cursor || prevStack.length > 0) && (
                            <div className="flex items-center justify-between px-5 py-3 border-t border-[#27272a] text-xs text-zinc-400">
                                <span>{data.total_count} total jobs</span>
                                <div className="flex gap-2">
                                    <button onClick={prevPage} disabled={prevStack.length === 0}
                                        className="px-3 py-1.5 rounded-lg bg-[#18181b] border border-[#3f3f46] disabled:opacity-40 hover:border-[#7c3aed]/40 transition-colors">
                                        ← Prev
                                    </button>
                                    <button onClick={nextPage} disabled={!data.next_cursor}
                                        className="px-3 py-1.5 rounded-lg bg-[#18181b] border border-[#3f3f46] disabled:opacity-40 hover:border-[#7c3aed]/40 transition-colors">
                                        Next →
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </main>
            </div>
        </div>
    )
}
