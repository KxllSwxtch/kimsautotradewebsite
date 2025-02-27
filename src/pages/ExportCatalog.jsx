import axios from 'axios'
import { useEffect, useState } from 'react'
import { CarCard } from '../components'

const ExportCatalog = () => {
	const [cars, setCars] = useState([])
	const [loading, setLoading] = useState(true)
	const [page, setPage] = useState(1)
	const [hasMore, setHasMore] = useState(true)

	// Функция для получения данных с API
	const fetchCars = async (pageNumber = 1) => {
		try {
			setLoading(true)
			const response = await axios.get(
				`https://corsproxy.io/?key=28174bc7&url=https://api.darvin.digital/api.php?method=get_cars&marka_id=&model_id=&year_from=&year_to=&mileage_from=&mileage_to=&engine_from=&engine_to=&price_from=&price_to=&sort=&page=${pageNumber}`,
			)
			const newCars = response.data

			if (newCars.length === 0) {
				setHasMore(false)
			} else {
				setCars((prevCars) => [...prevCars, ...newCars])
			}
			setLoading(false)
		} catch (error) {
			console.error('Ошибка при загрузке данных:', error)
			setLoading(false)
		}
	}

	// Загрузка данных при первом рендере и при изменении номера страницы
	useEffect(() => {
		fetchCars(page)
	}, [page])

	// Функция для загрузки следующей страницы
	const loadMore = () => {
		if (hasMore) {
			setPage((prevPage) => prevPage + 1)
		}
	}

	return (
		<div className='mt-20 md:mt-35 container m-auto'>
			<h1 className='text-3xl font-bold text-center mb-8'>
				Каталог автомобилей на экспорт
			</h1>

			{/* Сетка карточек автомобилей */}
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
				{cars
					.sort((a, b) => (a.year > b.year ? 1 : -1))
					.map((car) => (
						<CarCard key={car.ID} car={car} />
					))}
			</div>

			{/* Кнопка загрузки следующей страницы */}
			{hasMore && (
				<div className='text-center mt-10'>
					<button
						onClick={loadMore}
						className='bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-full transition duration-300'
					>
						Загрузить ещё
					</button>
				</div>
			)}

			{/* Лоадер при загрузке данных */}
			{loading && (
				<div className='text-center mt-10'>
					<div className='inline-block w-8 h-8 border-4 border-red-600 border-dashed rounded-full animate-spin'></div>
				</div>
			)}
		</div>
	)
}

export default ExportCatalog
