import { motion } from 'framer-motion'
import { FaCogs, FaShieldAlt, FaAward } from 'react-icons/fa'

const AdvantagesSection = () => {
	const containerVariants = {
		hidden: {},
		visible: {
			transition: {
				staggerChildren: 0.2,
			},
		},
	}

	const cardVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	}

	return (
		<section className='advantages bg-grayLight-500 py-16'>
			<div className='max-w-7xl mx-auto px-4'>
				<motion.h2
					className='text-3xl font-bold text-center text-primary-500 mb-8'
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
				>
					Почему выбирают нас
				</motion.h2>
				<motion.div
					className='grid grid-cols-1 md:grid-cols-3 gap-8'
					variants={containerVariants}
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true }}
				>
					{/* Карточка "Комплексный сервис" */}
					<motion.div
						className='bg-white rounded-lg shadow-xl p-6 text-center transform transition hover:-translate-y-1 hover:shadow-2xl'
						variants={cardVariants}
					>
						<div className='mb-4'>
							<div className='bg-accent-500 p-4 rounded-full inline-block text-primary-500'>
								<FaCogs size={24} />
							</div>
						</div>
						<h3 className='text-xl font-semibold mb-2'>Комплексный сервис</h3>
						<p className='text-grayDark'>
							От подбора авто до доставки — все услуги под ключ.
						</p>
					</motion.div>

					{/* Карточка "Надежность" */}
					<motion.div
						className='bg-white rounded-lg shadow-xl p-6 text-center transform transition hover:-translate-y-1 hover:shadow-2xl'
						variants={cardVariants}
					>
						<div className='mb-4'>
							<div className='bg-accent-500 p-4 rounded-full inline-block text-primary-500'>
								<FaShieldAlt size={24} />
							</div>
						</div>
						<h3 className='text-xl font-semibold mb-2'>Надежность</h3>
						<p className='text-grayDark'>
							Работаем с проверенными поставщиками и надежными партнерами.
						</p>
					</motion.div>

					{/* Карточка "Экспертность" */}
					<motion.div
						className='bg-white rounded-lg shadow-xl p-6 text-center transform transition hover:-translate-y-1 hover:shadow-2xl'
						variants={cardVariants}
					>
						<div className='mb-4'>
							<div className='bg-accent-500 p-4 rounded-full inline-block text-primary-500'>
								<FaAward size={24} />
							</div>
						</div>
						<h3 className='text-xl font-semibold mb-2'>Экспертность</h3>
						<p className='text-grayDark'>Более 3 лет опыта в автоэкспорте.</p>
					</motion.div>
				</motion.div>
			</div>
		</section>
	)
}

export default AdvantagesSection
