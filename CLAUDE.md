# Kim's Auto Trade - Project Context for Claude

## Project Overview

This is a React-based website for Kim's Auto Trade, a Korean car export business specializing in selling vehicles from South Korea to CIS countries (Russia, Kazakhstan, Kyrgyzstan). The site allows users to browse car catalogs from Korean markets, calculate import costs, and connect with sales representatives.

## Technology Stack

### Core Technologies

- **React**: v19.0.0 - Latest React with functional components and hooks
- **Vite**: v6.1.0 - Build tool and dev server
- **React Router**: v7.2.0 - SPA routing
- **Tailwind CSS**: v4.0.7 - Utility-first CSS framework with custom theme
- **Node.js**: Requires v22.9.0 or higher

### Key Dependencies

- **axios**: HTTP client for API calls
- **react-icons**: Icon library (using Heroicons and React Icons)
- **react-select**: Custom select dropdowns
- **react-slick**: Carousel/slider components
- **framer-motion**: Animation library
- **swiper**: Modern touch slider

## Project Structure

```
kimsautotradewebsite/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header.jsx       # Navigation header
│   │   ├── Footer.jsx       # Site footer
│   │   ├── HeroSection.jsx  # Landing hero
│   │   ├── CarCard.jsx      # Car listing card
│   │   ├── Calculator.jsx   # Import cost calculator
│   │   ├── Loader.jsx       # Loading spinner
│   │   └── index.js         # Centralized exports
│   ├── pages/               # Route pages
│   │   ├── Home.jsx         # Landing page
│   │   ├── ExportCatalog.jsx # Main car catalog (Encar API)
│   │   ├── ExportCarDetails.jsx # Individual car details
│   │   ├── About.jsx        # About page
│   │   ├── Contact.jsx      # Contact info
│   │   └── FAQ.jsx          # FAQ section
│   ├── translations/        # Multi-language support
│   │   ├── translations.js  # UI text translations
│   │   ├── carBrands.js     # Brand name translations
│   │   ├── carModels.js     # Model translations
│   │   └── carTrims.js      # Trim level translations
│   ├── utils/               # Helper functions
│   │   ├── formatDate.js    # Date formatting
│   │   ├── formatModelName.js # Model name formatting
│   │   ├── brandLogos.js    # Brand logo mappings
│   │   └── colorOptions.js  # Car color options
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles & Tailwind
├── public/                  # Static assets
├── dist/                    # Build output
└── package.json             # Dependencies & scripts
```

## Available Scripts

```bash
npm run dev       # Start development server (Vite)
npm run build     # Production build
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

## API Integrations

### 1. Encar API (Korean Car Marketplace)

- **Base URL**: `https://api.encar.com/v1/`
- **Endpoints**:
  - `/readside/vehicle/{carId}` - Car details
  - `/readside/inspection/vehicle/{vehicleId}` - Inspection reports
- **Image CDN**: `https://ci.encar.com/carpicture{path}`

### 2. Currency Exchange APIs

- **USD to KRW**: `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json`
- **USDT to RUB**: `https://api.coinbase.com/v2/prices/USDT-RUB/spot`
- **KRW to USDT**: `https://api.bithumb.com/v1/ticker?markets=KRW-USDT`

### 3. Customs Calculator

- **URL**: `https://calcus.ru/calculate/Customs`
- Used for Russian import duty calculations

### 4. Legacy Backend (Currently commented out)

- **URL**: `https://ark-motors-backend-3a002a527613.herokuapp.com`
- Endpoints for internal car catalog (not actively used)

## Styling Conventions

### Tailwind CSS Custom Theme

The project uses Tailwind CSS v4 with custom OKLCH color definitions in `src/index.css`:

```css
@theme {
  --color-primary-500: oklch(0 0 0); /* Black */
  --color-secondary-500: oklch(1 0 0); /* White */
  --color-gray-light-500: oklch(0.96 0.02 235); /* Light gray */
  --color-gray-dark-500: oklch(0.37 0.03 250); /* Dark gray */
  --color-accent-500: oklch(0.8 0.2 85); /* Yellow accent */
  --color-silver-500: oklch(0.67 0.02 265); /* Silver */
}
```

### Component Styling Patterns

- Use Tailwind utility classes directly in JSX
- Responsive design with `md:`, `lg:` prefixes
- Common patterns: `max-w-7xl mx-auto px-4` for container
- Hover states: `hover:bg-red-700` for interactive elements

## Component Patterns

### Functional Components with Hooks

All components use modern React patterns:

```jsx
import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

const Component = () => {
  const [state, setState] = useState(initialValue)

  useEffect(() => {
    // Side effects
  }, [dependencies])

  return <div>...</div>
}

export default Component
```

### Centralized Exports

Each module folder has an `index.js` for clean imports:

```javascript
// components/index.js
export { default as Header } from "./Header"
export { default as Footer } from "./Footer"
// Usage: import { Header, Footer } from './components'
```

## Translation System

The project supports multiple languages (Russian primary, with Korean/English names):

### Translation Structure

- `translations.js` - UI text in Russian
- `carBrands.js` - Brand name mappings
- `carModels.js` - Model translations by brand
- `translateSmartly()` - Smart translation function

### Usage Example

```javascript
import { translations, translateSmartly } from "../translations"

// Get translated text
const text = translations.heroTitle // "Продажа автомобилей"

// Translate car names
const translatedName = translateSmartly(carName, "ru")
```

## Key Features

### 1. Car Catalog (`ExportCatalog.jsx`)

- Fetches live data from Encar API
- Advanced filtering: brand, model, price, mileage, year
- Pagination with 20 items per page
- Sort options: newest, price ascending/descending
- Search by car number

### 2. Car Details Page (`ExportCarDetails.jsx`)

- Detailed vehicle information
- Image gallery with slider
- Inspection report integration
- Import cost calculators for Kazakhstan/Kyrgyzstan
- WhatsApp/Instagram contact buttons

### 3. Import Calculators

- **Kazakhstan Calculator**: Customs duties, recycling fee, VAT
- **Kyrgyzstan Calculator**: Similar with country-specific rates
- Real-time currency conversion (KRW → USD → Local currency)

### 4. Contact Integration

- WhatsApp links: `https://wa.me/821082828062`
- Instagram: `@auto_korea_cheongju` and `@ramis_auto_korea`

## Deployment

### Netlify Configuration (`netlify.toml`)

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200  # SPA routing

[build.environment]
  NODE_VERSION = "22.10.0"
```

## Development Guidelines

### Code Quality

- ESLint configured for React 19
- No unnecessary comments in code
- Consistent functional component pattern
- Proper error handling for API calls

### Best Practices

1. **State Management**: Use local state with useState for component-level data
2. **Side Effects**: Handle API calls in useEffect with cleanup
3. **Routing**: Use React Router's useNavigate and useLocation hooks
4. **Styling**: Prefer Tailwind utilities over custom CSS
5. **Translations**: Always use the translation system for user-facing text
6. **API Calls**: Use axios with proper error handling
7. **Loading States**: Show Loader component during data fetching

### Common Tasks

#### Adding a New Page

1. Create component in `src/pages/`
2. Export from `src/pages/index.js`
3. Add route in `App.jsx`
4. Update navigation in `Header.jsx`

#### Adding API Integration

1. Use axios for HTTP requests
2. Handle loading/error states
3. Add proper error messages in Russian
4. Consider adding to utils if reusable

#### Modifying Styles

1. Use Tailwind classes primarily
2. Custom CSS only in `index.css` if needed
3. Maintain responsive design (mobile-first)

## Current Status & Notes

- **Active Features**: Export catalog from Encar, car details, calculators
- **Commented Out**: Instagram section, internal catalog
- **Duplicate Route**: `/export-catalog/:carId` appears twice in routes (needs cleanup)
- **Primary Market**: Russian-speaking customers in CIS countries
- **Business Model**: Korean car export with full logistics support

## Environment Requirements

- Node.js 22.9.0 or higher
- npm or yarn package manager
- Modern browser with ES6+ support

## Testing

Currently no test setup. To add tests:

1. Install testing libraries (Jest, React Testing Library)
2. Add test scripts to package.json
3. Create `__tests__` folders in components/pages

## Performance Considerations

- Images loaded from Encar CDN (external)
- Pagination to limit data per request
- Lazy loading for route components recommended
- Consider implementing React.memo for expensive components

## Security Notes

- No authentication currently implemented
- API keys/secrets should be in environment variables
- CORS handled via API configuration
- WhatsApp/Instagram links are public business accounts
