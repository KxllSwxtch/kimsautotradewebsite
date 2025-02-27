import PropTypes from 'prop-types'
import { motion } from 'framer-motion'

// Функция для форматирования цены
const formatPrice = (price) => {
	return `₩${price.toLocaleString()}`
}

// Функция для форматирования пробега
const formatMileage = (mileage) => {
	return `${mileage.toLocaleString()} км`
}

// Функция для получения первого изображения
const getFirstImage = (images) => {
	if (!images) return ''
	const imageList = images.split('#')
	return imageList[0]
}

const CarCard = ({ car }) => {
	const firstImage = getFirstImage(car.IMAGES)
	return (
		<motion.div
			className='bg-white rounded-lg shadow-lg overflow-hidden mx-4'
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.5 }}
		>
			{/* Изображение автомобиля */}
			<img
				src={firstImage}
				alt={car.MODEL_NAME}
				className='w-full h-48 object-cover'
			/>

			{/* Информация об автомобиле */}
			<div className='p-4'>
				<h3 className='text-lg font-semibold text-gray-800'>
					{car.MARKA_NAME} {car.MODEL_NAME}
				</h3>
				<p className='text-gray-600'>Дата регистрации: {car.MONTH}</p>
				<p className='text-gray-500'>
					Объём двигателя: {car.ENG_V.toLocaleString()} cc
				</p>
				<p className='text-gray-500'>Пробег: {formatMileage(car.MILEAGE)}</p>
				<p className='text-gray-800 font-semibold text-lg'>
					Цена в Корее: {formatPrice(car.FINISH)}
				</p>
			</div>

			{/* Кнопка "Подробнее" */}
			<div className='p-4 bg-gray-100 text-center'>
				<a
					href={`https://www.encar.com/dc/dc_cardetailview.do?carid=${car.LOT}`}
					target='_blank'
					rel='noopener noreferrer'
					className='inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300'
				>
					Подробнее
				</a>
			</div>
		</motion.div>
	)
}

// PropTypes для CarCard
CarCard.propTypes = {
	car: PropTypes.shape({
		ID: PropTypes.number.isRequired, // ID автомобиля
		MARKA_NAME: PropTypes.string.isRequired, // Название марки
		MODEL_NAME: PropTypes.string.isRequired, // Название модели
		MONTH: PropTypes.string.isRequired, // Дата регистрации (ГОД/МЕСЯЦ)
		ENG_V: PropTypes.number.isRequired, // Объём двигателя (cc)
		MILEAGE: PropTypes.number.isRequired, // Пробег (км)
		FINISH: PropTypes.number.isRequired, // Цена в Корее (KRW)
		IMAGES: PropTypes.string, // Строка с URL изображений
		LOT: PropTypes.number.isRequired, // Номер лота для ссылки
	}),
}

export default CarCard
