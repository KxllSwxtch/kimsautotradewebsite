import { motion } from 'framer-motion'

const HowToChooseCarSection = () => {
	return (
		<section className='py-16 bg-[#f9f9f9]'>
			<div className='max-w-7xl mx-auto px-4'>
				{/* Заголовок */}
				<motion.h2
					className='text-3xl font-bold text-center text-[#000000] mb-8'
					initial={{ opacity: 0, y: 50 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
				>
					КАК ПОДОБРАТЬ ХОРОШЕЕ АВТО?
				</motion.h2>
				{/* Контент с ответами */}
				<motion.div
					className='grid grid-cols-1 md:grid-cols-3 gap-6'
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.7 }}
				>
					{/* Ответ 1 */}
					<div className='bg-white rounded-xl shadow-md overflow-hidden'>
						<div className='p-6'>
							<h3 className='text-lg font-semibold text-[#000000] mb-2'>
								Определите бюджет
							</h3>
							<p className='text-gray-500'>
								Рассчитайте максимально допустимую сумму, учитывая стоимость
								авто, страховку, налог и обслуживание.
							</p>
						</div>
					</div>

					{/* Ответ 2 */}
					<div className='bg-white rounded-xl shadow-md overflow-hidden'>
						<div className='p-6'>
							<h3 className='text-lg font-semibold text-[#000000] mb-2'>
								Выберите тип кузова
							</h3>
							<p className='text-gray-500'>
								Определитесь с типом автомобиля (седан, кроссовер, хэтчбек и
								т.д.), исходя из своих нужд и предпочтений.
							</p>
						</div>
					</div>

					{/* Ответ 3 */}
					<div className='bg-white rounded-xl shadow-md overflow-hidden'>
						<div className='p-6'>
							<h3 className='text-lg font-semibold text-[#000000] mb-2'>
								Проверьте историю авто
							</h3>
							<p className='text-gray-500'>
								Запросите отчёт по VIN-номеру, чтобы узнать о предыдущих
								владельцах, ДТП и ремонтах.
							</p>
						</div>
					</div>

					{/* Ответ 4 */}
					<div className='bg-white rounded-xl shadow-md overflow-hidden'>
						<div className='p-6'>
							<h3 className='text-lg font-semibold text-[#000000] mb-2'>
								Сравните несколько вариантов
							</h3>
							<p className='text-gray-500'>
								Проанализируйте предложения на рынке, чтобы выбрать лучшее
								соотношение цены и качества.
							</p>
						</div>
					</div>

					{/* Ответ 5 */}
					<div className='bg-white rounded-xl shadow-md overflow-hidden'>
						<div className='p-6'>
							<h3 className='text-lg font-semibold text-[#000000] mb-2'>
								Проверьте техническое состояние
							</h3>
							<p className='text-gray-500'>
								Перед покупкой обязательно проведите техническую диагностику у
								специалиста.
							</p>
						</div>
					</div>

					{/* Ответ 6 */}
					<div className='bg-white rounded-xl shadow-md overflow-hidden'>
						<div className='p-6'>
							<h3 className='text-lg font-semibold text-[#000000] mb-2'>
								Обратите внимание на пробег
							</h3>
							<p className='text-gray-500'>
								Сравните возраст и пробег автомобиля. Низкий пробег не всегда
								гарантирует хорошее состояние.
							</p>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	)
}

export default HowToChooseCarSection
