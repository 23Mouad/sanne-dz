import axios from 'axios'
import { API_URL } from './constants'

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000, // 15 seconds
})

// Track if we're currently refreshing to avoid multiple simultaneous refresh calls
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// ===== Request Interceptor — Attach JWT automatically =====
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ===== Response Interceptor — Silent token refresh on 401 =====
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Only attempt refresh on 401 and if we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't try to refresh if the failing request was itself a refresh or login
      if (
        originalRequest.url?.includes('/auth/refresh') ||
        originalRequest.url?.includes('/auth/login')
      ) {
        forceLogout()
        return Promise.reject(error)
      }

      if (isRefreshing) {
        // If we're already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken =
        typeof window !== 'undefined'
          ? localStorage.getItem('refresh_token')
          : null

      if (!refreshToken) {
        isRefreshing = false
        forceLogout()
        return Promise.reject(error)
      }

      try {
        const { data } = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        })

        const newAccessToken = data?.data?.accessToken || data?.accessToken
        const newRefreshToken = data?.data?.refreshToken || data?.refreshToken

        if (newAccessToken && typeof window !== 'undefined') {
          localStorage.setItem('access_token', newAccessToken)
          // Also set as cookie for middleware
          document.cookie = `access_token=${newAccessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`

          if (newRefreshToken) {
            localStorage.setItem('refresh_token', newRefreshToken)
          }
        }

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        processQueue(null, newAccessToken)
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        forceLogout()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

function forceLogout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('sanne-dz-auth') // Clear Zustand persist cache
    // Clear the cookie
    document.cookie = 'access_token=; path=/; max-age=0'
    // Only redirect if we're not already on the login page
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login'
    }
  }
}

export default api