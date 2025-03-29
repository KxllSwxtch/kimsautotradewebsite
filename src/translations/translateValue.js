import translations from './translations'

export function translateValue(value) {
	if (!value) return ''
	if (translations[value]) return translations[value]

	// Попробуем найти по частичному совпадению
	const foundKey = Object.keys(translations).find((key) => value.includes(key))
	if (foundKey) {
		// Заменяем найденный кусок на перевод
		return value.replace(foundKey, translations[foundKey])
	}

	// Если ничего не нашли — вернуть оригинал
	return value
}
