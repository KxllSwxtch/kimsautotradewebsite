import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { Home, About, Catalog, Contact } from './pages'
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
						<Route path='/catalog' element={<Catalog />} />
						<Route path='/contact' element={<Contact />} />
					</Routes>
				</main>
				<Footer />
			</div>
		</Router>
	)
}

export default App
