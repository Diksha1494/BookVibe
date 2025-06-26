
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiMiniBars3CenterLeft, HiOutlineHeart, HiOutlineShoppingCart} from "react-icons/hi2";
 import { IoSearchOutline } from "react-icons/io5";
  import { HiOutlineUser } from "react-icons/hi";
  import avatarImg from "../assets/avatar.png"
import './Navbar.css';
import { useSelector } from 'react-redux';
import { useAuth } from "../context/AuthContext";
  const navigation =[
    { name:"Dashboard", href:"/dashboard"},
    { name:"Orders", href:"/orders"},
    { name:"CartPage", href:"/cart"},
    { name:"Check Out", href:"/checkout"},
  ]

const Navbar = () => {
    const [isDropdownOpen,setIsDropdownOpen]=useState(false)
   const cartItems = useSelector(state => state.cart.cartItems);

const{currentUser,logout}=useAuth()
const handleLogOut =()=>{
    logout()
}

    return (
        <header className="max-w-screen-2xl mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
         {/*left side */}
         <div className="flex items-center md:gap-16 gap-4">
            <Link to='/'>
                <HiMiniBars3CenterLeft className="size-6"/>
            </Link>
            {/*search input*/}
            <div className="search-container">
           
                <IoSearchOutline className="search-icon"/>
                <input className="search-input" type="text"placeholder="Search here"></input>
            
               
            </div>

         </div>
         {/* right side */}
         <div className="relative flex items-center md:space-x-3 space-x-2">
          <div>
                {
                    currentUser ?  <>
                       <button onClick={()=>setIsDropdownOpen(!isDropdownOpen)}
                       style={{ outline: 'none', boxShadow: 'none', border: 'none',backgroundColor: "transparent"}}>
                          <img src={avatarImg} alt="" className={`size-7 rounded-full ${currentUser ? 'ring-2 ring-blue-500' : ''}`} />
                            
                        </button>
                        {/*show dropdown */}
                        {
                            isDropdownOpen && (
                                <div 
                                style={{
            position: "absolute",
            right: 0,
            marginTop: "8px",
            width: "12rem",
            backgroundColor: "white",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            zIndex: 40,
            
          }}>
         <ul style={{ listStyle: "none", padding: "8px 0", margin: 0,color: "black", 
         textDecoration: "none", }}>

              {
               navigation.map((item)=> (
                <li key={item.name} onClick={()=>
                 setIsDropdownOpen(false)}>
                <Link to={item.href} className="block px-4 py-2 text-sm hover:bg-gray-100"
                style={{color: "black", 
    textDecoration: "none", }}>
                                                    {item.name}

                                                    </Link>
                                                </li>
                                            ))
                                        }

                                        <li>
                                            <button
                                            onClick={handleLogOut}
                                             style={{ display: "block",
                                                         padding: "0.5rem 1rem",   
                                                         fontSize: "0.875rem" ,
                                                           width: "100%",      
                                                            textAlign: "left "  
                                                          
                                                            }}>Logout</button>
 
                                        </li>

                                    </ul>
                                </div>
                            )
                        }
                    </> : <Link to="/login"><HiOutlineUser className="size-6"/></Link> 
                }
            </div>
           
            <button  style={{ outline: 'none', boxShadow: 'none', border: 'none',   backgroundColor: "transparent"  }}>


            <HiOutlineHeart className="size-6"/>
            </button>
            <Link to="/cart" 
            style={{ backgroundColor: "#FFD700",textDecoration:"none" }} // Gold-yellow
  className="p-1 sm:px-6 py-2 flex items-center rounded-sm">
                <HiOutlineShoppingCart className="text-xl" style={{textDecoration:"none"}} />
                {
                    cartItems.length > 0 ?
                
                <span className="cart-number" style={{textDecoration:"none"}}>{cartItems.length}</span>:   <span className="cart-number" style={{textDecoration:"none"}}>0</span>
                }
            </Link>
         </div>
        </nav>
        </header>
    )
}
export default Navbar;