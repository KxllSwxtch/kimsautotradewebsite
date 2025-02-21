const About = () => {
	return (
		<div className='min-h-screen text-black py-10 px-4 mt-15'>
			<div className='container mx-auto max-w-4xl space-y-10'>
				<h1 className='text-4xl font-bold text-center mb-8 text-black'>
					О компании
				</h1>

				<div className='flex flex-col md:flex-row gap-8'>
					{/* Видео – слева для больших экранов */}
					<div className='w-full md:w-1/2'>
						<video
							className='w-full rounded-xl shadow-2xl'
							controls
							autoPlay
							loop
							muted
							playsInline
						>
							<source
								src='https://res.cloudinary.com/pomegranitedesign/video/upload/v1740115910/kimsautotrade/questions.mp4'
								type='video/mp4'
							/>
							Ваш браузер не поддерживает видео.
						</video>
					</div>

					{/* Описание – справа для больших экранов */}
					<div className='w-full'>
						<div className='bg-white shadow-2xl rounded-xl p-10'>
							<p className='text-lg leading-relaxed mb-4'>
								Kim's Auto Trade – это компания, которая предоставляет
								комплексные услуги по экспорту автомобилей под ключ для клиентов
								и дилеров из стран СНГ. Мы заботимся о каждом этапе сделки: от
								подбора автомобиля до его доставки, таможенного оформления и
								постпродажного обслуживания. Наш опыт и профессионализм
								позволяют нам обеспечить индивидуальный подход к каждому
								клиенту.
							</p>
							<p className='text-lg leading-relaxed mb-4'>
								Наша миссия – сделать процесс покупки автомобиля простым,
								прозрачным и надежным. Мы сотрудничаем с проверенными партнерами
								по всему миру, чтобы предоставить лучшие условия и гарантировать
								качество наших услуг. Благодаря инновационным технологиям и
								постоянному стремлению к совершенствованию, мы уверены, что
								сможем удовлетворить даже самые взыскательные запросы.
							</p>
							<p className='text-lg leading-relaxed'>
								На протяжении многих лет мы завоевывали доверие наших клиентов
								благодаря высокому уровню сервиса, оперативности и
								индивидуальному подходу. В Kim's Auto Trade вы найдете не просто
								автомобиль – вы получите комплексное решение, которое включает в
								себя профессиональное сопровождение на всех этапах сделки.
							</p>
						</div>
					</div>
				</div>

				{/* Кнопка перехода к странице контактов */}
				<div className='text-center'>
					<a
						href='/contact'
						className='inline-block px-6 py-3 border border-blue-700 text-blue-700 font-semibold rounded-full transition hover:bg-blue-700 hover:text-white'
					>
						Свяжитесь с нами
					</a>
				</div>
			</div>
		</div>
	)
}

export default About
