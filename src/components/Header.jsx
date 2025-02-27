import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaWhatsapp, FaBars, FaTimes } from 'react-icons/fa'

const Header = () => {
	const [menuOpen, setMenuOpen] = useState(false)
	const [showHeader, setShowHeader] = useState(true)
	const [lastScrollY, setLastScrollY] = useState(0)

	const toggleMenu = () => setMenuOpen(!menuOpen)

	// Логика для появления/скрытия Header при прокрутке
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > lastScrollY) {
				// Прокрутка вниз
				setShowHeader(false)
			} else {
				// Прокрутка вверх
				setShowHeader(true)
			}
			setLastScrollY(window.scrollY)
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [lastScrollY])

	return (
		<header
			className={`fixed top-0 left-0 w-full z-50 transition-transform duration-500 ${
				showHeader ? 'translate-y-0' : '-translate-y-full'
			} bg-[#000000] shadow-lg`}
		>
			{/* Верхняя полоса */}
			<div className='bg-[#000000] border-b border-[#333333]'>
				<div className='max-w-7xl mx-auto px-4 h-18 flex items-center justify-between text-[#ffffff]'>
					{/* Логотип слева */}
					<div className='flex items-center gap-2'>
						<Link to='/'>
							<img
								src='https://res.cloudinary.com/pomegranitedesign/image/upload/v1739951461/kimsautotrade/logo.jpg'
								alt="Kim's Auto Trade"
								className='h-10 w-auto transition-transform duration-300 hover:scale-105'
							/>
						</Link>
					</div>
					{/* Меню для десктопа */}
					<nav className='hidden md:flex items-center gap-8'>
						<Link
							to='/reviews'
							className='text-lg font-semibold transition-colors hover:text-[#ff4c4c]'
						>
							Отзывы
						</Link>
						<Link
							to='/videos'
							className='text-lg font-semibold transition-colors hover:text-[#ff4c4c]'
						>
							Видео
						</Link>
						<Link
							to='/faq'
							className='text-lg font-semibold transition-colors hover:text-[#ff4c4c]'
						>
							Вопросы/ответы
						</Link>
					</nav>
					{/* Иконка для мобильного меню */}
					<div className='md:hidden leading-0'>
						<button onClick={toggleMenu} className='text-[#ffffff]'>
							{menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
						</button>
					</div>
				</div>
			</div>

			{/* Нижняя полоса */}
			<div className='bg-[#000000] hidden md:block'>
				<div className='max-w-7xl mx-auto px-4 h-12 flex items-center justify-between text-[#ffffff]'>
					{/* Левое меню */}
					<nav className='hidden md:flex items-center gap-8 font-semibold'>
						<Link
							to='/catalog'
							className='transition-colors hover:text-[#ff4c4c]'
						>
							Каталог авто в Корее
						</Link>
						<Link
							to='/export-catalog'
							className='transition-colors hover:text-[#ff4c4c]'
						>
							Каталог авто на заказ из Кореи
						</Link>
						<Link
							to='/calculator'
							className='transition-colors hover:text-[#ff4c4c]'
						>
							Калькулятор стоимости
						</Link>
					</nav>
					{/* Номера телефонов */}
					<div className='hidden md:flex items-center gap-8'>
						<p className='flex flex-row items-center'>
							<span className='flex flex-row items-center mr-1'>
								<FaWhatsapp className='mr-1' />
								Артём:
							</span>
							<a
								href='https://wa.me/821082828062'
								target='_blank'
								rel='noopener noreferrer'
								className='font-medium transition-colors hover:text-[#ff4c4c]'
							>
								+82 10-8282-8062
							</a>
						</p>
						<p className='flex flex-row items-center'>
							<span className='flex flex-row items-center mr-1'>
								<FaWhatsapp className='mr-1' />
								Рамис:
							</span>
							<a
								href='https://wa.me/821080296232'
								target='_blank'
								rel='noopener noreferrer'
								className='font-medium transition-colors hover:text-[#ff4c4c]'
							>
								+82 10-8029-6232
							</a>
						</p>
					</div>
				</div>
			</div>

			{/* Мобильное меню на весь экран с анимацией справа налево */}
			<div
				className={`fixed top-0 right-0 w-full h-screen bg-[#1a1a1a] text-[#ffffff] z-50 shadow-2xl transform transition-transform duration-500 ease-in-out ${
					menuOpen ? 'translate-x-0' : 'translate-x-full'
				}`}
			>
				{/* Полупрозрачный фон для затемнения */}
				<div
					className={`fixed inset-0 bg-black bg-opacity-70 transition-opacity duration-500 ease-in-out ${
						menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
					}`}
					onClick={toggleMenu}
				></div>

				{/* Отключение прокрутки при открытом меню */}
				{menuOpen
					? document.body.classList.add('overflow-hidden')
					: document.body.classList.remove('overflow-hidden')}

				{/* Контент меню */}
				<div className='relative p-6'>
					{/* Логотип и кнопка закрытия */}
					<div className='flex justify-between items-center mb-6'>
						<Link to='/' onClick={toggleMenu}>
							<img
								src='https://res.cloudinary.com/pomegranitedesign/image/upload/v1739951461/kimsautotrade/logo.jpg'
								alt="Kim's Auto Trade"
								className='h-10 w-auto transition-transform duration-300 hover:scale-105'
							/>
						</Link>
						<button onClick={toggleMenu} className='text-[#ffffff]'>
							<FaTimes
								size={32}
								className='hover:text-[#ff4c4c] transition-colors duration-300 leading-0'
							/>
						</button>
					</div>

					{/* Меню навигации */}
					<nav className='flex flex-col space-y-6'>
						<Link
							to='/reviews'
							onClick={toggleMenu}
							className='text-xl font-semibold hover:text-[#ff4c4c] transition-colors duration-300'
						>
							Отзывы
						</Link>
						<Link
							to='/videos'
							onClick={toggleMenu}
							className='text-xl font-semibold hover:text-[#ff4c4c] transition-colors duration-300'
						>
							Видео
						</Link>
						<Link
							to='/faq'
							onClick={toggleMenu}
							className='text-xl font-semibold hover:text-[#ff4c4c] transition-colors duration-300'
						>
							Вопросы/ответы
						</Link>
						<Link
							to='/catalog'
							onClick={toggleMenu}
							className='text-xl font-semibold hover:text-[#ff4c4c] transition-colors duration-300'
						>
							Каталог
						</Link>
						<Link
							to='/export-catalog'
							onClick={toggleMenu}
							className='text-xl font-semibold hover:text-[#ff4c4c] transition-colors duration-300'
						>
							Каталог авто на заказ из Кореи
						</Link>
						<Link
							to='/calculator'
							onClick={toggleMenu}
							className='text-xl font-semibold hover:text-[#ff4c4c] transition-colors duration-300'
						>
							Калькулятор стоимости
						</Link>
					</nav>

					{/* Разделитель */}
					<hr className='border-t border-gray-700 my-6' />

					{/* Контакты внизу меню */}
					<div className='mt-4'>
						<p className='text-sm text-gray-400'>Контакты:</p>
						<p className='mt-2'>
							<a
								href='https://wa.me/821082828062'
								target='_blank'
								rel='noopener noreferrer'
								className='flex items-center gap-2 text-lg hover:text-[#ff4c4c] transition-colors duration-300'
							>
								<FaWhatsapp />
								Артём: +82 10-8282-8062
							</a>
						</p>
						<p className='mt-2'>
							<a
								href='https://wa.me/821080296232'
								target='_blank'
								rel='noopener noreferrer'
								className='flex items-center gap-2 text-lg hover:text-[#ff4c4c] transition-colors duration-300'
							>
								<FaWhatsapp />
								Рамис: +82 10-8029-6232
							</a>
						</p>
					</div>
				</div>
			</div>
		</header>
	)
}

export default Header
