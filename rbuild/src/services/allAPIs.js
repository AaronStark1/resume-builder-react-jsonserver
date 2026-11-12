import { commonAPI } from './commonAPI'

// RESUMES
export const addResumeAPI = async (reqBody) => {
  return await commonAPI('POST', '/resumes', reqBody)
}

export const getResumesAPI = async () => {
  return await commonAPI('GET', '/resumes', {})
}

export const getAResumeAPI = async (id) => {
  return await commonAPI('GET', `/resumes/${id}`, {})
}

export const updateAResumeAPI = async (id, reqBody) => {
  return await commonAPI('PUT', `/resumes/${id}`, reqBody)
}

// HISTORY
export const addHistoryAPI = async (reqBody) => {
  return await commonAPI('POST', '/history', reqBody)
}

export const getHistoryAPI = async () => {
  return await commonAPI('GET', '/history?_expand=resume&_sort=id&_order=desc', {})
}

export const deleteHistoryAPI = async (id) => {
  return await commonAPI('DELETE', `/history/${id}`, {})
}
