import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from './pages/Home'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import ViewDoc from './pages/ViewDoc';

const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/doc/:id" element={<ViewDoc/>}/>
        </Routes>
      </Router>
  )
}

export default App