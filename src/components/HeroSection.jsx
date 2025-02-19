import { Link } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'

const HeroSection = () => {
	return (
		<section className='relative min-h-screen flex items-center justify-center text-secondary-500'>
			{/* Фоновое видео */}
			<video
				autoPlay
				loop
				muted
				playsInline
				className='absolute inset-0 w-full h-full object-cover'
			>
				<source
					src='https://res.cloudinary.com/pomegranitedesign/video/upload/v1739957360/kimsautotrade/bg-video.mp4'
					type='video/mp4'
				/>
			</video>

			{/* Затемняющий оверлей */}
			<div className='absolute inset-0 bg-black opacity-50'></div>

			{/* Основной контент */}
			<div className='relative z-10 max-w-7xl mx-auto px-4 text-center'>
				<h1 className='text-4xl md:text-6xl font-bold mb-4'>
					Экспорт авто под ключ
				</h1>
				<p className='text-lg md:text-xl mb-6'>
					Надежный партнер для клиентов и дилеров из стран СНГ
				</p>

				{/* Контакты через WhatsApp */}
				<div className='mb-6 flex flex-col md:flex-row items-center justify-center gap-4'>
					<a
						href='https://wa.me/821080296232'
						target='_blank'
						rel='noopener noreferrer'
						className='flex items-center text-sm md:text-base underline hover:text-accent-500 transition-colors'
					>
						<FaWhatsapp className='w-5 h-5 mr-2' />
						Рамис: +82 10-8029-6232
					</a>
					<a
						href='https://wa.me/821082828062'
						target='_blank'
						rel='noopener noreferrer'
						className='flex items-center text-sm md:text-base underline hover:text-accent-500 transition-colors'
					>
						<FaWhatsapp className='w-5 h-5 mr-2' />
						Артём: +82 10-8282-8062
					</a>
				</div>

				{/* Кнопка "Смотреть каталог" */}
				<Link
					to='/catalog'
					className='bg-accent-500 text-primary-500 px-6 py-3 rounded-md transition hover:bg-accent-600 inline-block'
				>
					Смотреть каталог
				</Link>
			</div>
		</section>
	)
}

export default HeroSection
