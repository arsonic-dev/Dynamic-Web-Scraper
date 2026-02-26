import { motion } from 'framer-motion'
import { ArrowRight, Play, Zap, Shield, BarChart3 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const floatingBadges = [
    { icon: <Zap className="w-3 h-3" />, text: 'AI-Powered', delay: 0 },
    { icon: <Shield className="w-3 h-3" />, text: 'Validated Data', delay: 0.2 },
    { icon: <BarChart3 className="w-3 h-3" />, text: '99.2% Accuracy', delay: 0.4 },
]

export default function Hero() {
    const navigate = useNavigate()

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#7c3aed]/10 rounded-full blur-[120px]" />
                <div className="absolute top-2/3 left-1/4 w-[400px] h-[400px] bg-[#4c1d95]/8 rounded-full blur-[80px]" />
                {/* Grid */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'linear-gradient(#a78bfa 1px, transparent 1px), linear-gradient(90deg, #a78bfa 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />
            </div>

            {/* Floating badges */}
            <div className="flex flex-wrap gap-3 justify-center mb-12">
                {floatingBadges.map((b) => (
                    <motion.div
                        key={b.text}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: b.delay, duration: 0.5 }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs text-[#c4b5fd] font-medium border border-[#7c3aed]/30"
                    >
                        <span className="text-[#a78bfa]">{b.icon}</span>
                        {b.text}
                    </motion.div>
                ))}
            </div>

            {/* Headline */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-center max-w-5xl"
            >
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-white mb-6">
                    AI-Powered{' '}
                    <span className="gradient-text">Dynamic Web</span>
                    <br />Scraping Platform
                </h1>
                <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                    Extract structured, validated data from any website at scale.
                    Real-time progress tracking, automatic deduplication, and
                    AI-ready CSV/JSON output — in minutes, not hours.
                </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 mt-10"
            >
                <button
                    onClick={() => navigate('/dashboard')}
                    className="group flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-base transition-all duration-200 shadow-lg shadow-[#7c3aed]/30 hover:shadow-[#7c3aed]/50 hover:scale-[1.02]"
                >
                    Start Scraping
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="flex items-center gap-2 px-7 py-3.5 rounded-xl glass border border-[#3f3f46] hover:border-[#7c3aed]/50 text-zinc-300 hover:text-white font-semibold text-base transition-all duration-200">
                    <Play className="w-4 h-4 text-[#a78bfa]" />
                    View Demo
                </button>
            </motion.div>

            {/* Dashboard preview mockup */}
            <motion.div
                initial={{ opacity: 0, y: 60, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.8, ease: 'easeOut' }}
                className="relative mt-20 w-full max-w-5xl"
            >
                <div className="absolute -inset-1 bg-gradient-to-r from-[#7c3aed]/20 via-[#a78bfa]/10 to-[#7c3aed]/20 rounded-2xl blur-xl" />
                <div className="relative glass rounded-2xl border border-[#3f3f46] overflow-hidden">
                    {/* Mock browser chrome */}
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-[#27272a] bg-[#18181b]">
                        <div className="w-3 h-3 rounded-full bg-[#ef4444]/60" />
                        <div className="w-3 h-3 rounded-full bg-[#f59e0b]/60" />
                        <div className="w-3 h-3 rounded-full bg-[#22c55e]/60" />
                        <div className="ml-4 flex-1 max-w-xs bg-[#27272a] rounded-md px-3 py-1 text-xs text-zinc-500">
                            localhost:3000/dashboard
                        </div>
                    </div>
                    {/* Mock dashboard content */}
                    <div className="p-6 grid grid-cols-12 gap-4 min-h-[320px]">
                        {/* Sidebar */}
                        <div className="col-span-2 space-y-2">
                            {['Dashboard', 'History', 'Settings'].map((item, i) => (
                                <div key={item} className={`h-7 rounded-lg ${i === 0 ? 'bg-[#7c3aed]/40' : 'bg-[#27272a]'}`} />
                            ))}
                        </div>
                        {/* Main */}
                        <div className="col-span-10 space-y-4">
                            <div className="grid grid-cols-4 gap-3">
                                {['214', '198', '16', '92.5%'].map((v, i) => (
                                    <div key={i} className="bg-[#18181b] rounded-xl p-3 border border-[#27272a]">
                                        <div className="h-3 w-12 bg-[#3f3f46] rounded mb-2" />
                                        <div className="text-lg font-bold text-[#a78bfa]">{v}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-[#18181b] rounded-xl border border-[#27272a] p-4">
                                <div className="h-3 w-32 bg-[#3f3f46] rounded mb-3" />
                                <div className="h-2 bg-[#27272a] rounded-full overflow-hidden">
                                    <div className="h-full w-3/4 bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] rounded-full" />
                                </div>
                                <div className="mt-3 space-y-2">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="h-6 bg-[#27272a]/60 rounded" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
