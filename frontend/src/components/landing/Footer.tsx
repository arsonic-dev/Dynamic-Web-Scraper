import { Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Footer() {
    const navigate = useNavigate()
    const year = new Date().getFullYear()

    return (
        <footer className="border-t border-[#27272a] py-12 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="col-span-2 sm:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-7 h-7 rounded-lg bg-[#7c3aed] flex items-center justify-center">
                                <Zap className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold text-white">Scraper<span className="gradient-text">AI</span></span>
                        </div>
                        <p className="text-zinc-500 text-sm leading-relaxed">
                            AI-powered web scraping platform for developers and data teams.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="text-white font-medium mb-4 text-sm">Product</h4>
                        <ul className="space-y-2 text-sm text-zinc-500">
                            {['Features', 'How It Works', 'Pricing', 'API Docs'].map((l) => (
                                <li key={l}><a href={`#${l.toLowerCase().replace(' ', '-')}`} className="hover:text-[#a78bfa] transition-colors">{l}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* App */}
                    <div>
                        <h4 className="text-white font-medium mb-4 text-sm">App</h4>
                        <ul className="space-y-2 text-sm text-zinc-500">
                            {[
                                { label: 'Dashboard', path: '/dashboard' },
                                { label: 'Job History', path: '/history' },
                                { label: 'Settings', path: '/settings' },
                            ].map((l) => (
                                <li key={l.label}>
                                    <button onClick={() => navigate(l.path)} className="hover:text-[#a78bfa] transition-colors">
                                        {l.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-white font-medium mb-4 text-sm">Legal</h4>
                        <ul className="space-y-2 text-sm text-zinc-500">
                            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((l) => (
                                <li key={l}><a href="#" className="hover:text-[#a78bfa] transition-colors">{l}</a></li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-[#27272a] text-sm text-zinc-600">
                    <p>© {year} ScraperAI. All rights reserved.</p>
                    <p className="mt-2 sm:mt-0">Built with ❤️ for developers and data teams.</p>
                </div>
            </div>
        </footer>
    )
}
