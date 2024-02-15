import { Box, CircularProgress, Modal, TextField, Tooltip } from "@mui/material";
import Sidebar from "../components/Sidebar";
import React, { useEffect } from "react";
import { ThemeProvider } from "@emotion/react";
import { LoadingButton } from "@mui/lab";
import { createTheme } from "@mui/material/styles";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import Button from '@mui/material/Button';
import axios from "axios";

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

export default function PayMethods() {
    const apiUrl = "http://127.0.0.1:8000/api"
    // axios.defaults.headers.common['ngrok-skip-browser-warning'] = "any"

    const [payMethods, setPayMethods] = React.useState([])
    const [loadPayMethods, setLoadPayMethods] = React.useState(false)
    const [openModal, setOpenModal] = React.useState(false)
    const [newMethodName, setNewMethodName] = React.useState("")
    const [loadingSaveMethod, setLoadingSaveMethod] = React.useState(false)


    const getPayMethods = async () => {
        setLoadPayMethods(true)
        await axios.get(apiUrl + "/payment_methods").then((response) => {
            const allPayMethods = response.data
            setPayMethods(allPayMethods)
        }).then(setLoadPayMethods(false))
    }
    React.useEffect(() => {
        getPayMethods()
    }, [loadingSaveMethod])

    const deletePayMethod = async (id) => {
        try {
            await axios.delete(apiUrl + "/payment_methods/" + id).then((response) => {
                const newPayMethods = payMethods.filter(item => {
                    if (item.id !== id) {
                        return (item)
                    }
                })
                setPayMethods(newPayMethods)
            })
        } catch (err) {
            console.log(err)
        }
    }

    const handleInputChange = (e) => {
        let value = e.target.value
        setNewMethodName(value)
    }

    const addMethod = async () => {
        try {
            setLoadingSaveMethod(true)
            await axios.post(apiUrl + "/payment_methods", {
                title: newMethodName
            }).then(() => {
                setOpenModal(false)
                setLoadingSaveMethod(false)
                setNewMethodName("")
            })
        } catch (e) {
            setLoadingSaveMethod(false)
            console.log(e)
        }
    }

    const setCompanyQuestion = async (id) => {
        try{
            await axios.post(apiUrl+'/payment_methods/question/'+id).then(() => {
                let newPayMethods = payMethods.map(item => {
                    if(item.id === id){
                        item.has_companies = !item.has_companies
                    }
                    return item
                })
                setPayMethods(newPayMethods)
            })
        } catch (err){
            console.log(err)
        }
    }



    return (
        <div>
            <div className="h-full w-full flex flex-col justify-center items-center p-10">
                <div className="flex  justify-center w-5/6">
                    <div className="mt-6 mr-4">
                        <Sidebar active={2} />
                    </div>
                    <div className=" w-3/5 flex flex-col items-center">
                        {!payMethods || payMethods.length === 0 ? (
                            <div className="w-full text-xl min-w-96 mt-6 flex justify-center bg-white shadow-md shadow-white rounded-xl items-center p-5">
                                {loadPayMethods ? <CircularProgress /> : "Методов оплаты нет"}
                            </div>
                        ) : (
                            <div
                                className="w-full mt-6 flex bg-white shadow-md shadow-white rounded-xl items-center p-5"
                            >
                                <div className="ml-4 text-grafit text-lg w-full text-left flex flex-col justify-center h-full">
                                    <div className="font-bold text-xl mb-3">Методы оплаты</div>
                                    {payMethods.map((element, i) => {
                                        return (
                                            <div key={i} className="flex">
                                                <div className="mb-1">
                                                    {element.title}
                                                </div>
                                                <div className="ml-2 ">
                                                    <Tooltip title="Спрашивать компанию">
                                                        <IconButton onClick={() => setCompanyQuestion(element.id)} size="small">
                                                            <LocationCityIcon color={element.has_companies ? "success" : "inherit"} fontSize="inherit" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </div>
                                                <div className="ml-1 ">
                                                    <Tooltip title="Удалить">
                                                        <IconButton size="small" onClick={() => deletePayMethod(element.id)} aria-label="delete">
                                                            <CloseIcon fontSize="inherit" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </div>

                                            </div>

                                        );
                                    })}
                                    <div className="flex justify-between mt-4">
                                        <ThemeProvider theme={theme}>
                                            <div className="flex">
                                                <Box>
                                                    <LoadingButton
                                                        variant="outlined"
                                                        onClick={() => { setOpenModal(true); }}
                                                        color="grafit"
                                                    >
                                                        Добавить метод оплаты
                                                    </LoadingButton>
                                                </Box>
                                                <Modal
                                                    open={openModal}
                                                    onClose={() => {
                                                        setOpenModal(false)
                                                        setNewMethodName("")
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
                                                                Введите метод оплаты:
                                                            </div>
                                                            <TextField
                                                                value={newMethodName}
                                                                onChange={handleInputChange}
                                                                className=" w-full"
                                                                size="small"
                                                                variant="outlined"
                                                            ></TextField>
                                                        </div>
                                                        <div className="mt-3">
                                                            <LoadingButton
                                                                variant="outlined"
                                                                onClick={() => addMethod()}
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
                            </div>
                        )}

                    </div>
                    <div className="w-1/3 h-max ml-4 mt-6"></div>
                </div>
            </div>
        </div>
    );
}
