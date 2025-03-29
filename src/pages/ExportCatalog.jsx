import axios from 'axios'
import { useState, useEffect } from 'react'
import { formatDate, transformBadgeValue } from '../utils'
import { CarCard } from '../components'
import { translateValue, translations } from '../translations'

console.log(translations)

const ExportCatalog = () => {
	const [searchByNumber, setSearchByNumber] = useState('')

	const [currentPage, setCurrentPage] = useState(1)
	const [totalCars, setTotalCars] = useState(0)

	const [priceStart, setPriceStart] = useState('')
	const [priceEnd, setPriceEnd] = useState('')

	const [mileageStart, setMileageStart] = useState('')
	const [mileageEnd, setMileageEnd] = useState('')

	const [endYear, setEndYear] = useState('')
	const [endMonth, setEndMonth] = useState('00')

	const [startYear, setStartYear] = useState('')
	const [startMonth, setStartMonth] = useState('00')

	const [usdKrwRate, setUsdKrwRate] = useState(null)

	const [cars, setCars] = useState([])

	const [manufacturers, setManufacturers] = useState(null)
	const [selectedManufacturer, setSelectedManufacturer] = useState('')

	const [modelGroups, setModelGroups] = useState(null)
	const [selectedModelGroup, setSelectedModelGroup] = useState('')

	const [models, setModels] = useState(null)
	const [selectedModel, setSelectedModel] = useState('')

	const [configurations, setConfigurations] = useState(null)
	const [selectedConfiguration, setSelectedConfiguration] = useState('')

	const [badges, setBadges] = useState(null)
	const [selectedBadge, setSelectedBadge] = useState('')

	const [badgeDetails, setBadgeDetails] = useState(null)
	const [selectedBadgeDetails, setSelectedBadgeDetails] = useState('')

	// Загружаем курс USD
	useEffect(() => {
		const fetchUsdKrwRate = async () => {
			try {
				const response = await axios.get(
					'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
				)

				if (response.status === 200) {
					const jsonData = response.data
					const rate = jsonData['usd']['krw']

					console.log(rate)

					setUsdKrwRate(rate)
				}
			} catch (e) {
				console.error(e)
			}
		}

		fetchUsdKrwRate()
	}, [])

	// Загружаем список производителей
	useEffect(() => {
		const fetchManufacturers = async () => {
			setCurrentPage(1)
			const url = `https://api.encar.com/search/car/list/general?count=true&q=(And.Hidden.N._.SellType.%EC%9D%BC%EB%B0%98._.CarType.A.)&inav=%7CMetadata%7CSort`

			const response = await axios.get(url)

			const data = response.data
			const count = data?.Count

			setTotalCars(count)

			// data -> iNav -> Nodes[2] -> Nodes[2]?.Facets -> Nodes[2]?.Facets[0]?.Refinements?.Nodes[0]?.Facets
			const manufacturers =
				data?.iNav?.Nodes[2]?.Facets[0]?.Refinements?.Nodes[0]?.Facets

			setManufacturers(manufacturers)
		}

		fetchManufacturers()
	}, [])

	// Загружаем модели
	useEffect(() => {
		const fetchModelGroups = async () => {
			if (!selectedManufacturer) return

			setCurrentPage(1)

			const url = `https://api.encar.com/search/car/list/general?count=true&q=(And.Hidden.N._.SellType.%EC%9D%BC%EB%B0%98._.(C.CarType.A._.Manufacturer.${selectedManufacturer}.))&inav=%7CMetadata%7CSort`

			const response = await axios.get(url)

			const data = response?.data
			const count = data?.Count

			setTotalCars(count)

			// data?.iNav?.Nodes[2]?.Facets[0]?.Refinements?.Nodes[0]?.Facets
			const allManufacturers =
				data?.iNav?.Nodes[2]?.Facets[0]?.Refinements?.Nodes[0]?.Facets

			const filteredManufacturer = allManufacturers.filter(
				(item) => item.IsSelected === true,
			)[0]

			const models = filteredManufacturer?.Refinements?.Nodes[0]?.Facets

			setModelGroups(models)
		}

		fetchModelGroups()
	}, [selectedManufacturer])

	// Загружаем поколения
	useEffect(() => {
		const fetchModelGroups = async () => {
			if (!selectedModelGroup) return
			setCurrentPage(1)

			const url = `https://api.encar.com/search/car/list/general?count=true&count=true&q=(And.Hidden.N._.SellType.%EC%9D%BC%EB%B0%98._.(C.CarType.A._.(C.Manufacturer.${selectedManufacturer}._.ModelGroup.${selectedModelGroup}.)))&inav=%7CMetadata%7CSort`
			const response = await axios.get(url)

			const data = response?.data
			const count = data?.Count

			setTotalCars(count)

			const allManufacturers =
				data?.iNav?.Nodes[2]?.Facets[0]?.Refinements?.Nodes[0]?.Facets

			const filteredManufacturer = allManufacturers.filter(
				(item) => item.IsSelected === true,
			)[0]

			const modelGroup = filteredManufacturer?.Refinements?.Nodes[0]?.Facets
			const filteredModel = modelGroup.filter(
				(item) => item.IsSelected === true,
			)[0]
			const models = filteredModel?.Refinements?.Nodes[0]?.Facets

			setModels(models)
		}

		fetchModelGroups()
	}, [selectedManufacturer, selectedModelGroup])

	// Загружаем конфигурации
	useEffect(() => {
		const fetchConfigurations = async () => {
			if (!selectedModel) return
			setCurrentPage(1)

			const url = `https://api.encar.com/search/car/list/general?count=true&count=true&q=(And.Hidden.N._.(C.CarType.A._.(C.Manufacturer.${selectedManufacturer}._.(C.ModelGroup.${selectedModelGroup}._.Model.${selectedModel}.))))&inav=%7CMetadata%7CSort`

			const response = await axios.get(url)

			const data = response?.data
			const count = data?.Count

			setTotalCars(count)

			const allManufacturers =
				data?.iNav?.Nodes[1]?.Facets[0]?.Refinements?.Nodes[0]?.Facets

			const filteredManufacturer = allManufacturers.filter(
				(item) => item.IsSelected === true,
			)[0]

			const modelGroup = filteredManufacturer?.Refinements?.Nodes[0]?.Facets

			const filteredModel = modelGroup?.filter(
				(item) => item.IsSelected === true,
			)[0]

			const models = filteredModel?.Refinements?.Nodes[0]?.Facets
			const filteredConfiguration = models?.filter(
				(item) => item.IsSelected === true,
			)[0]

			const configurations =
				filteredConfiguration?.Refinements?.Nodes[0]?.Facets

			setConfigurations(configurations)
		}

		fetchConfigurations()
	}, [selectedManufacturer, selectedModelGroup, selectedModel])

	// Загружаем объёмы
	useEffect(() => {
		if (!selectedConfiguration) return
		setCurrentPage(1)

		const fetchBadges = async () => {
			const url = `https://api.encar.com/search/car/list/general?count=true&q=(And.Hidden.N._.(C.CarType.A._.(C.Manufacturer.${selectedManufacturer}._.(C.ModelGroup.${selectedModelGroup}._.(C.Model.${selectedModel}._.BadgeGroup.${selectedConfiguration}.)))))&inav=%7CMetadata%7CSort`

			const response = await axios.get(url)

			const data = response?.data
			const count = data?.Count

			setTotalCars(count)

			const allManufacturers =
				data?.iNav?.Nodes[1]?.Facets[0]?.Refinements?.Nodes[0]?.Facets

			const filteredManufacturer = allManufacturers.filter(
				(item) => item.IsSelected === true,
			)[0]

			const modelGroup = filteredManufacturer?.Refinements?.Nodes[0]?.Facets

			const filteredModel = modelGroup?.filter(
				(item) => item.IsSelected === true,
			)[0]

			const models = filteredModel?.Refinements?.Nodes[0]?.Facets
			const filteredConfiguration = models?.filter(
				(item) => item.IsSelected === true,
			)[0]

			const configurations =
				filteredConfiguration?.Refinements?.Nodes[0]?.Facets

			const filteredBadgeGroup = configurations?.filter(
				(item) => item.IsSelected === true,
			)[0]

			const badges = filteredBadgeGroup?.Refinements?.Nodes[0]?.Facets

			setBadges(badges)
		}

		fetchBadges()
	}, [
		selectedManufacturer,
		selectedModelGroup,
		selectedModel,
		selectedConfiguration,
		selectedBadge,
	])

	useEffect(() => {
		const fetchBadgeDetails = async () => {
			if (!selectedBadge) return
			setCurrentPage(1)

			const url = `https://api.encar.com/search/car/list/general?count=true&q=(And.Hidden.N._.(C.CarType.A._.(C.Manufacturer.${selectedManufacturer}._.(C.ModelGroup.${selectedModelGroup}._.(C.Model.${selectedModel}._.(C.BadgeGroup.${selectedConfiguration}._.Badge.${encodeURIComponent(
				transformBadgeValue(selectedBadge),
			)}.))))))&inav=%7CMetadata%7CSort`

			console.log(url)

			const response = await axios.get(url)

			const data = response?.data

			const allManufacturers =
				data?.iNav?.Nodes[1]?.Facets[0]?.Refinements?.Nodes[0]?.Facets

			const filteredManufacturer = allManufacturers.filter(
				(item) => item.IsSelected === true,
			)[0]

			const modelGroup = filteredManufacturer?.Refinements?.Nodes[0]?.Facets

			const filteredModel = modelGroup?.filter(
				(item) => item.IsSelected === true,
			)[0]

			const models = filteredModel?.Refinements?.Nodes[0]?.Facets
			const filteredConfiguration = models?.filter(
				(item) => item.IsSelected === true,
			)[0]

			const configurations =
				filteredConfiguration?.Refinements?.Nodes[0]?.Facets

			const filteredBadgeGroup = configurations?.filter(
				(item) => item.IsSelected === true,
			)[0]

			const badges = filteredBadgeGroup?.Refinements?.Nodes[0]?.Facets

			const filteredBadge = badges?.filter((item) => item.IsSelected === true)

			const badgeDetails = filteredBadge?.Refinements?.Nodes[0]?.Facets

			setBadgeDetails(badgeDetails)
		}

		fetchBadgeDetails()
	}, [
		selectedManufacturer,
		selectedModelGroup,
		selectedModel,
		selectedConfiguration,
		selectedBadge,
	])

	const fetchCars = async () => {
		let queryParts = []
		let filters = []

		if (searchByNumber) {
			queryParts.push(
				`(And.Hidden.N._.CarType.A._.Simple.keyword(${searchByNumber}).)`,
			)
		} else {
			queryParts.push('(And.Hidden.N._.SellType.일반._.')
		}

		if (
			selectedManufacturer &&
			selectedModelGroup &&
			selectedModel &&
			selectedConfiguration &&
			selectedBadge
		) {
			queryParts.push(
				`(C.CarType.A._.(C.Manufacturer.${selectedManufacturer}._.(C.ModelGroup.${selectedModelGroup}._.(C.Model.${selectedModel}._.(C.BadgeGroup.${selectedConfiguration}._.Badge.${encodeURIComponent(
					transformBadgeValue(selectedBadge),
				)}.)))))`,
			)
		} else if (
			selectedManufacturer &&
			selectedModelGroup &&
			selectedModel &&
			selectedConfiguration
		) {
			queryParts.push(
				`(C.CarType.A._.(C.Manufacturer.${selectedManufacturer}._.(C.ModelGroup.${selectedModelGroup}._.(C.Model.${selectedModel}._.BadgeGroup.${selectedConfiguration}.))))`,
			)
		} else if (selectedManufacturer && selectedModelGroup && selectedModel) {
			queryParts.push(
				`(C.CarType.A._.(C.Manufacturer.${selectedManufacturer}._.(C.ModelGroup.${selectedModelGroup}._.Model.${selectedModel}.)))`,
			)
		} else if (selectedManufacturer && selectedModelGroup) {
			queryParts.push(
				`(C.CarType.A._.(C.Manufacturer.${selectedManufacturer}._.ModelGroup.${selectedModelGroup}.))`,
			)
		} else if (selectedManufacturer) {
			queryParts.push(`(C.CarType.A._.Manufacturer.${selectedManufacturer}.)`)
		} else {
			queryParts.push('CarType.A.')
		}

		// Пробег
		if (mileageStart && mileageEnd) {
			filters.push(`Mileage.range(${mileageStart}..${mileageEnd}).`)
		} else if (mileageStart) {
			filters.push(`Mileage.range(${mileageStart}..).`)
		} else if (mileageEnd) {
			filters.push(`Mileage.range(..${mileageEnd}).`)
		}

		// Год
		if (startYear && endYear) {
			filters.push(`Year.range(${startYear}00..${endYear}99).`)
		} else if (startYear) {
			filters.push(`Year.range(${startYear}00..).`)
		} else if (endYear) {
			filters.push(`Year.range(..${endYear}99).`)
		} else if (startYear && startMonth && endYear && endMonth) {
			filters.push(
				`Year.range(${startYear}${startMonth}..${endYear}${endMonth}).`,
			)
		} else if (startYear && startMonth) {
			filters.push(`Year.range(${startYear}${startMonth}..).`)
		} else if (endYear && endMonth) {
			filters.push(`Year.range(..${endYear}${endMonth}).`)
		}

		// Цена
		if (priceStart && priceEnd) {
			filters.push(`Price.range(${priceStart}..${priceEnd}).`)
		} else if (priceStart) {
			filters.push(`Price.range(${priceStart}..).`)
		} else if (priceEnd) {
			filters.push(`Price.range(..${priceEnd}).`)
		}

		// Финальный запрос
		let query =
			queryParts.join('') +
			(filters.length ? `_.${filters.join('_.')}` : '') +
			')'

		const encodedQuery = encodeURIComponent(query)
		const itemsPerPage = 20
		const offset = (currentPage - 1) * itemsPerPage

		// https://api-encar.habsidev.com/api/catalog?
		const url = `https://api.encar.com/search/car/list/general?count=true&q=${encodedQuery}&sr=%7CModifiedDate%7C${offset}%7C${itemsPerPage}`

		console.log('Generated q=', query)

		try {
			const response = await axios.get(url)
			setCars(response.data?.SearchResults || [])
			window.scrollTo({ top: 0, behavior: 'smooth' })
		} catch (error) {
			console.error('Ошибка при загрузке автомобилей:', error)
		}
	}

	useEffect(() => {
		fetchCars()
	}, [
		selectedManufacturer,
		selectedModelGroup,
		selectedModel,
		selectedBadge,
		selectedBadgeDetails,
		selectedConfiguration,
		startYear,
		startMonth,
		endYear,
		endMonth,
		mileageStart,
		mileageEnd,
		priceStart,
		priceEnd,
		currentPage,
		searchByNumber,
	])

	return (
		<div className='md:mt-40 mt-35 px-6'>
			<h1 className='text-3xl font-bold text-center mb-5'>
				Каталог автомобилей
			</h1>
			<div className='container m-auto grid grid-cols-1 md:grid-cols-5 md:gap-15'>
				<div className='md:col-span-1.5'>
					<select
						className='w-full border border-gray-300 rounded-md px-3 py-2 mt-4'
						value={selectedManufacturer}
						onChange={(e) => setSelectedManufacturer(e.target.value)}
					>
						<option value=''>Марка</option>
						{manufacturers?.map((manufacturer, index) => (
							<option key={index} value={manufacturer.Value}>
								{translateValue(manufacturer.Value)} ({manufacturer.Count})
							</option>
						))}
					</select>
					<select
						disabled={!selectedManufacturer}
						className='w-full border border-gray-300 rounded-md px-3 py-2 mt-4 disabled:bg-gray-200'
						value={selectedModelGroup}
						onChange={(e) => setSelectedModelGroup(e.target.value)}
					>
						<option value=''>Модель</option>
						{modelGroups?.map((modelGroup, index) => (
							<option key={index} value={modelGroup.Value}>
								{translateValue(modelGroup.Value)} ({modelGroup.Count})
							</option>
						))}
					</select>
					<select
						disabled={!selectedModelGroup}
						className='w-full border border-gray-300 rounded-md px-3 py-2 mt-4 disabled:bg-gray-200'
						value={selectedModel}
						onChange={(e) => setSelectedModel(e.target.value)}
					>
						<option value=''>Поколение</option>
						{models?.map((model, index) => (
							<option key={index} value={model.Value}>
								{translateValue(model.Value)} (
								{formatDate(model?.Metadata?.ModelStartDate[0])} -{' '}
								{formatDate(model?.Metadata?.ModelEndDate[0])}) ({model.Count})
							</option>
						))}
					</select>
					<select
						disabled={!selectedModel}
						className='w-full border border-gray-300 rounded-md px-3 py-2 mt-4 disabled:bg-gray-200'
						value={selectedConfiguration}
						onChange={(e) => setSelectedConfiguration(e.target.value)}
					>
						<option value=''>Конфигурация</option>
						{configurations?.map((configuration, index) => (
							<option key={index} value={configuration.Value}>
								{translateValue(configuration.Value)} ({configuration.Count})
							</option>
						))}
					</select>
					<select
						disabled={!selectedConfiguration}
						className='w-full border border-gray-300 rounded-md px-3 py-2 mt-4 disabled:bg-gray-200'
						value={selectedBadge}
						onChange={(e) => setSelectedBadge(e.target.value)}
					>
						<option value=''>Выберите конфигурацию</option>
						{badges?.map((badge, index) => (
							<option key={index} value={badge.Value}>
								{translateValue(badge.Value)} ({badge.Count})
							</option>
						))}
					</select>
					{selectedManufacturer &&
						selectedModelGroup &&
						selectedModel &&
						selectedConfiguration &&
						selectedBadge &&
						badgeDetails && (
							<select
								className='w-full border border-gray-300 rounded-md px-3 py-2 mt-4'
								value={selectedBadgeDetails}
								onChange={(e) => setSelectedBadgeDetails(e.target.value)}
							>
								<option value=''>Выберите комплектацию</option>
								{badgeDetails.map((badgeDetail, index) => (
									<option key={index} value={badgeDetail.Value}>
										{translateValue(badgeDetail.Value)} ({badgeDetail.Count})
									</option>
								))}
							</select>
						)}

					<div className='grid grid-cols-2 gap-3'>
						<select
							className='w-full border border-gray-300 rounded-md px-3 py-2 mt-4 disabled:bg-gray-200'
							value={startYear}
							onChange={(e) => setStartYear(parseInt(e.target.value))}
						>
							<option value=''>Год от</option>
							{Array.from(
								{ length: (endYear || new Date().getFullYear()) - 1979 },
								(_, i) => 1980 + i,
							)
								.reverse()
								.map((year) => (
									<option key={year} value={year}>
										{year}
									</option>
								))}
						</select>

						<select
							className='w-full border border-gray-300 rounded-md px-3 py-2 mt-4 disabled:bg-gray-200'
							value={startMonth}
							onChange={(e) => setStartMonth(e.target.value)}
						>
							<option value=''>Месяц от</option>
							{Array.from({ length: 12 }, (_, i) => {
								const value = (i + 1).toString().padStart(2, '0')
								return { value, i }
							})
								.filter(
									({ value }) =>
										!endMonth || parseInt(value) <= parseInt(endMonth),
								)
								.map(({ value, i }) => {
									const monthNames = [
										'Январь',
										'Февраль',
										'Март',
										'Апрель',
										'Май',
										'Июнь',
										'Июль',
										'Август',
										'Сентябрь',
										'Октябрь',
										'Ноябрь',
										'Декабрь',
									]
									return (
										<option key={value} value={value}>
											{monthNames[i]}
										</option>
									)
								})}
						</select>
					</div>
					<div className='grid grid-cols-2 gap-3'>
						<select
							className='w-full border border-gray-300 rounded-md px-3 py-2 mt-4 disabled:bg-gray-200'
							value={endYear}
							onChange={(e) => setEndYear(parseInt(e.target.value))}
						>
							<option value=''>Год до</option>
							{Array.from(
								{
									length: new Date().getFullYear() - (startYear || 1980) + 1,
								},
								(_, i) => (startYear || 1980) + i,
							)
								.reverse()
								.map((year) => (
									<option key={year} value={year}>
										{year}
									</option>
								))}
						</select>

						<select
							className='w-full border border-gray-300 rounded-md px-3 py-2 mt-4 disabled:bg-gray-200'
							value={endMonth}
							onChange={(e) => setEndMonth(e.target.value)}
						>
							<option value=''>Месяц до</option>
							{Array.from({ length: 12 }, (_, i) => {
								const value = (i + 1).toString().padStart(2, '0')
								return { value, i }
							})
								.filter(
									({ value }) =>
										!startMonth || parseInt(value) >= parseInt(startMonth),
								)
								.map(({ value, i }) => {
									const monthNames = [
										'Январь',
										'Февраль',
										'Март',
										'Апрель',
										'Май',
										'Июнь',
										'Июль',
										'Август',
										'Сентябрь',
										'Октябрь',
										'Ноябрь',
										'Декабрь',
									]
									return (
										<option key={value} value={value}>
											{monthNames[i]}
										</option>
									)
								})}
						</select>
					</div>

					<select
						className='w-full border border-gray-300 rounded-md px-3 py-2 mt-4 disabled:bg-gray-200'
						value={mileageStart}
						onChange={(e) => setMileageStart(e.target.value)}
					>
						<option value=''>Пробег от</option>
						{Array.from({ length: 20 }, (_, i) => {
							const mileage = (i + 1) * 10000
							return (
								<option key={mileage} value={mileage}>
									{mileage.toLocaleString()} км
								</option>
							)
						})}
					</select>

					<select
						className='w-full border border-gray-300 rounded-md px-3 py-2 mt-4 disabled:bg-gray-200'
						value={mileageEnd}
						onChange={(e) => setMileageEnd(e.target.value)}
					>
						<option value=''>Пробег До</option>
						{Array.from({ length: 20 }, (_, i) => {
							const mileage = (i + 1) * 10000
							return (
								<option key={mileage} value={mileage}>
									{mileage.toLocaleString()} км
								</option>
							)
						})}
					</select>

					<div className='grid grid-cols-2 gap-3 mt-4'>
						<select
							className='w-full border border-gray-300 rounded-md px-3 py-2'
							value={priceStart}
							onChange={(e) => {
								const value = e.target.value
								setPriceStart(value)
								if (priceEnd && parseInt(value) > parseInt(priceEnd)) {
									setPriceEnd('')
								}
							}}
						>
							<option value=''>Цена от</option>
							{Array.from({ length: 100 }, (_, i) => (i + 1) * 100)
								.filter((price) => !priceEnd || price <= parseInt(priceEnd))
								.map((price) => (
									<option key={price} value={price}>
										₩{(price * 10000).toLocaleString()}
									</option>
								))}
						</select>

						<select
							className='w-full border border-gray-300 rounded-md px-3 py-2'
							value={priceEnd}
							onChange={(e) => {
								const value = e.target.value
								setPriceEnd(value)
								if (priceStart && parseInt(value) < parseInt(priceStart)) {
									setPriceStart('')
								}
							}}
						>
							<option value=''>Цена до</option>
							{Array.from({ length: 100 }, (_, i) => (i + 1) * 100)
								.filter((price) => !priceStart || price >= parseInt(priceStart))
								.map((price) => (
									<option key={price} value={price}>
										₩{(price * 10000).toLocaleString()}
									</option>
								))}
						</select>
					</div>

					<input
						type='text'
						placeholder='Поиск по номеру авто (например, 49서0290)'
						className='w-full border border-gray-300 rounded-md px-3 py-2 mt-5'
						value={searchByNumber}
						onChange={(e) => {
							setSearchByNumber(e.target.value)
							setCurrentPage(1)
						}}
					/>

					<button
						className='w-full bg-red-500 text-white py-2 px-4 mt-5 rounded hover:bg-red-600 transition cursor-pointer'
						onClick={() => {
							setSelectedManufacturer('')
							setSelectedModelGroup('')
							setSelectedModel('')
							setSelectedConfiguration('')
							setSelectedBadge('')
							setSelectedBadgeDetails('')
							setStartYear('')
							setStartMonth('00')
							setEndYear('')
							setEndMonth('00')
							setMileageStart('')
							setMileageEnd('')
							setPriceStart('')
							setPriceEnd('')
							setSearchByNumber('')
							setCurrentPage(1)
						}}
					>
						Сбросить фильтры
					</button>
				</div>

				{cars.length > 0 ? (
					<div className='md:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8'>
						{cars.map((car) => (
							<CarCard key={car.Id} car={car} usdKrwRate={usdKrwRate} />
						))}
					</div>
				) : (
					<h1 className='text-lg font-bold'>Автомобили не найдены</h1>
				)}
			</div>
			{totalCars > 20 && (
				<div className='flex justify-center mt-10 mb-10'>
					<div className='flex flex-wrap justify-center items-center gap-2 px-4 max-w-full'>
						{currentPage > 1 && (
							<button
								onClick={() => setCurrentPage(currentPage - 1)}
								className='cursor-pointer w-10 h-10 flex items-center justify-center border rounded-md text-sm font-medium shadow-sm bg-white text-gray-800 hover:bg-gray-100'
							>
								‹
							</button>
						)}
						{Array.from({ length: Math.ceil(totalCars / 20) }, (_, i) => i + 1)
							.filter((page) => {
								if (currentPage <= 3) return page <= 5
								const lastPage = Math.ceil(totalCars / 20)
								if (currentPage >= lastPage - 2) return page >= lastPage - 4
								return page >= currentPage - 2 && page <= currentPage + 2
							})
							.map((page) => (
								<button
									key={page}
									onClick={() => setCurrentPage(page)}
									className={`cursor-pointer w-10 h-10 flex items-center justify-center border rounded-md text-sm font-medium shadow-sm transition-all duration-200 ${
										currentPage === page
											? 'bg-black text-white'
											: 'bg-white text-gray-800 hover:bg-gray-100'
									}`}
								>
									{page}
								</button>
							))}
						{currentPage < Math.ceil(totalCars / 20) && (
							<button
								onClick={() => setCurrentPage(currentPage + 1)}
								className='cursor-pointer w-10 h-10 flex items-center justify-center border rounded-md text-sm font-medium shadow-sm bg-white text-gray-800 hover:bg-gray-100'
							>
								›
							</button>
						)}
					</div>
				</div>
			)}
		</div>
	)
}

export default ExportCatalog
