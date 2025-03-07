import axios from 'axios'
import * as cheerio from 'cheerio'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import { FaInstagram, FaWhatsapp } from 'react-icons/fa'
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
}

const ExportCarDetails = () => {
	const [calculatedResultKZ, setCalculatedResultKZ] = useState(null)

	const [usdKrwRate, setUsdKrwRate] = useState(null)
	const [usdRubRate, setUsdRubRate] = useState(null)
	const [usdKztRate, setUsdKztRate] = useState(null)
	const [usdEurRate, setUsdEurRate] = useState(null)
	const [usdtRubRates, setUsdtRubRates] = useState(null)

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
					setUsdRubRate(usdRubRate)
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
			const url = `https://corsproxy.io/${encodeURIComponent(
				'https://www.bestchange.ru/action.php?lang=ru',
			)}`

			try {
				// Создаем FormData для запроса
				const formData = new URLSearchParams({
					action: 'getrates',
					page: 'rates',
					from: '91',
					to: '10',
					city: '1',
					type: '',
					give: '',
					get: '',
					commission: '0',
					light: '0',
					sort: 'from',
					range: 'asc',
					sortm: '0',
					tsid: '0',
				})

				// Отправляем POST-запрос
				const response = await axios.post(url, formData, {
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				})

				// Загружаем HTML в cheerio
				const $ = cheerio.load(response.data)

				// Парсим таблицу
				const parsedData = []
				$('tbody tr').each((index, element) => {
					const row = $(element)
					const fsText = row.find('td.bi div.fs').text().trim() // Получаем текст из <div class="fs">
					const formattedFsText = parseFloat(fsText.split(' ')[0])

					if (fsText) parsedData.push(formattedFsText)
				})

				// Сохраняем в состояние
				setUsdtRubRates(parsedData)
			} catch (error) {
				console.error('Ошибка при получении данных:', error)
			}
		}

		fetchUsdtRubRates()
	}, [])

	// Расчёт под ключ до РФ
	const handleCalculate = async () => {
		setLoadingCalc(true)
		setErrorCalc('')

		// Логика расчёта логистики
		let logisticsCostKrw = 2040000 // По умолчанию для всех санкционных авто
		let logisticsCostUsd = logisticsCostKrw / usdKrwRate
		let logisticsCostRub = logisticsCostUsd * usdRubRate

		if (car?.spec?.displacement > 2000)
			logisticsCostUsd = logisticsCostUsd + 200

		try {
			const response = await axios.post(
				'https://corsproxy.io/?key=28174bc7&url=https://calcus.ru/calculate/Customs',
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
					price: car?.advertisement?.price * 10000,
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

			const formattedTotal = parseInt(
				data.total.split(',')[0].split(' ').join(''),
			)
			const formattedTotal2 = parseInt(
				data.total2.split(',')[0].split(' ').join(''),
			)

			const totalWithLogisticsRub = formattedTotal + logisticsCostRub
			const totalCarWithLogisticsRub = formattedTotal2 + logisticsCostRub
			const totalCarWithLogisticsUsd = totalCarWithLogisticsRub / usdRubRate
			const totalCarWithLogisticsUsdt =
				totalCarWithLogisticsRub / meanUsdtRubRate

			setCalculatedResult({
				...data,
				logisticsCostRub,
				logisticsCostKrw,
				logisticsCostUsd,
				totalWithLogisticsRub,
				totalCarWithLogisticsRub,
				totalCarWithLogisticsUsd,
				totalCarWithLogisticsUsdt,
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

	const meanUsdtRubRate =
		usdtRubRates?.reduce((a, b) => a + b, 0) / usdtRubRates?.length + 2

	return (
		<div className='container mx-auto mt-25 md:mt-40 p-6 bg-white shadow-lg rounded-lg'>
			<h1 className='text-3xl font-bold text-center mb-6'>
				{car?.category?.manufacturerEnglishName}{' '}
				{car?.category?.modelGroupEnglishName} {car?.category?.gradeEnglishName}
			</h1>

			{/* Слайдер с фото */}
			{sortedPhotos.length > 0 && (
				<div className='max-w-2xl mx-auto mb-'>
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
					<strong>Дата регистрации:</strong> {formattedYearMonth}
				</p>
				<p className='text-gray-600'>
					<strong>Объём двигателя:</strong>{' '}
					{car?.spec?.displacement.toLocaleString()} см³
				</p>
				<p className='text-gray-600'>
					<strong>Пробег:</strong> {car?.spec?.mileage.toLocaleString()} км
				</p>
				<p className='text-gray-600'>
					<strong>Трансмиссия:</strong>{' '}
					{translations[car?.spec?.transmissionName]}
				</p>
				<p className='text-gray-600'>
					<strong>Тип топлива:</strong> {translations[car?.spec?.fuelName]}
				</p>
				<p className='text-gray-600'>
					<strong>Цвет:</strong> {colorTranslations[car?.spec?.colorName]}
				</p>
				<>
					<CarInspection car={car} />
				</>

				<p className='mt-10 mb-2'>
					<span>Текущие курсы:</span>
					<br />
					<span className='text-gray-500 text-sm'>
						&nbsp; USDT - KRW: ₩{Math.floor(usdKrwRate - 15).toLocaleString()}
					</span>
					<br />
					<span className='text-gray-500 text-sm'>
						&nbsp; USDT - RUB: {meanUsdtRubRate.toFixed(2)} ₽
					</span>
				</p>
				<p className='text-gray-800 font-bold text-lg'>
					<strong>
						Цена в Корее: <br />
					</strong>{' '}
					₩{carPriceKorea.toLocaleString()} | ${carPriceUsd.toLocaleString()} |{' '}
					{Math.round(carPriceRub).toLocaleString()} ₽
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
					<p className='text-gray-600'>
						Стоимость автомобиля: ₩{carPriceKorea.toLocaleString()} | $
						{carPriceUsd.toLocaleString()} |{' '}
						{Math.round(carPriceRub).toLocaleString()} ₽
					</p>
					<br />
					<p className='text-gray-600'>
						Расходы по Корее: ₩
						{calculatedResult?.logisticsCostKrw.toLocaleString()} | $
						{calculatedResult?.logisticsCostUsd.toLocaleString()} |{' '}
						{calculatedResult?.logisticsCostRub.toLocaleString()} ₽
					</p>
					<br />
					<br />
					<h3 className='font-bold text-xl'>Расходы во Владивостоке</h3>
					<p className='text-gray-600'>
						Таможенная пошлина: {calculatedResult?.tax?.toLocaleString()} ₽
					</p>
					<p className='text-gray-600'>
						Таможенный сбор: {calculatedResult?.sbor?.toLocaleString()} ₽
					</p>
					<p className='text-gray-600'>
						Утилизационный сбор: {calculatedResult?.util?.toLocaleString()} ₽
					</p>
					{/* <p className='text-gray-600'>
						Итого (таможенные платежи во Владивостоке):{' '}
						{calculatedResult?.total?.toLocaleString()} ₽
					</p> */}
					<p className='text-black font-medium text-lg mx-auto mt-10'>
						Стоимость автомобиля под ключ во Владивостоке: <br />$
						{Math.round(
							calculatedResult?.totalCarWithLogisticsUsd,
							2,
						).toLocaleString('en-US')}{' '}
						|{' '}
						{calculatedResult?.totalCarWithLogisticsRub?.toLocaleString(
							'ru-RU',
						)}{' '}
						₽
					</p>
					<p className='text-black font-medium text-lg mx-auto mt-10'>
						Стоимость автомобиля под ключ во Владивостоке (USDT): <br />$
						{Math.round(
							calculatedResult?.totalCarWithLogisticsUsdt,
						).toLocaleString('en-US')}{' '}
					</p>
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
