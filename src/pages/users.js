import { Box, CircularProgress, Modal, TextField, Tooltip } from "@mui/material";
import Sidebar from "../components/Sidebar";
import React, { useEffect } from "react";
import { ThemeProvider } from "@emotion/react";
import { LoadingButton } from "@mui/lab";
import { createTheme } from "@mui/material/styles";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Button from '@mui/material/Button';
import axios from "axios";
import Snackbar from '@mui/material/Snackbar';
import { Alert } from "@mui/material";

const theme = createTheme({
    palette: {
        grafit: {
            main: "#032539",
            light: "#053b5b",
            dark: "#02121c",
            contrastText: "#ffffff",
        },
        orange: {
            main: "#FA991C",
            light: "#fbbe70",
            dark: "#df8006",
            contrastText: "#ffffff",
        },
        apple: {
            main: "#3ec116",
            light: "#48dc1b",
            dark: "#3bb516",
            contrastText: "#ffffff",
        },
        silver: {
            main: "#b0b7c6",
            light: "#c7cbd3",
            dark: "#858d9e",
            contrastText: "#ffffff",
        },
    },
});


const boxStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.papper",
    boxShadow: 24,
    p: 4,
};


export default function Users() {
    const apiUrl = "http://127.0.0.1:8000/api"
    const [users, setUsers] = React.useState([])
    const [loadUsers, setLoadUsers] = React.useState(false)
    const [openModal, setOpenModal] = React.useState(false)
    const [newEmail, setNewEmail] = React.useState("")
    const [newPassword, setNewPassword] = React.useState("")
    const [newUsername, setNewUsername] = React.useState("")
    const [loadingSaveMethod, setLoadingSaveMethod] = React.useState(false)
    const [errorNotify, setErrorNotify] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const closeError = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setErrorNotify(false)
        setTimeout(() => {
            setErrorMessage("")
        }, 500);
    }

    const getUsers = async () => {
        setLoadUsers(true)
        await axios.get(apiUrl + "/users").then((response) => {
            const allUsers = response.data
            setUsers(allUsers)
        })
        setLoadUsers(false)
    }
    
    React.useEffect(() => {
        getUsers()
    }, [loadingSaveMethod])

    const deleteUser = async (id) => {
        try {
            await axios.delete(apiUrl + "/admin/" + id).then((response) => {
                const newUsers = users.filter(item => {
                    if (item.id !== id) {
                        return (item)
                    }
                })
                setUsers(newUsers)
            })
        } catch (err) {
            setErrorMessage("Ошибка: " + err.message)
            setErrorNotify(true)
            console.log(err)
        }
    }

    const handleNameChange = (e) => {
        let value = e.target.value
        setNewUsername(value)
    }

    const handleEmailChange = (e) => {
        let value = e.target.value
        setNewEmail(value)
    }

    const handlePasswordChange = (e) => {
        let value = e.target.value
        setNewPassword(value)
    }

    const addUser = async () => {
        try {
            setLoadingSaveMethod(true)
            await axios.post(apiUrl + "/users", {
                name: newUsername,
                email: newEmail,
                password: newPassword
            }, {
                headers: {Authorization: `Bearer 4|ShPmoVDqqSpN7v0ENk9h3xLkqFZP6fT5GWEO3AOkca5dcf62`}
            }).then(() => {
                setOpenModal(false)
                setLoadingSaveMethod(false)
                setNewEmail("")
                setNewPassword("")
                setNewUsername("")
            })
        } catch (e) {
            setLoadingSaveMethod(false)
            setErrorMessage("Ошибка: " + e.message)
            setErrorNotify(true)
            console.log(e)
        }
    }

    const setAdmin = async (id) => {
        try {
            await axios.post(apiUrl + '/admin/' + id).then(() => {
                let newUsers = users.map(item => {
                    if (item.id === id) {
                        item.is_admin = !item.is_admin
                    }
                    return item
                })
                setUsers(newUsers)
            })
        } catch (err) {
            setErrorMessage("Ошибка: " + err.message)
            setErrorNotify(true)
            console.log(err)
        }
    }



    return (
        <div>
            <div className="h-full w-full flex flex-col justify-center items-center p-10">
                <div className="flex  justify-center w-5/6">
                    <div className="mt-6 mr-4">
                        <Sidebar active={3} />
                    </div>
                    <div className=" w-3/5 flex flex-col items-center">
                        {!users || users.length === 0 ? (
                            <div className="w-full text-xl min-w-96 mt-6 flex justify-center bg-white shadow-md shadow-white rounded-xl items-center p-5">
                                {loadUsers ? <CircularProgress /> : "Пользователей нет"}
                            </div>
                        ) : (
                            <div
                                className="w-full mt-6 flex bg-white shadow-md shadow-white rounded-xl items-center p-5"
                            >
                                <div className="ml-4 text-grafit text-lg w-full text-left flex flex-col justify-center h-full">
                                    <div className="font-bold text-xl mb-3">Пользователи</div>
                                    {users.map((element, i) => {
                                        return (
                                            <div key={i} className="flex">
                                                <div className="mb-2">
                                                    {element.name+" ("+element.email+")"}
                                                </div>
                                                <div className="ml-2 ">
                                                    <Tooltip title="Установить/убрать права админа">
                                                        <IconButton onClick={() => setAdmin(element.id)} size="small">
                                                            <AdminPanelSettingsIcon color={element.is_admin ? "success" : "inherit"} fontSize="inherit" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </div>
                                                <div className="ml-1 ">
                                                    <Tooltip title="Удалить пользователя">
                                                        <IconButton size="small" onClick={() => deleteUser(element.id)} aria-label="delete">
                                                            <CloseIcon fontSize="inherit" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </div>

                                            </div>

                                        );
                                    })}

                                </div>
                            </div>
                        )}
                        <div className="flex justify-between mt-4">
                            <ThemeProvider theme={theme}>
                                <div className="flex">
                                    <Box>
                                        <LoadingButton
                                            variant="contained"
                                            onClick={() => { setOpenModal(true); }}
                                            color="apple"
                                        >
                                            Добавить пользователя
                                        </LoadingButton>
                                    </Box>
                                    <Modal
                                        open={openModal}
                                        onClose={() => {
                                            setOpenModal(false)
                                            setNewEmail("")
                                            setNewPassword("")
                                            setNewUsername("")
                                        }}
                                        className="rounded-xl"
                                    >
                                        <Box
                                            sx={boxStyle}
                                            className="bg-white rounded-xl"
                                        >
                                            <div>
                                                <div className="text-2xl font-bold mb-5">
                                                    Добавление метода оплаты
                                                </div>
                                                <div className="text-lg mb-2">
                                                    Имя пользователя:
                                                </div>
                                                <TextField
                                                    value={newUsername}
                                                    onChange={handleNameChange}
                                                    className=" w-full"
                                                    sx={{marginBottom: 2}}
                                                    size="small"
                                                    variant="outlined"
                                                ></TextField>
                                                <div className="text-lg mb-2">
                                                    Email:
                                                </div>
                                                <TextField
                                                    value={newEmail}
                                                    onChange={handleEmailChange}
                                                    className="w-full"
                                                    sx={{marginBottom: 2}}
                                                    size="small"
                                                    variant="outlined"
                                                ></TextField>
                                                <div className="text-lg mb-2">
                                                    Пароль:
                                                </div>
                                                <TextField
                                                    value={newPassword}
                                                    onChange={handlePasswordChange}
                                                    className="w-full"
                                                    sx={{marginBottom: 2}}
                                                    size="small"
                                                    variant="outlined"
                                                ></TextField>
                                            </div>
                                            <div className="mt-3">
                                                <LoadingButton
                                                    variant="outlined"
                                                    onClick={() => addUser()}
                                                    color="apple"
                                                    loading={loadingSaveMethod}
                                                >
                                                    Сохранить
                                                </LoadingButton>
                                            </div>
                                        </Box>
                                    </Modal>
                                </div>
                            </ThemeProvider>
                        </div>
                    </div>
                    <div className="w-1/3 h-max ml-4 mt-6"></div>
                </div>
            </div>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={errorNotify}
                autoHideDuration={5000}
                onClose={closeError}
            >
                <Alert variant='filled' onClose={closeError} severity='error'>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}
