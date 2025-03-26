import { FAQItem } from '../components'

const faqData = [
	{
		question: 'Как заказать автомобиль?',
		answer:
			'Вы можете заказать автомобиль через наш сайт, связавшись с менеджером в Telegram или WhatsApp.',
	},
	{
		question: 'Какие способы оплаты доступны?',
		answer:
			'Мы принимаем платежи в KRW, USD, USDT. Также возможен перевод на расчетный счет.',
	},
	{
		question: 'Сколько занимает доставка автомобиля?',
		answer:
			'Средний срок доставки — от 30 до 45 дней, в зависимости от направления.',
	},
	{
		question: 'Есть ли гарантия на автомобили?',
		answer:
			'Да, все автомобили проходят диагностику перед отправкой. Возможны дополнительные услуги гарантии.',
	},
	{
		question: 'Как проверить авто перед покупкой?',
		answer:
			'Вы можете заказать технический отчет и проверку автомобиля на историю ДТП.',
	},
]

const FAQPage = () => {
	return (
		<div className='container mx-auto mt-30 p-6'>
			<h1 className='text-3xl font-bold text-center mb-8'>
				Часто задаваемые вопросы
			</h1>
			<div className='bg-white shadow-lg rounded-lg p-6'>
				{faqData.map((item, index) => (
					<FAQItem key={index} question={item.question} answer={item.answer} />
				))}
			</div>
		</div>
	)
}

export default FAQPage
