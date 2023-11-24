import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { capitalizeFirstLetter } from './helpers'

////////////////////////////////////////////
import {idToList, tableColumnsArray} from './helpers'
// let fetchingURL = 'https://localhost:3001/'
let fetchingURL = 'http://127.0.0.1:8000/api/'
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL:fetchingURL
})

// const categories= (cat1, cat2)=>{
//   let output={}
  
//   let url = new URL('getTable', fetchingURL)
//   url.search = new URLSearchParams({
//       table: cat1
//   })

//   return fetch(url)
//   .then((res) => res.json())
//   .then((services)=>output["services"]=services)
//   .then(()=>{
//     let url = new URL('getTable', fetchingURL)
//     url.search = new URLSearchParams({
//         table: cat2
//     })

//     return fetch(url)
//     .then((res) => res.json())
//     .then((staff)=> output["staff"]=staff)
//     .then(()=>{
//       console.log(output)
//       return output
//     })
//   })
// }

const adminUsers= (user1)=>{
  let url = new URL('getTable', fetchingURL)
  url.search = new URLSearchParams({
      table: user1
  })

  return fetch(url)
  .then((res) => res.json())
  .then((users)=>idToList(users))
}

export function getInitialData () {
  return Promise.all([
    categories("Services", "StaffCategories"),
    adminUsers("adminUsers"),
  ]).then(([categories, users]) => ({
    categories,
    users,
  }))
}

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

export async function getTableColumns (table) {
  let url = new URL(table, fetchingURL);
  const response = await axios.get(url);

  return Object.keys(response.data)
}


//////////////////////////////////////////////
// export function saveQuestionAnswer (info) {
//   return _saveQuestionAnswer(info)
// }

// export function saveQuestion (info) {
//   return _saveQuestion(info)
// }
