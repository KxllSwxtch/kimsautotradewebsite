import { FaInstagram, FaYoutube } from "react-icons/fa"
import { SiTiktok } from "react-icons/si"

const Footer = () => {
  return (
    <footer className="bg-primary-500 text-secondary-500 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Левый блок: Логотип, описание и соцсети */}
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <img
              src="https://res.cloudinary.com/pomegranitedesign/image/upload/v1739951461/kimsautotrade/logo.jpg"
              alt="Kim's Auto Trade"
              className="w-40 mx-auto md:mx-0"
            />
            <p className="mt-2 text-sm">
              Продажа авто в Южной Корее и Экспорт под ключ для клиентов и
              дилеров из стран СНГ
            </p>
            <div className="flex justify-center md:justify-start gap-4 mt-4">
              <a
                href="https://www.instagram.com/kims_auto_trade_official"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:text-accent-500 transition-colors duration-300"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.tiktok.com/@kims_auto_trade"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:text-accent-500 transition-colors duration-300"
              >
                <SiTiktok />
              </a>
              <a
                href="https://www.youtube.com/@Ramis_Safin97"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:text-accent-500 transition-colors duration-300"
              >
                <FaYoutube />
              </a>
            </div>
          </div>
          {/* Правый блок: Контакты и копирайт */}
          <div className="text-center md:text-right">
            <h3 className="text-lg font-semibold">Контакты</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="transition-colors duration-300 hover:text-accent-500">
                Артём:{" "}
                <a href="tel:+821082828062" className="underline">
                  +82 10-8282-8062
                </a>
              </li>
              <li className="transition-colors duration-300 hover:text-accent-500">
                Рамис:{" "}
                <a href="tel:+821080296232" className="underline">
                  +82 10-8029-6232
                </a>
              </li>
            </ul>
            <p className="mt-4 text-xs">
              © {new Date().getFullYear()} Kim&apos;sAutoTrade. Все права
              защищены.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
