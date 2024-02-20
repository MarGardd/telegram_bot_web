import React, { useContext } from "react";
import { BrowserRouter, NavLink, useNavigate } from "react-router-dom/dist";
import PayChecks from "../pages/paychecks";
import Companies from "../pages/companies";
import ReceiptIcon from '@mui/icons-material/Receipt';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PaymentIcon from '@mui/icons-material/Payment';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { UserContext } from './UserContext';
import { Button } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';

const Sidebar = ({ children, active }) => {
    const userData = useContext(UserContext)
    const navigate = useNavigate()
    const menuItem = [
        {
            path: "/",
            name: "Чеки",
            icon: <ReceiptIcon />,
            admin: false
        },
        {
            path: "/companies",
            name: "Компании",
            icon: <LocationCityIcon />,
            admin: false
        },
        {
            path: "/payment-methods",
            name: "Методы оплаты",
            icon: <PaymentIcon />,
            admin: false
        },
        {
            path: "/users",
            name: "Пользователи",
            icon: <GroupAddIcon />,
            admin: true
        }
    ]

    const logout = () => {
        localStorage.removeItem('vostorg-token')
        window.location.replace('/login')
    }
    return (
        <div className=' bg-grafit min-w-48  h-max'>
            {menuItem.map((el, index) => (
                !el.admin ? (<NavLink to={el.path} key={index} className={'border-b-2 border-grafit-light hover:bg-slate-400 cursor-pointer ' + (active === index ? "bg-slate-400" : 'bg-white') + ' rounded-lg py-4 px-4 flex align-middle mb-2'}>
                    <div>{el.icon}</div>
                    <div className='ml-2'>{el.name}</div>
                </NavLink>) : (el.admin === userData.is_admin ?
                    (<NavLink to={el.path} key={index} className={'border-b-2 border-grafit-light hover:bg-slate-400 cursor-pointer ' + (active === index ? "bg-slate-400" : 'bg-white') + ' rounded-lg py-4 px-4 flex align-middle mb-2'}>
                        <div>{el.icon}</div>
                        <div className='ml-2'>{el.name}</div>
                    </NavLink>) : "")
            ))}
            <NavLink onClick={() => logout()} className={'border-b-2 border-grafit-light hover:bg-slate-400 cursor-pointer bg-white rounded-lg py-4 px-4 flex align-middle mb-2'}>
                <div className="rotate-180"><LogoutIcon /></div>
                <div className='ml-2'>Выход</div>
            </NavLink>
            <main>{children}</main>
        </div>
    )
}

export default Sidebar;