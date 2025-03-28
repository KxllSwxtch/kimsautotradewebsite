import axios from 'axios'
import { useState, useEffect } from 'react'

const ExportCatalog = () => {
	const [manufacturers, setManufacturers] = useState(null)
	const [selectedManufacturer, setSelectedManufacturer] = useState('')
	const [models, setModels] = useState(null)
	const [selectedModel, setSelectedModel] = useState('')

	// Загружаем список производителей
	useEffect(() => {
		const fetchManufacturers = async () => {
			const url = `https://corsproxy.io/?url=${encodeURIComponent(
				'https://api-encar.habsidev.com/api/nav?count=true&q=(And.Hidden.N._.SellType.%EC%9D%BC%EB%B0%98._.CarType.A.)&inav=%7CMetadata%7CSort',
			)}`
			const response = await axios.get(url, { proxy: {} })

			const data = response.data

			// data -> iNav -> Nodes[2] -> Nodes[2]?.Facets -> Nodes[2]?.Facets[0]?.Refinements?.Nodes[0]?.Facets
			const manufacturers =
				data?.iNav?.Nodes[2]?.Facets[0]?.Refinements?.Nodes[0]?.Facets
			setManufacturers(manufacturers)
		}

		fetchManufacturers()
	}, [])

	useEffect(() => {
		const fetchModels = async () => {
			if (!selectedManufacturer) return

			const url = `https://corsproxy.io/${encodeURIComponent(
				`https://api-encar.habsidev.com/api/nav?count=true&q=(And.Hidden.N._.SellType.%EC%9D%BC%EB%B0%98._.(C.CarType.A._.Manufacturer.${selectedManufacturer}.))&inav=%7CMetadata%7CSort`,
			)}`

			const response = await axios.get(url)

			console.log(response.data)
		}

		fetchModels()
	}, [selectedManufacturer])

	return (
		<div className='mt-40 container m-auto'>
			<h1 className='text-3xl font-bold text-center mb-5'>
				Каталог автомобилей
			</h1>

			<select
				className='w-full border border-gray-300 rounded-md px-3 py-2 mt-4'
				value={selectedManufacturer}
				onChange={(e) => setSelectedManufacturer(e.target.value)}
			>
				{manufacturers?.map((manufacturer, index) => (
					<option key={index} value={manufacturer.Value} defaultValue={'Все'}>
						{manufacturer.Value} ({manufacturer.Count})
					</option>
				))}
			</select>

			{selectedManufacturer && models && (
				<select
					className='w-full border border-gray-300 rounded-md px-3 py-2 mt-4'
					value={selectedModel}
					onChange={(e) => setSelectedModel(e.target.value)}
				>
					<option value=''>Выберите модель</option>
					{models.map((model, index) => (
						<option key={index} value={model.Value}>
							{model.Text} ({model.Count})
						</option>
					))}
				</select>
			)}
		</div>
	)
}

export default ExportCatalog
