import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'
import './index.css'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { finishLoading, getTableData, logoutAPI, getTableOptions } from './utils/api'
import dataReduce from './reducers/data'
import logger from 'redux-logger'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { loadingBarMiddleware } from 'react-redux-loading-bar'
import { loadingBarReducer } from 'react-redux-loading-bar'

// replace console.* for disable log on production
// if (import.meta.env.MODE === 'production') {
//   console.log = () => {}
//   console.error = () => {}
//   console.debug = () => {}
//   console.group = () => {}
// }

export const store = configureStore({
  reducer:{data:dataReduce, loadingBar: loadingBarReducer},
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      // Ignore these field paths in all actions
      ignoredActionPaths: ['payload.config', 'payload.request', 'payload.headers', 'meta.arg', 'meta.baseQueryMeta'],
    },
  }).concat(logger).concat(loadingBarMiddleware()),
})
store.dispatch(getTableData("category")).then((res)=>{
  store.dispatch(getTableOptions("category"))
  res.payload.data.map((cat)=> {
    store.dispatch(getTableData(cat.name.toLowerCase()))
    store.dispatch(getTableOptions(cat.name.toLowerCase())).then(()=>
    cat.name == res.payload.data[res.payload.data.length - 1].name && store.dispatch(finishLoading())
    )
  })
})
// store.dispatch(logoutAPI())
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <App />
      </LocalizationProvider>
    </Provider>
  </React.StrictMode>,
)


