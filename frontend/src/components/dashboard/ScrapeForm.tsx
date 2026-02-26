import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Globe, FileText, ToggleLeft, ToggleRight, ChevronDown, Loader2 } from 'lucide-react'
import { useScraperStore } from '@/store/useScraperStore'
import { type DataType } from '@/services/api'
import { cn } from '@/lib/utils'

const DATA_TYPES: { value: DataType; label: string }[] = [
    { value: 'products', label: 'Products' },
    { value: 'jobs', label: 'Jobs' },
    { value: 'articles', label: 'Articles' },
    { value: 'custom', label: 'Custom' },
]

export default function ScrapeForm() {
    const { submitJob, isSubmitting, isPolling } = useScraperStore()

    const [url, setUrl] = useState('')
    const [pages, setPages] = useState(5)
    const [dataType, setDataType] = useState<DataType>('products')
    const [headless, setHeadless] = useState(false)
    const [open, setOpen] = useState(false)

    const isBusy = isSubmitting || isPolling

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!url.trim() || isBusy) return
        await submitJob({ url: url.trim(), pages, data_type: dataType, headless })
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl border border-[#27272a] p-6"
        >
            <h2 className="text-white font-semibold text-lg mb-5 flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#a78bfa]" />
                New Scraping Job
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* URL */}
                <div>
                    <label className="block text-sm text-zinc-400 mb-1.5">Target URL <span className="text-[#7c3aed]">*</span></label>
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com/products"
                        required
                        disabled={isBusy}
                        className={cn(
                            'w-full bg-[#18181b] border border-[#3f3f46] rounded-xl px-4 py-3 text-white text-sm',
                            'placeholder:text-zinc-600 focus:outline-none focus:border-[#7c3aed] transition-colors',
                            isBusy && 'opacity-50 cursor-not-allowed',
                        )}
                    />
                </div>

                {/* Pages + Data Type */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Pages */}
                    <div>
                        <label className="block text-sm text-zinc-400 mb-1.5">Pages<span className="text-[#7c3aed]">*</span></label>
                        <input
                            type="number"
                            min={1}
                            max={500}
                            value={pages}
                            onChange={(e) => setPages(Number(e.target.value))}
                            disabled={isBusy}
                            className={cn(
                                'w-full bg-[#18181b] border border-[#3f3f46] rounded-xl px-4 py-3 text-white text-sm',
                                'focus:outline-none focus:border-[#7c3aed] transition-colors',
                                isBusy && 'opacity-50 cursor-not-allowed',
                            )}
                        />
                    </div>

                    {/* Data Type */}
                    <div className="relative">
                        <label className="block text-sm text-zinc-400 mb-1.5">Data Type <span className="text-[#7c3aed]">*</span></label>
                        <button
                            type="button"
                            onClick={() => setOpen((o) => !o)}
                            disabled={isBusy}
                            className={cn(
                                'w-full bg-[#18181b] border border-[#3f3f46] rounded-xl px-4 py-3 text-white text-sm text-left',
                                'flex items-center justify-between focus:outline-none focus:border-[#7c3aed] transition-colors',
                                isBusy && 'opacity-50 cursor-not-allowed',
                            )}
                        >
                            <span className="flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5 text-[#a78bfa]" />
                                {DATA_TYPES.find((d) => d.value === dataType)?.label}
                            </span>
                            <ChevronDown className={cn('w-4 h-4 text-zinc-500 transition-transform', open && 'rotate-180')} />
                        </button>
                        {open && (
                            <div className="absolute top-full mt-1 left-0 right-0 z-20 bg-[#18181b] border border-[#3f3f46] rounded-xl overflow-hidden shadow-xl">
                                {DATA_TYPES.map((dt) => (
                                    <button
                                        key={dt.value}
                                        type="button"
                                        onClick={() => { setDataType(dt.value); setOpen(false) }}
                                        className={cn(
                                            'w-full px-4 py-2.5 text-sm text-left hover:bg-[#27272a] transition-colors',
                                            dt.value === dataType ? 'text-[#a78bfa]' : 'text-zinc-300',
                                        )}
                                    >
                                        {dt.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Headless toggle */}
                <div className="flex items-center justify-between p-4 bg-[#18181b] rounded-xl border border-[#27272a]">
                    <div>
                        <p className="text-sm text-zinc-200 font-medium">Headless Mode</p>
                        <p className="text-xs text-zinc-500 mt-0.5">Use Playwright for JS-rendered pages</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setHeadless((h) => !h)}
                        disabled={isBusy}
                        className="shrink-0 text-[#a78bfa] hover:text-[#7c3aed] transition-colors"
                    >
                        {headless
                            ? <ToggleRight className="w-8 h-8" />
                            : <ToggleLeft className="w-8 h-8 text-zinc-600" />
                        }
                    </button>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isBusy || !url.trim()}
                    className={cn(
                        'w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200',
                        isBusy || !url.trim()
                            ? 'bg-[#3f3f46] text-zinc-500 cursor-not-allowed'
                            : 'bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-lg shadow-[#7c3aed]/30 hover:scale-[1.01]',
                    )}
                >
                    {isBusy
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> {isSubmitting ? 'Submitting...' : 'Running...'}</>
                        : <><Play className="w-4 h-4" /> Start Scraping</>
                    }
                </button>
            </form>
        </motion.div>
    )
}
