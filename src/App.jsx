import React from 'react';
import { Outlet } from "react-router-dom";
import Navbar from './components/Navbar';
import './App.css'
import Footer from './components/Footer';
import { AuthProvide } from './context/AuthContext';
function App(){

  return (
    <>
    <AuthProvide>
<Navbar/>
    <main className='min-h-screen max-w-screen-2xl mx-auto px-4 px-6 font-primary'>
      <Outlet/> 
      </main>
    <Footer/>



    </AuthProvide>
    
        
    </>
  )
}
export default App;
//all the children will be in outlet and the nav and footer are always fixed//
//px py is padding toip bottom