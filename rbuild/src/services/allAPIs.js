import { commonAPI } from './commonAPI'
import { serverURL } from './serverURL'


// ⭐ ADD RESUME
export const addResumeAPI = async (reqBody) => {
    return await commonAPI('POST', `${serverURL}/resumes`, reqBody)
}


// ⭐ GET ALL RESUMES
export const getResumesAPI = async () => {
    return await commonAPI('GET', `${serverURL}/resumes`, {})
}


// ⭐ GET ONE RESUME
export const getAResumeAPI = async (id) => {
    return await commonAPI('GET', `${serverURL}/resumes/${id}`, {})
}


// ⭐ UPDATE RESUME
export const updateAResumeAPI = async (id, reqBody) => {
    return await commonAPI('PUT', `${serverURL}/resumes/${id}`, reqBody)
}



// ⭐ HISTORY APIs

export const addHistoryAPI = async (reqBody) => {
    return await commonAPI('POST', `${serverURL}/history`, reqBody)
}

export const getHistoryAPI = async () => {
    return await commonAPI('GET', `${serverURL}/history`, {})
}

export const deleteHistoryAPI = async (id) => {
    return await commonAPI('DELETE', `${serverURL}/history/${id}`, {})
}