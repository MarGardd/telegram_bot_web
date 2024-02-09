import { ThemeProvider, useTheme } from '@emotion/react';
import Button from '@mui/material/Button'
import { createTheme } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import React, { useEffect } from 'react';
import Input from '@mui/material/Input';
import { CircularProgress, Grid, SvgIcon, TextField } from '@mui/material';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { ReactComponent as ExcelIcon } from '../storage/excel-logo.svg'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InboxIcon from '@mui/icons-material/Inbox';
import { LoadingButton } from '@mui/lab';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import plus from '../storage/plus.png'

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
const boxStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "max-content",
    bgcolor: 'background.paper',
    boxShadow: 24,
};




var modalImg = ""
const modalImages = [
    {
        src: "http://127.0.0.1:8000/file_0.jpg"
    },
    {
        src: "http://127.0.0.1:8000/file_1.jpg"
    },
    {
        src: "http://127.0.0.1:8000/file_2.jpg"
    },
    {
        src: null
    }
]

export default function PayChecks() {
    var buttonsList = () => {
        let buttonsLoadingStatus = {
            approved: {},
            archive: {},
            delete: {}
        }
        for (let i = 0; i < 10; i++) {
            buttonsLoadingStatus.approved[i] = false
            buttonsLoadingStatus.archive[i] = false
            buttonsLoadingStatus.delete[i] = false
        }
        return (buttonsLoadingStatus)
    }
    const [sortType, setSortType] = React.useState(1);
    const [type, setType] = React.useState('');
    const [openImg, setOpenImg] = React.useState(false);
    const [paychecks, setPaychecks] = React.useState([]);
    const [archivalLoading, setArchivalLoading] = React.useState(Object.values(buttonsList().archive));
    const [approvedLoading, setApprovedLoading] = React.useState(Object.values(buttonsList().approved));
    const [deleteLoading, setDeleteLoading] = React.useState(Object.values(buttonsList().delete));
    const [startDate, setStartDate] = React.useState();
    const [endDate, setEndDate] = React.useState();
    const [loadExcelButton, setLoadExcelButton] = React.useState(false)
    const [loadPaycheksList, setLoadPaycheksList] = React.useState(false)
    const [activeImg, setActiveImg] = React.useState(0)
    const maxImages = modalImages.length
    const stepperTheme = useTheme()
    // axios.defaults.headers.common['ngrok-skip-browser-warning'] = "any"

    const apiUrl = "https://vostorg-api.skb-44.ru/api"
    const loadPaychecks = async () => {
        let status = null;
        if (type) {
            if (type === 1)
                status = true
            else if (type === 2)
                status = false
        }
        try {
            setLoadPaycheksList(true)
            await axios.get(apiUrl + "/paychecks", {
                params: {
                    date: sortType === 1 ? "desc" : null,
                    sum: sortType === 2 ? true : null,
                    min_date: startDate ? startDate.split("-").reverse().join(".") : null,
                    max_date: endDate ? endDate.split("-").reverse().join(".") : null,
                    checked: status,
                    archive: type === 3 ? true : false
                }
            })
                .then((response) => {
                    console.log(response)
                    const allPaychecks = response.data
                    setPaychecks(allPaychecks)
                    setTimeout(() => {
                        setLoadPaycheksList(false)
                    }, 1000);

                })
        } catch (err) {
            console.log(err)
        }

    }
    React.useEffect(() => {
        loadPaychecks()
    }, [sortType, type, startDate, endDate])

    





    const handleOpenImg = (url) => {
        modalImg = url;
        setOpenImg(true);
    }
    const handleCloseImg = () => {
        setOpenImg(false);
        modalImg = "";
    }

    const handleChange = (event) => {
        console.log(event.target.value)
        setSortType(event.target.value);
    };

    const typeChange = (event) => {
        setType(event.target.value)
    };

    const startDateChange = (value) => {
        console.log(value)
        setStartDate(value)
    }
    const endDateChange = (value) => {
        setEndDate(value)
    }

    const handleNext = () => {
        setActiveImg((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveImg((prevActiveStep) => prevActiveStep - 1);
    };

    React.useEffect(()=>{
        const handleKeyDown = (event) => {
            if (event.key === 'ArrowLeft' && activeImg > 0) {
                handleBack();
              } else if (event.key === 'ArrowRight' && activeImg < maxImages) {
                handleNext();
              }
        }
        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [activeImg])




    const approved = async (index, id) => {
        let oldtemp = Object.values(buttonsList().approved)
        console.log(id)
        const temp = Object.values(approvedLoading).map((el, i) => {
            if (index === i) {
                el = true
            }
            return el
        });
        setApprovedLoading(temp)
        try {
            const response = await axios.post(apiUrl + "/paychecks/" + id + "/check")
            loadPaychecks()
        } catch (err) {
            console.log(err)
        }
        setApprovedLoading(oldtemp)
    }

    const remove = async (id, index) => {
        let oldtemp = Object.values(buttonsList().delete)
        const temp = Object.values(deleteLoading).map((el, i) => {
            if (index === i) {
                el = true
            }
            return el
        });
        setDeleteLoading(temp)
        try {
            const response = await axios.delete(apiUrl + "/paychecks/" + id)
            loadPaychecks()
        } catch (err) {
            console.log(err)
        }
        setDeleteLoading(oldtemp)
    }


    const archived = async (index, action, id) => {
        let oldtemp = Object.values(buttonsList().archive)

        const temp = Object.values(archivalLoading).map((el, i) => {
            if (index === i) {
                el = true
            }
            return el
        });
        setArchivalLoading(temp)
        try {

            if (action === 0)
                await axios.post(apiUrl + "/paychecks/" + id + "/archive")
            else
                await axios.post(apiUrl + "/paychecks/" + id + "/restore")
            loadPaychecks()
        } catch (err) {
            console.log(err)
        }
        setArchivalLoading(oldtemp)
    }

    function ApprovedButton(props) {
        if (!props.checked && !props.archive)
            return (
                <Box mr={2}><LoadingButton variant="contained" sx={{
                    fontSize: "auto",
                    textTransform: "none",
                    marginTop: 2,
                }} loading={approvedLoading[props.index]} onClick={() => approved(props.index, props.id)} className='mr-2' color='apple' >Проверено</LoadingButton></Box>
            )
    }

    function StatusIcon(props) {
        if (props.checked && !props.archive) {
            return (
                <ThemeProvider theme={theme}><CheckCircleIcon color='apple' fontSize='large' className='text-xl right-10 top-6 left-100 absolute' /></ThemeProvider>
            )
        } else if (props.checked && props.archive) {
            return (
                <ThemeProvider theme={theme}>
                    <CheckCircleIcon color='apple' fontSize='large' className='text-xl right-10 top-6 left-100 absolute' />
                    <InboxIcon color='silver' fontSize='large' className='text-xl right-24 top-6 left-100 absolute'></InboxIcon>
                </ThemeProvider>
            )
        } else if (!props.checked && props.archive) {
            return (
                <ThemeProvider theme={theme}>
                    <InboxIcon color='silver' fontSize='large' className='text-xl right-10 top-6 left-100 absolute'></InboxIcon>
                </ThemeProvider>
            )

        }
    }

    const createTable = async () => {
        setLoadExcelButton(true)
        try {
            axios.get(apiUrl + '/sheet').then((response) => {
                setLoadExcelButton(false)
                window.open(response.data, '_blank')
            })
        } catch (err) {
            setLoadExcelButton(false)
            console.log(err)
        }
    }


    return (
        <div>
            <div className="h-full w-full flex  flex-col justify-center items-center p-10">
                <div className='flex  justify-center w-5/6'>
                    <div className='mt-6 mr-4'>
                        <Sidebar active={0} />
                    </div>
                    <div className=' w-3/5'>
                        {!paychecks || paychecks.length === 0 ?
                            <div className='w-full text-xl min-w-96 mt-6 flex justify-center bg-white shadow-md shadow-white rounded-xl items-center p-5'>
                                {loadPaycheksList ? <CircularProgress /> : "Чеков нет"}
                            </div>
                            :
                            paychecks.map((payCheck, index) => {
                                return (
                                    <div key={index} className='w-full mt-6 flex relative bg-white shadow-md shadow-white rounded-xl items-center p-5'>
                                        <StatusIcon checked={payCheck.checked} archive={payCheck.archive} />
                                        {/* <img src={payCheck.file} onClick={() => handleOpenImg(payCheck.file)} className='w-1/4 cursor-pointer rounded-xl' alt='Изображения нет'></img> */}
                                        <div className='w-2/5 min-w-32'>
                                            <img src={payCheck['file'] ?? null} onClick={() => handleOpenImg(payCheck['file'] ?? null)} className='w-full max-h-96  cursor-pointer rounded-xl' alt='Изображения нет'></img>
                                        </div>

                                        <div className='ml-4 text-grafit text-lg w-full flex-wrap text-left flex flex-col justify-center h-full'>
                                            <div className='mb-2'>Имя: {payCheck.username}</div>
                                            <div className='mb-2'>Компания: {payCheck.company}</div>
                                            <div className='mb-2'>Компания-продавец: {payCheck.organization}</div>
                                            <div className='mb-2'>Населенный пункт: {payCheck.locality}</div>
                                            <div className='mb-2'>Способ оплаты: {payCheck.payment_method}</div>
                                            <div className='mb-2'>Проект: {payCheck.project}</div>
                                            <div className='mb-2'>Сумма: {payCheck.sum}</div>
                                            <div className='mb-2'>Дата оплаты: {payCheck.pay_date}</div>
                                            <div className='mb-2'>Комментарий: {payCheck.comment}</div>
                                            <div className='mb-2'>Статус: {payCheck.checked ? "Проверено" : "Новый"}</div>
                                            <div className=''>Дата создания: {payCheck.date}</div>
                                            <div className='flex mt-4 text-grafit text-lg w-full text-left  h-full'>
                                                <ThemeProvider theme={theme}>

                                                    <div className='flex flex-wrap'>
                                                        <ApprovedButton checked={payCheck.checked} index={index} archive={payCheck.archive} id={payCheck.id} />
                                                        {payCheck.archive ?
                                                            <Box mr={2} mt={2}><LoadingButton variant="contained" sx={{
                                                                fontSize: 14,
                                                                textTransform: "none",
                                                            }} loading={archivalLoading[index]} className='mr-2' onClick={() => archived(index, 1, payCheck.id)} color='silver' >Восстановить</LoadingButton></Box>
                                                            :
                                                            <Box mr={2} mt={2}><LoadingButton variant="contained" sx={{
                                                                fontSize: 14,
                                                                textTransform: "none",
                                                            }} loading={archivalLoading[index]} className='mr-2' onClick={() => archived(index, 0, payCheck.id)} color='silver' >Архивировать</LoadingButton></Box>
                                                        }
                                                        <Box mt={2}><LoadingButton sx={{
                                                            fontSize: 14,
                                                            textTransform: "none",
                                                        }} variant="outlined" loading={deleteLoading[index]} onClick={() => remove(payCheck.id, index)} color='grafit' >Удалить</LoadingButton></Box>
                                                    </div>

                                                </ThemeProvider>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                    <Modal
                        open={openImg}
                        onClose={handleCloseImg}
                    >
                        <Box sx={boxStyle}>
<<<<<<< HEAD
                            <div className='flex flex-col items-center bg-milk'>
                                <img src={modalImages[activeImg].src} alt='Ошибка. Изображения нет :(' className=' max-h-[780px]'></img>
=======
                            <div className='flex flex-col items-center'>
                                {modalImages[activeImg].src ?
                                    <img src={modalImages[activeImg].src} alt='Ошибка. Изображения нет :(' className=' max-h-[780px]'></img>
                                    :
                                    <div className='h-[360px] w-[240px] bg-white p-2'>
                                        <label htmlFor='file-upload' className=' bg-black opacity-50 h-full rounded-lg cursor-pointer hover:opacity-65 flex justify-center items-center'>
                                            <img src={plus} alt='Ошибка' />
                                            <input
                                                id="file-upload"
                                                type="file"
                                                className="hidden"
                                                // onChange={handleFileChange}
                                            />
                                        </label>
                                    </div>
                                }

>>>>>>> 5ac2d9ddc31b10822a5990e1aa847062592ab0ee
                                <MobileStepper
                                    variant="text"
                                    sx={{
                                        backgroundColor: "#cfcdcd",
                                        color: "black"
                                    }}
                                    steps={maxImages}
                                    position="static"
                                    activeStep={activeImg}
                                    nextButton={
                                        <Button
                                            size="small"
                                            onClick={handleNext}
                                            disabled={activeImg === maxImages - 1}
                                            
                                        >

                                            {stepperTheme.direction === 'rtl' ? (
                                                <KeyboardArrowLeft  />
                                            ) : (
                                                <KeyboardArrowRight />
                                            )}
                                        </Button>
                                    }
                                    backButton={
                                        <Button size="small" onClick={handleBack} disabled={activeImg === 0}>
                                            {stepperTheme.direction === 'rtl' ? (
                                                <KeyboardArrowRight />
                                            ) : (
                                                <KeyboardArrowLeft />
                                            )}

                                        </Button>
                                    }
                                />
                            </div>
                        </Box>
                    </Modal>
                    <div className='bg-white w-1/3 h-max ml-4 mt-6 rounded-xl shadow-md shadow-white p-4'>
                        <div>
                            <div className='text-md mb-1'>Сортировка:</div>
                            <FormControl sx={{ minWidth: 180 }} size="small" className='bg-white w-3/4 2xl:w-auto shadow-md rounded-lg'>
                                <InputLabel id="select-sort-label"></InputLabel>
                                <Select
                                    labelId="select-sort-label"
                                    id="select-sort"
                                    value={sortType ? sortType : 1}
                                    label=""
                                    onChange={handleChange}
                                    className='rounded-lg border-white'
                                >
                                    <MenuItem value={1}>Дата создания</MenuItem>
                                    <MenuItem value={2}>Сумма</MenuItem>
                                </Select>
                            </FormControl>
                            <div className='text-md mb-1 mt-3'>Дата создания:</div>
                            <div className='flex flex-col w-max justify-center items-center 2xl:flex-row'>
                                <div className=''>
                                    <TextField id="outlined-basic" type='date' onChange={(e) => startDateChange(e.target.value)} size='small' label="" placeholder='Начальная дата' variant="outlined" className='rounded-lg bg-white shadow-md' />
                                </div>
                                <div className='text-xl text-black w-full text-center 2xl:w-auto 2xl:text-left 2xl:ml-3'> - </div>
                                <div className='2xl:ml-3'>
                                    <TextField id="outlined-basic" size='small' onChange={(e) => endDateChange(e.target.value)} type='date' label="" placeholder='Конечная дата' variant="outlined" className='rounded-lg bg-white shadow-md' />
                                </div>
                            </div>
                            <div className='text-md mb-1 mt-3'>Статус:</div>
                            <FormControl sx={{ minWidth: 180 }} size="small" className='bg-white w-3/4 2xl:w-auto shadow-md rounded-lg'>
                                <InputLabel></InputLabel>
                                <Select
                                    id="select-type"
                                    value={type ? type : 0}
                                    label=""
                                    onChange={typeChange}
                                    className='rounded-lg border-white'
                                >
                                    {/* <MenuItem value="">
                  <em>Не выбрано</em>
                </MenuItem> */}
                                    <MenuItem value={0}>Все</MenuItem>
                                    <MenuItem value={1}>Проверено</MenuItem>
                                    <MenuItem value={2}>Не проверено</MenuItem>
                                    <MenuItem value={3}>Архивные</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className='mt-6'>
                            <ThemeProvider theme={theme}>
                                <LoadingButton variant="contained" loading={loadExcelButton} color='apple' onClick={() => createTable()} startIcon={<SvgIcon component={ExcelIcon} inheritViewBox />}>Сформировать таблицу</LoadingButton>
                            </ThemeProvider>
                        </div>

                    </div>
                </div>

            </div >
        </div >
    );
}