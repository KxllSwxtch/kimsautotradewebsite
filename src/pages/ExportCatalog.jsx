import axios from 'axios'
import { useState, useEffect } from 'react'
import { formatDate, transformBadgeValue } from '../utils'

const ExportCatalog = () => {
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

	// Загружаем список производителей
	useEffect(() => {
		const fetchManufacturers = async () => {
			const url = `https://api.encar.com/search/car/list/general?count=true&q=(And.Hidden.N._.SellType.%EC%9D%BC%EB%B0%98._.CarType.A.)&inav=%7CMetadata%7CSort`
			const response = await axios.get(url, { proxy: {} })

			const data = response.data

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

			const url = `https://api.encar.com/search/car/list/general?count=true&q=(And.Hidden.N._.SellType.%EC%9D%BC%EB%B0%98._.(C.CarType.A._.Manufacturer.${selectedManufacturer}.))&inav=%7CMetadata%7CSort`

			const response = await axios.get(url)
			const data = response?.data

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

			const url = `https://api.encar.com/search/car/list/general?count=true&count=true&q=(And.Hidden.N._.SellType.%EC%9D%BC%EB%B0%98._.(C.CarType.A._.(C.Manufacturer.${selectedManufacturer}._.ModelGroup.${selectedModelGroup}.)))&inav=%7CMetadata%7CSort`
			const response = await axios.get(url)

			const data = response?.data

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

			const url = `https://api.encar.com/search/car/list/general?count=true&count=true&q=(And.Hidden.N._.(C.CarType.A._.(C.Manufacturer.${selectedManufacturer}._.(C.ModelGroup.${selectedModelGroup}._.Model.${selectedModel}.))))&inav=%7CMetadata%7CSort`
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
			setConfigurations(configurations)
		}

		fetchConfigurations()
	}, [selectedManufacturer, selectedModelGroup, selectedModel])

	// Загружаем объёмы
	useEffect(() => {
		if (!selectedConfiguration) return

		const fetchBadges = async () => {
			const url = `https://api.encar.com/search/car/list/general?count=true&q=(And.Hidden.N._.(C.CarType.A._.(C.Manufacturer.${selectedManufacturer}._.(C.ModelGroup.${selectedModelGroup}._.(C.Model.${selectedModel}._.BadgeGroup.${selectedConfiguration}.)))))&inav=%7CMetadata%7CSort`
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

			setBadges(badges)
		}

		fetchBadges()
	}, [
		selectedManufacturer,
		selectedModelGroup,
		selectedModel,
		selectedConfiguration,
	])

	useEffect(() => {
		const fetchBadgeDetails = async () => {
			if (!selectedBadge) return

			const url = `https://api.encar.com/search/car/list/general?count=true&q=(And.Hidden.N._.(C.CarType.A._.(C.Manufacturer.${selectedManufacturer}._.(C.ModelGroup.${selectedModelGroup}._.(C.Model.${selectedModel}._.(C.BadgeGroup.${selectedConfiguration}._.Badge.${encodeURIComponent(
				transformBadgeValue(selectedBadge),
			)}.))))))&inav=%7CMetadata%7CSort`

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

			console.log(badgeDetails)

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

			{selectedManufacturer && modelGroups && (
				<select
					className='w-full border border-gray-300 rounded-md px-3 py-2 mt-4'
					value={selectedModelGroup}
					onChange={(e) => setSelectedModelGroup(e.target.value)}
				>
					<option value=''>Выберите модель</option>
					{modelGroups.map((modelGroup, index) => (
						<option key={index} value={modelGroup.Value}>
							{modelGroup.Value} ({modelGroup.Count})
						</option>
					))}
				</select>
			)}

			{selectedManufacturer && selectedModelGroup && models && (
				<select
					className='w-full border border-gray-300 rounded-md px-3 py-2 mt-4'
					value={selectedModel}
					onChange={(e) => setSelectedModel(e.target.value)}
				>
					<option value=''>Выберите поколение</option>
					{models.map((model, index) => (
						<option key={index} value={model.Value}>
							{model.Value} ({formatDate(model?.Metadata?.ModelStartDate[0])} -{' '}
							{formatDate(model?.Metadata?.ModelEndDate[0])}) ({model.Count})
						</option>
					))}
				</select>
			)}

			{selectedManufacturer &&
				selectedModelGroup &&
				selectedModel &&
				configurations && (
					<select
						className='w-full border border-gray-300 rounded-md px-3 py-2 mt-4'
						value={selectedConfiguration}
						onChange={(e) => setSelectedConfiguration(e.target.value)}
					>
						<option value=''>Выберите конфигурацию</option>
						{configurations.map((configuration, index) => (
							<option key={index} value={configuration.Value}>
								{configuration.Value} ({configuration.Count})
							</option>
						))}
					</select>
				)}

			{selectedManufacturer &&
				selectedModelGroup &&
				selectedModel &&
				selectedConfiguration &&
				badges && (
					<select
						className='w-full border border-gray-300 rounded-md px-3 py-2 mt-4'
						value={selectedBadge}
						onChange={(e) => setSelectedBadge(e.target.value)}
					>
						<option value=''>Выберите конфигурацию</option>
						{badges.map((badge, index) => (
							<option key={index} value={badge.Value}>
								{badge.Value} ({badge.Count})
							</option>
						))}
					</select>
				)}

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
								{badgeDetail.Value} ({badgeDetail.Count})
							</option>
						))}
					</select>
				)}
		</div>
	)
}

export default ExportCatalog
