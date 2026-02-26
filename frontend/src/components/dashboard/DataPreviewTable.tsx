import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, Download, FileJson, Table2 } from 'lucide-react'
import { useScraperStore } from '@/store/useScraperStore'
import { getDownloadUrl } from '@/services/api'
import { cn } from '@/lib/utils'

type SortDir = 'asc' | 'desc' | null

export default function DataPreviewTable() {
    const { result, jobId } = useScraperStore()
    const [query, setQuery] = useState('')
    const [sortCol, setSortCol] = useState<string | null>(null)
    const [sortDir, setSortDir] = useState<SortDir>(null)
    const [page, setPage] = useState(1)
    const PAGE_SIZE = 5

    const rows = result?.preview_data ?? []

    // Derive columns from first row
    const columns = useMemo(() => rows.length > 0 ? Object.keys(rows[0]) : [], [rows])

    // Filter
    const filtered = useMemo(() => {
        if (!query.trim()) return rows
        const q = query.toLowerCase()
        return rows.filter((row) =>
            Object.values(row).some((v) => String(v ?? '').toLowerCase().includes(q)),
        )
    }, [rows, query])

    // Sort
    const sorted = useMemo(() => {
        if (!sortCol || !sortDir) return filtered
        return [...filtered].sort((a, b) => {
            const av = String(a[sortCol] ?? '')
            const bv = String(b[sortCol] ?? '')
            return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
        })
    }, [filtered, sortCol, sortDir])

    // Pagination
    const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
    const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    const toggleSort = (col: string) => {
        if (sortCol !== col) { setSortCol(col); setSortDir('asc'); return }
        if (sortDir === 'asc') { setSortDir('desc'); return }
        setSortCol(null); setSortDir(null)
    }

    const SortIcon = ({ col }: { col: string }) => {
        if (sortCol !== col) return <ChevronsUpDown className="w-3 h-3 text-zinc-600" />
        return sortDir === 'asc'
            ? <ChevronUp className="w-3 h-3 text-[#a78bfa]" />
            : <ChevronDown className="w-3 h-3 text-[#a78bfa]" />
    }

    if (!result) {
        return (
            <div className="glass rounded-2xl border border-[#27272a] p-6 flex flex-col items-center justify-center min-h-[200px]">
                <Table2 className="w-8 h-8 text-zinc-700 mb-3" />
                <p className="text-zinc-500 text-sm">Preview data appears after job completes</p>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl border border-[#27272a] overflow-hidden"
        >
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 border-b border-[#27272a]">
                <h3 className="text-white font-semibold">Data Preview <span className="text-zinc-500 font-normal text-sm">({result.clean_records.toLocaleString()} records)</span></h3>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 sm:w-52">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                        <input
                            value={query}
                            onChange={(e) => { setQuery(e.target.value); setPage(1) }}
                            placeholder="Search preview..."
                            className="w-full pl-9 pr-3 py-2 bg-[#18181b] border border-[#3f3f46] rounded-lg text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#7c3aed] transition-colors"
                        />
                    </div>
                    {/* Downloads */}
                    {jobId && (
                        <>
                            <a
                                href={getDownloadUrl(jobId)}
                                download
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#7c3aed]/20 border border-[#7c3aed]/30 text-[#a78bfa] text-xs font-medium hover:bg-[#7c3aed]/30 transition-colors"
                            >
                                <Download className="w-3.5 h-3.5" /> CSV
                            </a>
                            <button
                                onClick={() => {
                                    const json = JSON.stringify(result.preview_data, null, 2)
                                    const blob = new Blob([json], { type: 'application/json' })
                                    const a = document.createElement('a')
                                    a.href = URL.createObjectURL(blob)
                                    a.download = `scraper_${jobId.slice(0, 8)}.json`
                                    a.click()
                                }}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#18181b] border border-[#3f3f46] text-zinc-300 text-xs font-medium hover:border-[#7c3aed]/40 transition-colors"
                            >
                                <FileJson className="w-3.5 h-3.5" /> JSON
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-[#27272a] bg-[#18181b]">
                            {columns.map((col) => (
                                <th
                                    key={col}
                                    onClick={() => toggleSort(col)}
                                    className="px-4 py-3 text-left text-xs text-zinc-400 font-medium whitespace-nowrap cursor-pointer hover:text-zinc-200 transition-colors select-none"
                                >
                                    <span className="flex items-center gap-1.5">
                                        {col.replace(/_/g, ' ')}
                                        <SortIcon col={col} />
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paged.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="py-12 text-center text-zinc-500">
                                    No records match your search.
                                </td>
                            </tr>
                        ) : (
                            paged.map((row, ri) => (
                                <tr
                                    key={ri}
                                    className={cn(
                                        'border-b border-[#1c1c20] hover:bg-[#18181b] transition-colors',
                                        ri % 2 === 0 ? '' : 'bg-[#0d0d10]/40',
                                    )}
                                >
                                    {columns.map((col) => {
                                        const val = row[col]
                                        return (
                                            <td key={col} className="px-4 py-3 text-zinc-300 max-w-[200px] truncate">
                                                {val === null || val === undefined ? (
                                                    <span className="text-zinc-600">—</span>
                                                ) : typeof val === 'boolean' ? (
                                                    <span className={val ? 'text-green-400' : 'text-zinc-500'}>{String(val)}</span>
                                                ) : typeof val === 'number' ? (
                                                    <span className="text-[#a78bfa] font-mono">{val}</span>
                                                ) : String(val).startsWith('http') ? (
                                                    <a href={String(val)} target="_blank" rel="noreferrer" className="text-[#7c3aed] hover:underline truncate block max-w-[160px]">
                                                        {String(val).replace(/^https?:\/\/(www\.)?/, '')}
                                                    </a>
                                                ) : String(val)}
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-3 border-t border-[#27272a] text-xs text-zinc-400">
                    <span>Page {page} of {totalPages} ({sorted.length} results)</span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-1.5 rounded-lg bg-[#18181b] border border-[#3f3f46] disabled:opacity-40 hover:border-[#7c3aed]/40 transition-colors"
                        >
                            ← Prev
                        </button>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-3 py-1.5 rounded-lg bg-[#18181b] border border-[#3f3f46] disabled:opacity-40 hover:border-[#7c3aed]/40 transition-colors"
                        >
                            Next →
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    )
}
