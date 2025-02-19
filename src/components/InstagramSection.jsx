import InstagramEmbedCustom from './InstagramEmbedCustom'

// Замените эти URL на актуальные посты/ролики из профиля
const posts = [
	'https://www.instagram.com/p/DEmJ_eszcpy/',
	'https://www.instagram.com/p/DCbUeo8Trfb/?img_index=1',
	'https://www.instagram.com/p/DFkYl2myY16/',
]

const InstagramSection = () => {
	return (
		<section className='py-16 bg-grayLight-500'>
			<div className='max-w-7xl mx-auto px-4'>
				<h2 className='text-3xl font-bold text-center text-primary-500 mb-8'>
					Свежие посты Kim's Auto Trade
				</h2>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
					{posts.map((url, index) => (
						<div key={index} className='flex justify-center'>
							<div className='bg-white rounded-xl shadow-md overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-xl'>
								<InstagramEmbedCustom url={url} />
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}

export default InstagramSection
