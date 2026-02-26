import { motion } from 'framer-motion'
import { FileText, Braces, Code2, BarChart2, Cpu } from 'lucide-react'

const integrations = [
    { icon: FileText, label: 'CSV', color: '#22c55e' },
    { icon: Braces, label: 'JSON', color: '#f59e0b' },
    { icon: Code2, label: 'Python', color: '#3b82f6' },
    { icon: BarChart2, label: 'Power BI', color: '#f97316' },
    { icon: Cpu, label: 'ML Pipelines', color: '#a78bfa' },
]

export default function Integrations() {
    return (
        <section id="integrations" className="py-20 px-6">
            <div className="max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/30 mb-4">
                        Integrations
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Plug into your <span className="gradient-text">existing stack</span>
                    </h2>
                    <p className="text-zinc-400 mb-12">
                        Export structured data directly into the tools your team already uses.
                    </p>
                </motion.div>

                <div className="flex flex-wrap justify-center gap-5">
                    {integrations.map((intg, i) => {
                        const Icon = intg.icon
                        return (
                            <motion.div
                                key={intg.label}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ scale: 1.08, y: -4 }}
                                className="glass rounded-2xl border border-[#27272a] hover:border-[#7c3aed]/40 px-8 py-6 flex flex-col items-center gap-3 cursor-pointer transition-colors duration-200 w-36"
                            >
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                                    style={{ background: `${intg.color}22`, border: `1px solid ${intg.color}44` }}
                                >
                                    <Icon className="w-6 h-6" style={{ color: intg.color }} />
                                </div>
                                <span className="text-zinc-300 text-sm font-medium">{intg.label}</span>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
