import {
	HeroSection,
	CalculatorSection,
	AdvantagesSection,
	AboutSection,
	InstagramSection,
} from '../components'

const Home = () => {
	return (
		<div>
			<HeroSection />
			<AboutSection />
			<AdvantagesSection />
			<div id='calculator'>
				<CalculatorSection />
			</div>
			<InstagramSection />
		</div>
	)
}

export default Home
