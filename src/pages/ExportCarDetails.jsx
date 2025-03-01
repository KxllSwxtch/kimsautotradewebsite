import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Loader } from '../components'

const ExportCarDetails = () => {
	const [car, setCar] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const { carId } = useParams()

	useEffect(() => {
		const fetchCar = async () => {
			try {
				setLoading(true)
				const response = await axios.get(
					`https://api.encar.com/v1/readside/vehicle/${carId}`,
				)
				setCar(response.data)
			} catch (err) {
				setError('Ошибка при загрузке данных')
				console.error(err)
			} finally {
				setLoading(false)
			}
		}

		if (carId) {
			fetchCar()
		}
	}, [carId])

	if (loading) return <Loader />
	if (error) return <p className='text-center text-red-500'>{error}</p>
	if (!car) return <p className='text-center text-lg'>Автомобиль не найден</p>

	// Получение URL первой фотографии
	const getPhotoUrl = (path) => `https://ci.encar.com/carpicture${path}`
	const sortedPhotos = car?.photos?.sort((a, b) => (a.path > b.path ? 1 : -1))
	const uniquePhotos = [
		...new Map(car?.photos?.map((photo) => [photo.path, photo])).values(),
	]

	const formattedYearMonth = `${car?.category?.yearMonth.substring(
		4,
	)}/${car?.category?.yearMonth.substring(0, 4)}`

	return (
		<div className='container mx-auto mt-20 md:mt-30 p-6 bg-white shadow-lg rounded-lg'>
			<h1 className='text-3xl font-bold text-center mb-6'>
				{car?.category?.manufacturerEnglishName}{' '}
				{car?.category?.modelGroupEnglishName} {car?.category?.gradeEnglishName}
			</h1>

			{/* Слайдер с фото */}
			{sortedPhotos.length > 0 && (
				<div className='max-w-2xl mx-auto mb-6'>
					<Swiper
						modules={[Navigation, Pagination]}
						spaceBetween={10}
						slidesPerView={1}
						navigation
						pagination={{ clickable: true }}
						className='rounded-lg shadow-lg'
					>
						{uniquePhotos.map((photo, index) => (
							<SwiperSlide key={index}>
								<img
									src={getPhotoUrl(photo.path)}
									alt={`Car image ${index + 1}`}
									className='w-full h-auto rounded-lg'
								/>
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			)}

			{/* Данные об автомобиле */}
			<div className='mt-6 p-5 bg-gray-50 shadow-md rounded-lg'>
				<p className='text-gray-600'>
					<strong>Год выпуска:</strong> {formattedYearMonth}
				</p>
				<p className='text-gray-600'>
					<strong>Объём двигателя:</strong>{' '}
					{car?.spec?.displacement.toLocaleString()} см³
				</p>
				<p className='text-gray-600'>
					<strong>Трансмиссия:</strong> {car?.spec?.transmissionName}
				</p>
				<p className='text-gray-600'>
					<strong>Тип топлива:</strong> {car?.spec?.fuelName}
				</p>
				<p className='text-gray-600'>
					<strong>Цвет:</strong> {car?.spec?.colorName}
				</p>
				<p className='text-gray-600'>
					<strong>Пробег:</strong> {car?.spec?.mileage.toLocaleString()} км
				</p>
				<p className='text-gray-800 font-bold text-lg'>
					<strong>Цена в Корее:</strong> ₩
					{(car?.advertisement?.price * 10000).toLocaleString()}
				</p>
			</div>

			{/* Контакты менеджеров */}
			<div className='mt-6 p-5 bg-white shadow-md rounded-lg text-center'>
				<h2 className='text-xl font-semibold mb-4'>Контакты менеджеров</h2>
				<p className='text-gray-700'>
					<strong>Рамис:</strong>{' '}
					<a href='tel:+821080296232' className='text-blue-600 hover:underline'>
						+82 10-8029-6232
					</a>
				</p>
				<p className='text-gray-700'>
					<strong>Артём:</strong>{' '}
					<a href='tel:+821082828062' className='text-blue-600 hover:underline'>
						+82 10-8282-8062
					</a>
				</p>
			</div>
		</div>
	)
}

export default ExportCarDetails
