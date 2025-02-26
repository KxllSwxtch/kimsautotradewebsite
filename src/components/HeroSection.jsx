import { BsCheckCircle } from 'react-icons/bs'
import { Link } from 'react-router-dom'

const HeroSection = () => {
	return (
		<section className='bg-[#F7F8FA] py-16 mt-5 md:mt-20'>
			<div className='max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center'>
				{/* Левая колонка: Заголовок, список и кнопка */}
				<div className='md:w-1/2 space-y-6 md:pr-8'>
					<h1 className='text-4xl md:text-5xl font-bold text-gray-900 leading-tight'>
						Продаем авто в&nbsp;
						<span className='text-red-600'>Южной Корее</span>
						<br />и экспортируем в РФ за 14 дней
					</h1>
					<ul className='space-y-2 text-gray-700 text-lg'>
						<li className='flex items-center gap-2'>
							<BsCheckCircle className='text-red-600' />
							Полное сопровождение
						</li>
						<li className='flex items-center gap-2'>
							<BsCheckCircle className='text-red-600' />
							Никаких скрытых платежей
						</li>
						<li className='flex items-center gap-2'>
							<BsCheckCircle className='text-red-600' />
							Помощь с логистикой и растаможкой в РФ
						</li>
					</ul>

					<div className='flex flex-col justify-center md:block'>
						<Link
							to='/catalog'
							className='text-center md:mr-5 mb-5 inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-full transition duration-300'
						>
							Купить в Корее
						</Link>
						<Link
							to='/export-catalog'
							className='text-center inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-full transition duration-300'
						>
							Заказать из Кореи
						</Link>
					</div>
				</div>

				{/* Правая колонка: Картинка автомобилей */}
				<div className='md:w-1/2 mt-8 md:mt-0'>
					<img
						src='https://res.cloudinary.com/pomegranitedesign/image/upload/v1740536288/kimsautotrade/heroimage.png'
						alt='Cars from Korea'
						className='w-full h-auto object-contain'
					/>
				</div>
			</div>
		</section>
	)
}

export default HeroSection
