import { createSlice} from "@reduxjs/toolkit"
// import { getTableData, getTableColumns, addTableRow, removeTableRow, updateTableRow } from "../utils/api"
import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { capitalizeFirstLetter } from '../utils/helpers'
import { getTableData, addTableRow, removeTableRow, updateTableRow, loginAPI, logoutAPI, getTableOptions } from "../utils/api"

/////////////////////////
// import { RECEIVE_DATA, ADD_DATA, UPDATE_DATA, REMOVE_DATA} from "../actions/data"
let fetchingURL = 'http://127.0.0.1:8000/api/'

const initialState = {
  value:{},
  user:null,
  status: false,
  error:null,
  options: {}
}

// export const getTableData = createAsyncThunk('data/getDatas', async (table) =>{
//     let url = new URL(table, fetchingURL);
//     const response = await axios.get(url);
    
//     return {data:response.data, category:table}
//   })
  

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers:{
    // get_data: (state, action) => {
    //   console.log(action.payload)
    //   state.value[action.payload] = getTableData(action.payload)
    // },
    // add_data: (state, table, row) => {
    //   addTableRow(table, row)
    //   state.value[table].push(row)
    // },
    // remove_data: (state, table, rowId) => {
    //   removeTableRow(table, rowId)
    //   state.value[table] = state.value[table].filter(row => row.id !== rowId)
    // },
    // update_data: (state, table, row, rowId) => {
    //   updateTableRow(table, row, rowId)
    //   state.value[table] = state.value[table].map(entity => entity.id === rowId ? row : entity) 
    // }

  },
  extraReducers(builder) {
    builder
        .addCase(getTableData.pending, (state, action) => {
            state.status = 'loading'
        })
        .addCase(getTableData.fulfilled, (state, action) => {
            state.status = 'succeeded'

            // Add any fetched posts to the array
            state.value[action.payload.category] = action.payload.data
        })
        .addCase(getTableOptions.fulfilled, (state, action) => {
            state.status = 'succeeded'

            // Add any fetched posts to the array
            console.log(action.payload.data)
            state.options[action.payload.category] = action.payload.data.actions.POST
        })
        .addCase(getTableData.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        })
        .addCase(addTableRow.fulfilled, (state, action) => {
          state.status = 'succeeded'

          // Add any fetched posts to the array
          state.value[action.payload.category].push(action.payload.data)
      })
        .addCase(addTableRow.rejected, (state, action) => {
          state.status = 'failed'
          if (action.payload) {
            // Being that we passed in ValidationErrors to rejectType in `createAsyncThunk`, the payload will be available here.
            state.error = action.payload.errorMessage
          } else {
            state.error = action.error.message
          }
      })
        .addCase(removeTableRow.fulfilled, (state, action) => {
          state.status = 'succeeded'

          // Add any fetched posts to the array
          state.value[action.payload.category] = state.value[action.payload.category].filter(row=> row.id!=action.payload.rowId)
      })
        .addCase(updateTableRow.fulfilled, (state, action) => {
          state.status = 'succeeded'

          // Add any fetched posts to the array
          state.value[action.payload.category] = action.payload.data
      })
        .addCase(updateTableRow.rejected, (state, action) => {
          state.status = 'failed'
          if (action.payload) {
            // Being that we passed in ValidationErrors to rejectType in `createAsyncThunk`, the payload will be available here.
            state.error = action.payload.errorMessage
          } else {
            state.error = action.error.message
          }
      })
        .addCase(loginAPI.fulfilled, (state, action) => {
          state.status = 'succeeded'

          state.user = action.payload
      })
        .addCase(logoutAPI.fulfilled, (state, action) => {
          state.status = 'succeeded'
          state.user = null
      })
        // .addCase(addNewPost.fulfilled, (state, action) => {
        //     // Fix for API post IDs:
        //     // Creating sortedPosts & assigning the id 
        //     // would be not be needed if the fake API 
        //     // returned accurate new post IDs
        //     const sortedPosts = state.posts.sort((a, b) => {
        //         if (a.id > b.id) return 1
        //         if (a.id < b.id) return -1
        //         return 0
        //     })
        //     action.payload.id = sortedPosts[sortedPosts.length - 1].id + 1;
        //     // End fix for fake API post IDs 

        //     action.payload.userId = Number(action.payload.userId)
        //     action.payload.date = new Date().toISOString();
        //     action.payload.reactions = {
        //         thumbsUp: 0,
        //         hooray: 0,
        //         heart: 0,
        //         rocket: 0,
        //         eyes: 0
        //     }
        //     console.log(action.payload)
        //     state.posts.push(action.payload)
        // })
}
})
export const dataData = (state) => state.data.value
export const statusData = (state) => state.data.status
export const errorData = (state) => state.data.error
export const authedUser = (state) => state.data.user
// export const {get_data, add_data, remove_data, update_data} = dataSlice.actions
export default dataSlice.reducer

/////////////////
// export function data(state ={}, action){
//   const {dataCategory, table, row, rowId}= action
//   switch(action.type){
//         case RECEIVE_DATA:
//           return {
//               ...state,
//               [dataCategory]:{
                // ...state[dataCategory],
          //       ...action.data
          //     }
          // }
          // case ADD_DATA:
          // return {
          //     ...state,
          //     [table]:{
          //       ...state[table],
          //       [row.id]: row,
          //     }
          // }
          // return{
          //     ...state,
          //     [question.id]: question,
          // }
          // case UPDATE_DATA:
          // return {
          //     ...state,
          //     [dataCategory]:{
          //       ...state[dataCategory],
          //       ...action.data
          //     }
          // }
          // case REMOVE_DATA:
          // return {
          //     ...state,
          //     [dataCategory]:{
          //       ...state[dataCategory],
          //       ...action.data
          //     }
          // }
//         default:
//             return state
//     }
// }

