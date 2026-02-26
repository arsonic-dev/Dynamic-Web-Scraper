import { motion } from 'framer-motion'
import { Check, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const tiers = [
    {
        name: 'Free',
        price: '$0',
        period: 'forever',
        desc: 'Perfect for side projects and exploration.',
        cta: 'Get Started',
        highlighted: false,
        features: [
            '50 pages / month',
            '1 concurrent job',
            'CSV export',
            'Basic validation',
            '24h data retention',
        ],
    },
    {
        name: 'Pro',
        price: '$29',
        period: 'per month',
        desc: 'For professionals and growing teams.',
        cta: 'Start Pro Trial',
        highlighted: true,
        features: [
            '10,000 pages / month',
            '10 concurrent jobs',
            'CSV + JSON export',
            'AI schema validation',
            'Webhook notifications',
            '30-day data retention',
            'Priority support',
        ],
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        period: 'contact us',
        desc: 'Unlimited scale for large organizations.',
        cta: 'Contact Sales',
        highlighted: false,
        features: [
            'Unlimited pages',
            'Unlimited concurrent jobs',
            'All export formats',
            'Custom schemas',
            'Dedicated infrastructure',
            'SLA guarantee',
            'SSO / SAML',
        ],
    },
]

export default function Pricing() {
    const navigate = useNavigate()

    return (
        <section id="pricing" className="py-24 px-6">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/30 mb-4">
                        Pricing
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Simple, <span className="gradient-text">transparent</span> pricing
                    </h2>
                    <p className="text-zinc-400">No hidden fees. Scale as you grow.</p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {tiers.map((tier, i) => (
                        <motion.div
                            key={tier.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                            className={`relative rounded-2xl p-7 flex flex-col border transition-all duration-200 ${tier.highlighted
                                    ? 'bg-gradient-to-b from-[#7c3aed]/20 to-[#4c1d95]/10 border-[#7c3aed]/50 shadow-xl shadow-[#7c3aed]/15'
                                    : 'glass border-[#27272a] hover:border-[#3f3f46]'
                                }`}
                        >
                            {tier.highlighted && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full bg-[#7c3aed] text-xs font-semibold text-white">
                                    <Zap className="w-3 h-3" /> Most Popular
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-white font-semibold text-lg mb-1">{tier.name}</h3>
                                <p className="text-zinc-400 text-sm mb-4">{tier.desc}</p>
                                <div className="flex items-end gap-1">
                                    <span className="text-4xl font-bold text-white">{tier.price}</span>
                                    <span className="text-zinc-500 text-sm mb-1">/ {tier.period}</span>
                                </div>
                            </div>

                            <ul className="space-y-3 mb-8 flex-1">
                                {tier.features.map((f) => (
                                    <li key={f} className="flex items-center gap-2.5 text-sm text-zinc-300">
                                        <Check className="w-4 h-4 text-[#7c3aed] shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => navigate('/dashboard')}
                                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${tier.highlighted
                                        ? 'bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-lg shadow-[#7c3aed]/30 hover:scale-[1.02]'
                                        : 'glass border border-[#3f3f46] hover:border-[#7c3aed]/40 text-zinc-300 hover:text-white'
                                    }`}
                            >
                                {tier.cta}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
