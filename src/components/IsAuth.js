import React from 'react'

export const isAuth = () => {
    const token = localStorage.getItem('vostorg-token')
    if(token){
        return true
    } 
    else{
        return false
    }
}
const Logic = () => {
    return 
}

export default Logic