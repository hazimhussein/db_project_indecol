import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import { connect } from 'react-redux'
// import { handleInitialData } from '../actions/shared'
// import Dashboard from './Dashboard'
// import  LoadingBar  from 'react-redux-loading'
// import NewData from './NewData'
// import Leaderboard from './Leaderboard'
// import SignIn from './SignIn'
// import Nav from './Nav'
import Dashboard from './Dashboard'
import { Navigate } from 'react-router-dom';
import "../assets/styles/index.css"

function App() {  
    return (
      <div className='container'>
            <BrowserRouter>
                <Routes>
                    <Route path='/dashboard/:category?' element={<Dashboard/>}/>
                    <Route path='/' element={<Navigate to='/dashboard'/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

// function mapStateToProps({authedUser}){
//   return{
//     loading: authedUser===null,
//     authedUser
//   }
// }

export default App
