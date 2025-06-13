import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const steps = [
  {
    number: "01",
    title: "Оставляете заявку",
    description:
      "Заполните заявку, и наш менеджер свяжется с вами, чтобы ответить на все вопросы и предложить оптимальные варианты автомобилей с подробными расчетами.",
  },
  {
    number: "02",
    title: "Заключаем договор",
    description:
      "Мы оформляем договор, в котором фиксируем все условия, выбранные вами характеристики автомобиля и нашу ответственность.",
  },
  {
    number: "03",
    title: "Подбираем авто",
    description:
      "Наш менеджер ежедневно подбирает актуальные варианты автомобилей с аукционов и площадок, помогая вам выбрать лучшее предложение.",
  },
  {
    number: "04",
    title: "Доставка и растаможка",
    description:
      "Мы обеспечиваем быструю доставку автомобилей из Кореи и профессиональное прохождение таможенных процедур.",
  },
  {
    number: "05",
    title: "Получение авто",
    description:
      "Мы сопровождаем вас до момента получения автомобиля и регистрации, чтобы процесс был максимально удобным.",
  },
]

const HowToBuySection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [orderType, setOrderType] = useState(null)
  const [comment, setComment] = useState("")

  const handleSubmit = () => {
    if (!name || !phone || !orderType) {
      alert("Пожалуйста, заполните все обязательные поля.")
      return
    }

    const message = `
Имя: ${name}
Телефон: ${phone}

${comment || "Нет"}`

    const phoneNumber =
      orderType === "Купить авто в Корее" ? "821082828062" : "821080296232"
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`

    window.open(whatsappUrl, "_blank")

    setName("")
    setPhone("")
    setOrderType("")
    setComment("")
    setIsModalOpen(false)
  }

  return (
    <section className="py-16 bg-[#f9f9f9]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Заголовок */}
        <motion.h2
          className="text-3xl font-bold text-center text-[#000000] mb-10"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          КАК КУПИТЬ АВТОМОБИЛЬ?
        </motion.h2>

        {/* Карточки шагов */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 transform transition hover:-translate-y-1 hover:shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              {/* Номер шага */}
              <h3 className="text-4xl font-bold text-red-500 mb-2">
                {step.number}
              </h3>
              {/* Заголовок шага */}
              <h4 className="text-xl font-bold text-[#000000] mb-2">
                {step.title}
              </h4>
              {/* Описание шага */}
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Призыв к действию */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-[#000000]">
            Закажите автомобиль{" "}
            <span className="text-red-500">уже сейчас!</span>
          </h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-colors duration-300"
          >
            Оставить заявку
          </button>
        </div>
      </div>

      {/* Модальное окно */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold text-center mb-4">
                Оставить заявку
              </h2>
              <label className="block mb-2 text-gray-700">Имя*</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md mb-4"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <label className="block mb-2 text-gray-700">
                Номер телефона*
              </label>
              <input
                type="tel"
                className="w-full p-2 border rounded-md mb-4"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

              <div className="flex flex-col md:flex-row gap-2 mb-4">
                <button
                  className={`flex-1 py-2 px-4 rounded-md ${
                    orderType === "Купить авто в Корее"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setOrderType("Купить авто в Корее")}
                >
                  Купить авто в Корее
                </button>
                <button
                  className={`flex-1 py-2 px-4 rounded-md ${
                    orderType === "Заказать авто из Кореи"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setOrderType("Заказать авто из Кореи")}
                >
                  Заказать авто из Кореи
                </button>
              </div>

              <label className="block mb-2 text-gray-700">Комментарий</label>
              <textarea
                className="w-full p-2 border rounded-md mb-4"
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>

              <div className="flex justify-between">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 transition-colors duration-300 px-4 py-2 rounded-md cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-green-500 hover:bg-green-600 transition-colors duration-300 text-white px-4 py-2 rounded-md cursor-pointer"
                >
                  Отправить
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default HowToBuySection
