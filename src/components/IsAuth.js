import React from 'react'
import axios from 'axios'
axios.defaults.baseURL = "http://127.0.0.1:8000/api";

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