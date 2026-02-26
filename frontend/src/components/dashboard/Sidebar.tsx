import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, History, Settings, ArrowLeft, Zap, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/history', icon: History, label: 'Job History' },
    { to: '/settings', icon: Settings, label: 'Settings' },
]

interface SidebarProps {
    mobileOpen: boolean
    onClose: () => void
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
    const navigate = useNavigate()

    return (
        <>
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/60 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed lg:static inset-y-0 left-0 z-40 w-64 flex flex-col',
                    'bg-[#0d0d10] border-r border-[#1c1c20] transition-transform duration-300',
                    mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
                )}
            >
                {/* Logo */}
                <div className="flex items-center justify-between px-5 h-16 border-b border-[#1c1c20]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#7c3aed] flex items-center justify-center shadow-lg shadow-[#7c3aed]/30">
                            <Zap className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-white text-sm">
                            Scraper<span className="gradient-text">AI</span>
                        </span>
                    </div>
                    <button onClick={onClose} className="lg:hidden text-zinc-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navItems.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            onClick={onClose}
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                                    isActive
                                        ? 'bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/30'
                                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#18181b]',
                                )
                            }
                        >
                            <Icon className="w-4 h-4 shrink-0" />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* Back to Home */}
                <div className="px-3 pb-5">
                    <button
                        onClick={() => navigate('/')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-500 hover:text-zinc-300 hover:bg-[#18181b] transition-all duration-150"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </button>
                </div>
            </aside>
        </>
    )
}
