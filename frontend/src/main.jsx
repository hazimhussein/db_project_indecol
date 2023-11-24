import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'
import './index.css'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import reducer from './reducers'
import middleware from './middleware'
import { getTableData } from './utils/api'
import dataReduce from './reducers/data'
import logger from 'redux-logger'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const store = configureStore({
  reducer:{data:dataReduce},
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
})
store.dispatch(getTableData("category"))
store.dispatch(getTableData("user"))
store.dispatch(getTableData("person"))
store.dispatch(getTableData("partner"))
store.dispatch(getTableData("ressource"))
store.dispatch(getTableData("group"))
store.dispatch(getTableData("project"))
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <App />
      </LocalizationProvider>
    </Provider>
  </React.StrictMode>,
)


