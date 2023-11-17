import { createSlice } from "@reduxjs/toolkit"
import { getTableData, addTableRow, removeTableRow, updateTableRow } from "../utils/api"

/////////////////////////
// import { RECEIVE_DATA, ADD_DATA, UPDATE_DATA, REMOVE_DATA} from "../actions/data"

const initialState = {
  value:[]
}

const table = "user"

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers:{
    get_users: (state) => {
      state.value = getTableData(table)
    },
    add_user: (state, row) => {
      addTableRow(table, row)
      state.value.push(row)
    },
    remove_user: (state, rowId) => {
      removeTableRow(table, rowId)
      state.value = state.value.filter(row => row.id !== rowId)
    },
    update_user: (state, row, rowId) => {
      updateTableRow(table, row, rowId)
      state.value = state.value.map(entity => entity.id === rowId ? row : entity) 
    }

  }
})

export const {get_users, add_user, remove_user, update_user} = userSlice.actions
export default userSlice.reducer
