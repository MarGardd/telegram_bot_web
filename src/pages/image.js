import { CircularProgress } from '@mui/material';
import axios from 'axios';
import React from 'react'
import { useParams } from 'react-router-dom'

const Image = () => {
    let { id } = useParams();
    const [image, setImage] = React.useState()
    const [loadImage, setLoadImage] = React.useState(false)

    React.useEffect(() => {
        const getImage = async () => {
            setLoadImage(true)
            await axios.get("/paychecks/photo/" + id).then((response) => {
                setImage(response.data)
            }).catch((err) => {console.error(err)})
            setLoadImage(false)
        }
        getImage()
    }, [])

    return (
        <div className='text-white  w-screen h-screen flex justify-center items-center'>
            {loadImage ? <CircularProgress /> : (
                <img src={image} alt='Ошибка. Не удалось получить изображение'></img>
            )}
        </div>
    )
}

export default Image