import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Menu } from 'lucide-react'
import { motion } from 'framer-motion'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import HowItWorks from '@/components/landing/HowItWorks'
import Integrations from '@/components/landing/Integrations'
import Pricing from '@/components/landing/Pricing'
import FAQ from '@/components/landing/FAQ'
import Footer from '@/components/landing/Footer'

const NAV_LINKS = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Integrations', href: '#integrations' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
]

export default function Landing() {
    const navigate = useNavigate()
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <div className="min-h-screen bg-[#0d0d10] text-zinc-200">
            {/* Sticky navbar */}
            <motion.header
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0d0d10]/90 backdrop-blur-lg border-b border-[#1c1c20]' : ''
                    }`}
            >
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#7c3aed] flex items-center justify-center">
                            <Zap className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-white">Scraper<span className="gradient-text">AI</span></span>
                    </div>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-7">
                        {NAV_LINKS.map((l) => (
                            <a key={l.label} href={l.href} className="text-sm text-zinc-400 hover:text-white transition-colors">
                                {l.label}
                            </a>
                        ))}
                    </nav>

                    {/* CTA */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="hidden sm:flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-[#7c3aed]/30"
                        >
                            <Zap className="w-3.5 h-3.5" /> Get Started
                        </button>
                        <button className="md:hidden text-zinc-400 hover:text-white">
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Page sections */}
            <main>
                <Hero />
                <Features />
                <HowItWorks />
                <Integrations />
                <Pricing />
                <FAQ />
            </main>
            <Footer />
        </div>
    )
}
