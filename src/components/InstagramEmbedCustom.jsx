import PropTypes from 'prop-types'
import { useEffect, useRef } from 'react'

const InstagramEmbedCustom = ({ url }) => {
	const embedRef = useRef(null)

	useEffect(() => {
		const processEmbeds = () => {
			if (window.instgrm && window.instgrm.Embeds && embedRef.current) {
				window.instgrm.Embeds.process()
			}
		}

		// Если скрипт ещё не загружен, добавляем его
		if (!window.instgrm) {
			const script = document.createElement('script')
			script.src = 'https://www.instagram.com/embed.js'
			script.async = true
			script.onload = processEmbeds
			document.body.appendChild(script)
		} else {
			processEmbeds()
		}
	}, [url])

	return (
		<div
			ref={embedRef}
			className='
        p-4 
        bg-white 
        rounded-lg 
        shadow-lg 
        transform 
        transition 
        duration-300 
        hover:scale-105 
        flex 
        justify-center 
        items-center
      '
		>
			<blockquote
				className='instagram-media'
				data-instgrm-permalink={url}
				data-instgrm-version='14'
				style={{
					background: '#FFF',
					border: 'none',
					margin: 0,
					padding: 0,
					maxWidth: '100%',
					width: '100%',
				}}
			>
				<a href={url}>View post</a>
			</blockquote>
		</div>
	)
}

InstagramEmbedCustom.propTypes = {
	url: PropTypes.string.isRequired,
}

export default InstagramEmbedCustom
