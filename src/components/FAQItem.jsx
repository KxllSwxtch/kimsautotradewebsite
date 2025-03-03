import PropTypes from 'prop-types'
import { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { motion } from 'framer-motion'

const FAQItem = ({ question, answer }) => {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<div className='border-b border-gray-300'>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className='w-full text-left flex justify-between items-center py-4 px-6 hover:bg-gray-100 transition duration-300'
			>
				<span className='text-lg font-semibold'>{question}</span>
				<motion.div
					animate={{ rotate: isOpen ? 180 : 0 }}
					transition={{ type: 'spring', stiffness: 300, damping: 20 }}
				>
					<FiChevronDown size={22} />
				</motion.div>
			</button>

			<motion.div
				initial={false}
				animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
				transition={{ duration: 0.3, ease: 'easeInOut' }}
				className='overflow-hidden'
			>
				<p className='px-6 pb-4 text-gray-600'>{answer}</p>
			</motion.div>
		</div>
	)
}

FAQItem.propTypes = {
	question: PropTypes.string.isRequired,
	answer: PropTypes.string.isRequired,
}

export default FAQItem
