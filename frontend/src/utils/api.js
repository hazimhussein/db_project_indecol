import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { store } from '../main';

// Basic options for API requests
let fetchingURL = 'http://10.66.60.218:8000/api/'
// let fetchingURL = '/api/'
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = "multipart/form-data";
axios.defaults.headers.patch['Content-Type'] = "multipart/form-data";
axios.defaults.onUploadProgress = progressFunc
axios.defaults.onDownloadProgress = progressFunc

const client = axios.create({
  baseURL:fetchingURL
})



////////////////////////////////////////
// Convert any data sent to API requests to FormData Type
function jsonToForm(json){
  let form_data = new FormData();
    Object.entries(json).map(([key,value])=>{
      if (value && value.constructor && value.constructor == Array){
        value.forEach(item => {
          form_data.append(key, item);
         });
      } else {
        value != undefined && form_data.append(key,value)
      }
    })
    return form_data
}

function progressFunc (progressEvent) {
  const progress = progressEvent.progress < 0.98 ? (progressEvent.progress * 100).toFixed(0) : 98
  store.dispatch(getProgress(progress))
}

export const getProgress = createAsyncThunk(`data/getProgress`, async (progress) =>{
       
    return progress ? progress : 100
  })

export const finishLoading = createAsyncThunk(`data/loaded`, async () =>{
       
    return true
  })

export const getTableData = createAsyncThunk(`data/getData`, async (table) =>{
    const response = await client.get(`${table}/`);
    
    return {data:response.data, category:table}
  })

export const getTableOptions = createAsyncThunk(`data/getOptions`, async (table) =>{
    const response = await client.options(`${table}/`);
    
    return {data:response.data, category:table}
  })

export const loginAPI = createAsyncThunk(`data/login`, async (cred, { rejectWithValue }) =>{
    
    try{
      const response = await client.post(`login`, cred)
    
      return response.data
    }catch (err) {
      let error = err // cast the error for access
      if (!error.response) {
        throw err
      }
      // We got validation errors, let's return those so we can reference in our component and set form errors
      return rejectWithValue(error.response.data)
    }
  })
export const logoutAPI = createAsyncThunk(`data/logout`, async () =>{
    const response = await client.post(`logout`);
    
    return response
  })
  
  

export const addTableRow = createAsyncThunk(`data/addData`, async ({table, row}, { rejectWithValue }) =>{

  try{
    const response = await client.post(`${table}/`, jsonToForm(row));
    return {data:response.data, category:table}
  }catch (err) {
    let error = err // cast the error for access
    if (!error.response) {
      throw err
    }
    // We got validation errors, let's return those so we can reference in our component and set form errors
    return rejectWithValue(error.response.data)
  }
  
})

export const removeTableRow = createAsyncThunk(`data/removeData`, async ({table, rowId}) =>{ 
    const response = await client.delete(table+`/${rowId}/`);
    return {rowId:rowId, category:table}
})

export const updateTableRow = createAsyncThunk(`data/updateData`, async ({table, row, rowId}, { rejectWithValue }) =>{
  
  try{
    const response = await client.patch(table+`/${rowId}/`, jsonToForm(row));
    const new_data = await client.get(`${table}/`);
    return {data:new_data.data, category:table}
  }catch (err) {
    let error = err // cast the error for access
    if (!error.response) {
      throw err
    }
    // We got validation errors, let's return those so we can reference in our component and set form errors
    return rejectWithValue(error.response.data)
  }

})
