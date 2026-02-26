import { useState } from 'react'
import { Menu } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '@/components/dashboard/Sidebar'
import ScrapeForm from '@/components/dashboard/ScrapeForm'
import ProgressTracker from '@/components/dashboard/ProgressTracker'
import ValidationSummary from '@/components/dashboard/ValidationSummary'
import DataPreviewTable from '@/components/dashboard/DataPreviewTable'
import { useScraperStore } from '@/store/useScraperStore'

export default function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { error, clearError } = useScraperStore()

    return (
        <div className="flex h-screen bg-[#0d0d10] overflow-hidden">
            <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top bar */}
                <header className="h-16 border-b border-[#1c1c20] flex items-center justify-between px-5 shrink-0">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-zinc-400 hover:text-white">
                            <Menu className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-white font-semibold">Dashboard</h1>
                            <p className="text-zinc-500 text-xs hidden sm:block">Submit jobs and track real-time results</p>
                        </div>
                    </div>
                </header>

                {/* Scrollable body */}
                <main className="flex-1 overflow-y-auto p-5 space-y-5">
                    {/* Global error notification */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                className="bg-red-950/40 border border-red-500/30 rounded-xl p-4 flex items-start justify-between gap-3"
                            >
                                <div>
                                    <p className="text-red-300 font-medium text-sm">{error.error_code}</p>
                                    <p className="text-red-400/80 text-xs mt-0.5">{error.message}</p>
                                </div>
                                <button onClick={clearError} className="text-red-400 hover:text-red-200 text-xs shrink-0">Dismiss</button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Scrape form + progress side-by-side on wide screens */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <ScrapeForm />
                        <ProgressTracker />
                    </div>

                    {/* Validation summary — only shown after result */}
                    <ValidationSummary />

                    {/* Data preview table */}
                    <DataPreviewTable />
                </main>
            </div>
        </div>
    )
}
