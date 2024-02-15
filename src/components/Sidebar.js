import React from "react";
import { BrowserRouter, NavLink } from "react-router-dom/dist";
import PayChecks from "../pages/paychecks";
import Companies from "../pages/companies";
import ReceiptIcon from '@mui/icons-material/Receipt';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PaymentIcon from '@mui/icons-material/Payment';

const Sidebar = ({children, active}) => {
    const menuItem = [
        {
            path: "/",
            name: "Чеки",
            icon:<ReceiptIcon />
        },
        {
            path: "/companies",
            name: "Компании",
            icon:<LocationCityIcon />
        },
        {
            path: "/payment-methods",
            name: "Методы оплаты",
            icon:<PaymentIcon />
        }
    ]
    return (
        <div className=' bg-grafit min-w-48  h-max'>
            {menuItem.map((el, index) => (
                <NavLink to={el.path} key={index} className={'border-b-2 border-grafit-light hover:bg-slate-400 cursor-pointer '+ (active === index ? "bg-slate-400" : 'bg-white')  +' rounded-lg py-4 px-4 flex align-middle mb-2'}>
                    <div>{el.icon}</div>
                    <div className='ml-2'>{el.name}</div>
                </NavLink>
            ))}
            <main>{children}</main>
        </div>
    )
}

export default Sidebar;