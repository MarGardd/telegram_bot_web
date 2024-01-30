import { ThemeProvider } from '@emotion/react';
import Button from '@mui/material/Button'
import { createTheme } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import React, { useEffect } from 'react';
import Input from '@mui/material/Input';
import { Grid, SvgIcon, TextField } from '@mui/material';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { ReactComponent as ExcelIcon } from '../storage/excel-logo.svg'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InboxIcon from '@mui/icons-material/Inbox';
import { LoadingButton } from '@mui/lab';
import Sidebar from '../components/Sidebar';
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
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
};


var images = [
    {
        img: "https://sportishka.com/uploads/posts/2022-11/thumbs/1667508034_11-sportishka-com-p-avto-chek-vkontakte-11.jpg",
    },
    {
        img: "https://avatars.dzeninfra.ru/get-zen_doc/3986059/pub_5f6b35b542c2f942bedf1439_5f6b42a1b79f4c7486772c87/scale_1200"
    },
    {
        img: "https://mykaleidoscope.ru/uploads/posts/2021-03/1615325587_59-p-roza-chek-meit-obraz-62.jpg",
    },
    {
        img: "https://mykaleidoscope.ru/uploads/posts/2021-03/1615325567_37-p-roza-chek-meit-obraz-37.jpg"
    },
    {
        img: "https://pro-dachnikov.com/uploads/posts/2023-01/1673936357_pro-dachnikov-com-p-chek-na-mebel-foto-68.jpg"
    }
]









var modalImg = ""

export default function PayChecks() {
    
    const [sortType, setSortType] = React.useState('');
    const [type, setType] = React.useState('');
    const [openImg, setOpenImg] = React.useState(false);
    const [paychecks, setPaychecks] = React.useState([]);
    const [archivalLoading, setArchivalLoading] = React.useState();
    const [approvedLoading, setApprovedLoading] = React.useState();
    const [deleteLoading, setDeleteLoading] = React.useState();
    const [startDate, setStartDate] = React.useState();
    const [endDate, setEndDate] = React.useState();
    const apiUrl = "http://127.0.0.1:8000/api"

    const loadPaychecks = async () => {
        var status = null;
        if(type) {
            if(type === 1)
                status = true
            else if(type === 2)
                status = false
        }
        await axios.get(apiUrl + "/paychecks", {
            date: sortType === 1 ? true : null,
            sum: sortType === 2 ? true : null,
            min_date: startDate ? startDate.split("-").reverse().join(".") : null,
            max_date: endDate ? startDate.split("-").reverse().join(".") : null,
            checked: status,
            archived: type === 3 ? true : false
        })
        .then((response) => {
            const allPaychecks = response.data
            console.log(response.config)
            setPaychecks(allPaychecks)
        })
    }
    var buttonsList = () => {
        let buttonsLoadingStatus = {
            approved: {},
            archive: {},
            delete: {}
        }
        for (let i = 0; i < paychecks.length; i++) {
            buttonsLoadingStatus.approved[i] = false
            buttonsLoadingStatus.archive[i] = false
            buttonsLoadingStatus.delete[i] = false
        }
        return (buttonsLoadingStatus)
    }
    React.useEffect(() => {
        loadPaychecks().then(() => {
            buttonsList()
            setArchivalLoading(Object.values(buttonsList().archive))
            setApprovedLoading(Object.values(buttonsList().approved))
            setDeleteLoading(Object.values(buttonsList().delete))
        })
    }, [setPaychecks])



    const handleOpenImg = (url) => {
        modalImg = url;
        setOpenImg(true);
    }
    const handleCloseImg = () => {
        setOpenImg(false);
        modalImg = "";
    }

    const handleChange = (event) => {
        setSortType(event.target.value);
        loadPaychecks()
    };

    const typeChange = (event) => {
        setType(event.target.value)
        loadPaychecks()
    };

    const startDateChange = (value) => { 
        console.log(value)
        setStartDate(value) 
        loadPaychecks()
    }
    const endDateChange = (value) => { 
        console.log(value)
        setEndDate(value)
        loadPaychecks()
    }




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
        try{
            const response = await axios.post(apiUrl+"/paychecks/"+id+"/check")
        } catch ($err){
            console.log($err)
        }
        setApprovedLoading(oldtemp)
        loadPaychecks()
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
        try{
            const response = await axios.delete(apiUrl+"/paychecks/"+id)
        } catch ($err){
            console.log($err)
        }
        setDeleteLoading(oldtemp)
        loadPaychecks()
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
        try{
            const response = await axios.post(apiUrl+"/paychecks/"+id+"/archive")
        } catch ($err){
            console.log($err)
        }
        setArchivalLoading(oldtemp)
        loadPaychecks()
    }

    function ApprovedButton(props) {
        if (!props.checked && !props.archive)
            return (
                <Box mr={2}><LoadingButton variant="contained" loading={approvedLoading[props.index]} onClick={() => approved(props.index, props.id)} className='mr-2' color='apple' >Проверено</LoadingButton></Box>
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
        } else if (!props.checked&& props.archive) {
            return (
                <ThemeProvider theme={theme}>
                    <InboxIcon color='silver' fontSize='large' className='text-xl right-10 top-6 left-100 absolute'></InboxIcon>
                </ThemeProvider>
            )

        }
    }


    return (
        <div>
            <div className="h-full w-full flex  flex-col justify-center items-center p-10">
                <div className='flex relative justify-center w-[1255px]'>
                    <div className='mt-6 mr-3 absolute  -left-56'>
                        <Sidebar active={0} />
                    </div>
                    <div className=' w-[850px]'>
                        {!paychecks || paychecks.length === 0 ?
                            <div className='w-full text-xl min-w-96 mt-6 flex justify-center bg-white shadow-md shadow-white rounded-xl items-center p-5'>
                                Чеков нет
                            </div>
                            :
                            paychecks.map((payCheck, index) => {
                                return (
                                    <div key={index} className='w-full mt-6 flex relative bg-white shadow-md shadow-white rounded-xl items-center p-5'>
                                        <StatusIcon checked={payCheck.checked} archive={payCheck.archive} />
                                        {/* <img src={payCheck.file} onClick={() => handleOpenImg(payCheck.file)} className='w-1/4 cursor-pointer rounded-xl' alt='Изображения нет'></img> */}
                                        <img src={images[index].img ?? null} onClick={() => handleOpenImg(images[index].img ?? null)} className='w-1/3 cursor-pointer rounded-xl' alt='Изображения нет'></img>
                                        <div className='ml-4 text-grafit text-lg w-full text-left flex flex-col justify-center h-full'>
                                            <div className='mb-2'>Имя: {payCheck.username}</div>
                                        
                                            <div className='mb-2'>Компания: {payCheck.organization}</div>
                                            <div className='mb-2'>Населенный пункт: {payCheck.locality}</div>
                                            <div className='mb-2'>Способ оплаты: {payCheck.payment_method}</div>
                                            <div className='mb-2'>Проект: {payCheck.project}</div>
                                            <div className='mb-2'>Сумма: {payCheck.sum}</div>
                                            <div className='mb-2'>Комментарий: {payCheck.comment}</div>
                                            <div className='mb-2'>Статус: {payCheck.checked ? "Проверено" : "Новый"}</div>
                                            <div className=''>Дата создания: {payCheck.date}</div>
                                            <div className='flex justify-between mt-4'>
                                                <ThemeProvider theme={theme}>
                                                    <ApprovedButton checked={payCheck.checked} index={index} archive={payCheck.archive} id={payCheck.id} />
                                                    <div className='flex'>
                                                        {payCheck.archive ?
                                                            <Box mr={2}><LoadingButton variant="contained" loading={archivalLoading[index]} className='mr-2' onClick={() => archived(index, 1, payCheck.id)} color='silver' >Восстановить</LoadingButton></Box>
                                                            :
                                                            <Box mr={2}><LoadingButton variant="contained" loading={archivalLoading[index]} className='mr-2' onClick={() => archived(index, 0, payCheck.id)} color='silver' >Архивировать</LoadingButton></Box>
                                                        }
                                                        <Box><LoadingButton variant="outlined" loading={deleteLoading[index]} onClick={() => remove(payCheck.id, index)} color='grafit' >Удалить</LoadingButton></Box>
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
                            <img src={modalImg} alt='Ошибка. Изображения нет :('></img>
                        </Box>
                    </Modal>
                    <div className='bg-white w-max h-max ml-4 mt-6 rounded-xl shadow-md shadow-white p-4'>
                        <div>
                            <div className='text-md mb-1'>Сортировка:</div>
                            <FormControl sx={{ minWidth: 180 }} size="small" className='bg-white shadow-md rounded-lg'>
                                <InputLabel id="select-sort-label"></InputLabel>
                                <Select
                                    labelId="select-sort-label"
                                    id="select-sort"
                                    value={sortType ? sortType : 1}
                                    label=""
                                    onChange={handleChange}
                                    className='rounded-lg border-white'
                                >
                                    <MenuItem value={1}>Дата</MenuItem>
                                    <MenuItem value={2}>Сумма</MenuItem>
                                </Select>
                            </FormControl>
                            <div className='text-md mb-1 mt-3'>Дата:</div>
                            <div className='flex'>
                                <div className=''>
                                    <TextField id="outlined-basic" type='date' onChange={e => startDateChange(e.target.value)} size='small' label="" placeholder='Начальная дата' variant="outlined" className='rounded-lg bg-white shadow-md' />
                                </div>
                                <div className='text-xl text-black ml-3'> - </div>
                                <div className='ml-3'>
                                    <TextField id="outlined-basic" size='small' onChange={e => endDateChange(e.target.value)} type='date' label="" placeholder='Конечная дата' variant="outlined" className='rounded-lg bg-white shadow-md' />
                                </div>
                            </div>
                            <div className='text-md mb-1 mt-3'>Статус:</div>
                            <FormControl sx={{ minWidth: 180 }} size="small" className='bg-white shadow-md rounded-lg'>
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
                                <Button variant="contained" color='apple' startIcon={<SvgIcon component={ExcelIcon} inheritViewBox />}>Сформировать таблицу</Button>
                            </ThemeProvider>
                        </div>

                    </div>
                </div>

            </div >
        </div >
    );
}