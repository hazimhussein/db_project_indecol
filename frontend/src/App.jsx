import { useState } from 'react'
import './App.css'
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard'

function App() {
    return (
        <div className='container'>
            <div>
              <Route path='/' exact component={Dashboard}/>
            </div>
        </div>
    )
}


export default App
