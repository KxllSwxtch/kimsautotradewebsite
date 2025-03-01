import axios from 'axios'
import { useEffect, useState } from 'react'
import { CarCard, Loader } from '../components'

const ExportCatalog = () => {
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
	]

	// Функция для получения данных с API
	const fetchCars = async (pageNumber = 1) => {
		try {
			setLoading(true)
			const response = await axios.get(
				`https://corsproxy.io/${encodeURIComponent(
					`https://api.darvin.digital/api.php?method=get_cars&marka_id=${filters.brand}&model_id=${filters.model}&year_from=${filters.yearFrom}&year_to=${filters.yearTo}&mileage_from=${filters.mileageFrom}&mileage_to=${filters.mileageTo}&engine_from=${filters.capacityFrom}&engine_to=${filters.capacityTo}&price_from=${filters.priceFrom}&price_to=${filters.priceTo}&sort=&page=${pageNumber}`,
				)}`,
			)
			const newCars = response.data

			if (newCars.length === 0) {
				setTotalPages(pageNumber - 1)
			} else {
				setCars(newCars)
				setTotalPages(5)
			}
			setLoading(false)
		} catch (error) {
			console.error('Ошибка при загрузке данных:', error)
			setLoading(false)
		}
	}

	// Загрузка данных при первом рендере и при изменении номера страницы
	useEffect(() => {
		fetchCars(currentPage)
	}, [currentPage])

	// Функция для изменения текущей страницы
	const changePage = (pageNumber) => {
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
		if (pageNumber > 0 && pageNumber <= totalPages) {
			setCurrentPage(pageNumber)
		}
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
		setCurrentPage(1)
		fetchCars(1)
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
		setModels([])
		fetchCars(1)
	}

	// Генерация кнопок пагинации
	const renderPagination = () => {
		const pageNumbers = []

		// Генерация номеров страниц
		for (let i = 1; i <= totalPages; i++) {
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

		return (
			<div className='flex justify-center mt-10 mb-20'>
				{/* Кнопка предыдущая страница */}
				<button
					onClick={() => changePage(currentPage - 1)}
					className='cursor-pointer w-10 h-10 border rounded-md mx-1 transition duration-300 hover:bg-gray-100 text-gray-600'
					disabled={currentPage === 1}
				>
					&lt;
				</button>
				{pageNumbers}
				{/* Кнопка следующая страница */}
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

	return (
		<div className='mt-25 md:mt-35 container m-auto'>
			<h1 className='text-3xl font-bold text-center mb-8'>
				Каталог автомобилей на экспорт
			</h1>

			<div>
				{/* Форма фильтрации */}
				<div className='bg-white p-5 rounded-lg shadow-md mb-8'>
					<form>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
							<div>
								<label>Марка</label>
								<select
									name='brand'
									value={filters.brand}
									onChange={handleFilterChange}
									className='w-full border p-2 rounded'
								>
									<option value=''>Любая</option>
									<option value='1'>Acura</option>
									<option value='2'>Alfaromeo</option>
									<option value='3'>Aston martin</option>
									<option value='4'>Audi</option>
									<option value='5'>Baic yinxiang</option>
									<option value='6'>Bentley</option>
									<option value='7'>Bmw</option>
									<option value='8'>Cadillac</option>
									<option value='9'>Chevrolet</option>
									<option value='10'>ChevroletGMDaewoo</option>
									<option value='11'>Chrysler</option>
									<option value='12'>Citroen</option>
									<option value='13'>Daihatsu</option>
									<option value='14'>DFSK</option>
									<option value='15'>Dodge</option>
									<option value='16'>etc</option>
									<option value='17'>Ferrari</option>
									<option value='18'>Fiat</option>
									<option value='19'>Ford</option>
									<option value='20'>Genesis</option>
									<option value='21'>GMC</option>
									<option value='22'>Honda</option>
									<option value='23'>Hummer</option>
									<option value='24'>Hyundai</option>
									<option value='25'>Infiniti</option>
									<option value='26'>Jaguar</option>
									<option value='27'>Jeep</option>
									<option value='28'>KG Mobility Ssangyong</option>
									<option value='29'>Kia</option>
									<option value='30'>Lamborghini</option>
									<option value='31'>Land rover</option>
									<option value='32'>Lexus</option>
									<option value='33'>Lincoln</option>
									<option value='34'>Lotus</option>
									<option value='35'>Maserati</option>
									<option value='36'>Maybach</option>
									<option value='37'>Mazda</option>
									<option value='38'>Mclaren</option>
									<option value='39'>Mercedes-Benz</option>
									<option value='40'>Mercury</option>
									<option value='41'>Mini</option>
									<option value='42'>Mitsubishi</option>
									<option value='43'>Mitsuoka</option>
									<option value='44'>Nissan</option>
									<option value='45'>Others</option>
									<option value='46'>Peugeot</option>
									<option value='47'>Polestar</option>
									<option value='48'>Porsche</option>
									<option value='49'>Renault-KoreaSamsung</option>
									<option value='50'>Rolls-Royce</option>
									<option value='51'>Saab</option>
									<option value='52'>Scion</option>
									<option value='53'>Smart</option>
									<option value='54'>Subaru</option>
									<option value='55'>Suzuki</option>
									<option value='56'>Tesla</option>
									<option value='57'>Toyota</option>
									<option value='58'>Volkswagen</option>
									<option value='59'>Volvo</option>
								</select>
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
										{filteredYearsFrom.map((year) => (
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
										{filteredYearsTo.map((year) => (
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

						<div className='flex justify-between mt-4'>
							<button
								type='button'
								onClick={resetFilters}
								className='bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded'
							>
								Сбросить фильтр
							</button>
							<button
								type='button'
								onClick={applyFilters}
								className='bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded'
							>
								Поиск
							</button>
						</div>
					</form>
				</div>

				{/* Сетка карточек автомобилей */}
				<div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
					{cars
						.sort((a, b) => (a.year > b.year ? 1 : -1))
						.map((car) => (
							<CarCard key={car.ID} car={car} />
						))}
				</div>
			</div>

			{/* Лоадер при загрузке данных */}
			{loading && <Loader />}

			{/* Пагинация */}
			{!loading && renderPagination()}
		</div>
	)
}

export default ExportCatalog
