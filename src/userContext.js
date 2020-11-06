import React, { createContext, useContext, useState } from 'react';
import jwtDecode from 'jwt-decode'

const UserContext = createContext(null)

export const useUserContext = () => useContext(UserContext)


const token = localStorage.getItem(`token`)

let user = null

if(token){
    try {
        const decoded = jwtDecode(token)
        let expiresIn = new Date( decoded.exp * 1000 )
        if(expiresIn < new Date()){
            throw new Error('Token is expired')
        }else{
            user = decoded
        }
    } catch (error) {
        localStorage.removeItem('token')
        console.log(error)
    }
    
}

export const UserContextProvider = ({ children }) => {
    const userState = useState(user)

    return (
        <UserContext.Provider value={userState} >
            { children }
        </UserContext.Provider>
    );
}
