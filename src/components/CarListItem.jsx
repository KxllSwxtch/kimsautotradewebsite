import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

// Local imports
import { translateCarName } from '../utils'

const fuelTypeTranslation = {
	휘발유: 'Бензин',
	경유: 'Дизель',
	LPG: 'Газ (LPG)',
	'휘발유/LPG겸': 'Бензин/Газ (LPG)',
	'휘발유/CNG겸': 'Бензин/CNG',
	'휘발유 하이브리드': 'Гибрид (Бензин)',
	'LPG 하이브리드': 'Гибрид (Газ LPG)',
	'경유 하이브리드': 'Гибрид (Дизель)',
	전기: 'Электро',
	CNG: 'Газ (CNG)',
	수소: 'Водород',
}

const CarListItem = ({ car }) => {
	// Цена в вонах
	const priceWonNum = car.price.replace(/\D+/gm, '') * 10000
	const priceWonFormatted = priceWonNum.toLocaleString()

	const formattedCarMileage = parseInt(
		car.mileage.replace(/\D+/gm, ''),
	).toLocaleString()

	const carYear = car.year.split('-')[0]
	const carMonth = car.year.split('-')[1]
	const formattedCarDate = `${carMonth}/${carYear}`
	const carId = car.link.split('/').pop() // Получаем ID из URL
	const formattedTransmission =
		car.transmission === '오토' ? 'Автомат' : 'Механика'

	const formattedCarName = translateCarName(car?.name) || car?.name

	return (
		<div className='relative bg-avtoVitaBlack rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl duration-300 border border-gray-700/50'>
			{/* Блок изображения */}
			<Link
				to={`/car/${carId}`}
				target='_blank'
				rel='noopener noreferrer'
				className='block'
			>
				<div className='relative w-full h-60 overflow-hidden rounded-t-2xl'>
					<img
						src={car.image.replaceAll('"', '')}
						alt={car.name}
						className='w-full h-full object-cover'
					/>
					{/* Полупрозрачный градиент внизу для эффекта глубины */}
					<div className='absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/50 to-transparent'></div>
				</div>
			</Link>

			{/* Основная информация */}
			<div className='p-4 rounded-b-2xl'>
				{/* Марка и модель */}
				<h2 className='text-xl font-semibold text-black truncate'>
					{formattedCarName}
				</h2>

				{/* Основные характеристики */}
				<div className='flex flex-col text-sm text-black mt-2 space-y-1'>
					<span className='flex items-center gap-2'>
						📅 Дата регистрации: {formattedCarDate}
					</span>
					<span className='flex items-center gap-2'>
						🚗 Пробег: {formattedCarMileage} км
					</span>
					<span className='flex items-center gap-2'>
						⛽ {fuelTypeTranslation[car.fuelType] || car.fuelType}
					</span>
					<span>⚙️ {formattedTransmission}</span>
				</div>

				{/* Цена в разных валютах и кнопка */}
				<div className='mt-4'>
					<div className='mt-4 flex justify-between items-center'>
						<span className='text-lg font-bold text-black'>
							₩{priceWonFormatted}
						</span>
						<Link
							to={`/car/${carId}`}
							target='_blank'
							className='inline-block px-4 py-2 border border-yellow-500 text-yellow-500 text-sm font-semibold rounded transition duration-300 hover:bg-yellow-500 hover:text-black'
						>
							Подробнее →
						</Link>
					</div>
				</div>
			</div>

			{/* Год автомобиля (выведен в углу) */}
			<div className='absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded'>
				{car.year}
			</div>
		</div>
	)
}

CarListItem.propTypes = {
	car: PropTypes.shape({
		link: PropTypes.string.isRequired,
		image: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		year: PropTypes.string.isRequired,
		mileage: PropTypes.string.isRequired,
		fuelType: PropTypes.string.isRequired,
		transmission: PropTypes.string.isRequired,
		price: PropTypes.string.isRequired,
	}).isRequired,
}

export default CarListItem
