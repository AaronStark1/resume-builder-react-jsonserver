import axios from 'axios'
import { serverURL } from './serverURL'

export const api = axios.create({
  baseURL: serverURL,
  timeout: 60000, // Render cold start can take ~50s
})

export const commonAPI = (method, url, data) => api({ method, url, data })
