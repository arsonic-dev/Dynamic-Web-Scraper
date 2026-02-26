import { motion } from 'framer-motion'
import {
    Globe, ShieldCheck, Layers, Activity,
    Copy, Download,
} from 'lucide-react'

const features = [
    {
        icon: Globe,
        title: 'Dynamic JS Rendering',
        desc: 'Handles React, Vue, Angular — anything Playwright can load. No more missing data from SPAs.',
        color: 'from-[#7c3aed] to-[#6d28d9]',
    },
    {
        icon: ShieldCheck,
        title: 'Schema Validation',
        desc: 'Every record validated against your data type schema. Type errors, nulls, and malformed fields caught automatically.',
        color: 'from-[#2563eb] to-[#1d4ed8]',
    },
    {
        icon: Layers,
        title: 'AI-Ready Structured Output',
        desc: 'Clean, normalized JSON and CSV output ready to feed into ML pipelines, BI tools, or databases.',
        color: 'from-[#059669] to-[#047857]',
    },
    {
        icon: Activity,
        title: 'Real-Time Job Tracking',
        desc: 'Live progress percentage, pages scraped, and records extracted — updated every 3 seconds.',
        color: 'from-[#d97706] to-[#b45309]',
    },
    {
        icon: Copy,
        title: 'Duplicate Removal',
        desc: 'Exact and near-duplicate records detected and removed. Your dataset stays clean and unique.',
        color: 'from-[#dc2626] to-[#b91c1c]',
    },
    {
        icon: Download,
        title: 'CSV & JSON Export',
        desc: 'One-click download. Time-limited signed URLs. Ready for Excel, Power BI, or programmatic use.',
        color: 'from-[#7c3aed] to-[#4c1d95]',
    },
]

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
}
const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function Features() {
    return (
        <section id="features" className="py-24 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/30 mb-4">
                        Features
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Everything you need to scrape <span className="gradient-text">at scale</span>
                    </h2>
                    <p className="text-zinc-400 max-w-xl mx-auto">
                        Built for engineers and data teams who need reliable, clean data — not raw HTML dumps.
                    </p>
                </motion.div>

                {/* Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                    {features.map((f) => {
                        const Icon = f.icon
                        return (
                            <motion.div
                                key={f.title}
                                variants={item}
                                className="group glass rounded-2xl p-6 border border-[#27272a] hover:border-[#7c3aed]/40 transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg`}>
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
                            </motion.div>
                        )
                    })}
                </motion.div>
            </div>
        </section>
    )
}
