import axios from 'axios'
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

const CarInspection = ({ car }) => {
	const [inspectionData, setInspectionData] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchInspectionData = async () => {
			try {
				if (!car?.vehicleId || !car?.vehicleNo) {
					setError('Нет данных об автомобиле')
					setLoading(false)
					return
				}

				const url = `https://api.encar.com/v1/readside/record/vehicle/${
					car.vehicleId
				}/open?vehicleNo=${encodeURIComponent(car.vehicleNo)}`
				const response = await axios.get(url)

				setInspectionData(response.data)
				setError(null)
			} catch (err) {
				setError('Ошибка при загрузке данных')
				console.error(err)
			} finally {
				setLoading(false)
			}
		}

		fetchInspectionData()
	}, [car])

	if (loading)
		return <p className='text-center text-gray-500'>Загрузка данных...</p>
	if (error) return <p className='text-center text-red-500'>{error}</p>
	if (!inspectionData)
		return (
			<p className='text-center text-gray-600'>
				Нет данных о страховых выплатах
			</p>
		)

	const {
		year,
		maker,
		carShape,
		displacement,
		firstDate,
		myAccidentCnt,
		otherAccidentCnt,
		myAccidentCost,
		otherAccidentCost,
		ownerChangeCnt,
		accidentCnt,
		accidents = [],
	} = inspectionData

	return (
		<div className='p-1 mt-4'>
			<h2 className='text-xl font-semibold mb-4'>Страховая история</h2>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<p className='text-gray-700'>
					<strong>Количество владельцев:</strong> {ownerChangeCnt}
				</p>
				<p className='text-gray-700'>
					<strong>Количество ДТП:</strong> {accidentCnt}
				</p>
				<p className='text-gray-700'>
					<strong>Cтраховые выплаты (по этому авто):</strong> {myAccidentCnt}{' '}
					раз
				</p>
				<p className='text-gray-700'>
					<strong>Страховые выплаты (по другому авто):</strong>{' '}
					{otherAccidentCnt} раз
				</p>
				<p className='text-gray-700'>
					<strong>Общая сумма выплат (по этому авто):</strong> ₩
					{myAccidentCost.toLocaleString()}
				</p>
				<p className='text-gray-700'>
					<strong>Общая сумма выплат (по другому авто):</strong> ₩
					{otherAccidentCost.toLocaleString()}
				</p>
			</div>

			{/* Детализация ДТП */}
			{accidents.length > 0 && (
				<div className='mt-6'>
					<h3 className='text-lg font-semibold'>Детализация ДТП:</h3>
					<div className='mt-4 space-y-4'>
						{accidents.map((acc, index) => (
							<div key={index} className='p-4 bg-gray-100 rounded-lg shadow-sm'>
								<p className='text-gray-800'>
									<strong>Дата ДТП:</strong> {acc.date}
								</p>
								<p className='text-gray-800'>
									<strong>Страховая выплата:</strong> ₩
									{acc.insuranceBenefit.toLocaleString()}
								</p>
								<p className='text-gray-800'>
									<strong>Ремонтные работы:</strong> ₩
									{acc.partCost.toLocaleString()}
								</p>
								<p className='text-gray-800'>
									<strong>Стоимость работ:</strong> ₩
									{acc.laborCost.toLocaleString()}
								</p>
								<p className='text-gray-800'>
									<strong>Покраска:</strong> ₩
									{acc.paintingCost.toLocaleString()}
								</p>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	)
}

CarInspection.propTypes = {
	car: PropTypes.shape({
		vehicleId: PropTypes.string,
		vehicleNo: PropTypes.string,
	}),
}

export default CarInspection
