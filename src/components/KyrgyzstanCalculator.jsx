import { useState, useEffect } from 'react'

const KyrgyzstanCalculator = ({ usdEurRate, usdKgsRate, krwKgsRate, carData }) => {
	const [fuelType, setFuelType] = useState('petrol')
	const [year, setYear] = useState(new Date().getFullYear())
	const [engineVolume, setEngineVolume] = useState('')
	const [carPrice, setCarPrice] = useState('')
	const [carType, setCarType] = useState('sedan')
	const [result, setResult] = useState(null)

	// Use passed rates or defaults
	const USD_KGS_RATE = usdKgsRate || 85 // Default USD to KGS rate
	const KRW_KGS_RATE = krwKgsRate || 0.065 // Default KRW to KGS rate
	const NDS = 12 // НДС процент

	// Initialize with car data if available
	useEffect(() => {
		if (carData) {
			if (carData.engineVolume) setEngineVolume(carData.engineVolume)
			if (carData.year) setYear(carData.year)
			if (carData.priceUSD) setCarPrice(carData.priceUSD)
			if (carData.fuelType) {
				// Map fuel types from car data to calculator options
				const fuelMap = {
					'가솔린': 'petrol',
					'경유': 'diesel',
					'하이브리드': 'gibrid',
					'전기': 'electro'
				}
				setFuelType(fuelMap[carData.fuelType] || 'petrol')
			}
		}
	}, [carData])

	// Calculate customs fee based on engine volume and car age (matching Python logic)
	const calculateCustomsFee = (engineVol, carYear) => {
		const carAge = new Date().getFullYear() - carYear
		
		if (carAge < 3) {
			// До 3 лет - процент от стоимости
			return 0 // Will be calculated as percentage
		} else if (carAge >= 3 && carAge < 5) {
			// От 3 до 5 лет
			if (engineVol <= 1000) return 1.5
			else if (engineVol <= 1500) return 1.7
			else if (engineVol <= 1800) return 2.5
			else if (engineVol <= 2300) return 2.7
			else if (engineVol <= 3000) return 3.0
			else return 3.6
		} else if (carAge >= 5 && carAge < 7) {
			// От 5 до 7 лет
			if (engineVol <= 1000) return 3.0
			else if (engineVol <= 1500) return 3.2
			else if (engineVol <= 1800) return 3.5
			else if (engineVol <= 2300) return 4.8
			else if (engineVol <= 3000) return 5.0
			else return 5.7
		} else {
			// Старше 7 лет
			if (engineVol <= 1000) return 3.0
			else if (engineVol <= 1500) return 3.5
			else if (engineVol <= 1800) return 3.7
			else if (engineVol <= 2300) return 5.0
			else if (engineVol <= 3000) return 5.3
			else return 6.0
		}
	}

	const calculateTurnkey = () => {
		if (!carPrice || !engineVolume) {
			alert('Введите цену и объем двигателя!')
			return
		}

		const carAge = new Date().getFullYear() - year
		const priceUSD = parseFloat(carPrice)
		const engineVol = parseInt(engineVolume)

		// Таможенная пошлина
		let customsFeeUSD = 0
		if (carAge < 3) {
			// До 3 лет - 54% от стоимости минимум 5400 USD
			customsFeeUSD = Math.max(priceUSD * 0.54, 5400)
		} else {
			// Старше 3 лет - по объему двигателя
			const ratePerCC = calculateCustomsFee(engineVol, year)
			customsFeeUSD = engineVol * ratePerCC
		}

		const customsFeeKGS = customsFeeUSD * USD_KGS_RATE

		// Брокерские услуги (как в Python)
		const brokerFee = 100000 // KGS

		// Доставка в зависимости от типа авто (как в Python)
		let deliveryFeeUSD = 0
		if (carType === 'sedan') {
			deliveryFeeUSD = 2400
		} else if (carType === 'crossover') {
			deliveryFeeUSD = 2500
		} else {
			deliveryFeeUSD = 2600
		}
		const deliveryFeeKGS = deliveryFeeUSD * USD_KGS_RATE

		// Услуги KimsAutoTrade (440000 KRW как в Python)
		const kimsServiceKGS = 440000 * KRW_KGS_RATE

		// Конвертируем цену авто в KGS
		const carPriceKGS = priceUSD * USD_KGS_RATE

		// Итоговая стоимость
		const totalKGS = carPriceKGS + customsFeeKGS + deliveryFeeKGS + kimsServiceKGS + brokerFee
		const totalUSDT = totalKGS / USD_KGS_RATE

		setResult({
			carPriceKGS,
			customsFeeKGS,
			customsFeeUSD,
			deliveryFeeKGS,
			deliveryFeeUSD,
			kimsServiceKGS,
			brokerFee,
			totalKGS,
			totalUSDT,
		})
	}

	const formatNumber = (num) => Math.round(num).toLocaleString('ru-RU')

	return (
		<div className='container mx-auto mt-6 p-6 bg-white shadow-lg rounded-lg'>
			<h2 className='text-2xl font-bold text-center mb-6'>
				🇰🇬 Калькулятор под ключ до Бишкека
			</h2>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<div>
					<label className='block text-gray-700 font-semibold mb-2'>
						Тип кузова
					</label>
					<select
						value={carType}
						onChange={(e) => setCarType(e.target.value)}
						className='w-full border p-2 rounded'
					>
						<option value='sedan'>Седан</option>
						<option value='crossover'>Кроссовер/SUV</option>
						<option value='other'>Другой</option>
					</select>
				</div>

				<div>
					<label className='block text-gray-700 font-semibold mb-2'>
						Год выпуска
					</label>
					<input
						type='number'
						value={year}
						onChange={(e) => setYear(parseInt(e.target.value))}
						className='w-full border p-2 rounded'
						min={2000}
						max={new Date().getFullYear()}
					/>
				</div>

				<div>
					<label className='block text-gray-700 font-semibold mb-2'>
						Объем двигателя (см³)
					</label>
					<input
						type='number'
						value={engineVolume}
						onChange={(e) => setEngineVolume(parseInt(e.target.value))}
						className='w-full border p-2 rounded'
						placeholder='Например: 2000'
					/>
				</div>

				<div>
					<label className='block text-gray-700 font-semibold mb-2'>
						Стоимость авто ($)
					</label>
					<input
						type='number'
						value={carPrice}
						onChange={(e) => setCarPrice(e.target.value)}
						className='w-full border p-2 rounded'
						placeholder='Цена в долларах США'
					/>
				</div>
			</div>

			<button
				onClick={calculateTurnkey}
				className='cursor-pointer mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300'
			>
				📊 Рассчитать стоимость под ключ
			</button>

			{result && (
				<div className='mt-6 p-6 bg-gray-100 shadow-md rounded-lg'>
					<h3 className='text-xl font-bold mb-4 text-center'>
						📊 Расчёт стоимости под ключ до Бишкека
					</h3>
					
					<div className='space-y-2 text-gray-700'>
						<div className='flex justify-between'>
							<span>Стоимость автомобиля:</span>
							<span className='font-semibold'>
								{formatNumber(result.carPriceKGS)} KGS
							</span>
						</div>
						
						<div className='flex justify-between'>
							<span>Услуги KimsAutoTrade:</span>
							<span className='font-semibold'>
								{formatNumber(result.kimsServiceKGS)} KGS
							</span>
						</div>
						
						<div className='flex justify-between'>
							<span>Таможенная пошлина:</span>
							<span className='font-semibold'>
								{formatNumber(result.customsFeeKGS)} KGS
								<span className='text-sm text-gray-500'>
									{' '}(${formatNumber(result.customsFeeUSD)})
								</span>
							</span>
						</div>
						
						<div className='flex justify-between'>
							<span>Доставка до Бишкека:</span>
							<span className='font-semibold'>
								{formatNumber(result.deliveryFeeKGS)} KGS
								<span className='text-sm text-gray-500'>
									{' '}(${formatNumber(result.deliveryFeeUSD)})
								</span>
							</span>
						</div>
						
						<div className='flex justify-between'>
							<span>Услуги брокера:</span>
							<span className='font-semibold'>
								{formatNumber(result.brokerFee)} KGS
							</span>
						</div>
						
						<hr className='my-3' />
						
						<div className='flex justify-between text-lg font-bold'>
							<span>Итого под ключ:</span>
							<span className='text-blue-600'>
								{formatNumber(result.totalKGS)} KGS
							</span>
						</div>
						
						<div className='flex justify-between text-lg font-bold'>
							<span>В USDT:</span>
							<span className='text-green-600'>
								${formatNumber(result.totalUSDT)} USDT
							</span>
						</div>
					</div>
					
					<p className='text-xs text-gray-500 mt-4 text-center'>
						* Цены могут варьироваться в зависимости от курса валют.
						<br />
						Для точной информации свяжитесь с менеджером: +82 10-8029-6232
					</p>
				</div>
			)}
		</div>
	)
}

export default KyrgyzstanCalculator