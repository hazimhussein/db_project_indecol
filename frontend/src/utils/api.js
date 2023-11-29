import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'

let fetchingURL = 'http://127.0.0.1:8000/api/'
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL:fetchingURL
})


////////////////////////////////////////

const categories = ["user", "person", "group", "partner", "ressource", "project"]

export const getTableData = createAsyncThunk(`data/getData`, async (table) =>{
    // let url = new URL(table, fetchingURL);
    const response = await client.get(`${table}/`);
    
    return {data:response.data, category:table}
  })

export const loginAPI = createAsyncThunk(`data/login`, async (cred) =>{
    // let url = new URL(table, fetchingURL);
    const response = await client.post(`login`, cred)
    
    return response.data
  })
export const logoutAPI = createAsyncThunk(`data/logout`, async () =>{
    // let url = new URL(table, fetchingURL);
    const response = await client.post(`logout`);
    
    return response
  })
  
  

export const addTableRow = createAsyncThunk(`data/addData`, async ({table, row}) =>{
  // let url = new URL(table, fetchingURL);

  try{
    const response = await client.post(`${table}/`, row);
    return {data:response.data, category:table}
  }catch(err){
    console.log(err.response.data);
 }
  
  
})

export const removeTableRow = createAsyncThunk(`data/removeData`, async ({table, rowId}) =>{ 
  // let url = new URL(table+`/${rowId}/`, fetchingURL);
  try{
    const response = await client.delete(table+`/${rowId}/`);
    return {rowId:rowId, category:table}
  }catch(err){
    console.log(err.response.data);
  }
})

export const updateTableRow = createAsyncThunk(`data/updateData`, async ({table, row, rowId}) =>{
  // let url = new URL(table+`/${rowId}/`, fetchingURL);
  
  try{
    const response = await client.patch(table+`/${rowId}/`, row);
    return {data:response.data, rowId:rowId, category:table, row:row}
  }catch(err){
    console.log(err.response.data);
  }

})
