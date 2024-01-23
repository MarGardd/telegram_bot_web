import { Box, Modal, TextField } from "@mui/material";
import Sidebar from "../components/Sidebar"
import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { LoadingButton } from '@mui/lab';
import { createTheme } from '@mui/material/styles';


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
            main: '#b0b7c6',
            light: '#c7cbd3',
            dark: '##858d9e',
            contrastText: '#ffffff',
        }
    },
});

const companiesList = {
    1: {
        id: 1,
        name: "ООО 'ВЗС'",
        projects: [
            {
                id: 2312,
                name: 'Основная деятельность'
            }
        ]
    },
    2: {
        id: 2,
        name: "ООО 'Аркелит'",
        projects: [
            {
                id: 231,
                name: 'Совхозная, 12',
            },
            {
                id: 232,
                name: 'Лесная, 38',
            },
            {
                id: 233,
                name: 'Ленина, 6'
            }
        ]
    },
    5: {
        id: 5,
        name: "ООО 'Ижарболит'",
        projects: []
    }
}

const boxStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.papper',
    boxShadow: 24,
    p:4
};





export default function Companies() {
    const [openAddProject, setOpenAddProject] = React.useState(false);
    const [companies, setCompanies] = React.useState(companiesList);
    const [projectName, setProjectName] = React.useState("");

    const openProjectModal = (url) => {
        setOpenAddProject(true);
    }
    const closeProjectModal = () => {
        setOpenAddProject(false);
    }
    const addProject = (index) => {
        console.log(index)
       
        const newCompaniesList = Object.keys(companies).map((el, i) => {
            console.log(el)
            if(el === index){
                companies[el].projects.push({id: Math.floor(Math.random()*40), name: projectName})
            }
            return companies[el]
        })
        setCompanies(newCompaniesList)
        setOpenAddProject(false)
    }
    const handleInputChange = (e) => {
        setProjectName(e.target.value)
    }

    return (
        <div>
            <div className="h-full w-full flex flex-col justify-center items-center p-10">
                <div className='flex relative w-[1255px] mr-5'>
                    <div className='mt-6 mr-3 absolute  -left-56'>
                        <Sidebar active={1} />
                    </div>
                    <div className=' w-[850px]'>
                        {!companies ?
                            <div className='w-full text-xl min-w-96 mt-6 flex justify-center bg-white shadow-md shadow-white rounded-xl items-center p-5'>
                                Компаний нет
                            </div>
                            :
                            Object.keys(companies).map((el, index) => {
                                return (
                                    <div key={index} className='w-full mt-6 flex relative bg-white shadow-md shadow-white rounded-xl items-center p-5'>
                                        <div className='ml-4 text-grafit text-lg w-full text-left flex flex-col justify-center h-full'>
                                            <div className="font-bold text-xl">{companies[el].name}</div>
                                            
                                            <div className="mt-4 mb-3">{companies[el].projects.length>0  ? "Проекты: " : "Проектов нет"}</div>
                                            {Object.keys(companies[el].projects).map((element, i) => {
                                                return(
                                                    <div key={i} className="mb-1">{companies[el].projects[element].name}</div>
                                                )
                                            })}
                                            <div className='flex justify-between mt-4'>
                                                <ThemeProvider theme={theme}>
                                                    <div className='flex'>
                                                        {/* {payCheck.archival ?
                                                            <Box mr={2}><LoadingButton variant="contained" loading={archivalLoading[index]} className='mr-2' onClick={() => archived(index, 1)} color='silver' >Восстановить</LoadingButton></Box>
                                                            :
                                                            <Box mr={2}><LoadingButton variant="contained" loading={archivalLoading[index]} className='mr-2' onClick={() => archived(index, 0)} color='silver' >Архивировать</LoadingButton></Box>
                                                        } */}
                                                        <Box><LoadingButton variant="outlined" onClick={() => openProjectModal()} color='grafit' >Добавить проект</LoadingButton></Box>
                                                        <Modal open={openAddProject} onClose={closeProjectModal} className="rounded-xl">
                                                            <Box sx={boxStyle} className="bg-white rounded-xl">
                                                                <div>
                                                                    <div className="text-2xl font-bold mb-5">Добавление проекта</div>
                                                                    <div className="text-lg mb-2">Введите название проекта:</div>
                                                                    <TextField value={projectName} onChange={handleInputChange} className=" w-full" size="small" variant="outlined"></TextField>
                                                                </div>
                                                                <LoadingButton variant="outlined" onClick={() => addProject(el)} color='grafit' >Сохранить</LoadingButton>
                                                            </Box>
                                                            
                                                        </Modal>
                                                    </div>

                                                </ThemeProvider>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }

                    </div>
                    <div className="w-[389px] ml-3 h-max">

                    </div>
                </div>
            </div>
        </div>
    )
}