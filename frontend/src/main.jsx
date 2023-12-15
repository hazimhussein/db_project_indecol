import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'
import './index.css'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { getTableData, logoutAPI, getTableOptions } from './utils/api'
import dataReduce from './reducers/data'
import logger from 'redux-logger'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { loadingBarMiddleware } from 'react-redux-loading-bar'
import { loadingBarReducer } from 'react-redux-loading-bar'

const store = configureStore({
  reducer:{data:dataReduce, loadingBar: loadingBarReducer},
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger).concat(loadingBarMiddleware()),
})
store.dispatch(getTableData("category"))
store.dispatch(getTableData("user"))
store.dispatch(getTableData("person"))
store.dispatch(getTableData("partner"))
store.dispatch(getTableData("resource"))
store.dispatch(getTableData("group"))
store.dispatch(getTableData("project"))
store.dispatch(getTableOptions("project"))
store.dispatch(logoutAPI())
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <App />
      </LocalizationProvider>
    </Provider>
  </React.StrictMode>,
)


