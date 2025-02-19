import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { Home, About, Catalog, Contact } from './pages'

const App = () => {
	return (
		<Router>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/about' element={<About />} />
				<Route path='/catalog' element={<Catalog />} />
				<Route path='/contact' element={<Contact />} />
			</Routes>
		</Router>
	)
}

export default App
