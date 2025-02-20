import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Slider from 'react-slick'
import { FaPhoneAlt } from 'react-icons/fa'
import { FaInstagram, FaYoutube } from 'react-icons/fa'
import { SiTiktok } from 'react-icons/si'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import { Loader, NextArrow, PrevArrow } from '../components'
import { translateCarName } from '../utils'
import { carModelsTranslation } from '../translations'

const translations = {
	연식: 'Год выпуска',
	최초등록일: 'Дата первой регистрации',
	연료: 'Тип топлива',
	휘발유: 'Бензин',
	경유: 'Дизель',
	전기: 'Электро',
	하이브리드: 'Гибрид',
	변속기: 'Трансмиссия',
	오토: 'Автомат',
	수동: 'Механика',
	색상: 'Цвет',
	흰색: 'Белый',
	검정색: 'Чёрный',
	회색: 'Серый',
	파란색: 'Синий',
	빨간색: 'Красный',
	주행거리: 'Пробег',
	차량번호: 'Гос. номер',
	차대번호: 'VIN-номер',
	'압류｜저당': 'Был в ДТП',
	'0건｜0건': 'Нет',
	모델명: 'Модель',
	세금미납: 'Задолженность по налогам',
	없음: 'Отсутствует',
	제시번호: 'Номер предложения',
}

const API_BASE_URL = 'https://ark-motors-backend-3a002a527613.herokuapp.com'

const CarDetails = () => {
	const { carId } = useParams()
	const [carData, setCarData] = useState(null)
	const [loading, setLoading] = useState(true)
	const [images, setImages] = useState([])
	const [carName, setCarName] = useState('')

	useEffect(() => {
		const fetchCarDetails = async () => {
			try {
				const response = await axios.get(`${API_BASE_URL}/car-details`, {
					params: { carId },
				})
				// Сервер возвращает JSON с полями carName и carData
				setCarName(response.data.carName)
				setCarData(response.data.carData)
			} catch (error) {
				console.error('Ошибка при загрузке деталей автомобиля:', error)
			} finally {
				setLoading(false)
			}
		}

		const fetchCarImages = async () => {
			try {
				const response = await axios.get(`${API_BASE_URL}/car-images`, {
					params: { carId },
				})
				setImages(response.data.images)
			} catch (error) {
				console.error('Ошибка загрузки изображений:', error)
			}
		}

		fetchCarDetails()
		fetchCarImages()
	}, [carId])

	if (loading) return <Loader />

	const sliderSettings = {
		dots: true, // Показать индикаторы (точки)
		infinite: true, // Зацикленный слайдер
		speed: 500, // Скорость анимации
		slidesToShow: 1, // Показывать по одному слайду
		slidesToScroll: 1,
		adaptiveHeight: true, // Автоматическая подгонка высоты
		autoplay: true, // Автоматическая прокрутка
		autoplaySpeed: 4000, // Интервал между слайдами (4 сек)
		nextArrow: <NextArrow />, // Пользовательская стрелка "вперед"
		prevArrow: <PrevArrow />, // Пользовательская стрелка "назад"
	}

	return (
		<div className='min-h-screen py-8 px-4 mt-20'>
			<div className='container mx-auto max-w-4xl'>
				{images.length > 0 && (
					<div className='mb-8'>
						<Slider {...sliderSettings} className='rounded-lg overflow-hidden'>
							{images.map((img, index) => (
								<div key={index} className='flex justify-center'>
									<img
										src={img.full}
										alt={`Car ${index}`}
										className='w-full max-h-96 object-contain rounded-lg'
									/>
								</div>
							))}
						</Slider>
					</div>
				)}
				{carData ? (
					<div className='bg-white shadow-2xl rounded-xl p-10'>
						<h2 className='text-4xl font-bold mb-8 text-center text-blue-700'>
							{carName ? translateCarName(carName) : 'Модель не указана'}
						</h2>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
							{Object.entries(carData).map(([key, value], index) => (
								<div
									key={index}
									className='bg-white p-6 rounded-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300'
								>
									<p className='text-sm font-medium text-blue-600'>
										{translations[key] || key}:
									</p>
									<p className='mt-1 text-xl font-semibold text-gray-800'>
										{translations[value] ||
											carModelsTranslation[value] ||
											value}
									</p>
								</div>
							))}
						</div>
					</div>
				) : (
					<p className='text-center text-gray-300'>Автомобиль не найден</p>
				)}
				<div className='mt-10 p-8 bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl shadow-lg flex flex-col items-center space-y-4'>
					<h3 className='text-2xl font-bold text-blue-600'>
						Контакты для связи
					</h3>
					<div className='flex items-center gap-3'>
						<FaPhoneAlt className='text-blue-500' />
						<p className='text-lg text-blue-700'>
							Артём: <span className='font-semibold'>+82 10-8282-8062</span>
						</p>
					</div>
					<div className='flex items-center gap-3'>
						<FaPhoneAlt className='text-blue-500' />
						<p className='text-lg text-blue-700'>
							Рамис: <span className='font-semibold'>+82 10-8029-6232</span>
						</p>
					</div>
					{/* Блок соцсетей */}
					<div className='flex items-center gap-6 mt-4'>
						<a
							href='https://www.instagram.com/kims_auto_trade_official/'
							target='_blank'
							rel='noopener noreferrer'
							className='text-3xl text-pink-500 hover:text-pink-600 transition-colors duration-300'
						>
							<FaInstagram />
						</a>
						<a
							href='https://www.tiktok.com/@kims_auto_trade'
							target='_blank'
							rel='noopener noreferrer'
							className='text-3xl text-black hover:text-gray-800 transition-colors duration-300'
						>
							<SiTiktok />
						</a>
						<a
							href='https://www.youtube.com/@Ramis_Safin97'
							target='_blank'
							rel='noopener noreferrer'
							className='text-3xl text-red-600 hover:text-red-700 transition-colors duration-300'
						>
							<FaYoutube />
						</a>
					</div>
				</div>
			</div>
		</div>
	)
}

export default CarDetails
