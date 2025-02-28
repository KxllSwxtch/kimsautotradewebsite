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
			className='p-4 rounded-[10px] bg-white shadow-md flex flex-col justify-between gap-5 transition-all duration-300 hover:shadow-lg'
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.5 }}
		>
			{/* Изображение автомобиля */}
			<div className='aspect-[16/9] rounded-[5px] overflow-hidden relative'>
				<img
					src={firstImage}
					alt={car.MODEL_NAME}
					className='absolute left-0 top-0 w-full h-full object-cover'
				/>
			</div>

			{/* Информация об автомобиле */}
			<div className='px-2'>
				<h3 className='text-xl font-bold text-gray-800 mb-2 text-center'>
					{car.MARKA_NAME} {car.MODEL_NAME}
				</h3>
				<div className='flex justify-between text-gray-500 text-sm border-b border-dotted border-gray-300 pb-1 mb-2'>
					<span>Год</span>
					<span>{car.MONTH} г.</span>
				</div>
				<div className='flex justify-between text-gray-500 text-sm border-b border-dotted border-gray-300 pb-1 mb-2'>
					<span>Пробег</span>
					<span>{formatMileage(car.MILEAGE)}</span>
				</div>
				<div className='flex justify-between text-gray-500 text-sm border-b border-dotted border-gray-300 pb-1 mb-2'>
					<span>Объём</span>
					<span>{car.ENG_V.toLocaleString()} см³</span>
				</div>
				<p className='text-black font-bold text-xl text-center mt-5'>
					{formatPrice(car.FINISH)}
				</p>
			</div>

			{/* Кнопка "Подробнее" */}
			<div className='p-4 text-center'>
				<a
					href={`https://www.encar.com/dc/dc_cardetailview.do?carid=${car.LOT}`}
					target='_blank'
					rel='noopener noreferrer'
					className='inline-block bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-sm transition duration-300'
				>
					Узнать подробнее
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
