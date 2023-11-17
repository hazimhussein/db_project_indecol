import { createSlice } from "@reduxjs/toolkit"
import { getTableData, getTableColumns, addTableRow, removeTableRow, updateTableRow } from "../utils/api"

/////////////////////////
// import { RECEIVE_DATA, ADD_DATA, UPDATE_DATA, REMOVE_DATA} from "../actions/data"

const initialState = {
  value:{}
}

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers:{
    get_data: (state, table) => {
      state.value[table] = getTableData(table)
    },
    add_data: (state, table, row) => {
      addTableRow(table, row)
      state.value[table].push(row)
    },
    remove_data: (state, table, rowId) => {
      removeTableRow(table, rowId)
      state.value[table] = state.value[table].filter(row => row.id !== rowId)
    },
    update_data: (state, table, row, rowId) => {
      updateTableRow(table, row, rowId)
      state.value[table] = state.value[table].map(entity => entity.id === rowId ? row : entity) 
    }

  }
})

export const {get_data, add_data, remove_data, update_data} = dataSlice.actions
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

