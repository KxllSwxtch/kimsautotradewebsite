import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const Header = () => {
	const [menuOpen, setMenuOpen] = useState(false)
	const [showHeader, setShowHeader] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			// Если прокручено более чем на 10 пикселей, показываем хедер
			if (window.scrollY > 5) {
				setShowHeader(true)
			} else {
				setShowHeader(false)
			}
		}
		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	const toggleMenu = () => setMenuOpen((prev) => !prev)

	// Варианты анимации для мобильного меню
	const menuVariants = {
		hidden: { opacity: 0, y: -50 },
		visible: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: -50 },
	}

	return (
		<>
			<header
				className={`bg-primary-500 fixed w-full z-50 transform transition-transform duration-300 ${
					showHeader ? 'translate-y-0' : '-translate-y-full'
				}`}
			>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex items-center justify-between h-16'>
						{/* Логотип */}
						<div className='flex-shrink-0'>
							<Link to='/'>
								<img
									className='h-10 w-auto transition-transform duration-500 hover:scale-105'
									src='https://res.cloudinary.com/pomegranitedesign/image/upload/v1739951461/kimsautotrade/logo.jpg'
									alt="Kim's Auto Trade"
								/>
							</Link>
						</div>
						{/* Десктопное меню */}
						<nav className='hidden md:flex space-x-8'>
							<Link
								to='/'
								className='text-secondary-500 hover:text-accent-500 transition duration-300'
							>
								Главная
							</Link>
							<Link
								to='/about'
								className='text-secondary-500 hover:text-accent-500 transition duration-300'
							>
								О компании
							</Link>
							<a
								className='text-secondary-500 hover:text-accent-500 transition duration-300'
								href='#calculator'
							>
								Калькулятор
							</a>
							<Link
								to='/catalog'
								className='text-secondary-500 hover:text-accent-500 transition duration-300'
							>
								Каталог
							</Link>
							<Link
								to='/contact'
								className='text-secondary-500 hover:text-accent-500 transition duration-300'
							>
								Контакты
							</Link>
						</nav>
						{/* Кнопка мобильного меню */}
						<div className='md:hidden'>
							<button
								onClick={toggleMenu}
								type='button'
								className='text-secondary-500 hover:text-accent-500 focus:outline-none transition duration-300'
							>
								<svg
									className='h-6 w-6'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									{menuOpen ? (
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
											d='M6 18L18 6M6 6l12 12'
										/>
									) : (
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
											d='M4 6h16M4 12h16M4 18h16'
										/>
									)}
								</svg>
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* Полноэкранное мобильное меню с анимацией через framer-motion */}
			<AnimatePresence>
				{menuOpen && (
					<motion.div
						className='fixed inset-0 z-40 bg-primary-500 flex flex-col items-center justify-center'
						initial='hidden'
						animate='visible'
						exit='exit'
						variants={menuVariants}
						transition={{ duration: 0.3 }}
					>
						{/* Кнопка закрытия */}
						<button
							onClick={toggleMenu}
							type='button'
							className='absolute top-6 right-6 text-secondary-500 hover:text-accent-500 focus:outline-none transition duration-300'
						>
							<svg
								className='h-8 w-8'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='M6 18L18 6M6 6l12 12'
								/>
							</svg>
						</button>
						<nav className='space-y-8 text-center'>
							<Link
								onClick={() => setMenuOpen(false)}
								to='/'
								className='block text-secondary-500 text-2xl hover:text-accent-500 transition-colors duration-300'
							>
								Главная
							</Link>
							<Link
								onClick={() => setMenuOpen(false)}
								to='/about'
								className='block text-secondary-500 text-2xl hover:text-accent-500 transition-colors duration-300'
							>
								О компании
							</Link>
							<Link
								onClick={() => setMenuOpen(false)}
								to='/catalog'
								className='block text-secondary-500 text-2xl hover:text-accent-500 transition-colors duration-300'
							>
								Каталог
							</Link>
							<Link
								onClick={() => setMenuOpen(false)}
								to='/contact'
								className='block text-secondary-500 text-2xl hover:text-accent-500 transition-colors duration-300'
							>
								Контакты
							</Link>
						</nav>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	)
}

export default Header
