import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'

let fetchingURL = 'http://10.50.41.100:8000/api/'
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL:fetchingURL
})


////////////////////////////////////////

const categories = ["user", "person", "group", "partner", "ressource", "project"]

export const getTableData = createAsyncThunk(`data/getData`, async (table) =>{
    const response = await client.get(`${table}/`);
    
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
    const response = await client.post(`${table}/`, row);
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
    const response = await client.patch(table+`/${rowId}/`, row);
    return {data:response.data, rowId:rowId, category:table, row:row}
  }catch (err) {
    let error = err // cast the error for access
    if (!error.response) {
      throw err
    }
    // We got validation errors, let's return those so we can reference in our component and set form errors
    return rejectWithValue(error.response.data)
  }

})
