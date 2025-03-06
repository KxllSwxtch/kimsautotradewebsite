import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import {
	Home,
	About,
	CatalogPage,
	Contact,
	CarDetails,
	ExportCatalog,
	ExportCarDetails,
	FAQ,
} from './pages'
import { Header, Footer } from './components'

const App = () => {
	return (
		<Router>
			<div className='flex flex-col min-h-screen'>
				<Header />
				<main className='flex-grow'>
					<Routes>
						<Route path='/' element={<Home />} />
						<Route path='/about' element={<About />} />
						<Route path='/catalog' element={<CatalogPage />} />
						<Route path='/contact' element={<Contact />} />
						<Route path='/export-catalog' element={<ExportCatalog />} />
						<Route path='/export-catalog/:carId' element={<ExportCatalog />} />
						<Route path='/faq' element={<FAQ />} />
						<Route path='/car/:carId' element={<CarDetails />} />
						<Route
							path='/export-catalog/:carId'
							element={<ExportCarDetails />}
						/>
					</Routes>
				</main>
				<Footer />
			</div>
		</Router>
	)
}

export default App
