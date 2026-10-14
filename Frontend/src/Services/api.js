import axios from 'axios'


const api = axios.create({
  baseURL: '/api',
})

// Attach the JWT (if present) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    return Promise.reject(error)
  }
)

// ---- Auth ----
export const login = (email, password) =>
  api.post('/auth/login', { email, password })

export const signup = (name, email, password) =>
  api.post('/auth/signup', { name, email, password })


export const getRecords = (objectName, { page = 1, limit = 10, search = '' } = {}) =>
  api.get(`/records/${objectName}`, { params: { page, limit, search } })

export const getRecord = (objectName, id) =>
  api.get(`/records/${objectName}/${id}`)

export const createRecord = (objectName, data) =>
  api.post(`/records/${objectName}`, data)

export const updateRecord = (objectName, id, data) =>
  api.put(`/records/${objectName}/${id}`, data)

export const deleteRecord = (objectName, id) =>
  api.delete(`/records/${objectName}/${id}`)

export default api
