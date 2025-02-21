import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const AboutSection = () => {
	const videoRef = useRef(null)
	const [videoError, setVideoError] = useState(false)

	useEffect(() => {
		const videoElement = videoRef.current
		if (!videoElement) return

		const observerOptions = {
			threshold: 0.5, // 50% видимости
		}

		const observerCallback = (entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					videoElement
						.play()
						.then(() => {
							setVideoError(false)
						})
						.catch((err) => {
							console.error('Ошибка запуска видео:', err)
							setVideoError(true)
						})
				} else {
					videoElement.pause()
				}
			})
		}

		const observer = new IntersectionObserver(observerCallback, observerOptions)
		observer.observe(videoElement)

		return () => {
			observer.unobserve(videoElement)
		}
	}, [])

	const handlePlayClick = () => {
		const videoElement = videoRef.current
		videoElement
			.play()
			.then(() => {
				setVideoError(false)
			})
			.catch((err) => {
				console.error('Ошибка при ручном запуске видео:', err)
			})
	}

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
							Kim's Auto Trade – ваш надежный партнер в сфере экспорта
							автомобилей. Мы предоставляем полный спектр услуг по подбору,
							оформлению и доставке авто под ключ. Наша компания обладает
							многолетним опытом работы, что позволяет гарантировать высокое
							качество сервиса и индивидуальный подход к каждому клиенту.
						</p>
						<p>
							Мы работаем с дилерами и клиентами из стран СНГ, предлагая лучшие
							предложения по подбору автомобилей, а также предоставляя удобный
							калькулятор для расчёта доставки до Владивостока. Наша цель –
							обеспечить безопасность, оперативность и прозрачность на каждом
							этапе сотрудничества.
						</p>
					</div>
					<div className='relative flex justify-center'>
						<video
							ref={videoRef}
							src='https://res.cloudinary.com/pomegranitedesign/video/upload/v1740115681/kimsautotrade/aboutvideo.mp4'
							className='w-80 h-auto rounded-lg shadow-2xl'
							loop
							muted
							playsInline
							controls
						/>
						{videoError && (
							<button
								onClick={handlePlayClick}
								className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xl font-bold rounded-lg'
							>
								Play Video
							</button>
						)}
					</div>
				</motion.div>
			</div>
		</section>
	)
}

export default AboutSection
