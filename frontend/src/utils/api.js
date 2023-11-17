import axios from 'axios'

////////////////////////////////////////////
import {idToList, tableColumnsArray} from './helpers'
// let fetchingURL = 'https://localhost:3001/'
let fetchingURL = 'http://127.0.0.1:8000/'

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

export async function getTableData (table) {
  
  let url = new URL(table, fetchingURL);
  const response = await axios.get(url);

  return response.data
}

export async function addTableRow (table, row) {
  let url = new URL(table, fetchingURL);
  await axios.post(url, row);
}

export async function removeTableRow (table, rowId) {
  let url = new URL(table+`/${rowId}`, fetchingURL);
  await axios.delete(url);
}

export async function updateTableRow (table, row, rowId) {
  let url = new URL(table+`/${rowId}`, fetchingURL);
  await axios.patch(url, row);

}

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
