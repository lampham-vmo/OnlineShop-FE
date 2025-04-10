import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1', // update if needed
})

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Get tokens from localStorage
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')

    // Add tokens to headers if they exist
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    if (refreshToken) {
      config.headers['x-refresh-token'] = refreshToken
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,  //if response successs return response
  async (error) => {  // if server send error, call this function
    const originalRequest = error.config
    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true //set to avoid infinite request
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        
        // Call refresh token endpoint
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/refreshAT`, {
          headers: {
            'x-refresh-token': refreshToken
          }
        })
        
        const { accessToken: newAccessToken } = response.data

        // Update tokens in localStorage
        localStorage.setItem('accessToken', newAccessToken)
  
        // Update the Authorization header
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        // Retry the original request, if still failed (invalid RT => relog)
        return api(originalRequest)
      } catch (refreshError) {
       // If refresh token fails, redirect to login
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
