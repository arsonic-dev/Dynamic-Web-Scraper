/**
 * api.ts — Clean API Service Layer
 * Fully aligned with current FastAPI backend (port 8000)
 */

import axios, { AxiosError } from "axios"

// ---------------------------------------------------
// Axios instance (hardcoded for dev stability)
// ---------------------------------------------------
const api = axios.create({
    baseURL: "http://localhost:8000",
    timeout: 30000,
    headers: { "Content-Type": "application/json" },
})

// ---------------------------------------------------
// Types
// ---------------------------------------------------

export type DataType = "products" | "jobs" | "articles" | "custom"
export type JobStatus = "pending" | "running" | "completed" | "failed"

export interface ScrapeRequest {
    url: string
    pages: number
    data_type: DataType
    headless: boolean
}

export interface ScrapeSubmitResponse {
    success: boolean
    job_id: string
    status: JobStatus
    estimated_duration_seconds: number | null
    created_at: string
    status_url: string
}

export interface StatusResponse {
    success: boolean
    job_id: string
    status: JobStatus
    progress_percentage: number
    pages_scraped: number
    pages_total: number
    records_extracted: number
    started_at: string | null
    completed_at: string | null
    error_message: string | null
    result_url: string | null
}

export interface QualityBreakdown {
    completeness: number
    uniqueness: number
    validity: number
    consistency: number
}

export interface ResultResponse {
    success: boolean
    job_id: string
    data_type: DataType
    total_records: number
    clean_records: number
    duplicates_removed: number
    missing_fields_fixed: number
    data_quality_score: number
    quality_breakdown: QualityBreakdown
    preview_data: Record<string, unknown>[]
    download_url: string
    download_expires_at: string
    created_at: string
    completed_at: string
}

export interface JobSummary {
    job_id: string
    url: string
    data_type: DataType
    status: JobStatus
    pages_scraped: number
    pages_total: number
    records_extracted: number
    data_quality_score: number | null
    created_at: string
    completed_at: string | null
}

export interface HistoryResponse {
    success: boolean
    jobs: JobSummary[]
    total_count: number
    next_cursor: string | null
    prev_cursor: string | null
}

export interface ApiError {
    success: false
    error_code: string
    message: string
}

// ---------------------------------------------------
// Error Extractor
// ---------------------------------------------------

export function extractApiError(err: unknown): ApiError {
    if (err instanceof AxiosError && err.response?.data) {
        return err.response.data as ApiError
    }

    return {
        success: false,
        error_code: "NETWORK_ERROR",
        message:
            err instanceof Error
                ? err.message
                : "An unexpected error occurred.",
    }
}

// ---------------------------------------------------
// API Calls
// ---------------------------------------------------

export async function submitScrapeJob(
    req: ScrapeRequest
): Promise<ScrapeSubmitResponse> {
    const { data } = await api.post<ScrapeSubmitResponse>("/scrape", req)
    return data
}

export async function getJobStatus(
    job_id: string
): Promise<StatusResponse> {
    const { data } = await api.get<StatusResponse>(`/status/${job_id}`)
    return data
}

export async function getJobResult(
    job_id: string,
    preview_limit = 10
): Promise<ResultResponse> {
    const { data } = await api.get<ResultResponse>(`/result/${job_id}`, {
        params: { preview_limit },
    })
    return data
}

export async function getHistory(): Promise<HistoryResponse> {
    const { data } = await api.get<HistoryResponse>("/history")
    return data
}

export function getDownloadUrl(job_id: string): string {
    return `http://localhost:8000/download/${job_id}`
}

export default api