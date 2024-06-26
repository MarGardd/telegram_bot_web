import { ThemeProvider, useTheme } from '@emotion/react';
import Button from '@mui/material/Button'
import { createTheme } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import React, { useEffect } from 'react';
import Input from '@mui/material/Input';
import { Alert, CircularProgress, Grid, IconButton, SvgIcon, TextField } from '@mui/material';
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
import DeleteIcon from '@mui/icons-material/Delete';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import OutlinedInput from '@mui/material/OutlinedInput';
import ListItemText from '@mui/material/ListItemText';
import { BorderColorOutlined, Close, Done, Edit } from '@mui/icons-material';
import Snackbar from '@mui/material/Snackbar';

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
const boxStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "max-content",
    bgcolor: 'background.paper',
    boxShadow: 24,
};






axios.defaults.baseURL = "http://127.0.0.1:8000/api";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 200,
            textWrap: 'wrap'
        },
    },
};

var companies = []
var companiesList = []


var payments = []


var redactList = []
const token = localStorage.getItem('vostorg-token')
if (token) {
    await axios.get("/paychecks", {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then((response) => {
            const allPaychecks = response.data
            allPaychecks.forEach(item => {
                redactList[item.id] = {
                    company: false,
                    organization: false,
                    locality: false,
                    payment_method: false,
                    project: false,
                    sum: false,
                    pay_date: false,
                    comment: false,
                }
            })
        })

    axios.get('/companies', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(response => {
        companiesList = response.data
        let companiesTitles = response.data.map((el) => {
            return el.title
        })
        companies = companiesTitles
    })

    axios.get('/payment_methods', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(response => {
        let paymentsList = response.data.map((el) => {
            return el.title
        })
        payments = paymentsList
    })
}





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

    const [type, setType] = React.useState('');
    const [openImg, setOpenImg] = React.useState(false);
    const [paychecks, setPaychecks] = React.useState([]);
    const [archivalLoading, setArchivalLoading] = React.useState(Object.values(buttonsList().archive));
    const [approvedLoading, setApprovedLoading] = React.useState(Object.values(buttonsList().approved));
    const [deleteLoading, setDeleteLoading] = React.useState(Object.values(buttonsList().delete));
    const [startDate, setStartDate] = React.useState('');
    const [endDate, setEndDate] = React.useState('');
    const [loadExcelButton, setLoadExcelButton] = React.useState(false)
    const [loadPaycheksList, setLoadPaycheksList] = React.useState(false)
    const [activeImg, setActiveImg] = React.useState(0)
    const [paycheckModal, setPaycheckModal] = React.useState()
    const [isInitialize, setIsInitialize] = React.useState(false)
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

    //Фильтры
    const [userName, setUserName] = React.useState('')
    const [companyName, setCompanyName] = React.useState([]);
    const [sellerName, setSellerName] = React.useState('')
    const [localityName, setLocalityName] = React.useState('')
    const [paymentsName, setPaymentsName] = React.useState([]);
    const [projectsName, setProjectsName] = React.useState([]);
    const [minAmount, setMinAmount] = React.useState('');
    const [maxAmount, setMaxAmount] = React.useState('');
    const [startPaymentDate, setStartPaymentDate] = React.useState('');
    const [endPaymentDate, setEndPaymentDate] = React.useState('');
    const [loadSetFilters, setLoadSetFilters] = React.useState(false)
    const [loadRemoveFilters, setLoadRemoveFilters] = React.useState(false)
    const [allFilters, setAllFilters] = React.useState({
        username: null,
        company: [],
        organization: null,
        locality: null,
        payment_method: [],
        project: [],
        min_sum: null,
        max_sum: null,
        min_pay_date: null,
        max_pay_date: null,
        checked: null,
        archive: false
    })
    const [companiesIds, setCompaniesIds] = React.useState([])
    const [projects, setProjects] = React.useState([])
    React.useEffect(() => {
        axios.get('/projects', {
            params: {
                company_id: companiesIds
            }
        }).then(response => {
            let projectsList = response.data.map((el) => {
                return el.title
            })
            setProjects(projectsList)
        })
    }, [companiesIds])



    //Редактирование полей
    const changeIsRedact = (id, field, status) => {
        let newIsRedact = isRedact
        newIsRedact[id][field] = status
        setIsRedact(newIsRedact)
        if (field === 'company') {
            setRedactCompany(status)
        } else if (field === 'organization') {
            setRedactOrganization(status)
        } else if (field === 'locality') {
            setRedactLocality(status)
        } else if (field === 'payment_method') {
            setRedactPaymentMethod(status)
        } else if (field === 'project') {
            setRedactProject(status)
        } else if (field === 'sum') {
            setRedactSum(status)
        } else if (field === 'pay_date') {
            setRedactPayDate(status)
        } else if (field === 'comment') {
            setRedactComment(status)
        }

    }

    const [isRedact, setIsRedact] = React.useState(redactList)
    const startRedact = (paycheckId, field) => {
        if (field === "company") {
            setRedactCompany(true)
        } else if (field === "organization") {
            setRedactOrganization(true)
        } else if (field === "locality") {
            setRedactLocality(true)
        } else if (field === "payment_method") {
            setRedactPaymentMethod(true)
        } else if (field === "project") {
            setRedactProject(true)
        } else if (field === "sum") {
            setRedactSum(true)
        } else if (field === "pay_date") {
            setRedactPayDate(true)
        } else if (field === "comment") {
            setRedactComment(true)
        }
        changeIsRedact(paycheckId, field, true)
        loadPaychecks(false)
    }
    //Компания
    const [redactCompany, setRedactCompany] = React.useState(false)
    const [newCompany, setNewCompany] = React.useState('')
    const handleNewCompany = (e) => {
        let value = e.target.value
        setNewCompany(value)
    }
    const saveNewCompany = async (id) => {
        try {
            if (!newCompany || newCompany === "") {
                setErrorMessage("Ошибка. Редактируемое поле обязательно для заполнения")
                setErrorNotify(true)
                return
            }
            await axios.post("/paychecks/" + id, {
                question_id: 1,
                answer_text: newCompany
            }).then((response) => {
                let newPaychecks = paychecks.map(item => {
                    if (item.id === id) {
                        item.company = newCompany
                    }
                    return item
                })
                setPaychecks(newPaychecks)

                changeIsRedact(id, 'company', false)
                setRedactCompany(false)
                setNewCompany("")
            })
        } catch (err) {
            console.log(err)
            setErrorMessage("Ошибка: "+err.message)
            setErrorNotify(true)
        }
    }

    //Компания-продавец
    const [redactOrganization, setRedactOrganization] = React.useState(false)
    const [newOrganization, setNewOrganization] = React.useState('')

    const handleNewOrganization = (e) => {
        let value = e.target.value
        setNewOrganization(value)
    }
    const saveNewOrganization = async (id) => {
        try {
            if (!newOrganization || newOrganization === "") {
                setErrorMessage("Ошибка. Редактируемое поле обязательно для заполнения")
                setErrorNotify(true)
                return
            }
            await axios.post("/paychecks/" + id, {
                question_id: 2,
                answer_text: newOrganization
            }).then((response) => {
                let newPaychecks = paychecks.map(item => {
                    if (item.id === id) {
                        item.organization = newOrganization
                    }
                    return item
                })
                setPaychecks(newPaychecks)
                changeIsRedact(id, 'organization', false)
                setRedactOrganization(false)
                setNewOrganization("")
            })
        } catch (err) {
            console.log(err)
            setErrorMessage("Ошибка: "+err.message)
            setErrorNotify(true)
        }
    }

    //Населенный пункт
    const [redactLocality, setRedactLocality] = React.useState(false)
    const [newLocality, setNewLocality] = React.useState('')

    const handleNewLocality = (e) => {
        let value = e.target.value
        setNewLocality(value)
    }
    const saveNewLocality = async (id) => {
        try {
            if (!newLocality || newLocality === "") {
                setErrorMessage("Ошибка. Редактируемое поле обязательно для заполнения")
                setErrorNotify(true)
                return
            }
            await axios.post("/paychecks/" + id, {
                question_id: 4,
                answer_text: newLocality
            }).then((response) => {
                let newPaychecks = paychecks.map(item => {
                    if (item.id === id) {
                        item.locality = newLocality
                    }
                    return item
                })
                setPaychecks(newPaychecks)
                changeIsRedact(id, 'locality', false)
                setRedactLocality(false)
                setNewLocality("")
            })
        } catch (err) {
            console.log(err)
            setErrorMessage("Ошибка: "+err.message)
            setErrorNotify(true)
        }
    }

    //Способ оплаты
    const [redactPaymentMethod, setRedactPaymentMethod] = React.useState(false)
    const [newPaymentMethod, setNewPaymentMethod] = React.useState('')

    const handleNewPaymentMethod = (e) => {
        let value = e.target.value
        setNewPaymentMethod(value)
    }
    const saveNewPaymentMethod = async (id) => {
        try {
            if (!newPaymentMethod || newPaymentMethod === "") {
                setErrorMessage("Ошибка. Редактируемое поле обязательно для заполнения")
                setErrorNotify(true)
                return
            }
            await axios.post("/paychecks/" + id, {
                question_id: 5,
                answer_text: newPaymentMethod
            }).then((response) => {
                let newPaychecks = paychecks.map(item => {
                    if (item.id === id) {
                        item.payment_method = newPaymentMethod
                    }
                    return item
                })
                setPaychecks(newPaychecks)
                changeIsRedact(id, 'payment_method', false)
                setRedactPaymentMethod(false)
                setNewPaymentMethod("")
            })
        } catch (err) {
            console.log(err)
            setErrorMessage("Ошибка: "+err.message)
            setErrorNotify(true)
        }
    }

    //Проект
    const [redactProject, setRedactProject] = React.useState(false)
    const [newProject, setNewProject] = React.useState('')

    const handleNewProject = (e) => {
        let value = e.target.value
        setNewProject(value)
    }
    const saveNewProject = async (id) => {
        try {
            if (!newProject || newProject === "") {
                setErrorMessage("Ошибка. Редактируемое поле обязательно для заполнения")
                setErrorNotify(true)
                return
            }
            await axios.post("/paychecks/" + id, {
                question_id: 3,
                answer_text: newProject
            }).then((response) => {
                let newPaychecks = paychecks.map(item => {
                    if (item.id === id) {
                        item.project = newProject
                    }
                    return item
                })
                setPaychecks(newPaychecks)
                changeIsRedact(id, 'project', false)
                setRedactProject(false)
                setNewProject("")
            })
        } catch (err) {
            console.log(err)
            setErrorMessage("Ошибка: "+err.message)
            setErrorNotify(true)
        }
    }

    //Сумма оплаты
    const [redactSum, setRedactSum] = React.useState(false)
    const [newSum, setNewSum] = React.useState('')

    const handleNewSum = (e) => {
        let value = e.target.value
        setNewSum(value)
    }
    const saveNewSum = async (id) => {
        try {
            if (!newSum || newSum === "") {
                setErrorMessage("Ошибка. Редактируемое поле обязательно для заполнения")
                setErrorNotify(true)
                return
            }
            await axios.post("/paychecks/" + id, {
                question_id: 6,
                answer_text: newSum
            }).then((response) => {
                let newPaychecks = paychecks.map(item => {
                    if (item.id === id) {
                        item.sum = newSum
                    }
                    return item
                })
                setPaychecks(newPaychecks)
                changeIsRedact(id, 'sum', false)
                setRedactSum(false)
                setNewSum("")
            })
        } catch (err) {
            console.log(err)
            setErrorMessage("Ошибка: "+err.message)
            setErrorNotify(true)
        }
    }

    //Дата оплаты
    const [redactPayDate, setRedactPayDate] = React.useState(false)
    const [newPayDate, setNewPayDate] = React.useState('')

    const handleNewPayDate = (e) => {
        let value = e.target.value
        setNewPayDate(value)
    }
    const saveNewPayDate = async (id) => {
        try {
            if (!newPayDate || newPayDate === "") {
                setErrorMessage("Ошибка. Редактируемое поле обязательно для заполнения")
                setErrorNotify(true)
                return
            }
            const parts = newPayDate.split('-');
            const outputDate = parts[2] + '.' + parts[1] + '.' + parts[0];
            await axios.post("/paychecks/" + id, {
                question_id: 7,
                answer_text: outputDate
            }).then((response) => {
                let newPaychecks = paychecks.map(item => {
                    if (item.id === id) {
                        item.pay_date = outputDate
                    }
                    return item
                })
                setPaychecks(newPaychecks)
                changeIsRedact(id, 'pay_date', false)
                setRedactPayDate(false)
                setNewPayDate("")
            })
        } catch (err) {
            console.log(err)
            setErrorMessage("Ошибка: "+err.message)
            setErrorNotify(true)
        }
    }

    //Комментарий
    const [redactComment, setRedactComment] = React.useState(false)
    const [newComment, setNewComment] = React.useState('')

    const handleNewComment = (e) => {
        let value = e.target.value
        setNewComment(value)
    }
    const saveNewComment = async (id) => {
        try {
            if (!newComment || newComment === "") {
                setErrorMessage("Ошибка. Редактируемое поле обязательно для заполнения")
                setErrorNotify(true)
                return
            }
            await axios.post("/paychecks/" + id, {
                question_id: 9,
                answer_text: newComment
            }).then((response) => {
                let newPaychecks = paychecks.map(item => {
                    if (item.id === id) {
                        item.comment = newComment
                    }
                    return item
                })
                setPaychecks(newPaychecks)
                changeIsRedact(id, 'comment', false)
                setRedactComment(false)
                setNewComment("")
            })
        } catch (err) {
            console.log(err)
            setErrorMessage("Ошибка: "+err.message)
            setErrorNotify(true)
        }
    }

    //Редактирование полей (конец)


    //Сортировка
    const [sort, setSort] = React.useState([['date', 'desc']]);
    const [checkedState, setCheckedState] = React.useState({
        date: true,
        project: false,
        locality: false,
        pay_date: false,
        company: false,
    });

    const stepperTheme = useTheme()
    // axios.defaults.headers.common['ngrok-skip-browser-warning'] = "any"


    const loadPaychecks = async (reload) => {
        try {
            if (reload) {
                setLoadPaycheksList(true)
            }
            await axios.get("/paychecks", {
                params: {
                    sort: sort,
                    ...allFilters
                }
            })
                .then((response) => {
                    const allPaychecks = response.data
                    // setTimeout(() => {
                    setPaychecks(allPaychecks)
                    setLoadPaycheksList(false)
                    // }, 3000);

                })
        } catch (err) {
            console.log(err)
            setErrorMessage("Ошибка: "+err.message)
            setErrorNotify(true)
        }
    }
    React.useEffect(() => {
        loadPaychecks(true)
    }, [sort, allFilters])
    React.useEffect(() => {
        if (isInitialize) {
            loadPaychecks(false)
        } else {
            setIsInitialize(true)
        }
    }, [isRedact])









    const handleOpenImg = (paycheck) => {
        setPaycheckModal(paycheck)
        setOpenImg(true);
    }
    const handleCloseImg = () => {
        setOpenImg(false);
        setPaycheckModal()
        setActiveImg(0)
    }


    const typeChange = (event) => {
        setType(event.target.value)
    };

    const startDateChange = (value) => {
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
    const handleFileChange = (paycheck) => async (event) => {
        try {
            const selectedFile = event.target.files[0];
            const formData = new FormData();
            formData.set('file', selectedFile);
            await axios.post("/paychecks/" + paycheck['id'] + "/add-photo", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            }).then((response) => {
                let index = paycheck.files.length - 1
                paycheck.files.splice(index, 0, response.data)
                loadPaychecks(false)
            })
        } catch (err) {
            console.log(err)
            setErrorMessage("Ошибка: "+err.message)
            setErrorNotify(true)
        }
    }

    const deletePhoto = async (paycheck, image, index) => {
        try {
            await axios.delete("/paychecks/photo/" + image.id).then(() => {
                paycheck.files.splice(index, 1)
                activeImg > 0 ? setActiveImg(activeImg--) : setActiveImg(activeImg++)
                loadPaychecks(false)
            })
        } catch (err) {
            console.log(err)
            setErrorMessage("Ошибка: "+err.message)
            setErrorNotify(true)
        }

    }

    React.useEffect(() => {
        if (paycheckModal) {
            const handleKeyDown = (event) => {
                if (event.key === 'ArrowLeft' && activeImg > 0) {
                    handleBack();
                } else if (event.key === 'ArrowRight' && activeImg < paycheckModal['files'].length - 1) {
                    handleNext();
                }
            }
            document.addEventListener('keydown', handleKeyDown)

            return () => {
                document.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [activeImg, paycheckModal])



    const approved = async (index, id) => {
        let oldtemp = Object.values(buttonsList().approved)
        const temp = Object.values(approvedLoading).map((el, i) => {
            if (index === i) {
                el = true
            }
            return el
        });
        setApprovedLoading(temp)
        try {
            const response = await axios.post("/paychecks/" + id + "/check")
            loadPaychecks(false)
        } catch (err) {
            console.log(err)
            setErrorMessage("Ошибка: "+err.message)
            setErrorNotify(true)
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
            const response = await axios.delete("/paychecks/" + id)
            loadPaychecks(false)
        } catch (err) {
            console.log(err)
            setErrorMessage("Ошибка: "+err.message)
            setErrorNotify(true)
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
                await axios.post("/paychecks/" + id + "/archive")
            else
                await axios.post("/paychecks/" + id + "/restore")
            loadPaychecks(false)
        } catch (err) {
            console.log(err)
            setErrorMessage("Ошибка: "+err.message)
            setErrorNotify(true)
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
            axios.get('/sheet', {
                params: allFilters
            }).then((response) => {
                setLoadExcelButton(false)
                window.open(response.data, '_blank')
            })
        } catch (err) {
            setLoadExcelButton(false)
            console.log(err)
            setErrorMessage("Ошибка: "+err.message)
            setErrorNotify(true)
        }
    }

    //Фильтры
    const usernameFilterChange = (event) => {
        setUserName(event.target.value)
    }

    React.useEffect(() => {
        let ids = companiesList.filter(item => companyName.includes(item.title))
            .map(item => item.id);
        setCompaniesIds(ids)
    }, [companyName])

    const companyFilterChange = (event) => {
        let value = event.target.value
        setCompanyName(typeof value === 'string' ? value.split(',') : value)
    };

    const paymentsFilterChange = (event) => {
        let value = event.target.value
        setPaymentsName(typeof value === 'string' ? value.split(',') : value)
    };

    const projectsFilterChange = (event) => {
        let value = event.target.value
        setProjectsName(typeof value === 'string' ? value.split(',') : value)
    };

    const sellerFilterChange = (event) => {
        setSellerName(event.target.value)
    }

    const localityFilterChange = (event) => {
        setLocalityName(event.target.value)
    }

    const setFilters = () => {
        setLoadSetFilters(true)
        let status = null;
        if (type) {
            if (type === 1)
                status = true
            else if (type === 2)
                status = false
        }
        let filters = {
            username: userName && userName !== '' ? userName : null,
            company: Array.isArray(companyName) && companyName.length > 0 ? companyName : null,
            organization: sellerName && sellerName !== '' ? sellerName : null,
            locality: localityName && localityName !== '' ? localityName : null,
            payment_method: Array.isArray(paymentsName) && paymentsName.length > 0 ? paymentsName : null,
            project: Array.isArray(projectsName) && projectsName.length > 0 ? projectsName : null,
            min_sum: minAmount && minAmount !== '' ? minAmount : null,
            max_sum: maxAmount && maxAmount !== '' ? maxAmount : null,
            min_pay_date: startPaymentDate && startPaymentDate !== '' ? startPaymentDate : null,
            max_pay_date: endPaymentDate && endPaymentDate !== '' ? endPaymentDate : null,
            checked: status,
            archive: type === 3
        }
        setAllFilters(filters)
        setLoadSetFilters(false)
    }

    const removeFilters = () => {
        setLoadRemoveFilters(true)
        let filters = {
            username: null,
            company: [],
            organization: null,
            locality: null,
            payment_method: [],
            project: [],
            min_sum: null,
            max_sum: null,
            min_pay_date: null,
            max_pay_date: null,
            checked: null,
            archive: false
        }
        setAllFilters(filters)
        setUserName('')
        setCompanyName([])
        setSellerName('')
        setLocalityName('')
        setPaymentsName([])
        setProjectsName([])
        setMinAmount('')
        setMaxAmount('')
        setStartPaymentDate('')
        setEndPaymentDate('')
        setType(0)
        setLoadRemoveFilters(false)
    }

    React.useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                document.getElementById('FiltersBtn').click();
            }
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [])
    //Фильтры

    const handleChecked = (field, type) => (e) => {
        let isChecked = e.target.checked
        setCheckedState({ ...checkedState, [field]: isChecked })
        if (isChecked) {
            setSort([...sort, [field, type]])
        } else {
            setSort(sort.filter(item => item[0] !== field))
        }

    }

    const resetCheckboxes = () => {
        setSort([['date', 'desc']])
        setCheckedState({
            date: true,
            project: false,
            locality: false,
            pay_date: false,
            company: false
        });
    };



    return (
        <div>
            <div className="h-full w-full flex  flex-col justify-center items-center p-10">
                <div className='flex  justify-center w-5/6'>
                    <div className='mt-6 mr-4'>
                        <Sidebar active={0} />
                    </div>
                    <div className=' w-3/5'>
                        {loadPaycheksList ?
                            (<div className='w-full text-xl min-w-96 mt-6 flex justify-center bg-white shadow-md shadow-white rounded-xl items-center p-5'>
                                <CircularProgress />
                            </div>)
                            : (!paychecks || paychecks.length === 0 ?
                                <div className='w-full text-xl min-w-96 mt-6 flex justify-center bg-white shadow-md shadow-white rounded-xl items-center p-5'>
                                    Чеков нет
                                </div>
                                :
                                paychecks.map((payCheck, index) => {
                                    return (
                                        <div key={index} className='w-full mt-6 flex relative bg-white shadow-md shadow-white rounded-xl items-center p-5'>
                                            <StatusIcon checked={payCheck.checked} archive={payCheck.archive} />

                                            <div className='w-2/5 min-w-32'>
                                                <img src={payCheck['files'][0]['path'] ?? null} onClick={() => handleOpenImg(payCheck)} className='w-full max-h-96  cursor-pointer rounded-xl' alt='Изображения нет'></img>
                                            </div>

                                            <div className='ml-4 text-grafit text-lg w-full flex-wrap text-left flex flex-col justify-center h-full'>
                                                <div className=''>Имя: {payCheck.username}</div>
                                                {isRedact[payCheck.id]['company'] ?
                                                    <div className='flex'>
                                                        <TextField variant="outlined" size="small" placeholder='Компания' value={newCompany} onChange={handleNewCompany} className='bg-white w-3/4 2xl:w-3/4 rounded-lg' />
                                                        <IconButton onClick={() => saveNewCompany(payCheck.id)} sx={{ marginBottom: 1, cursor: "pointer", marginLeft: 2 }} >
                                                            <Done fontSize='small' />
                                                        </IconButton>
                                                        <IconButton onClick={() => changeIsRedact(payCheck.id, 'company', false)} sx={{ marginBottom: 1, cursor: "pointer", marginLeft: 1 }} >
                                                            <Close fontSize='small' />
                                                        </IconButton>
                                                    </div>
                                                    :
                                                    <div className='flex items-center mb-1'>Компания: {payCheck.company}
                                                        <IconButton disabled={redactCompany} onClick={() => startRedact(payCheck.id, 'company')} sx={{ cursor: "pointer" }} >
                                                            <Edit fontSize='small' />
                                                        </IconButton>

                                                    </div>
                                                }
                                                {isRedact[payCheck.id]['organization'] ?
                                                    <div className='flex mt-2'>
                                                        <TextField variant="outlined" size="small" placeholder='Компания-продавец' value={newOrganization} onChange={handleNewOrganization} className='bg-white w-3/4 2xl:w-3/4 rounded-lg' />
                                                        <IconButton onClick={() => saveNewOrganization(payCheck.id)} sx={{ marginBottom: 1, cursor: "pointer", marginLeft: 2 }} >
                                                            <Done fontSize='small' />
                                                        </IconButton>
                                                        <IconButton onClick={() => changeIsRedact(payCheck.id, 'organization', false)} sx={{ marginBottom: 1, cursor: "pointer", marginLeft: 1 }} >
                                                            <Close fontSize='small' />
                                                        </IconButton>
                                                    </div>
                                                    :
                                                    <div className=' flex items-center mb-1'>Компания-продавец: {payCheck.organization}
                                                        <IconButton disabled={redactOrganization} onClick={() => startRedact(payCheck.id, 'organization')} sx={{ cursor: "pointer" }} >
                                                            <Edit fontSize='small' />
                                                        </IconButton>
                                                    </div>
                                                }
                                                {isRedact[payCheck.id]['locality'] ?
                                                    <div className='flex mt-2'>
                                                        <TextField variant="outlined" size="small" placeholder='Населенный пункт' value={newLocality} onChange={handleNewLocality} className='bg-white w-3/4 2xl:w-3/4 rounded-lg' />
                                                        <IconButton onClick={() => saveNewLocality(payCheck.id)} sx={{ marginBottom: 1, cursor: "pointer", marginLeft: 2 }} >
                                                            <Done fontSize='small' />
                                                        </IconButton>
                                                        <IconButton onClick={() => changeIsRedact(payCheck.id, 'locality', false)} sx={{ marginBottom: 1, cursor: "pointer", marginLeft: 1 }} >
                                                            <Close fontSize='small' />
                                                        </IconButton>
                                                    </div>
                                                    :
                                                    <div className=' flex items-center mb-1'>Населенный пункт: {payCheck.locality}
                                                        <IconButton disabled={redactLocality} onClick={() => startRedact(payCheck.id, 'locality')} sx={{ cursor: "pointer" }} >
                                                            <Edit fontSize='small' />
                                                        </IconButton>
                                                    </div>
                                                }
                                                {isRedact[payCheck.id]['payment_method'] ?
                                                    <div className='flex mt-2'>
                                                        <TextField variant="outlined" size="small" placeholder='Метод оплаты' value={newPaymentMethod} onChange={handleNewPaymentMethod} className='bg-white w-3/4 2xl:w-3/4 rounded-lg' />
                                                        <IconButton onClick={() => saveNewPaymentMethod(payCheck.id)} sx={{ marginBottom: 1, cursor: "pointer", marginLeft: 2 }} >
                                                            <Done fontSize='small' />
                                                        </IconButton>
                                                        <IconButton onClick={() => changeIsRedact(payCheck.id, 'payment_method', false)} sx={{ marginBottom: 1, cursor: "pointer", marginLeft: 1 }} >
                                                            <Close fontSize='small' />
                                                        </IconButton>
                                                    </div>
                                                    :
                                                    <div className=' flex items-center mb-1'>Способ оплаты: {payCheck.payment_method}
                                                        <IconButton disabled={redactPaymentMethod} onClick={() => startRedact(payCheck.id, 'payment_method')} sx={{ cursor: "pointer" }} >
                                                            <Edit fontSize='small' />
                                                        </IconButton>
                                                    </div>
                                                }
                                                {isRedact[payCheck.id]['project'] ?
                                                    <div className='flex mt-2'>
                                                        <TextField variant="outlined" size="small" placeholder='Проект' value={newProject} onChange={handleNewProject} className='bg-white w-3/4 2xl:w-3/4 rounded-lg' />
                                                        <IconButton onClick={() => saveNewProject(payCheck.id)} sx={{ marginBottom: 1, cursor: "pointer", marginLeft: 2 }} >
                                                            <Done fontSize='small' />
                                                        </IconButton>
                                                        <IconButton onClick={() => changeIsRedact(payCheck.id, 'project', false)} sx={{ marginBottom: 1, cursor: "pointer", marginLeft: 1 }} >
                                                            <Close fontSize='small' />
                                                        </IconButton>
                                                    </div>
                                                    :
                                                    <div className=' flex items-center mb-1'>Проект: {payCheck.project}
                                                        <IconButton disabled={redactProject} onClick={() => startRedact(payCheck.id, 'project')} sx={{ cursor: "pointer" }} >
                                                            <Edit fontSize='small' />
                                                        </IconButton>
                                                    </div>
                                                }
                                                {isRedact[payCheck.id]['sum'] ?
                                                    <div className='flex mt-2'>
                                                        <TextField variant="outlined" type='number' size="small" placeholder='Сумма оплаты' value={newSum} onChange={handleNewSum} className='bg-white w-3/4 2xl:w-3/4 rounded-lg' />
                                                        <IconButton onClick={() => saveNewSum(payCheck.id)} sx={{ marginBottom: 1, cursor: "pointer", marginLeft: 2 }} >
                                                            <Done fontSize='small' />
                                                        </IconButton>
                                                        <IconButton onClick={() => changeIsRedact(payCheck.id, 'sum', false)} sx={{ marginBottom: 1, cursor: "pointer", marginLeft: 1 }} >
                                                            <Close fontSize='small' />
                                                        </IconButton>
                                                    </div>
                                                    :
                                                    <div className=' flex items-center mb-1'>Сумма: {payCheck.sum}
                                                        <IconButton disabled={redactSum} onClick={() => startRedact(payCheck.id, 'sum')} sx={{ cursor: "pointer" }} >
                                                            <Edit fontSize='small' />
                                                        </IconButton>
                                                    </div>
                                                }
                                                {isRedact[payCheck.id]['pay_date'] ?
                                                    <div className='flex mt-2'>
                                                        <TextField variant="outlined" type='date' size="small" placeholder='Дата оплаты' value={newPayDate} onChange={handleNewPayDate} className='bg-white w-3/4 2xl:w-3/4 rounded-lg' />
                                                        <IconButton onClick={() => saveNewPayDate(payCheck.id)} sx={{ marginBottom: 1, cursor: "pointer", marginLeft: 2 }} >
                                                            <Done fontSize='small' />
                                                        </IconButton>
                                                        <IconButton onClick={() => changeIsRedact(payCheck.id, 'pay_date', false)} sx={{ marginBottom: 1, cursor: "pointer", marginLeft: 1 }} >
                                                            <Close fontSize='small' />
                                                        </IconButton>
                                                    </div>
                                                    :
                                                    <div className=' flex items-center mb-1'>Дата оплаты: {payCheck.pay_date}
                                                        <IconButton disabled={redactPayDate} onClick={() => startRedact(payCheck.id, 'pay_date')} sx={{ cursor: "pointer" }} >
                                                            <Edit fontSize='small' />
                                                        </IconButton>
                                                    </div>
                                                }
                                                {isRedact[payCheck.id]['comment'] ?
                                                    <div className='flex mt-2'>
                                                        <TextField variant="outlined" type='text' size="small" placeholder='Комментарий' value={newComment} onChange={handleNewComment} className='bg-white w-3/4 2xl:w-3/4 rounded-lg' />
                                                        <IconButton onClick={() => saveNewComment(payCheck.id)} sx={{ marginBottom: 1, cursor: "pointer", marginLeft: 2 }} >
                                                            <Done fontSize='small' />
                                                        </IconButton>
                                                        <IconButton onClick={() => changeIsRedact(payCheck.id, 'comment', false)} sx={{ marginBottom: 1, cursor: "pointer", marginLeft: 1 }} >
                                                            <Close fontSize='small' />
                                                        </IconButton>
                                                    </div>
                                                    :
                                                    <div className=' flex items-center mb-1'>Комментарий: {payCheck.comment}
                                                        <IconButton disabled={redactComment} onClick={() => startRedact(payCheck.id, 'comment')} sx={{ cursor: "pointer" }} >
                                                            <Edit fontSize='small' />
                                                        </IconButton>
                                                    </div>
                                                }
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
                                }))
                        }
                    </div>

                    {paycheckModal ?
                        <Modal
                            open={openImg}
                            onClose={handleCloseImg}
                        >
                            <Box sx={boxStyle}>
                                <div className='flex flex-col items-center bg-milk'>
                                    {paycheckModal['files'][activeImg].path ?
                                        <div className='relative'>
                                            <img src={paycheckModal['files'][activeImg].path} alt='Ошибка. Изображения нет :(' className=' max-h-[780px]'>
                                            </img>
                                            <button onClick={() => deletePhoto(paycheckModal, paycheckModal['files'][activeImg], activeImg)} className='p-2 bg-black absolute opacity-25 bottom-7 left-1/2 -translate-x-1/2 rounded-lg cursor-pointer hover:opacity-65'>
                                                <DeleteIcon style={{ color: 'white' }} />
                                            </button>
                                        </div>
                                        :
                                        <div className='h-[360px] w-[240px] bg-white p-2'>
                                            <label htmlFor='file-upload' className=' bg-black opacity-50 h-full rounded-lg cursor-pointer hover:opacity-65 flex justify-center items-center'>
                                                <img src={plus} alt='Ошибка' />
                                                <input
                                                    id="file-upload"
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleFileChange(paycheckModal)}
                                                />
                                            </label>

                                        </div>
                                    }

                                    <MobileStepper
                                        variant="text"
                                        sx={{
                                            backgroundColor: "#cfcdcd",
                                            color: "black"
                                        }}
                                        steps={paycheckModal['files'].length}
                                        position="static"
                                        activeStep={activeImg}
                                        nextButton={
                                            <Button
                                                size="small"
                                                onClick={handleNext}
                                                disabled={activeImg === paycheckModal['files'].length - 1}

                                            >

                                                {stepperTheme.direction === 'rtl' ? (
                                                    <KeyboardArrowLeft />
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
                        :
                        ""}
                    <div className='flex flex-col w-1/3'>
                        <div className='bg-white h-max ml-4 mt-6 rounded-xl shadow-md shadow-white p-4'>
                            <div>
                                <div className='text-lg font-bold mb-2'>Сортировка</div>
                                <FormGroup>
                                    <FormControlLabel onChange={handleChecked('date', 'desc')} control={<Checkbox checked={checkedState.date} />} label="Дата создания" />
                                    <FormControlLabel onChange={handleChecked('project', 'asc')} control={<Checkbox checked={checkedState.project} />} label="Проект" />
                                    <FormControlLabel onChange={handleChecked('locality', 'asc')} control={<Checkbox checked={checkedState.locality} />} label="Город" />
                                    <FormControlLabel onChange={handleChecked('pay_date', 'desc')} control={<Checkbox checked={checkedState.pay_date} />} label="Дата оплаты" />
                                    <FormControlLabel onChange={handleChecked('company', 'asc')} control={<Checkbox checked={checkedState.company} />} label="Компания" />
                                </FormGroup>
                            </div>
                            <ThemeProvider theme={theme}>
                                <LoadingButton sx={{
                                    marginBottom: 2,
                                    marginTop: 2,
                                    textTransform: "none",
                                    width: "max"
                                }} variant="contained" color='grafit' onClick={() => resetCheckboxes()}>Сбросить</LoadingButton>
                            </ThemeProvider>
                        </div>
                        <div className='bg-white h-max ml-4 mt-6 rounded-xl shadow-md shadow-white p-4'>
                            <div>
                                <div className='text-lg font-bold mb-2'>Фильтры</div>

                                <div className='text-md mb-1 mt-3'>Пользователь:</div>
                                <TextField variant="outlined" size="small" value={userName} onChange={usernameFilterChange} className='bg-white w-3/4 2xl:w-3/4 shadow-md rounded-lg' />

                                <div className='text-md mb-1 mt-3'>Компания:</div>
                                <FormControl sx={{ minWidth: 180 }} size="small" className='bg-white w-3/4 2xl:w-3/4 shadow-md rounded-lg'>
                                    <InputLabel></InputLabel>
                                    <Select
                                        multiple
                                        value={companyName}
                                        onChange={companyFilterChange}
                                        input={<OutlinedInput label="Tag" />}
                                        renderValue={(selected) => selected.join(', ')}
                                        MenuProps={MenuProps}
                                        className='rounded-lg border-white'
                                    >
                                        {companies.map((name) => (
                                            <MenuItem key={name} sx={{ textWrap: 'wrap' }} value={name}>
                                                <Checkbox checked={companyName.indexOf(name) > -1} />
                                                <ListItemText primary={name} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <div className='text-md mb-1 mt-3'>Продавец:</div>
                                <TextField variant="outlined" size="small" value={sellerName} onChange={sellerFilterChange} className='bg-white w-3/4 2xl:w-3/4 shadow-md rounded-lg' />

                                <div className='text-md mb-1 mt-3'>Населенный пункт:</div>
                                <TextField variant="outlined" size="small" value={localityName} onChange={localityFilterChange} className='bg-white w-3/4 2xl:w-3/4 shadow-md rounded-lg' />

                                <div className='text-md mb-1 mt-3'>Способ оплаты:</div>
                                <FormControl sx={{ minWidth: 180 }} size="small" className='bg-white w-3/4 2xl:w-3/4 shadow-md rounded-lg'>
                                    <InputLabel></InputLabel>
                                    <Select
                                        multiple
                                        value={paymentsName}
                                        onChange={paymentsFilterChange}
                                        input={<OutlinedInput label="Tag" />}
                                        renderValue={(selected) => selected.join(', ')}
                                        MenuProps={MenuProps}
                                        className='rounded-lg border-white'
                                    >
                                        {payments.map((name) => (
                                            <MenuItem key={name} sx={{ textWrap: 'wrap' }} value={name}>
                                                <Checkbox checked={paymentsName.indexOf(name) > -1} />
                                                <ListItemText primary={name} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <div className='text-md mb-1 mt-3'>Проект:</div>
                                <FormControl sx={{ minWidth: 180 }} size="small" className='bg-white w-3/4 2xl:w-3/4 shadow-md rounded-lg'>
                                    <InputLabel></InputLabel>
                                    <Select
                                        multiple
                                        value={projectsName}
                                        onChange={projectsFilterChange}
                                        input={<OutlinedInput label="Tag" />}
                                        renderValue={(selected) => selected.join(', ')}
                                        MenuProps={MenuProps}
                                        className='rounded-lg border-white'
                                    >
                                        {projects.length > 0 ? projects.map((name) => (
                                            <MenuItem key={name} sx={{ textWrap: 'wrap' }} value={name}>
                                                <Checkbox checked={projectsName.indexOf(name) > -1} />
                                                <ListItemText primary={name} />
                                            </MenuItem>
                                        )) :
                                            <MenuItem>
                                                <ListItemText primary={"Проектов нет"} />
                                            </MenuItem>
                                        }
                                    </Select>
                                </FormControl>

                                <div className='text-md mb-1 mt-3'>Сумма:</div>
                                <div className='flex flex-col w-max justify-center 2xl:max-w-80 items-center 2xl:flex-row'>
                                    <div className='w-48'>
                                        <TextField id="outlined-basic" value={minAmount} defaultValue={minAmount} onChange={(e) => setMinAmount(e.target.value)} size='small' label="" placeholder='От' variant="outlined" className='rounded-lg bg-white shadow-md' />
                                    </div>
                                    <div className='text-xl text-black w-full text-center 2xl:w-auto 2xl:text-left 2xl:ml-3'> - </div>
                                    <div className='2xl:ml-3 w-48'>
                                        <TextField id="outlined-basic" value={maxAmount} defaultValue={maxAmount} size='small' onChange={(e) => setMaxAmount(e.target.value)} label="" placeholder='До' variant="outlined" className='rounded-lg bg-white shadow-md' />
                                    </div>
                                </div>

                                <div className='text-md mb-1 mt-3'>Дата оплаты:</div>
                                <div className='flex flex-col w-max justify-center items-center 2xl:flex-row'>
                                    <div className=''>
                                        <TextField id="outlined-basic" type='date' value={startPaymentDate} onChange={(e) => setStartPaymentDate(e.target.value)} size='small' label="" placeholder='Начальная дата' variant="outlined" className='rounded-lg bg-white shadow-md' />
                                    </div>
                                    <div className='text-xl text-black w-full text-center 2xl:w-auto 2xl:text-left 2xl:ml-3'> - </div>
                                    <div className='2xl:ml-3'>
                                        <TextField id="outlined-basic" size='small' value={endPaymentDate} onChange={(e) => setEndPaymentDate(e.target.value)} type='date' label="" placeholder='Конечная дата' variant="outlined" className='rounded-lg bg-white shadow-md' />
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
                                        <MenuItem value={0}>Все</MenuItem>
                                        <MenuItem value={1}>Проверено</MenuItem>
                                        <MenuItem value={2}>Не проверено</MenuItem>
                                        <MenuItem value={3}>Архивные</MenuItem>
                                    </Select>
                                </FormControl>

                                <div className='text-md mb-1 mt-3'>Дата создания:</div>
                                <div className='flex flex-col w-max justify-center items-center 2xl:flex-row'>
                                    <div className=''>
                                        <TextField id="outlined-basic" type='date' value={startDate} onChange={(e) => startDateChange(e.target.value)} size='small' label="" placeholder='Начальная дата' variant="outlined" className='rounded-lg bg-white shadow-md' />
                                    </div>
                                    <div className='text-xl text-black w-full text-center 2xl:w-auto 2xl:text-left 2xl:ml-3'> - </div>
                                    <div className='2xl:ml-3'>
                                        <TextField id="outlined-basic" size='small' value={endDate} onChange={(e) => endDateChange(e.target.value)} type='date' label="" placeholder='Конечная дата' variant="outlined" className='rounded-lg bg-white shadow-md' />
                                    </div>
                                </div>
                            </div>
                            <div className='mt-6 flex-col flex w-max'>
                                <ThemeProvider theme={theme}>
                                    <LoadingButton sx={{
                                        marginBottom: 2,
                                        textTransform: "none",
                                        width: "max"
                                    }} variant="contained" id='FiltersBtn' loading={loadSetFilters} color='silver' onClick={() => setFilters()}>Применить</LoadingButton>
                                    <LoadingButton sx={{
                                        marginBottom: 2,
                                        textTransform: "none",
                                        width: "max"
                                    }} variant="contained" loading={loadRemoveFilters} color='grafit' onClick={() => removeFilters()}>Сбросить фильтры</LoadingButton>
                                </ThemeProvider>
                            </div>
                            <div className='mt-6'>
                                <ThemeProvider theme={theme}>
                                    <LoadingButton variant="contained" sx={{ textTransform: "none" }} loading={loadExcelButton} color='apple' onClick={() => createTable()} startIcon={<SvgIcon component={ExcelIcon} inheritViewBox />}>Сформировать таблицу</LoadingButton>
                                </ThemeProvider>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
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
        </div >
    );
}