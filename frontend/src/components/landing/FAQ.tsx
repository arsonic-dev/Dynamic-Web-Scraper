import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
    {
        q: 'Does it handle JavaScript-rendered pages?',
        a: 'Yes. When headless mode is enabled, we use Playwright (Chromium) to fully render JavaScript before extracting data. This works with React, Vue, Angular, and any other SPA.',
    },
    {
        q: 'How does AI validation work?',
        a: 'Each scraped record is validated against the schema defined by your chosen data type (products, jobs, articles, or custom). We check field presence, data types, format rules (URLs, prices, dates), and flag anomalies. The data quality score is a weighted composite of completeness, uniqueness, validity, and consistency.',
    },
    {
        q: 'What happens if a site has CAPTCHAs or rate limits?',
        a: "The scraper detects CAPTCHA responses and marks the job as failed with a clear error message. You can retry with headless mode enabled and a higher delay_ms value. Enterprise plans include proxy rotation to mitigate rate limits.",
    },
    {
        q: 'How long are my scraped files retained?',
        a: 'Download links expire 24 hours after job completion. Free plan data is retained for 24 hours; Pro retains for 30 days; Enterprise has configurable retention policies.',
    },
    {
        q: 'Can I integrate the API into my own application?',
        a: 'Absolutely. The REST API is fully documented. You can submit jobs, poll status, retrieve results, and download CSVs programmatically from any language. Webhook notifications are available on Pro and above.',
    },
    {
        q: 'Is there a scraping rate limit?',
        a: 'Yes — POST /scrape is limited to 10 requests/minute on Free and Pro plans. Within jobs, the delay_ms parameter controls per-page throttling. Enterprise plans have custom limits.',
    },
]

function FAQItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false)
    return (
        <div className="border border-[#27272a] rounded-xl overflow-hidden">
            <button
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center justify-between px-5 py-4 text-left text-white font-medium hover:bg-[#18181b] transition-colors duration-150"
            >
                <span>{q}</span>
                <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-5 h-5 text-[#a78bfa] shrink-0" />
                </motion.span>
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                        <p className="px-5 pb-5 text-zinc-400 text-sm leading-relaxed">{a}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default function FAQ() {
    return (
        <section id="faq" className="py-24 px-6">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/30 mb-4">
                        FAQ
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Frequently asked <span className="gradient-text">questions</span>
                    </h2>
                </motion.div>

                <div className="space-y-3">
                    {faqs.map((faq) => (
                        <FAQItem key={faq.q} {...faq} />
                    ))}
                </div>
            </div>
        </section>
    )
}
