import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'

let fetchingURL = 'http://10.50.41.100:8000/api/'
// let fetchingURL = '/api/'
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = "multipart/form-data";
axios.defaults.headers.patch['Content-Type'] = "multipart/form-data";

const client = axios.create({
  baseURL:fetchingURL
})



////////////////////////////////////////
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

export const getTableData = createAsyncThunk(`data/getData`, async (table) =>{
    const response = await client.get(`${table}/`);
    
    return {data:response.data, category:table}
  })

export const getTableOptions = createAsyncThunk(`data/getOptions`, async (table) =>{
    const response = await client.options(`${table}/`);
    
    return {data:response.data, category:table}
  })

export const loginAPI = createAsyncThunk(`data/login`, async (cred) =>{
    const response = await client.post(`login`, cred)
    
    return response.data
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
