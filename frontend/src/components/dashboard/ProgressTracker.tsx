import type { ReactNode } from "react"
import { motion } from 'framer-motion'
import { Activity, Clock, FileStack, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useScraperStore } from '@/store/useScraperStore'
import { type JobStatus } from '@/services/api'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils'

const STATUS_CONFIG: Record<
  JobStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
    pending: { label: 'Pending', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20', icon: <Loader2 className="w-3 h-3 animate-spin" /> },
    running: { label: 'Running', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', icon: <Activity className="w-3 h-3" /> },
    completed: { label: 'Completed', color: 'text-green-400 bg-green-400/10 border-green-400/20', icon: <CheckCircle className="w-3 h-3" /> },
    failed: { label: 'Failed', color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: <XCircle className="w-3 h-3" /> },
}

export default function ProgressTracker() {
    const { status } = useScraperStore()

    if (!status) {
        return (
            <div className="glass rounded-2xl border border-[#27272a] p-6 flex flex-col items-center justify-center min-h-[200px]">
                <Activity className="w-8 h-8 text-zinc-700 mb-3" />
                <p className="text-zinc-500 text-sm">Submit a job to see real-time progress</p>
            </div>
        )
    }

    const cfg = STATUS_CONFIG[status.status]
    const pct = status.progress_percentage ?? 0

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl border border-[#27272a] p-6 space-y-5"
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-white font-semibold">Job Progress</h3>
                    <p className="text-zinc-500 text-xs mt-0.5 font-mono">{status.job_id.slice(0, 18)}…</p>
                </div>
                <span className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border', cfg.color)}>
                    {cfg.icon}
                    {cfg.label}
                </span>
            </div>

            {/* Progress bar */}
            <div>
                <div className="flex justify-between text-xs text-zinc-400 mb-2">
                    <span>Progress</span>
                    <span className="font-semibold text-[#a78bfa]">{pct.toFixed(1)}%</span>
                </div>
                <div className="h-2.5 bg-[#27272a] rounded-full overflow-hidden">
                    <motion.div
                        className={cn(
                            'h-full rounded-full',
                            status.status === 'failed'
                                ? 'bg-red-500'
                                : 'bg-gradient-to-r from-[#7c3aed] to-[#a78bfa]',
                        )}
                        initial={{ width: '0%' }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { icon: <FileStack className="w-4 h-4 text-[#a78bfa]" />, label: 'Pages', value: `${status.pages_scraped} / ${status.pages_total}` },
                    { icon: <Activity className="w-4 h-4 text-[#a78bfa]" />, label: 'Records', value: status.records_extracted.toLocaleString() },
                    { icon: <Clock className="w-4 h-4 text-[#a78bfa]" />, label: 'Started', value: status.started_at ? formatDate(status.started_at) : '—' },
                ].map(({ icon, label, value }) => (
                    <div key={label} className="bg-[#18181b] rounded-xl p-3 border border-[#27272a] flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                            {icon} {label}
                        </div>
                        <p className="text-white text-sm font-semibold truncate">{value}</p>
                    </div>
                ))}
            </div>

            {/* Error message */}
            {status.status === 'failed' && status.error_message && (
                <div className="bg-red-950/30 border border-red-500/20 rounded-xl p-4 text-sm text-red-300">
                    <p className="font-medium mb-1">Error</p>
                    <p className="text-xs text-red-400/80">{status.error_message}</p>
                </div>
            )}
        </motion.div>
    )
}
