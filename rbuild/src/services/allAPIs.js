import {commonAPI} from './commonAPI'
import {serverURL} from './serverURL'

export const addResumeAPI = async(reqBody)=>{
    return await commonAPI('POST',`${serverURL}/resume`,reqBody)
}

// Add resume history API CALL - POST(reqBody)
export const addHistoryAPI = async(reqBody)=>{
    return await commonAPI('POST',`${serverURL}/history`,reqBody)
}
export const getHistoryAPI = async()=>{
    return await commonAPI('GET',`${serverURL}/history`)
}

export const deleteHistoryAPI = async(id)=>{
    return await commonAPI('DELETE',`${serverURL}/history/${id}`,{})
}
//get resume by id
export const getAResumeAPI = async(id)=>{
    return await commonAPI('GET',`${serverURL}/history/${id}`,{})
}
export const updateAResumeAPI = async(id,reqBody)=>{
    return await commonAPI('PUT',`${serverURL}/history/${id}`,reqBody)
}