import { Box, Modal, TextField } from "@mui/material";
import Sidebar from "../components/Sidebar";
import React, { useEffect } from "react";
import { ThemeProvider } from "@emotion/react";
import { LoadingButton } from "@mui/lab";
import { createTheme } from "@mui/material/styles";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
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

export default function Companies() {
    const [openAddProject, setOpenAddProject] = React.useState(false);
    const [openAddCompany, setOpenAddCompany] = React.useState(false);
    const [companies, setCompanies] = React.useState();
    const [projectName, setProjectName] = React.useState("");
    const [companyName, setCompanyName] = React.useState("");
    const [modalIndex, setModalIndex] = React.useState(0);
    const [loadingSave, setLoadingSave] = React.useState(false)
    const apiUrl = "http://127.0.0.1:8000"

    const loadCompanies = async () => {
        await axios.get(apiUrl+"/api/companies").then((response) => {
            const allCompanies = response.data
            setCompanies(allCompanies)
        })
    }
    React.useEffect(() => {
        loadCompanies()
    }, [setCompanies])

    const openProjectModal = (url) => {
        setOpenAddProject(true);
    };
    const closeProjectModal = () => {
        setProjectName("");
        setOpenAddProject(false);
    };
    const closeCompanyModal = () => {
        setCompanyName("");
        setOpenAddCompany(false);
    };

    const changeProject = async (companyid, projectId) => {
        if (!projectId) {
            try{
                setLoadingSave(true)
                const response = await axios.post( apiUrl+"/api/companies/"+companyid+"/projects", {
                    title: projectName
                })
                setProjectName("")
                loadCompanies()
                setLoadingSave(false)
                setOpenAddProject(false);
            } catch($err) {
                setLoadingSave(false)
                console.log($err)
            }
        } else {
            const newCompaniesList = companies.map((el, i) => {
                if (el.id === companyid) {
                    const newProjects = el.projects.filter(element => {
                        if (element.id !== projectId) {
                            return (element)
                        }

                    })
                    el.projects = newProjects
                }
                return el
            })
            setCompanies(newCompaniesList)
            try {
                const response = await axios.delete( apiUrl+"/api/companies/"+companyid+"/projects/"+projectId)
                loadCompanies()
            } catch($err){
                console.log($err)
            }
            
        }
    };

    const changeCompany = async (companyId) => {
        if (companyId) {
            const newCompaniesList = companies.filter(el => el.id !== companyId)
            setCompanies(newCompaniesList)
            try{
                const response = await axios.delete(apiUrl+"/api/companies/"+companyId)
            } catch ($err){
                console.log($err)
            }
            
        } else {

            try{
                setLoadingSave(true)
                const response = await axios.post(apiUrl+"/api/companies", {
                    title: companyName
                })
                
                setLoadingSave(false)
                loadCompanies()
                setCompanyName("")
                setOpenAddCompany(false)
            } catch ($err){
                console.log($err)
                setLoadingSave(false)
            }

            setTimeout(() => {
                setLoadingSave(false)
                setCompanyName("")
                setOpenAddCompany(false)
            }, 1000);
        }
    }

    const handleInputChange = (e) => {
        setProjectName(e.target.value);
    };
    const handleInputCompanyChange = (e) => {
        setCompanyName(e.target.value);
    };

    return (
        <div>
            <div className="h-full w-full flex flex-col justify-center items-center p-10">
                <div className="flex relative w-[1255px] mr-5">
                    <div className="mt-6 mr-3 absolute  -left-56">
                        <Sidebar active={1} />
                    </div>
                    <div className=" w-[850px] flex justify-center flex-col items-center">
                        {!companies || companies.length === 0 ? (
                            <div className="w-full text-xl min-w-96 mt-6 flex justify-center bg-white shadow-md shadow-white rounded-xl items-center p-5">
                                Компаний нет
                            </div>
                        ) : (
                            companies.map((el, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="w-full mt-6 flex relative bg-white shadow-md shadow-white rounded-xl items-center p-5"
                                    >
                                        <div className=" absolute right-6 top-3 left-100">
                                            <IconButton size="large" onClick={() => changeCompany(el.id)} aria-label="delete">
                                                <CloseIcon/>
                                            </IconButton>
                                        </div>
                                        <div className="ml-4 text-grafit text-lg w-full text-left flex flex-col justify-center h-full">
                                            <div className="font-bold text-xl">{el.title}</div>
                                            <div className="mt-4 mb-3">
                                                {el.projects.length > 0 ? "Проекты: " : "Проектов нет"}
                                            </div>
                                            {el.projects.map((element, i) => {
                                                return (
                                                    <div key={i} className="flex">
                                                        <div className="mb-1">
                                                            {element.title}
                                                        </div>
                                                        <div className="ml-1 ">
                                                            <IconButton size="small" onClick={() => changeProject(el.id, element.id)} aria-label="delete">
                                                                <CloseIcon fontSize="inherit" />
                                                            </IconButton>
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
                                                                onClick={() => { setOpenAddProject(true); setModalIndex(el.id) }}
                                                                color="grafit"
                                                            >
                                                                Добавить проект
                                                            </LoadingButton>
                                                        </Box>
                                                        <Modal
                                                            open={openAddProject}
                                                            onClose={closeProjectModal}
                                                            className="rounded-xl"
                                                        >
                                                            <Box
                                                                sx={boxStyle}
                                                                className="bg-white rounded-xl"
                                                            >
                                                                <div>
                                                                    <div className="text-2xl font-bold mb-5">
                                                                        Добавление проекта
                                                                    </div>
                                                                    <div className="text-lg mb-2">
                                                                        Введите название проекта:
                                                                    </div>
                                                                    <TextField
                                                                        value={projectName}
                                                                        onChange={handleInputChange}
                                                                        className=" w-full"
                                                                        size="small"
                                                                        variant="outlined"
                                                                    ></TextField>
                                                                </div>
                                                                <div className="mt-3">
                                                                    <LoadingButton
                                                                        variant="outlined"
                                                                        onClick={() => changeProject(modalIndex)}
                                                                        color="apple"
                                                                        loading={loadingSave}
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
                                );
                            })
                        )}
                        <ThemeProvider theme={theme}>
                            <div className="w-max mt-6">
                                <Button variant="contained" onClick={() => setOpenAddCompany(true)} color="apple">Добавить компанию</Button>
                            </div>
                            <Modal
                                open={openAddCompany}
                                onClose={closeCompanyModal}
                                className="rounded-xl"
                            >
                                <Box
                                    sx={boxStyle}
                                    className="bg-white rounded-xl"
                                >
                                    <div>
                                        <div className="text-2xl font-bold mb-5">
                                            Добавление компании
                                        </div>
                                        <div className="text-lg mb-2">
                                            Введите название компании:
                                        </div>
                                        <TextField
                                            value={companyName}
                                            onChange={handleInputCompanyChange}
                                            className=" w-full"
                                            size="small"
                                            variant="outlined"
                                        ></TextField>
                                    </div>
                                    <div className="mt-3">
                                        <LoadingButton
                                            variant="outlined"
                                            onClick={() => changeCompany()}
                                            color="apple"
                                            loading={loadingSave}
                                        >
                                            Сохранить
                                        </LoadingButton>
                                    </div>
                                </Box>
                            </Modal>

                        </ThemeProvider>

                    </div>
                    <div className="w-[389px] ml-3 h-max"></div>
                </div>
            </div>
        </div>
    );
}
