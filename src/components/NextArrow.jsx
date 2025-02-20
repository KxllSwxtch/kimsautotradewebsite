import PropTypes from 'prop-types'

const NextArrow = (props) => {
	const { className, style, onClick } = props
	return (
		<div
			className={`${className} custom-arrow next-arrow`}
			style={{
				...style,
				display: 'block',
				right: '10px',
				zIndex: 2,
				background: 'rgba(0, 0, 0, 0.5)',
				borderRadius: '50%',
			}}
			onClick={onClick}
		/>
	)
}

NextArrow.propTypes = {
	className: PropTypes.string,
	style: PropTypes.object,
	onClick: PropTypes.func,
}

export default NextArrow
