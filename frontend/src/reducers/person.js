import { createSlice } from "@reduxjs/toolkit"
import { getTableData, addTableRow, removeTableRow, updateTableRow } from "../utils/api"

/////////////////////////
// import { RECEIVE_DATA, ADD_DATA, UPDATE_DATA, REMOVE_DATA} from "../actions/data"

const initialState = {
  value:[]
}

const table = "person"

const personSlice = createSlice({
  name: "person",
  initialState,
  reducers:{
    get_persons: (state) => {
      state.value = getTableData(table)
    },
    add_person: (state, row) => {
      addTableRow(table, row)
      state.value.push(row)
    },
    remove_person: (state, rowId) => {
      removeTableRow(table, rowId)
      state.value = state.value.filter(row => row.id !== rowId)
    },
    update_person: (state, row, rowId) => {
      updateTableRow(table, row, rowId)
      state.value = state.value.map(entity => entity.id === rowId ? row : entity) 
    }

  }
})

export const {get_persons, add_person, remove_person, update_person} = personSlice.actions
export default personSlice.reducer
