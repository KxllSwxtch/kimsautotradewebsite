import { useEffect, useState } from 'react'
import Select from 'react-select'
import axios from 'axios'
import { CarCard, Loader } from '../components'
import { brandLogos } from '../utils'

const ExportCatalog = () => {
	const [sortOption, setSortOption] = useState('') // Сортировка
	const [usdKrwRate, setUsdKrwRate] = useState(null)
	const [cars, setCars] = useState([])
	const [loading, setLoading] = useState(true)
	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(5) // Предположим, что всего 5 страниц
	const [models, setModels] = useState([])
	const [filters, setFilters] = useState({
		brand: '',
		model: '',
		yearFrom: '',
		yearTo: '',
		mileageFrom: '',
		mileageTo: '',
		capacityFrom: '',
		capacityTo: '',
		priceFrom: '',
		priceTo: '',
	})

	// Опции с логотипами брендов
	const brandOptions = [
		{ value: '', label: 'Любая' },
		{ value: '1', label: 'Acura', logo: brandLogos.Acura },
		{ value: '2', label: 'Alfaromeo', logo: brandLogos['Alfa Romeo'] },
		{ value: '3', label: 'Aston Martin', logo: brandLogos['Aston Martin'] },
		{ value: '4', label: 'Audi', logo: brandLogos.Audi },
		{ value: '5', label: 'Baic Yinxiang', logo: brandLogos.Buick },
		{ value: '6', label: 'Bentley', logo: brandLogos.Bentley },
		{ value: '7', label: 'BMW', logo: brandLogos.BMW },
		{ value: '8', label: 'Cadillac', logo: brandLogos.Cadillac },
		{ value: '9', label: 'Chevrolet', logo: brandLogos.Chevrolet },
		{
			value: '10',
			label: 'Chevrolet GM Daewoo',
			logo: brandLogos['Chevrolet (Korea)'],
		},
		{ value: '11', label: 'Chrysler', logo: brandLogos.Chrysler },
		{ value: '12', label: 'Citroen', logo: brandLogos.Citroën },
		{ value: '13', label: 'Daihatsu', logo: brandLogos.Daihatsu },
		{ value: '14', label: 'DFSK', logo: '' },
		{ value: '15', label: 'Dodge', logo: brandLogos.Dodge },
		{ value: '16', label: 'etc', logo: '' },
		{ value: '17', label: 'Ferrari', logo: brandLogos.Ferrari },
		{ value: '18', label: 'Fiat', logo: brandLogos.Fiat },
		{ value: '19', label: 'Ford', logo: brandLogos.Ford },
		{ value: '20', label: 'Genesis', logo: brandLogos.Genesis },
		{ value: '21', label: 'GMC', logo: brandLogos.GMC },
		{ value: '22', label: 'Honda', logo: brandLogos.Honda },
		{ value: '23', label: 'Hummer', logo: brandLogos.Hummer },
		{ value: '24', label: 'Hyundai', logo: brandLogos.Hyundai },
		{ value: '25', label: 'Infiniti', logo: brandLogos.Infiniti },
		{ value: '26', label: 'Jaguar', logo: brandLogos.Jaguar },
		{ value: '27', label: 'Jeep', logo: brandLogos.Jeep },
		{
			value: '28',
			label: 'KG Mobility Ssangyong',
			logo: brandLogos['KG Mobility (SsangYong)'],
		},
		{ value: '29', label: 'Kia', logo: brandLogos.KIA },
		{ value: '30', label: 'Lamborghini', logo: brandLogos.Lamborghini },
		{ value: '31', label: 'Land Rover', logo: brandLogos['Land Rover'] },
		{ value: '32', label: 'Lexus', logo: brandLogos.Lexus },
		{ value: '33', label: 'Lincoln', logo: brandLogos.Lincoln },
		{ value: '34', label: 'Lotus', logo: brandLogos.Lotus },
		{ value: '35', label: 'Maserati', logo: brandLogos.Maserati },
		{ value: '36', label: 'Maybach', logo: brandLogos.Maybach },
		{ value: '37', label: 'Mazda', logo: brandLogos.Mazda },
		{ value: '38', label: 'McLaren', logo: brandLogos.McLaren },
		{ value: '39', label: 'Mercedes-Benz', logo: brandLogos['Mercedes-Benz'] },
		{ value: '40', label: 'Mercury', logo: '' },
		{ value: '41', label: 'Mini', logo: brandLogos.Mini },
		{ value: '42', label: 'Mitsubishi', logo: brandLogos.Mitsubishi },
		{ value: '43', label: 'Mitsuoka', logo: brandLogos.Mitsuoka },
		{ value: '44', label: 'Nissan', logo: brandLogos.Nissan },
		{ value: '45', label: 'Others', logo: '' },
		{ value: '46', label: 'Peugeot', logo: brandLogos.Peugeot },
		{ value: '47', label: 'Polestar', logo: brandLogos.Polestar },
		{ value: '48', label: 'Porsche', logo: brandLogos.Porsche },
		{ value: '49', label: 'Renault-Korea Samsung', logo: brandLogos.Renault },
		{ value: '50', label: 'Rolls-Royce', logo: brandLogos['Rolls-Royce'] },
		{ value: '51', label: 'Saab', logo: brandLogos.SAAB },
		{ value: '52', label: 'Scion', logo: brandLogos.Scion },
		{ value: '53', label: 'Smart', logo: brandLogos.Smart },
		{ value: '54', label: 'Subaru', logo: brandLogos.Subaru },
		{ value: '55', label: 'Suzuki', logo: brandLogos.Suzuki },
		{ value: '56', label: 'Tesla', logo: brandLogos.Tesla },
		{ value: '57', label: 'Toyota', logo: brandLogos.Toyota },
		{ value: '58', label: 'Volkswagen', logo: brandLogos.Volkswagen },
		{ value: '59', label: 'Volvo', logo: brandLogos.Volvo },
	]

	// Список годов для фильтра
	const years = [
		'2011',
		'2012',
		'2013',
		'2014',
		'2015',
		'2016',
		'2017',
		'2018',
		'2019',
		'2020',
		'2021',
		'2022',
		'2023',
		'2024',
		'2025',
	]

	const sortOptions = [
		{ value: '', label: 'Сортировать по' },
		{ value: 'FINISH-ASC', label: 'По возрастанию цены в вонах' },
		{ value: 'FINISH-DESC', label: 'По убыванию цены в вонах' },
		{ value: 'YEAR-ASC', label: 'Год по возрастанию' },
		{ value: 'YEAR-DESC', label: 'Год по убыванию' },
		{ value: 'MILEAGE-ASC', label: 'Пробег по возрастанию' },
		{ value: 'MILEAGE-DESC', label: 'Пробег по убыванию' },
		{ value: 'CREATE_AT-DESC', label: 'По дате добавления' },
	]

	// Функция для получения данных с API
	const fetchCars = async (pageNumber = 1) => {
		try {
			setLoading(true)
			const response = await axios.get(
				`https://corsproxy.io/?url=${`https://api.darvin.digital/api.php?method=get_cars&marka_id=${filters.brand}&model_id=${filters.model}&year_from=${filters.yearFrom}&year_to=${filters.yearTo}&mileage_from=${filters.mileageFrom}&mileage_to=${filters.mileageTo}&engine_from=${filters.capacityFrom}&engine_to=${filters.capacityTo}&price_from=${filters.priceFrom}&price_to=${filters.priceTo}&sort=${sortOption}&page=${pageNumber}`}`,
			)
			const newCars = response.data

			setCars(newCars)
			setLoading(false)
		} catch (error) {
			console.error('Ошибка при загрузке данных:', error)
			setLoading(false)
		}
	}

	// Получаем общее кол-во автомобилей по поиску или без
	const fetchTotalCars = async () => {
		try {
			const response = await axios.get(
				`https://corsproxy.io/?url=${`https://api.darvin.digital/api.php?method=get_cars_count&marka_id=${filters.brand}&model_id=${filters.model}&year_from=${filters.yearFrom}&year_to=${filters.yearTo}&mileage_from=${filters.mileageFrom}&mileage_to=${filters.mileageTo}&engine_from=${filters.capacityFrom}&engine_to=${filters.capacityTo}&price_from=${filters.priceFrom}&price_to=${filters.priceTo}&sort=${sortOption}`}`,
			)

			if (response.data.length > 0 && response.data[0].TOTAL_COUNT) {
				const totalCars = response.data[0].TOTAL_COUNT
				const carsPerPage = 24 // ⚡ Количество машин на странице

				setTotalPages(Math.ceil(totalCars / carsPerPage))
			} else {
				setTotalPages(1)
			}
		} catch (error) {
			console.error(
				'Ошибка при получении общего количества автомобилей:',
				error,
			)
			setTotalPages(1)
		}
	}

	// Загрузка данных при первом рендере и при изменении номера страницы
	useEffect(() => {
		fetchCars(currentPage)
		fetchTotalCars()
	}, [currentPage])

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

	// Функция для изменения текущей страницы
	const changePage = (pageNumber) => {
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
		if (pageNumber < 1 || pageNumber > totalPages) return
		setCurrentPage(pageNumber)
	}

	// Функция для получения моделей по выбранной марке
	const fetchModels = async (brandId) => {
		try {
			const response = await axios.get(
				`https://corsproxy.io/${encodeURIComponent(
					`https://api.darvin.digital/api.php?method=get_model&marka_id=${brandId}`,
				)}`,
			)
			setModels(response.data)
		} catch (error) {
			console.error('Ошибка при загрузке моделей:', error)
		}
	}

	// Логика для фильтров по году
	const filteredYearsFrom = years.filter(
		(year) => !filters.yearTo || parseInt(year) <= parseInt(filters.yearTo),
	)
	const filteredYearsTo = years.filter(
		(year) => !filters.yearFrom || parseInt(year) >= parseInt(filters.yearFrom),
	)

	const handleMileageChange = (e) => {
		const { name, value } = e.target
		setFilters((prevFilters) => {
			// Преобразуем в число для сравнения
			const numValue = Number(value)

			// Логика для mileageFrom
			if (name === 'mileageFrom') {
				// Если значение меньше чем mileageTo или mileageTo пустое, то обновляем
				if (
					numValue < Number(prevFilters.mileageTo) ||
					!prevFilters.mileageTo
				) {
					return {
						...prevFilters,
						mileageFrom: value,
					}
				}
			}

			// Логика для mileageTo
			if (name === 'mileageTo') {
				// Если значение больше чем mileageFrom или mileageFrom пустое, то обновляем
				if (
					numValue > Number(prevFilters.mileageFrom) ||
					!prevFilters.mileageFrom
				) {
					return {
						...prevFilters,
						mileageTo: value,
					}
				}
			}

			// Возвращаем текущее состояние, если условия не выполнены
			return prevFilters
		})
	}

	const handleCapacityChange = (e) => {
		const { name, value } = e.target

		setFilters((prevFilters) => {
			const numValue = Number(value)

			// Логика для capacityFrom
			if (name === 'capacityFrom') {
				// Если capacityTo больше или равно capacityFrom или capacityTo пустое, то обновляем
				if (
					Number(prevFilters.capacityTo) >= numValue ||
					!prevFilters.capacityTo
				) {
					return {
						...prevFilters,
						capacityFrom: value,
					}
				}
			}

			// Логика для capacityTo
			if (name === 'capacityTo') {
				// Если capacityFrom меньше или равно capacityTo или capacityFrom пустое, то обновляем
				if (
					Number(prevFilters.capacityFrom) <= numValue ||
					!prevFilters.capacityFrom
				) {
					return {
						...prevFilters,
						capacityTo: value,
					}
				}
			}

			// Возвращаем текущее состояние, если условия не выполнены
			return prevFilters
		})
	}

	// Обработка изменений в фильтрах
	const handleFilterChange = (e) => {
		const { name, value } = e.target
		setFilters((prevFilters) => ({
			...prevFilters,
			[name]: value,
		}))

		// Если выбрана марка, подгружаем модели
		if (name === 'brand') {
			if (value) {
				fetchModels(value)
			} else {
				setModels([])
				setFilters((prevFilters) => ({
					...prevFilters,
					model: '',
				}))
			}
		}
	}

	// Применение фильтров
	const applyFilters = () => {
		setCurrentPage(1) // Сброс на первую страницу
		fetchCars(1) // Перезагружаем список машин с новыми фильтрами
	}

	// Сброс фильтров
	const resetFilters = () => {
		setFilters({
			brand: '',
			model: '',
			yearFrom: '',
			yearTo: '',
			mileageFrom: '',
			mileageTo: '',
			capacityFrom: '',
			capacityTo: '',
			priceFrom: '',
			priceTo: '',
		})
		setCurrentPage(1)
		setSortOption('')
		setModels([])
	}

	// Генерация кнопок пагинации
	const renderPagination = () => {
		const maxPageButtons = 5 // Количество страниц слева и справа
		const pageNumbers = []

		const startPage = Math.max(1, currentPage - maxPageButtons)
		const endPage = Math.min(totalPages, currentPage + maxPageButtons)

		// Добавляем кнопку "Первая страница", если currentPage > 1
		if (startPage > 1) {
			pageNumbers.push(
				<button
					key={1}
					onClick={() => changePage(1)}
					className={`cursor-pointer w-10 h-10 border rounded-md mx-1 transition duration-300 ${
						currentPage === 1
							? 'bg-gray-200 text-gray-800 font-bold'
							: 'bg-white hover:bg-gray-100 text-gray-600'
					}`}
				>
					1
				</button>,
			)

			if (startPage > 2) {
				pageNumbers.push(<span key='dots1'>...</span>)
			}
		}

		// Добавляем страницы в диапазоне
		for (let i = startPage; i <= endPage; i++) {
			pageNumbers.push(
				<button
					key={i}
					onClick={() => changePage(i)}
					className={`cursor-pointer w-10 h-10 border rounded-md mx-1 transition duration-300 ${
						i === currentPage
							? 'bg-gray-200 text-gray-800 font-bold'
							: 'bg-white hover:bg-gray-100 text-gray-600'
					}`}
				>
					{i}
				</button>,
			)
		}

		// Добавляем кнопку "Последняя страница", если currentPage < totalPages
		if (endPage < totalPages) {
			if (endPage < totalPages - 1) {
				pageNumbers.push(<span key='dots2'>...</span>)
			}

			pageNumbers.push(
				<button
					key={totalPages}
					onClick={() => changePage(totalPages)}
					className={`cursor-pointer w-10 h-10 border rounded-md mx-1 transition duration-300 ${
						currentPage === totalPages
							? 'bg-gray-200 text-gray-800 font-bold'
							: 'bg-white hover:bg-gray-100 text-gray-600'
					}`}
				>
					{totalPages}
				</button>,
			)
		}

		return (
			<div className='flex justify-center mt-10 mb-20'>
				{/* Кнопка "Назад" */}
				<button
					onClick={() => changePage(currentPage - 1)}
					className='cursor-pointer w-10 h-10 border rounded-md mx-1 transition duration-300 hover:bg-gray-100 text-gray-600'
					disabled={currentPage === 1}
				>
					&lt;
				</button>

				{pageNumbers}

				{/* Кнопка "Вперёд" */}
				<button
					onClick={() => changePage(currentPage + 1)}
					className='cursor-pointer w-10 h-10 border rounded-md mx-1 transition duration-300 hover:bg-gray-100 text-gray-600'
					disabled={currentPage === totalPages}
				>
					&gt;
				</button>
			</div>
		)
	}

	const handleSortChange = (e) => {
		setSortOption(e.target.value)
		setCurrentPage(1) // Сбрасываем страницу на первую
	}

	// Кастомный рендер опций
	const customSingleValue = ({ data }) => (
		<div className='flex items-center'>
			{data.logo && (
				<img src={data.logo} alt={data.label} className='w-6 mr-2' />
			)}
			<span>{data.label}</span>
		</div>
	)

	const customOption = (props) => {
		const { data, innerRef, innerProps } = props
		return (
			<div
				ref={innerRef}
				{...innerProps}
				className='flex items-center p-2 hover:bg-gray-200 cursor-pointer'
			>
				{data.logo && (
					<img src={data.logo} alt={data.label} className='w-6 h-6 mr-2' />
				)}
				<span>{data.label}</span>
			</div>
		)
	}

	// @ts-ignore
	const BrandSelect = ({ filters, handleFilterChange }) => {
		const handleChange = (selectedOption) => {
			handleFilterChange({
				target: {
					name: 'brand',
					value: selectedOption.value,
				},
			})
		}

		return (
			<div>
				<label className='block text-gray-700 font-semibold mb-2'>Марка</label>
				<Select
					options={brandOptions}
					value={brandOptions.find((opt) => opt.value === filters.brand)}
					onChange={handleChange}
					getOptionLabel={(e) => (
						<div className='flex items-center '>
							{e.logo && (
								<img src={e.logo} alt={e.label} className='w-5 mr-2' />
							)}
							<span>{e.label}</span>
						</div>
					)}
					// components={{ SingleValue: customSingleValue, Option: customOption }}
					className='w-full'
					isSearchable={false} // 🔥 Отключает возможность ввода текста
				/>
			</div>
		)
	}

	return (
		<div className='mt-30 md:mt-40 container m-auto'>
			<h1 className='text-3xl font-bold text-center mb-5'>
				Каталог авто в Корее
			</h1>

			<div className='md:flex md:flex-row md:justify-center grid grid-cols-1'>
				{/* Форма фильтрации */}
				<div className='bg-white p-5 rounded-lg shadow-md md:w-1/3'>
					<form>
						<div className='grid grid-cols-1 md:grid-cols-1 gap-4'>
							<div>
								<BrandSelect
									filters={filters}
									handleFilterChange={handleFilterChange}
								/>
							</div>

							<div>
								<label>Модель</label>
								<select
									name='model'
									value={filters.model}
									onChange={handleFilterChange}
									className='w-full border p-2 rounded'
									disabled={!filters.brand}
								>
									<option value=''>Любая</option>
									{models.map((model, index) => (
										<option key={index} value={model.MODEL_NAME}>
											{model.MODEL_NAME}
										</option>
									))}
								</select>
							</div>

							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div>
									<label>Год (от)</label>
									<select
										name='yearFrom'
										value={filters.yearFrom}
										onChange={handleFilterChange}
										className='w-full border p-2 rounded'
									>
										<option value=''>Любой</option>
										{filteredYearsFrom.reverse().map((year) => (
											<option key={year} value={year}>
												{year}
											</option>
										))}
									</select>
								</div>
								<div>
									<label>Год (до)</label>
									<select
										name='yearTo'
										value={filters.yearTo}
										onChange={handleFilterChange}
										className='w-full border p-2 rounded'
									>
										<option value=''>Любой</option>
										{filteredYearsTo.reverse().map((year) => (
											<option key={year} value={year}>
												{year}
											</option>
										))}
									</select>
								</div>
							</div>

							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div>
									<label>Пробег (от, км)</label>
									<input
										type='number'
										name='mileageFrom'
										value={filters.mileageFrom}
										onChange={handleMileageChange}
										className='w-full border p-2 rounded'
										placeholder='От'
										min={0}
									/>
								</div>
								<div>
									<label>Пробег (до, км)</label>
									<input
										type='number'
										name='mileageTo'
										value={filters.mileageTo}
										onChange={handleMileageChange}
										className='w-full border p-2 rounded'
										placeholder='До'
									/>
								</div>
							</div>

							<div className='mb-4'>
								<label
									className='block text-gray-700 font-semibold mb-2'
									htmlFor='capacity-from'
								>
									Объём двигателя (от)
								</label>
								<div className='relative'>
									<select
										name='capacityFrom'
										id='capacity-from'
										className='block w-full bg-white border border-gray-300 rounded-lg shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:border-red-500 focus:ring focus:ring-red-200 transition duration-300'
										value={filters.capacityFrom}
										onChange={handleCapacityChange}
									>
										<option value=''>Любой</option>
										<option value='1398'>1,4</option>
										<option value='1498'>1,5</option>
										<option value='1598'>1,6</option>
										<option value='1798'>1,8</option>
										<option value='1998'>2,0</option>
										<option value='2198'>2,2</option>
										<option value='2498'>2,5</option>
										<option value='2998'>3,0</option>
										<option value='3498'>3,5</option>
										<option value='3798'>3,8</option>
										<option value='3998'>4,0</option>
										<option value='7000'>Более 4,0</option>
									</select>
								</div>
							</div>

							<div className='mb-4'>
								<label
									className='block text-gray-700 font-semibold mb-2'
									htmlFor='capacity-to'
								>
									Объём двигателя (до)
								</label>
								<div className='relative'>
									<select
										name='capacityTo'
										id='capacity-to'
										className='block w-full bg-white border border-gray-300 rounded-lg shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:border-red-500 focus:ring focus:ring-red-200 transition duration-300'
										value={filters.capacityTo}
										onChange={handleCapacityChange}
									>
										<option value=''>Любой</option>
										<option value='7000'>Более 4,0</option>
										<option value='3998'>4,0</option>
										<option value='3798'>3,8</option>
										<option value='3498'>3,5</option>
										<option value='2998'>3,0</option>
										<option value='2198'>2,2</option>
										<option value='2498'>2,5</option>
										<option value='1998'>2,0</option>
										<option value='1798'>1,8</option>
										<option value='1598'>1,6</option>
										<option value='1498'>1,5</option>
										<option value='1398'>1,4</option>
									</select>
								</div>
							</div>

							<div className='filter__item mb-4'>
								<label
									className='block text-gray-700 font-semibold mb-2'
									htmlFor='price-from'
								>
									Цена (от, воны)
								</label>
								<input
									type='number'
									id='price-from'
									name='priceFrom'
									placeholder='0'
									className='block w-full bg-white border border-gray-300 rounded-lg shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:border-red-500 focus:ring focus:ring-red-200 transition duration-300'
									value={filters.priceFrom}
									onChange={(e) =>
										setFilters((prevFilters) => ({
											...prevFilters,
											priceFrom: e.target.value,
										}))
									}
								/>
							</div>

							<div className='filter__item mb-4'>
								<label
									className='block text-gray-700 font-semibold mb-2'
									htmlFor='price-to'
								>
									Цена (до, воны)
								</label>
								<input
									type='number'
									id='price-to'
									name='priceTo'
									placeholder='∞'
									className='block w-full bg-white border border-gray-300 rounded-lg shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:border-red-500 focus:ring focus:ring-red-200 transition duration-300'
									value={filters.priceTo}
									onChange={(e) =>
										setFilters((prevFilters) => ({
											...prevFilters,
											priceTo: e.target.value,
										}))
									}
								/>
							</div>
						</div>

						<div className='mb-4'>
							<label className='block text-gray-700 font-semibold mb-2'>
								Сортировка
							</label>
							<select
								name='sort'
								value={sortOption}
								onChange={handleSortChange}
								className='w-full border p-2 rounded'
							>
								{sortOptions.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</div>

						<div className='flex justify-between mt-4'>
							<button
								type='button'
								onClick={resetFilters}
								className='bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded cursor-pointer'
							>
								Сбросить фильтр
							</button>
							<button
								type='button'
								onClick={applyFilters}
								className='bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded cursor-pointer'
							>
								Поиск
							</button>
						</div>
					</form>
				</div>

				{/* Сетка карточек автомобилей */}
				{cars.length > 0 ? (
					<div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full md:ml-5'>
						{cars.map((car) => (
							<CarCard usdKrwRate={usdKrwRate} key={car.ID} car={car} />
						))}
					</div>
				) : (
					<div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full md:ml-5'>
						<h1>Автомобили не найдены</h1>
					</div>
				)}
			</div>

			{/* Лоадер при загрузке данных */}
			{loading && <Loader />}

			{/* Пагинация */}
			{!loading && renderPagination()}
		</div>
	)
}

export default ExportCatalog
