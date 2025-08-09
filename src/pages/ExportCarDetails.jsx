import axios from 'axios'
import * as cheerio from 'cheerio'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import { Thumbs } from 'swiper/modules'
import { FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { motion } from 'framer-motion'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import {
	Loader,
	KazakhstanCalculator,
	KyrgyzstanCalculator,
	CarInspection,
} from '../components'

const translations = {
	price: 'Цена в Корее (₩)',
	연식: 'Год выпуска',
	최초등록일: 'Дата первой регистрации',
	연료: 'Тип топлива',
	휘발유: 'Бензин',
	가솔린: 'Бензин',
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
	보험사보증: 'Гарантия страховой компании',
	양호: 'Хорошее состояние',
}

const colorTranslations = {
	흰색: 'Белый',
	검정색: 'Чёрный',
	회색: 'Серый',
	파란색: 'Синий',
	빨간색: 'Красный',
	은색: 'Серебристый',
	녹색: 'Зелёный',
	노란색: 'Жёлтый',
	주황색: 'Оранжевый',
	보라색: 'Фиолетовый',
	갈색: 'Коричневый',
	베이지색: 'Бежевый',
	분홍색: 'Розовый',
	금색: 'Золотой',
	청록색: 'Бирюзовый',
	기타: 'Другой',
	쥐색: 'Тёмно-серый',
}

const formatDate = (rawDate) => {
	if (!rawDate || rawDate.length !== 8) return rawDate
	const year = rawDate.slice(0, 4)
	const month = rawDate.slice(4, 6)
	const day = rawDate.slice(6, 8)
	return `${day}.${month}.${year}`
}

const ExportCarDetails = () => {
	const [vehicleId, setVehicleId] = useState(null)
	const [inspectionData, setInspectionData] = useState(null)

	const [calculatedResultKZ, setCalculatedResultKZ] = useState(null)
	const [thumbsSwiper, setThumbsSwiper] = useState(null)

	const [usdKrwRate, setUsdKrwRate] = useState(null)
	const [usdRubRate, setUsdRubRate] = useState(null)
	const [usdKztRate, setUsdKztRate] = useState(null)
	const [usdEurRate, setUsdEurRate] = useState(null)
	const [usdtRubRates, setUsdtRubRates] = useState(90.0) // Default value to prevent NaN
	const [usdtKrwRate, setUsdtKrwRate] = useState(1430) // Default value to prevent NaN

	const [car, setCar] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [selectedCountry, setSelectedCountry] = useState(null)
	const [loadingCalc, setLoadingCalc] = useState(false)
	const [errorCalc, setErrorCalc] = useState('')
	const [calculatedResult, setCalculatedResult] = useState(null)

	const { carId } = useParams()

	useEffect(() => {
		const fetchCar = async () => {
			try {
				setLoading(true)
				const response = await axios.get(
					`https://api.encar.com/v1/readside/vehicle/${carId}`,
				)

				setCar(response.data)
				setVehicleId(response.data?.vehicleId)
			} catch (err) {
				setError('Ошибка при загрузке данных')
				console.error(err)
			} finally {
				setLoading(false)
			}
		}

		if (carId) fetchCar()
	}, [carId])

	useEffect(() => {
		const fetchInspectionData = async () => {
			try {
				const response = await axios.get(
					`https://api.encar.com/v1/readside/inspection/vehicle/${vehicleId}`,
				)
				setInspectionData(response.data)
			} catch (error) {
				console.error('Ошибка при загрузке отчёта осмотра:', error)
			}
		}

		if (carId) fetchInspectionData()
	}, [carId, vehicleId])

	useEffect(() => {
		const fetchUsdKrwRate = async () => {
			try {
				const response = await axios.get(
					'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
				)

				if (response.status === 200) {
					const jsonData = response.data
					const rate = jsonData['usd']['krw']
					const usdRubRate = jsonData['usd']['rub']
					const usdKztRate = jsonData['usd']['kzt']
					const usdEurRate = jsonData['usd']['eur']

					setUsdKrwRate(rate)
					// Добавляем 6 к USD-RUB курсу как в Python
					setUsdRubRate(usdRubRate + 6)
					setUsdKztRate(usdKztRate + 3)
					setUsdEurRate(usdEurRate)
				}
			} catch (e) {
				console.error(e)
			}
		}

		fetchUsdKrwRate()
	}, [])

	useEffect(() => {
		const fetchUsdtRubRates = async () => {
			try {
				const response = await axios.get(
					'https://api.coinbase.com/v2/prices/USDT-RUB/spot',
				)

				if (response.data && response.data.data && response.data.data.amount) {
					// Получаем курс из ответа API
					const rate = parseFloat(response.data.data.amount)

					// Форматируем до двух знаков после запятой
					const formattedRate = parseFloat(rate.toFixed(2))

					// Добавляем 3.5% к курсу (как в Python)
					const rateWithMargin = formattedRate + formattedRate * 0.035

					// Сохраняем в состояние
					setUsdtRubRates(rateWithMargin)
				}
			} catch (error) {
				console.error('Ошибка при получении курса USDT-RUB:', error)
				// Fallback value как в Python
				setUsdtRubRates(90.0)
			}
		}

		fetchUsdtRubRates()
	}, [])

	useEffect(() => {
		const fetchUsdtKrwRate = async () => {
			try {
				const response = await axios.get(
					'https://api.bithumb.com/v1/ticker?markets=KRW-USDT',
				)

				if (response.data && response.data[0] && response.data[0].trade_price) {
					// Получаем курс из ответа API и вычитаем 40 пунктов (как в Python)
					const rawRate = parseFloat(response.data[0].trade_price)
					const adjustedRate = rawRate - 40

					// Форматируем до целого числа
					const formattedRate = Math.round(adjustedRate)

					// Сохраняем в состояние
					setUsdtKrwRate(formattedRate)
				} else {
					// Fallback to Coinbase API как в Python
					fetchUsdtKrwRateFallback()
				}
			} catch (error) {
				console.error('Ошибка при получении курса USDT-KRW с Bithumb:', error)
				// Fallback to Coinbase API как в Python
				fetchUsdtKrwRateFallback()
			}
		}

		const fetchUsdtKrwRateFallback = async () => {
			try {
				const response = await axios.get(
					'https://api.coinbase.com/v2/exchange-rates?currency=USDT'
				)
				if (response.data && response.data.data && response.data.data.rates) {
					const krwRate = parseFloat(response.data.data.rates.KRW)
					// Добавляем 4 как в Python fallback
					setUsdtKrwRate(Math.round(krwRate + 4))
				}
			} catch (error) {
				console.error('Ошибка при получении курса USDT-KRW с Coinbase:', error)
			}
		}

		fetchUsdtKrwRate()
	}, [])

	// Расчёт под ключ до РФ
	const handleCalculate = async () => {
		setLoadingCalc(true)
		setErrorCalc('')

		// Ensure exchange rates are loaded
		if (!usdtKrwRate || !usdtRubRates || !usdKrwRate) {
			console.log('Waiting for exchange rates to load...')
			setErrorCalc('Загрузка курсов валют...')
			setLoadingCalc(false)
			return
		}

		// Логика расчёта как в Python (excise = 2040000)
		const excise = 2040000 // Фиксированные расходы по Корее (паром, автовоз, документы)
		const priceKrw = car?.advertisement?.price * 10000
		
		// Расчеты по Корее
		let totalKoreaCostsKrw = priceKrw + excise
		
		// Добавляем $200 USD если объем двигателя > 2000cc
		if (car?.spec?.displacement > 2000) {
			totalKoreaCostsKrw = totalKoreaCostsKrw + (200 * usdKrwRate)
		}
		
		// Конвертируем в USDT
		const totalKoreaCostsUsdt = totalKoreaCostsKrw / (usdtKrwRate || 1430)
		const totalKoreaCostsRub = totalKoreaCostsUsdt * (usdtRubRates || 90.0)

		try {
			const response = await axios.post(
				'https://calcus.ru/calculate/Customs',
				new URLSearchParams({
					owner: 1,
					age: calculateAge(
						car?.category?.formYear,
						car?.category?.yearMonth?.substring(4, 6),
					),
					engine: car?.spec?.fuelName === '가솔린' ? 1 : 2,
					power: 1,
					power_unit: 1,
					value: car?.spec?.displacement,
					price: priceKrw,
					curr: 'KRW',
				}).toString(),
				{
					withCredentials: false,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				},
			)

			if (!response.status === 200) throw new Error('Ошибка при расчёте')

			const data = await response.data

			// Debug: log the API response to understand the format
			console.log('Calcus.ru API response:', data)

			// Парсим результаты от calcus.ru
			const cleanNumber = (str) => {
				if (!str) return 0
				
				// If it's already a number, return it
				if (typeof str === 'number') return Math.round(str)
				
				// Convert to string
				let cleaned = str.toString()
				
				// Log original value for debugging
				console.log('Cleaning value:', cleaned)
				
				// Check if it contains 'руб' or similar
				if (cleaned.includes('руб')) {
					// Extract number before 'руб'
					cleaned = cleaned.split('руб')[0]
				}
				
				// Remove all non-numeric except dots, commas, and spaces
				cleaned = cleaned.replace(/[^\d.,\s]/g, '')
				// Remove spaces (Russian thousands separator)
				cleaned = cleaned.replace(/\s/g, '')
				// Replace comma with dot for decimal
				cleaned = cleaned.replace(',', '.')
				// Parse and round
				const result = Math.round(parseFloat(cleaned) || 0)
				
				// Validation: customs shouldn't be more than 10 million rubles for normal cars
				if (result > 10000000) {
					console.warn(`Warning: parsed value ${result} seems too high for input: ${str}`)
					// Try alternative parsing - maybe it's in kopecks?
					const alternative = result / 100
					if (alternative < 10000000) {
						console.log(`Using alternative value: ${alternative} (divided by 100)`)
						return Math.round(alternative)
					}
				}
				
				return result
			}

			const customsDuty = cleanNumber(data.tax) // Таможенная пошлина
			const customsFee = cleanNumber(data.sbor) // Таможенный сбор
			const recyclingFee = cleanNumber(data.util) // Утилизационный сбор
			
			console.log('Parsed customs values:', {
				customsDuty,
				customsFee,
				recyclingFee,
				total: customsDuty + customsFee + recyclingFee
			})

			// Расходы по России как в Python
			const brokerFee = 100000 // Услуги брокера
			const carrierFee = 250000 // Автовоз
			
			const totalRussiaCosts = customsDuty + customsFee + recyclingFee + brokerFee + carrierFee
			const totalRussiaCostsUsdt = totalRussiaCosts / (usdtRubRates || 90.0)

			// Итоговые расчеты
			const totalCostRub = totalKoreaCostsRub + totalRussiaCosts
			const totalCostUsdt = totalKoreaCostsUsdt + totalRussiaCostsUsdt
			const totalCostUsdtRub = totalCostUsdt * (usdtRubRates || 90.0)

			setCalculatedResult({
				...data,
				// Korea costs
				excise,
				totalKoreaCostsKrw,
				totalKoreaCostsUsdt,
				totalKoreaCostsRub,
				// Russia costs
				customsDuty,
				customsFee,
				recyclingFee,
				brokerFee,
				carrierFee,
				totalRussiaCosts,
				totalRussiaCostsUsdt,
				// Total
				totalCostRub,
				totalCostUsdt,
				totalCostUsdtRub,
			})
		} catch (err) {
			setErrorCalc(err.message)
		} finally {
			setLoadingCalc(false)
		}
	}

	const calculateAge = (year, month) => {
		const currentDate = new Date()
		const carDate = new Date(year, month - 1, 1)

		const ageInMonths =
			(currentDate.getFullYear() - carDate.getFullYear()) * 12 +
			(currentDate.getMonth() - carDate.getMonth())

		if (ageInMonths < 36) {
			return '0-3'
		} else if (ageInMonths < 60) {
			return '3-5'
		} else if (ageInMonths < 84) {
			return '5-7'
		} else {
			return '7-0'
		}
	}

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

	const carPriceKorea = car?.advertisement?.price * 10000
	const carPriceUsd = Math.round(
		(car?.advertisement?.price * 10000) / usdKrwRate,
	)
	const carPriceRub = carPriceUsd * usdRubRate

	return (
		<div className='container mx-auto mt-30 p-6 bg-white shadow-lg rounded-lg'>
			<h1 className='text-3xl font-bold text-center mb-6'>
				{car?.category?.manufacturerEnglishName}{' '}
				{car?.category?.modelGroupEnglishName} {car?.category?.gradeEnglishName}
			</h1>

			<div className='md:flex md:gap-8'>
				{/* Слайдер с фото */}
				<div className='max-w-3xl mx-auto mb-10 md:w-1/2'>
					{sortedPhotos.length > 0 && (
						<div className='max-w-3xl mx-auto mb-10'>
							<Swiper
								modules={[Navigation, Pagination, Thumbs]}
								spaceBetween={10}
								slidesPerView={1}
								navigation
								pagination={{ clickable: true }}
								thumbs={{ swiper: thumbsSwiper }}
								className='rounded-lg shadow-lg mb-4'
							>
								{uniquePhotos.map((photo, index) => (
									<SwiperSlide key={index}>
										<img
											src={getPhotoUrl(photo.path)}
											alt={`Car image ${index + 1}`}
											className='w-full h-auto rounded-lg object-cover max-h-[500px]'
										/>
									</SwiperSlide>
								))}
							</Swiper>

							{/* Превью */}
							<Swiper
								onSwiper={setThumbsSwiper}
								spaceBetween={10}
								slidesPerView={Math.min(uniquePhotos.length, 5)}
								freeMode={true}
								watchSlidesProgress={true}
								className='cursor-pointer'
							>
								{uniquePhotos.map((photo, index) => (
									<SwiperSlide key={index}>
										<img
											src={getPhotoUrl(photo.path)}
											alt={`Thumbnail ${index + 1}`}
											className='w-full h-[70px] object-cover rounded border transition border-gray-300 swiper-slide-thumb-active:border-blue-500'
										/>
									</SwiperSlide>
								))}
							</Swiper>
						</div>
					)}
				</div>

				{/* Данные об автомобиле */}
				<motion.div
					initial='hidden'
					whileInView='visible'
					variants={{
						hidden: { opacity: 0, y: 30 },
						visible: {
							opacity: 1,
							y: 0,
							transition: {
								staggerChildren: 0.15,
								when: 'beforeChildren',
							},
						},
					}}
					viewport={{ once: true, amount: 0.2 }}
					className='mt-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl rounded-xl md:mt-0 md:w-1/2 border border-gray-300'
				>
					<h2 className='text-2xl font-bold text-gray-900 mb-6 border-b pb-2 border-gray-300'>
						Характеристики автомобиля
					</h2>
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800 text-sm'>
						{[
							['Дата регистрации', formattedYearMonth],
							[
								'Объём двигателя',
								`${car?.spec?.displacement.toLocaleString()} см³`,
							],
							['Пробег', `${car?.spec?.mileage.toLocaleString()} км`],
							['Трансмиссия', translations[car?.spec?.transmissionName]],
							['Тип топлива', translations[car?.spec?.fuelName]],
							['Цвет', colorTranslations[car?.spec?.colorName]],
						].map(([label, value], idx) => (
							<motion.div
								key={idx}
								variants={{
									hidden: { opacity: 0, y: 20 },
									visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
								}}
								className='flex items-start gap-2'
							>
								<div className='mt-1 w-2 h-2 bg-blue-500 rounded-full'></div>
								<p>
									<span className='font-medium'>{label}:</span> {value}
								</p>
							</motion.div>
						))}
					</div>

					<div className='mt-6 border-t pt-4 border-gray-300'>
						<motion.h3
							variants={{
								hidden: { opacity: 0, y: 20 },
								visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
							}}
							className='text-md font-semibold text-gray-900 mb-1'
						>
							Текущие курсы (Уточняйте у +82 10-8029-6232 - Рамис)
						</motion.h3>
						<motion.p
							variants={{
								hidden: { opacity: 0, y: 20 },
								visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
							}}
							className='text-sm text-gray-600'
						>
							USDT - KRW:{' '}
							<span className='font-medium'>
								₩{usdtKrwRate ? usdtKrwRate.toLocaleString() : '--'}
							</span>
						</motion.p>
						<motion.p
							variants={{
								hidden: { opacity: 0, y: 20 },
								visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
							}}
							className='text-sm text-gray-600'
						>
							USDT - RUB: <span className='font-medium'>{usdtRubRates} ₽</span>{' '}
						</motion.p>
					</div>

					<motion.div
						initial='hidden'
						whileInView='visible'
						variants={{
							hidden: { opacity: 0, y: 30 },
							visible: {
								opacity: 1,
								y: 0,
								transition: {
									staggerChildren: 0.15,
									when: 'beforeChildren',
								},
							},
						}}
						viewport={{ once: true, amount: 0.2 }}
						className='mt-6 border-t pt-4 border-gray-300'
					>
						<motion.h3
							variants={{
								hidden: { opacity: 0, y: 20 },
								visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
							}}
							className='text-md font-semibold text-gray-900 mb-1'
						>
							Цена в Корее
						</motion.h3>
						<motion.p
							variants={{
								hidden: { opacity: 0, y: 20 },
								visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
							}}
							className='text-gray-800 font-bold text-lg'
						>
							₩{carPriceKorea.toLocaleString()} | $
							{carPriceUsd.toLocaleString()} |{' '}
							{Math.round(carPriceRub).toLocaleString()} ₽
						</motion.p>
					</motion.div>
				</motion.div>
			</div>

			<div>
				<CarInspection car={car} />
			</div>

			{/* Инспекционный отчёт Encar */}
			{/* {carId && (
				<div className='mt-10'>
					<h2 className='text-2xl font-bold mb-4 text-center'>
						Инспекционный отчёт
					</h2>
					<div className='w-full h-300 md:h-200 aspect-[16/9] rounded-lg overflow-hidden shadow-lg border border-gray-300'>
						<iframe
							src={`https://fem.encar.com/cars/report/inspect/${carId}`}
							title='Encar Report'
							className='w-full h-full'
							allowFullScreen
						/>
					</div>
				</div>
			)} */}

			{inspectionData && (
				<motion.div
					initial='hidden'
					whileInView='visible'
					variants={{
						hidden: { opacity: 0, y: 40 },
						visible: {
							opacity: 1,
							y: 0,
							transition: {
								staggerChildren: 0.15,
								when: 'beforeChildren',
							},
						},
					}}
					viewport={{ once: true, amount: 0.2 }}
					className='mt-10'
				>
					<h2 className='text-3xl font-bold mb-6 text-center text-gray-800'>
						🔍 Диагностика автомобиля
					</h2>
					<div className='bg-white p-6 rounded-xl shadow-lg border border-gray-200'>
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800'>
							{[
								['VIN', inspectionData?.master?.detail?.vin],
								[
									'Пробег',
									`${inspectionData?.master?.detail?.mileage.toLocaleString()} км`,
								],
								[
									'Дата 1-й регистрации',
									formatDate(
										inspectionData?.master?.detail?.firstRegistrationDate,
									),
								],
								[
									'Тип коробки передач',
									translations[
										inspectionData?.master?.detail?.transmissionType?.title
									] || inspectionData?.master?.detail?.transmissionType?.title,
								],
								[
									'Гарантийное покрытие',
									translations[
										inspectionData?.master?.detail?.guarantyType?.title
									] || inspectionData?.master?.detail?.guarantyType?.title,
								],
								[
									'Состояние автомобиля',
									translations[
										inspectionData?.master?.detail?.carStateType?.title
									] || inspectionData?.master?.detail?.carStateType?.title,
								],
								[
									'Проверка двигателя',
									inspectionData?.master?.detail?.engineCheck === 'Y'
										? 'Пройдена'
										: 'Нет',
								],
								[
									'Проверка коробки передач',
									inspectionData?.master?.detail?.trnsCheck === 'Y'
										? 'Пройдена'
										: 'Нет',
								],
								[
									'Участие в ДТП',
									inspectionData?.master?.accdient ? 'Да' : 'Нет',
								],
								[
									'Тюнинг',
									inspectionData?.master?.detail?.tuning ? 'Да' : 'Нет',
								],
								['Ремонт', inspectionData?.master?.simpleRepair ? 'Да' : 'Нет'],
								[
									'Наличие отзывов',
									inspectionData?.master?.detail?.recall ? 'Да' : 'Нет',
								],
								['Модельный год', inspectionData?.master?.detail?.modelYear],
								[
									'Дата отчёта',
									formatDate(inspectionData?.master?.detail?.issueDate),
								],
								['Модель двигателя', inspectionData?.master?.detail?.motorType],
								['Версия отчёта', inspectionData?.master?.detail?.version],
							].map(([label, value], idx) => (
								<motion.div
									key={idx}
									variants={{
										hidden: { opacity: 0, y: 20 },
										visible: {
											opacity: 1,
											y: 0,
											transition: { duration: 0.4 },
										},
									}}
									className='flex items-start gap-2'
								>
									<div className='mt-1 w-2 h-2 bg-blue-500 rounded-full'></div>
									<p>
										<span className='font-medium'>{label}:</span> {value}
									</p>
								</motion.div>
							))}
						</div>

						<a
							href={`https://fem.encar.com/cars/report/inspect/${vehicleId}`}
							target='_blank'
							rel='noopener noreferrer'
							className='mt-8 inline-block bg-black text-white text-sm px-6 py-3 rounded-md hover:bg-gray-800 transition duration-300 text-center'
						>
							Посмотреть полный технический отчёт
						</a>
					</div>
				</motion.div>
			)}

			{/* Контакты менеджеров */}
			<div className='mt-6 p-5 bg-white shadow-md rounded-lg text-center flex justify-center gap-10 md:gap-20 flex-col md:flex-row'>
				<div>
					<h2 className='text-xl font-semibold mb-4'>
						Для покупки, продажи и обмена авто в Корее
					</h2>
					<p className='text-gray-700'>
						<strong>Артём:</strong>{' '}
						<a
							href='tel:+821080296232'
							className='text-blue-600 hover:underline'
						>
							+82 10-8282-8062
						</a>
					</p>
					<p className='text-gray-700'>
						<a
							target='_blank'
							href='https://wa.me/821082828062'
							className='text-blue-600 hover:underline flex justify-center items-center'
						>
							<FaWhatsapp className='text-green-600 text-xl mr-1' />
							+82 10-8282-8062
						</a>
					</p>
					<p className='text-gray-700'>
						<a
							target='_blank'
							href='https://www.instagram.com/auto_korea_cheongju'
							className='text-blue-600 hover:underline flex justify-center items-center'
						>
							<FaInstagram className='text-pink-600 text-xl mr-1' />
							@auto_korea_cheongju
						</a>
					</p>
				</div>

				<div>
					<h2 className='text-xl font-semibold mb-4'>
						Для заказа и отправки авто из Южной Кореи
					</h2>
					<p className='text-gray-700'>
						<strong>Рамис:</strong>{' '}
						<a
							href='tel:+821080296232'
							className='text-blue-600 hover:underline'
						>
							+82 10-8029-6232
						</a>
					</p>
					<p className='text-gray-700'>
						<a
							target='_blank'
							href='https://wa.me/821080296232'
							className='text-blue-600 hover:underline flex justify-center items-center'
						>
							<FaWhatsapp className='text-green-600 text-xl mr-1' />
							+82 10-8029-6232
						</a>
					</p>
					<p className='text-gray-700'>
						<a
							target='_blank'
							href='https://www.instagram.com/ramis_auto_korea/'
							className='text-blue-600 hover:underline flex justify-center items-center'
						>
							<FaInstagram className='text-pink-600 text-xl mr-1' />
							@ramis_auto_korea
						</a>
					</p>
				</div>
			</div>

			{/* Выбор страны для расчёта */}
			<div className='mt-6 p-6 bg-white shadow-lg rounded-lg text-center border border-gray-200'>
				<h2 className='text-2xl font-semibold mb-6 text-gray-800'>
					Рассчитать стоимость до:
				</h2>
				<div className='flex justify-center gap-6 flex-wrap'>
					<button
						onClick={() => setSelectedCountry('russia')}
						className={`px-6 py-3 rounded-lg shadow-md text-lg font-semibold transition duration-300 border-2 cursor-pointer
				${
					selectedCountry === 'russia'
						? 'bg-blue-700 text-white border-blue-700'
						: 'bg-white text-blue-700 border-blue-500 hover:bg-blue-100'
				}`}
					>
						🇷🇺 Россия
					</button>
					<button
						onClick={() => setSelectedCountry('kazakhstan')}
						className={`px-6 py-3 rounded-lg shadow-md text-lg font-semibold transition duration-300 border-2 cursor-pointer
				${
					selectedCountry === 'kazakhstan'
						? 'bg-green-700 text-white border-green-700'
						: 'bg-white text-green-700 border-green-500 hover:bg-green-100'
				}`}
					>
						🇰🇿 Казахстан
					</button>
					<button
						onClick={() => setSelectedCountry('kyrgyzstan')}
						className={`px-6 py-3 rounded-lg shadow-md text-lg font-semibold transition duration-300 border-2 cursor-pointer
				${
					selectedCountry === 'kyrgyzstan'
						? 'bg-yellow-600 text-white border-yellow-600'
						: 'bg-white text-yellow-700 border-yellow-500 hover:bg-yellow-100'
				}`}
					>
						🇰🇬 Кыргызстан
					</button>
				</div>
			</div>

			{/* РФ */}
			{selectedCountry === 'russia' && (
				<div className='mt-8 flex justify-center'>
					<button
						className={`cursor-pointer relative py-3 px-10 rounded-lg shadow-xl text-lg font-semibold transition-all duration-300 border-2 flex items-center gap-2
			${
				loadingCalc
					? 'bg-gray-600 border-gray-700 text-gray-300 opacity-60 cursor-not-allowed'
					: 'bg-gradient-to-r from-red-600 to-red-700 border-red-800 text-white hover:from-red-700 hover:to-red-800 hover:border-red-900 hover:scale-105'
			}`}
						onClick={handleCalculate}
						disabled={loadingCalc}
					>
						{loadingCalc ? (
							<>
								<span className='animate-spin border-t-2 border-white border-solid rounded-full w-5 h-5'></span>
								<span>Расчёт...</span>
							</>
						) : (
							<>
								📊 <span>Рассчитать стоимость</span>
							</>
						)}
					</button>
				</div>
			)}

			{calculatedResult && selectedCountry === 'russia' && (
				<div className='mt-6 p-5 bg-gray-50 shadow-md rounded-lg text-center'>
					<h2 className='text-xl font-semibold mb-4'>Расчёт для России</h2>
					
					<h3 className='font-bold text-lg mt-4 mb-2'>Корея:</h3>
					<p className='text-gray-600'>
						Стоимость автомобиля: ₩{carPriceKorea.toLocaleString()}
					</p>
					<p className='text-gray-600'>
						Расходы по Корее (паром, автовоз, документы): ₩{calculatedResult?.excise?.toLocaleString()}
					</p>
					<p className='text-gray-600 font-medium'>
						Итого: ₩{calculatedResult?.totalKoreaCostsKrw?.toLocaleString()} | 
						${isFinite(calculatedResult?.totalKoreaCostsUsdt) ? Math.round(calculatedResult?.totalKoreaCostsUsdt).toLocaleString() : '---'} USDT
						(курс: 1 USDT = {usdtKrwRate?.toLocaleString()} ₩) | 
						{isFinite(calculatedResult?.totalKoreaCostsRub) ? Math.round(calculatedResult?.totalKoreaCostsRub).toLocaleString() : '---'} ₽
					</p>
					
					<h3 className='font-bold text-lg mt-4 mb-2'>Расходы по России:</h3>
					<p className='text-gray-600'>
						Таможенные платежи: {Math.round(calculatedResult?.customsDuty + calculatedResult?.customsFee + calculatedResult?.recyclingFee).toLocaleString()} ₽
					</p>
					<p className='text-gray-600'>
						Услуги Брокера: {calculatedResult?.brokerFee?.toLocaleString()} ₽ (если клиент оплачивает таможенные платежи)
					</p>
					<p className='text-gray-600'>
						Автовоз: {calculatedResult?.carrierFee?.toLocaleString()} ₽ (в зависимости от региона и вида автовоза, фуры)
					</p>
					<p className='text-gray-600 font-medium'>
						Итого: {calculatedResult?.totalRussiaCosts?.toLocaleString()} ₽
					</p>
					
					<div className='mt-6 pt-4 border-t border-gray-300'>
						<p className='text-black font-bold text-xl'>
							Итого стоимость автомобиля под ключ (USDT):
							<br />(курс: 1 USDT = {usdtRubRates?.toFixed(2)} ₽)
						</p>
						<p className='text-2xl font-bold text-blue-600 mt-2'>
							${isFinite(calculatedResult?.totalCostUsdt) ? Math.round(calculatedResult?.totalCostUsdt).toLocaleString('en-US') : '---'} | 
							{isFinite(calculatedResult?.totalCostUsdtRub) ? Math.round(calculatedResult?.totalCostUsdtRub).toLocaleString('ru-RU') : '---'} ₽
						</p>
					</div>
				</div>
			)}

			{/* КЗ */}
			{selectedCountry === 'kazakhstan' && (
				<KazakhstanCalculator
					usdKztRate={usdKztRate}
					usdKrwRate={usdKrwRate}
					carPriceKRW={carPriceKorea}
				/>
			)}

			{calculatedResultKZ && selectedCountry === 'kazakhstan' && (
				<div className='mt-6 p-5 bg-gray-50 shadow-md rounded-lg text-center'>
					<h2 className='text-xl font-semibold mb-4'>Расчёт для Казахстана</h2>
					<p className='text-gray-600'>
						Стоимость авто:{' '}
						{Math.round(calculatedResultKZ?.carPriceKZT).toLocaleString()} ₸
					</p>
					<p className='text-gray-600'>
						Таможенная пошлина (15%):{' '}
						{Math.round(calculatedResultKZ?.vatKZT).toLocaleString()} ₸
					</p>
					<p className='text-gray-600'>
						НДС (12%): {Math.round(calculatedResultKZ?.vatKZT).toLocaleString()}{' '}
						₸
					</p>
					<p className='text-black mt-3 font-medium text-lg w-1/2 mx-auto'>
						<strong>
							Итого:{' '}
							{Math.round(calculatedResultKZ?.totalCostKZT).toLocaleString()} ₸
						</strong>
					</p>
				</div>
			)}

			{selectedCountry === 'kyrgyzstan' && (
				<KyrgyzstanCalculator usdEurRate={usdEurRate} />
			)}

			{errorCalc && <p className='text-center text-red-500'>{errorCalc}</p>}
		</div>
	)
}

export default ExportCarDetails
