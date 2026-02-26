import { motion } from 'framer-motion'
import { Link2, Settings, Sparkles, Download } from 'lucide-react'

const steps = [
    {
        number: '01',
        icon: Link2,
        title: 'Enter URL',
        desc: 'Paste any target URL. Products page, job board, news site — any publicly accessible web page.',
    },
    {
        number: '02',
        icon: Settings,
        title: 'Configure Options',
        desc: 'Set page depth, data type, headless mode, and delay. The AI adapts the extraction schema automatically.',
    },
    {
        number: '03',
        icon: Sparkles,
        title: 'AI Validation',
        desc: 'Every extracted record is validated, deduplicated, and quality-scored against your schema in real-time.',
    },
    {
        number: '04',
        icon: Download,
        title: 'Download Clean Data',
        desc: 'Export as CSV or JSON. Time-limited signed URL, ready for Excel, Power BI, or your ML pipeline.',
    },
]

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 px-6 relative">
            {/* subtle bg accent */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-[#7c3aed]/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-5xl mx-auto relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/30 mb-4">
                        How It Works
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        From URL to clean data in <span className="gradient-text">4 steps</span>
                    </h2>
                </motion.div>

                <div className="relative">
                    {/* connector line */}
                    <div className="hidden lg:block absolute top-10 left-[calc(12.5%+20px)] right-[calc(12.5%+20px)] h-px bg-gradient-to-r from-transparent via-[#7c3aed]/40 to-transparent" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, i) => {
                            const Icon = step.icon
                            return (
                                <motion.div
                                    key={step.number}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15, duration: 0.5 }}
                                    className="flex flex-col items-center text-center"
                                >
                                    <div className="relative mb-6">
                                        <div className="w-16 h-16 rounded-2xl bg-[#18181b] border border-[#3f3f46] flex items-center justify-center shadow-lg glow">
                                            <Icon className="w-7 h-7 text-[#a78bfa]" />
                                        </div>
                                        <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#7c3aed] flex items-center justify-center text-xs font-bold text-white">
                                            {i + 1}
                                        </span>
                                    </div>
                                    <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                                    <p className="text-zinc-400 text-sm leading-relaxed">{step.desc}</p>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}
