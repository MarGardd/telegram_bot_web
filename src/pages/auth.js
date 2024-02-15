import React, { useState } from 'react'
import { createTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { LoadingButton } from '@mui/lab';
import { ThemeProvider, useTheme } from '@emotion/react';

const theme = createTheme({
    palette: {
        grafit: {
            main: '#032539',
            light: '#053b5b',
            dark: '#02121c',
            contrastText: '#ffffff',
        },
        orange: {
            main: '#FA991C',
            light: '#fbbe70',
            dark: '#df8006',
            contrastText: '#ffffff',
        },
        apple: {
            main: '#3ec116',
            light: '#48dc1b',
            dark: '#3bb516',
            contrastText: '#ffffff',
        },
        silver: {
            main: '#9ca3b1',
            light: '#c7cbd3',
            dark: '##858d9e',
            contrastText: '#ffffff',
        }
    },
});

const Auth = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loadingBtn, setLoadingBtn] = useState(false)

    const handleEmail = (e) => {
        setEmail(e.target.value)
    }

    const handlePassword = (e) => {
        setPassword(e.target.value)
    }

    const login = async () => {
        setLoadingBtn(true)
    }

    return (
        <div className="h-[100vh] w-full flex flex-col justify-center items-center">
            <div className=" w-1/2 justify-center flex flex-col bg-white shadow-md shadow-white rounded-xl items-center p-10">
                <div className='text-2xl font-bold mb-10'>
                    Вход
                </div>
                <div id='InputContainer' className='flex flex-col text-lg w-full'>
                    <div className='mb-2'>Email:</div>
                    <div className='mb-8'>
                        <TextField variant="outlined" type='email' placeholder='' value={email} onChange={handleEmail} className='bg-white w-full rounded-lg' />
                    </div>
                    <div className='mb-2'>Пароль:</div>
                    <div className='mb-8'>
                        <TextField variant="outlined" type='password' placeholder='' value={password} onChange={handlePassword} className='bg-white w-full rounded-lg' />
                    </div>
                </div>
                <ThemeProvider theme={theme}>
                    <LoadingButton onClick={login} variant="contained" color='apple' type='submit' loading={loadingBtn} sx={{ width:"50%", textTransform: "none", fontSize: "16px" }}>
                        Войти
                    </LoadingButton>
                </ThemeProvider>

            </div>
        </div>
    )
}

export default Auth