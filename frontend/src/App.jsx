import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './components/App'

function App() {
    return (
        <div className='container'>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<App/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    )
}


export default App
