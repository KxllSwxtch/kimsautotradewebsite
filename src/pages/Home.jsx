import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import {
	HeroSection,
	CalculatorSection,
	AdvantagesSection,
	AboutSection,
	InstagramSection,
} from '../components'

const Home = () => {
	const location = useLocation()

	useEffect(() => {
		if (location.hash === '#calculator') {
			const calculatorElement = document.getElementById('calculator')
			if (calculatorElement) {
				calculatorElement.scrollIntoView({ behavior: 'smooth' })
			}
		}
	}, [location])

	return (
		<div>
			<HeroSection />
			<AboutSection />
			<AdvantagesSection />
			<CalculatorSection />
			<InstagramSection />
		</div>
	)
}

export default Home
