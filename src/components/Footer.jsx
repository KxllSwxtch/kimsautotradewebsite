const Footer = () => {
	return (
		<footer className='bg-primary-500 text-secondary-500 py-8'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex flex-col md:flex-row justify-between items-center'>
					{/* Блок контактов */}
					<div className='mb-4 md:mb-0 text-center md:text-left'>
						<h2 className='text-lg font-bold'>Контакты</h2>
						<ul className='mt-2 space-y-2'>
							<li className='transition-colors duration-300 hover:text-accent-500'>
								Рамис:{' '}
								<a href='tel:+821080296232' className='underline'>
									+82 10-8029-6232
								</a>
							</li>
							<li className='transition-colors duration-300 hover:text-accent-500'>
								Артём:{' '}
								<a href='tel:+821082828062' className='underline'>
									+82 10-8282-8062
								</a>
							</li>
						</ul>
					</div>
					{/* Авторские права */}
					<div className='text-center md:text-right'>
						<p className='text-sm'>
							© {new Date().getFullYear()} Kim's Auto Trade. Все права защищены.
						</p>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer
