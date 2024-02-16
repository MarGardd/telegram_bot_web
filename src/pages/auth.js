import React, { useState } from 'react'
import { createTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { LoadingButton } from '@mui/lab';
import { ThemeProvider, useTheme } from '@emotion/react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
const apiUrl = "http://127.0.0.1:8000/api"


const Auth = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loadingBtn, setLoadingBtn] = useState(false)
    const [isError, setIsError] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const handleEmail = (e) => {
        setEmail(e.target.value)
    }

    const handlePassword = (e) => {
        setPassword(e.target.value)
    }

    const login = async () => {
        try{
            setLoadingBtn(true)
            await axios.post(apiUrl+"/login", {
                email: email,
                password: password
            })
            .then ((response => {
                console.log(response)
                localStorage.setItem("vostorg-token", response.data.token)
                navigate('/')
                setLoadingBtn(false)
                window.location.reload()
            }))
        } catch (error){
            if (error.response) {
                // Request made but the server responded with an error
                if(error.response.status === 422){
                    setIsError(1) //Ошибка ввода данных
                } else if (error.response.status === 500){
                    setIsError(2) //Ошибка сервера
                } 
            } else if (error.request) {
                // Request made but no response is received from the server.
                console.log(error.request);
            } else {
                // Error occured while setting up the request
                console.log('Error', error.message);
            }
            setLoadingBtn(false)
        }
    }

    React.useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                document.getElementById('loginBtn').click();
            }
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [])

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
                    <div className={isError ? "mb-4" : "mb-8"}>
                        <OutlinedInput
                            className='bg-white w-full rounded-lg'
                            id="outlined-adornment-password"
                            value={password}
                            onChange={handlePassword}
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label=""
                        />
                    </div>
                    {isError ? (
                        <div className={"bg-red-100 mb-4 border border-red-400 text-red-700 px-4 py-3 rounded relative"} role="alert">
                            <strong className="font-bold">{isError === 1 ? "Email или пароль введены неверно" : "Сервер не отвечает"}<br /></strong>
                            <span className="block sm:inline">{isError === 1 ? "Проверте правильность введенных данных и попробуйте еще раз" : "Повторите попытку позже"}</span>
                            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                                <svg onClick={() => setIsError(false)} className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
                            </span>
                        </div>
                    ) : (
                        ""
                    )}

                </div>
                <ThemeProvider theme={theme}>
                    <LoadingButton id='loginBtn' onClick={login} variant="contained" color='apple' type='submit' loading={loadingBtn} sx={{ width: "50%", textTransform: "none", fontSize: "16px" }}>
                        Войти
                    </LoadingButton>
                </ThemeProvider>

            </div>
        </div>
    )
}

export default Auth