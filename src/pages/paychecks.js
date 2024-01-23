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


var paychecksList = [
    {
        id: 1,
        img: "https://sportishka.com/uploads/posts/2022-11/thumbs/1667508034_11-sportishka-com-p-avto-chek-vkontakte-11.jpg",
        username: "Vanya Petrov",
        date: '11.11.2023',
        company: "ООО Зеленый дракон",
        sum: 1500,
        status: "Новый",
        status_id: 1,
        created_at: '12.11.2023',
        archival: false
    },
    {
        id: 2,
        img: "https://avatars.dzeninfra.ru/get-zen_doc/3986059/pub_5f6b35b542c2f942bedf1439_5f6b42a1b79f4c7486772c87/scale_1200",
        username: "Petr Ivanov",
        date: '13.11.2023',
        company: "ИМЗ КУПОЛ",
        sum: 911,
        status: "Новый",
        status_id: 1,
        created_at: '14.11.2023',
        archival: false
    },
    {
        id: 3,
        img: "https://mykaleidoscope.ru/uploads/posts/2021-03/1615325587_59-p-roza-chek-meit-obraz-62.jpg",
        username: "Victor Pushin",
        date: '16.11.2023',
        company: "ИжГТУ",
        sum: 7400,
        status: "Проверен",
        status_id: 2,
        created_at: '16.11.2023',
        archival: false
    }
]

var buttonsList = () => {
    let buttonsLoadingStatus = {
        approved: {},
        archival: {},
        delete: {}
    }
    for (let i = 0; i < paychecksList.length; i++) {
        buttonsLoadingStatus.approved[i] = false
        buttonsLoadingStatus.archival[i] = false
        buttonsLoadingStatus.delete[i] = false
    }
    return (buttonsLoadingStatus)
}



const check = (value) => { console.log(value) }
var modalImg = ""

export default function PayChecks() {
    const [sortType, setSort] = React.useState('');
    const [type, setType] = React.useState('');
    const [openImg, setOpenImg] = React.useState(false);
    const [paychecks, setPaychecks] = React.useState(paychecksList);
    const [archivalLoading, setArchivalLoading] = React.useState(Object.values(buttonsList().archival));
    const [approvedLoading, setApprovedLoading] = React.useState(Object.values(buttonsList().approved));
    const [deleteLoading, setDeleteLoading] = React.useState(Object.values(buttonsList().delete));

    const handleOpenImg = (url) => {
        modalImg = url;
        setOpenImg(true);
    }
    const handleCloseImg = () => {
        setOpenImg(false);
        modalImg = "";
    }

    const handleChange = (event) => {
        setSort(event.target.value);
    };

    const typeChange = (event) => {
        setType(event.target.value);
    };




    const approved = (index) => {
        let oldtemp = Object.values(buttonsList().approved)
        const temp = Object.values(approvedLoading).map((el, i) => {
            if (index === i) {
                el = true
            }
            return el
        });
        setApprovedLoading(temp)
        setTimeout(() => {
            const nextPaychecks = paychecks.map((el, i) => {
                if (i === index) {
                    el.status_id = 2
                    el.status = "Проверено"
                }
                return el
            });
            setPaychecks(nextPaychecks)
            setApprovedLoading(oldtemp)
        }, 1000);
    }

    const remove = (id, index) => {
        let oldtemp = Object.values(buttonsList().delete)
        const temp = Object.values(deleteLoading).map((el, i) => {
            if (index === i) {
                el = true
            }
            return el
        });
        setDeleteLoading(temp)
        setTimeout(() => {
            const nextPaychecks = paychecks.filter(el => el.id !== id)
            setPaychecks(nextPaychecks)
            setDeleteLoading(oldtemp)
        }, 1000);
    }


    const archived = (index, action) => {
        let oldtemp = Object.values(buttonsList().archival)

        const temp = Object.values(archivalLoading).map((el, i) => {
            if (index === i) {
                el = true
            }
            return el
        });
        setArchivalLoading(temp)
        setTimeout(() => {
            const nextPaychecks = paychecks.map((el, i) => {
                if (i === index) {
                    action === 0 ? el.archival = true : el.archival = false
                }
                return el
            });
            setPaychecks(nextPaychecks)
            setArchivalLoading(oldtemp)
        }, 1000);
    }

    function ApprovedButton(props) {
        if (props.status_id === 1 && !props.archival)
            return (
                <Box mr={2}><LoadingButton variant="contained" loading={approvedLoading[props.index]} onClick={() => approved(props.index)} className='mr-2' color='apple' >Проверено</LoadingButton></Box>
            )
    }

    function StatusIcon(props) {
        if (props.status_id === 2 && !props.archival) {
            return (
                <ThemeProvider theme={theme}><CheckCircleIcon color='apple' fontSize='large' className='text-xl right-10 top-6 left-100 absolute' /></ThemeProvider>
            )
        } else if (props.status_id === 2 && props.archival) {
            return (
                <ThemeProvider theme={theme}>
                    <CheckCircleIcon color='apple' fontSize='large' className='text-xl right-10 top-6 left-100 absolute' />
                    <InboxIcon color='silver' fontSize='large' className='text-xl right-24 top-6 left-100 absolute'></InboxIcon>
                </ThemeProvider>
            )
        } else if (props.status_id !== 2 && props.archival) {
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
                        {paychecks.length === 0 ?
                            <div className='w-full text-xl min-w-96 mt-6 flex justify-center bg-white shadow-md shadow-white rounded-xl items-center p-5'>
                                Чеков нет
                            </div>
                            :
                            paychecks.map((payCheck, index) => {
                                return (
                                    <div key={index} className='w-full mt-6 flex relative bg-white shadow-md shadow-white rounded-xl items-center p-5'>
                                        <StatusIcon status_id={payCheck.status_id} archival={payCheck.archival} />
                                        <img src={payCheck.img} onClick={() => handleOpenImg(payCheck.img)} className='w-1/4 cursor-pointer rounded-xl' alt='Изображения нет'></img>
                                        <div className='ml-4 text-grafit text-lg w-full text-left flex flex-col justify-center h-full'>
                                            <div className='mb-2'>Имя: {payCheck.username}</div>
                                            <div className='mb-2'>Дата: {payCheck.date}</div>
                                            <div className='mb-2'>Компания: {payCheck.company}</div>
                                            <div className='mb-2'>Сумма: {payCheck.sum}</div>
                                            <div className='mb-2'>Статус: {payCheck.status}</div>
                                            <div className=''>Дата создания: {payCheck.created_at}</div>
                                            <div className='flex justify-between mt-4'>
                                                <ThemeProvider theme={theme}>
                                                    <ApprovedButton status_id={payCheck.status_id} index={index} archival={payCheck.archival} />
                                                    <div className='flex'>
                                                        {payCheck.archival ?
                                                            <Box mr={2}><LoadingButton variant="contained" loading={archivalLoading[index]} className='mr-2' onClick={() => archived(index, 1)} color='silver' >Восстановить</LoadingButton></Box>
                                                            :
                                                            <Box mr={2}><LoadingButton variant="contained" loading={archivalLoading[index]} className='mr-2' onClick={() => archived(index, 0)} color='silver' >Архивировать</LoadingButton></Box>
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
                                    <TextField id="outlined-basic" type='date' onChange={e => check(e.target.value)} size='small' label="" placeholder='Начальная дата' variant="outlined" className='rounded-lg bg-white shadow-md' />
                                </div>
                                <div className='text-xl text-black ml-3'> - </div>
                                <div className='ml-3'>
                                    <TextField id="outlined-basic" size='small' onChange={e => check(e.target.value)} type='date' label="" placeholder='Конечная дата' variant="outlined" className='rounded-lg bg-white shadow-md' />
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