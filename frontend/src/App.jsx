import React from 'react';
import { Outlet, useLocation } from "react-router-dom";
import Navbar from './components/Navbar';
import './App.css'
import Footer from './components/Footer';
import { AuthProvide } from './context/AuthContext';
function App(){
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/signup", "/register"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <AuthProvide>
      <div className="app-shell">
        {!shouldHideNavbar && <Navbar />}
        <main className={`app-main ${shouldHideNavbar ? "app-main--auth" : ""}`}>
          <Outlet/>
        </main>
        <Footer/>
      </div>
    </AuthProvide>
  )
}
export default App;
//all the children will be in outlet and the nav and footer are always fixed//
//px py is padding toip bottom
