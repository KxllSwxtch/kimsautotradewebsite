import { motion } from 'framer-motion'

const AboutSection = () => {
	return (
		<section className='py-16 bg-grayLight-500'>
			<div className='max-w-7xl mx-auto px-4'>
				<motion.h2
					className='text-3xl font-bold text-center text-primary-500 mb-8'
					initial={{ opacity: 0, y: 50 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
				>
					О компании
				</motion.h2>
				<motion.div
					className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.7 }}
				>
					<div className='space-y-4 text-grayDark text-lg'>
						<p>
							Kim's Auto Trade – ваш надежный партнер в сфере автомобилей. Мы
							предоставляем полный спектр услуг по подбору, оформлению и
							доставке авто под ключ. Наша компания обладает многолетним опытом
							работы, что позволяет гарантировать высокое качество сервиса и
							индивидуальный подход к каждому клиенту.
						</p>
						<p>
							Мы работаем с дилерами и клиентами из стран СНГ, а так же продаём
							автомобили внутри Кореи , предлагая лучшие предложения по подбору
							автомобилей, а также предоставляя удобный калькулятор для расчёта
							доставки до стран СНГ. Наша цель – обеспечить безопасность,
							оперативность и прозрачность на каждом этапе сотрудничества.
						</p>
					</div>
					<div className='flex justify-center'>
						<img
							src='https://res.cloudinary.com/pomegranitedesign/image/upload/v1739951461/kimsautotrade/logo.jpg'
							alt="Kim's Auto Trade"
							className='w-80 h-auto rounded-lg shadow-2xl'
						/>
					</div>
				</motion.div>
			</div>
		</section>
	)
}

export default AboutSection
