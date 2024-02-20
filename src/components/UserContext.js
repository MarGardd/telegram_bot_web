import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const currentPath = window.location.pathname;
        if (currentPath !== "/login") {
            const getUserData = async () => {
                try {
                    const token = localStorage.getItem('vostorg-token')
                    const response = await axios.get("/auth_user", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setUserData(response.data);
                } catch (error) {
                    console.log('Ошибка при получении данных пользователя:', error);
                }
            };
            getUserData();
        }

    }, []);

    return (
        <UserContext.Provider value={userData}>
            {children}
        </UserContext.Provider>
    );
};