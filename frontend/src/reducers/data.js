import { createSlice} from "@reduxjs/toolkit"
import { getTableData, addTableRow, removeTableRow, updateTableRow, loginAPI, logoutAPI, getTableOptions } from "../utils/api"

/////////////////////////

const initialState = {
  value:{},
  user:null,
  status: false,
  error:null,
  options: {}
}

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers:{
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
}
})
export const dataData = (state) => state.data.value
export const dataOptions = (state) => state.data.options
export const statusData = (state) => state.data.status
export const errorData = (state) => state.data.error
export const authedUser = (state) => state.data.user
export default dataSlice.reducer

/////////////////