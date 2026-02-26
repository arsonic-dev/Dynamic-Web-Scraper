/**
 * useScraperStore.ts — Global Zustand state store
 * Manages active job state, results, and polling lifecycle.
 */
import { create } from 'zustand'
import {
    submitScrapeJob,
    getJobStatus,
    getJobResult,
    extractApiError,
    type ScrapeRequest,
    type StatusResponse,
    type ResultResponse,
    type ApiError,
} from '@/services/api'

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------
interface ScraperState {
    // Active job
    jobId: string | null
    status: StatusResponse | null
    result: ResultResponse | null
    isSubmitting: boolean
    isPolling: boolean
    error: ApiError | null
    pollingIntervalId: ReturnType<typeof setInterval> | null

    // Actions
    submitJob: (req: ScrapeRequest) => Promise<void>
    startPolling: (jobId: string) => void
    stopPolling: () => void
    fetchResult: (jobId: string) => Promise<void>
    clearJob: () => void
    clearError: () => void
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------
export const useScraperStore = create<ScraperState>((set, get) => ({
    jobId: null,
    status: null,
    result: null,
    isSubmitting: false,
    isPolling: false,
    error: null,
    pollingIntervalId: null,

    // ── Submit a new job ──────────────────────────────────────────────────────
    submitJob: async (req) => {
        get().stopPolling()
        set({ isSubmitting: true, error: null, result: null, status: null, jobId: null })
        try {
            const res = await submitScrapeJob(req)
            set({ jobId: res.job_id, isSubmitting: false })
            get().startPolling(res.job_id)
        } catch (err) {
            set({ isSubmitting: false, error: extractApiError(err) })
        }
    },

    // ── Start polling status every 3 seconds ─────────────────────────────────
    startPolling: (jobId) => {
        get().stopPolling()
        set({ isPolling: true })

        const poll = async () => {
            try {
                const status = await getJobStatus(jobId)
                set({ status })

                // If terminal — stop polling and fetch result
                if (status.status === 'completed') {
                    get().stopPolling()
                    await get().fetchResult(jobId)
                } else if (status.status === 'failed') {
                    get().stopPolling()
                }
            } catch (err) {
                set({ error: extractApiError(err) })
                get().stopPolling()
            }
        }

        poll() // immediate first call
        const id = setInterval(poll, 3_000)
        set({ pollingIntervalId: id })
    },

    // ── Stop polling ──────────────────────────────────────────────────────────
    stopPolling: () => {
        const { pollingIntervalId } = get()
        if (pollingIntervalId) {
            clearInterval(pollingIntervalId)
            set({ pollingIntervalId: null, isPolling: false })
        }
    },

    // ── Fetch validated result ────────────────────────────────────────────────
    fetchResult: async (jobId) => {
        try {
            const result = await getJobResult(jobId, 10)
            set({ result })
        } catch (err) {
            set({ error: extractApiError(err) })
        }
    },

    // ── Reset active job ──────────────────────────────────────────────────────
    clearJob: () => {
        get().stopPolling()
        set({ jobId: null, status: null, result: null, error: null })
    },

    clearError: () => set({ error: null }),
}))
