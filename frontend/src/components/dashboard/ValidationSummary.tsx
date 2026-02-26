import { motion } from 'framer-motion'
import { ShieldCheck, TrendingUp, Copy, Wrench, Star } from 'lucide-react'
import { useScraperStore } from '@/store/useScraperStore'

interface StatCardProps {
    icon: React.ReactNode
    label: string
    value: string | number
    sub?: string
    accent?: boolean
    delay?: number
}

function StatCard({ icon, label, value, sub, accent, delay = 0 }: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.4 }}
            className={`rounded-2xl p-5 border flex flex-col gap-3 ${accent
                    ? 'bg-gradient-to-br from-[#7c3aed]/20 to-[#4c1d95]/10 border-[#7c3aed]/30 shadow-lg shadow-[#7c3aed]/10'
                    : 'bg-[#18181b] border-[#27272a]'
                }`}
        >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent ? 'bg-[#7c3aed]/30' : 'bg-[#27272a]'}`}>
                {icon}
            </div>
            <div>
                <p className="text-zinc-400 text-xs mb-1">{label}</p>
                <p className={`text-2xl font-bold ${accent ? 'gradient-text' : 'text-white'}`}>{value}</p>
                {sub && <p className="text-xs text-zinc-500 mt-0.5">{sub}</p>}
            </div>
        </motion.div>
    )
}

// Mini quality dimension bar
function QualityBar({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400 w-24 shrink-0 capitalize">{label}</span>
            <div className="flex-1 h-1.5 bg-[#27272a] rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                />
            </div>
            <span className="text-xs font-semibold text-zinc-300 w-10 text-right">{value.toFixed(1)}%</span>
        </div>
    )
}

export default function ValidationSummary() {
    const { result } = useScraperStore()

    if (!result) {
        return (
            <div className="glass rounded-2xl border border-[#27272a] p-6 flex flex-col items-center justify-center min-h-[160px]">
                <ShieldCheck className="w-8 h-8 text-zinc-700 mb-3" />
                <p className="text-zinc-500 text-sm">Validation results appear after job completes</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Stat cards grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <StatCard icon={<TrendingUp className="w-4 h-4 text-zinc-400" />} label="Total Records" value={result.total_records} delay={0} />
                <StatCard icon={<ShieldCheck className="w-4 h-4 text-green-400" />} label="Clean Records" value={result.clean_records} delay={0.05} />
                <StatCard icon={<Copy className="w-4 h-4 text-orange-400" />} label="Duplicates Removed" value={result.duplicates_removed} delay={0.1} />
                <StatCard icon={<Wrench className="w-4 h-4 text-blue-400" />} label="Fields Fixed" value={result.missing_fields_fixed} delay={0.15} />
                <StatCard
                    icon={<Star className="w-4 h-4 text-[#a78bfa]" />}
                    label="Quality Score"
                    value={`${result.data_quality_score.toFixed(1)}%`}
                    accent
                    delay={0.2}
                />
            </div>

            {/* Quality breakdown */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-2xl border border-[#27272a] p-5"
            >
                <h4 className="text-white font-semibold text-sm mb-4">Quality Breakdown</h4>
                <div className="space-y-3">
                    {Object.entries(result.quality_breakdown).map(([dim, val]) => (
                        <QualityBar key={dim} label={dim} value={val} />
                    ))}
                </div>
            </motion.div>
        </div>
    )
}
