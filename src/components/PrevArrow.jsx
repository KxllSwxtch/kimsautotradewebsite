import PropTypes from 'prop-types'

const PrevArrow = (props) => {
	const { className, style, onClick } = props
	return (
		<div
			className={`${className} custom-arrow prev-arrow`}
			style={{
				...style,
				display: 'block',
				left: '10px',
				zIndex: 2,
				background: 'rgba(0, 0, 0, 0.5)',
				borderRadius: '50%',
			}}
			onClick={onClick}
		/>
	)
}

PrevArrow.propTypes = {
	className: PropTypes.string,
	style: PropTypes.object,
	onClick: PropTypes.func,
}

export default PrevArrow
