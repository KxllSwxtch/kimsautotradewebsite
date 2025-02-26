import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import {
	HeroSection,
	CalculatorSection,
	AdvantagesSection,
	AboutSection,
	HowToChooseCarSection,
	InstagramSection,
	HowToBuySection,
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
			<HowToChooseCarSection />
			<AdvantagesSection />
			<HowToBuySection />
			{/* <InstagramSection /> */}
		</div>
	)
}

export default Home
