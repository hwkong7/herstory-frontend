import axios, { AxiosError } from 'axios'

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
  timeout: 60000, // Render 콜드스타트 대비
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
      if (!location.pathname.startsWith('/login')) location.href = '/login'
    }
    return Promise.reject(error)
  },
)

/** 백엔드가 ApiResponse<T> 로 감싸므로 data 한 겹을 벗긴다 */
function unwrap<T>(raw: unknown): T {
  const r = raw as { data?: T }
  return (r && typeof r === 'object' && 'data' in r ? r.data : raw) as T
}

export async function get<T>(url: string, params?: object): Promise<T> {
  const res = await api.get(url, { params })
  return unwrap<T>(res.data)
}

export async function post<T>(url: string, body?: unknown): Promise<T> {
  const res = await api.post(url, body)
  return unwrap<T>(res.data)
}

export async function put<T>(url: string, body?: unknown): Promise<T> {
  const res = await api.put(url, body)
  return unwrap<T>(res.data)
}

export async function patch<T>(url: string, body?: unknown): Promise<T> {
  const res = await api.patch(url, body)
  return unwrap<T>(res.data)
}

export async function del<T>(url: string): Promise<T> {
  const res = await api.delete(url)
  return unwrap<T>(res.data)
}

export async function upload<T>(url: string, formData: FormData): Promise<T> {
  const res = await api.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return unwrap<T>(res.data)
}

export function errorMessage(e: unknown): string {
  const err = e as AxiosError<{ message?: string }>
  if (err?.code === 'ECONNABORTED') return '서버 응답이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.'
  return err?.response?.data?.message ?? '요청을 처리하지 못했습니다.'
}
