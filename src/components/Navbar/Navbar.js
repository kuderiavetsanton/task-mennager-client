import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import './navbar.css'

import { useUserContext } from '../../userContext'

export default function Navbar() {
    const [ user,setUser ] = useUserContext()

    const handleLogout = () => {
        localStorage.removeItem('token')
        setUser(null)
        window.location.href = '/login'
    }

    return (
        <nav>
            <NavLink to='/' className="nav__brand">Task Mennager</NavLink>
            <ul>
                {user ? <>
                    <li><NavLink to='/' className="link">Home</NavLink></li>
                    <li><button className="link button__link" onClick={handleLogout}>Log Out</button></li>
                 </> : <>
                    <li><NavLink to='/login' className="link">Login</NavLink></li>
                    <li><NavLink to='/signup'className="link">Register</NavLink></li>
                 </>}
            </ul>
        </nav>
    )
}
