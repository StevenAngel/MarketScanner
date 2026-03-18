# 📊 MarketScanner

> A full-stack crypto market dashboard built as a portfolio project — featuring real-time market data, multi-chain portfolio tracking, an interactive portfolio builder, coin detail pages, and a live crypto news feed.

---

## ✨ Features

### 🏠 Market Overview — Live Ticker Table
- Displays the **Top 100 / Top 200** USDT perpetual futures from Binance, sorted by 24h trading volume
- All prices and stats update **in real-time** via a **Binance WebSocket** connection (`wss://fstream.binance.com`)
- Sortable columns: **#, Symbol, Price, Change %, Change USD, Volume, Volume USD**
- Price changes are color-coded (green / red) for quick scanning
- Toggle between **Top 100** and **Top 200** coins with a single button
- Click any coin in the table to navigate to its dedicated detail page

---

### 💼 Portfolio Tracker — Multi-Chain Wallet Overview
- Connect your **Web3 wallet** using [Reown AppKit](https://reown.com/) (supports MetaMask, WalletConnect, and more)
- Select from multiple **EVM chains**: **Ethereum, BSC, Arbitrum, Polygon, Base**
- Your **live token balances** and current USD values are fetched via the **Moralis API**
- Spam tokens and illiquid positions are automatically filtered out
- **Pie Chart** — Visual breakdown of your portfolio allocation across all held tokens
- **Line Chart** — Historical portfolio performance chart for the **last 2 years**, computed from individual token price histories via the **Mobula API**
- Switching chains instantly refreshes all charts

---

### 🛠️ Portfolio Builder — Backtesting
- Build a **hypothetical portfolio** using any coin listed on Binance
- Select multiple coins from a searchable crypto selector (dynamically populated from Binance)
- Assign a **percentage weight** to each coin in the portfolio
- Set a **start date** and an **initial investment value (in USD)**
- The chart dynamically calculates and renders the **simulated portfolio performance** over time using historical daily close prices from the **Binance REST API** (via backend proxy)
- Useful for comparing the performance of different asset allocations

---

### 🪙 Coin Detail Page — Individual Coin Data & Charts
- Navigate to any coin from the market table to see its dedicated page
- Displays rich metadata fetched from the **CoinMarketCap API**:
  - Logo, name, launch date, full description
  - Links to: **Website, Block Explorer, Whitepaper, Source Code, Reddit, X (Twitter)**
- Embeds a full **TradingView Advanced Chart** widget for the selected coin's USDT perpetual pair
  - Interactive candlestick chart with indicators, drawing tools, and timeframe selection

---

### 📰 Crypto News Feed — RSS Integration
- Aggregates the latest crypto news articles from **Decrypt.co** via the RSS feed
- Articles display: **title, thumbnail image, author, date, content preview, and categories**
- Filter news by **category tags** (e.g. DeFi, Bitcoin, NFTs, etc.)
- All RSS parsing and data transformation is handled by the **Node.js backend**

---

## 🏗️ Architecture

The project uses a **monorepo structure** with a **Vue.js frontend** and a lightweight **Express.js backend** running concurrently in development.

```
MarketScanner/
├── src/                    # Vue.js frontend
│   ├── views/              # Page-level components
│   │   ├── HomeView.vue    # Market table (live ticker)
│   │   ├── PortfolioView.vue # Portfolio tracker + wallet connect
│   │   ├── CoinView.vue    # Coin detail + TradingView chart
│   │   └── NewsView.vue    # RSS crypto news feed
│   ├── components/
│   │   ├── charts/         # ECharts line chart & pie chart
│   │   ├── markets/        # Market table, rows, header cells
│   │   ├── portfolio/      # Portfolio builder, chain selector, crypto selector
│   │   ├── walletConnect/  # Reown AppKit wallet button
│   │   └── layout/         # Navbar, custom button, etc.
│   ├── router/             # Vue Router route definitions
│   └── stores/             # Shared reactive state (appState)
├── backend/
│   └── server.js           # Express API proxy server
├── public/                 # Static assets
├── vite.config.js
└── package.json
```

---

## 🔌 APIs & Data Sources

| Service | Usage | Type |
|---|---|---|
| **Binance Futures REST API** | Top 200 tickers, coin price history | REST |
| **Binance Futures WebSocket** | Real-time ticker updates for all coins | **WebSocket** |
| **Moralis API** | Wallet token balances across EVM chains | REST |
| **Mobula API** | Historical token price data for portfolio history | REST |
| **CoinMarketCap API** | Coin metadata (logo, description, links) | REST |
| **TradingView Widget** | Embedded advanced trading chart | Widget/Embed |
| **Decrypt.co RSS Feed** | Crypto news articles | **RSS Feed** |

> The Express backend acts as a **secure proxy** for all API-key-protected endpoints (Moralis, Mobula, CoinMarketCap), keeping keys out of the browser. It also includes **rate limiting** to protect against abuse.

---

## 🧰 Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| ![Vue](https://img.shields.io/badge/Vue.js_3-35495E?style=flat&logo=vuedotjs&logoColor=4FC08D) | UI framework (Composition API + `<script setup>`) |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) | Build tool & dev server |
| ![Vue Router](https://img.shields.io/badge/Vue_Router_5-35495E?style=flat&logo=vuedotjs&logoColor=4FC08D) | Client-side routing |
| ![ECharts](https://img.shields.io/badge/Apache_ECharts-AA344D?style=flat&logo=apacheecharts&logoColor=white) | Interactive charts (line chart, pie chart) |
| ![TradingView](https://img.shields.io/badge/TradingView-131722?style=flat&logo=tradingview&logoColor=white) | Advanced embedded trading charts |
| ![Wagmi](https://img.shields.io/badge/Wagmi-000000?style=flat&logo=ethereum&logoColor=white) | Ethereum wallet hooks |
| ![Reown AppKit](https://img.shields.io/badge/Reown_AppKit-7C3AED?style=flat) | Multi-wallet connect modal |
| ![viem](https://img.shields.io/badge/viem-FCD34D?style=flat) | Ethereum/EVM utilities |
| ![VueUse](https://img.shields.io/badge/VueUse-41B883?style=flat&logo=vuedotjs&logoColor=white) | Vue composition utilities |

### Backend

| Technology | Purpose |
|---|---|
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white) | JavaScript runtime |
| ![Express](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white) | REST API server & proxy |
| ![rss-parser](https://img.shields.io/badge/rss--parser-FF6600?style=flat) | RSS feed parsing (Decrypt.co) |
| ![express-rate-limit](https://img.shields.io/badge/Rate_Limiting-D00000?style=flat) | API abuse protection |
| ![dotenv](https://img.shields.io/badge/dotenv-ECD53F?style=flat&logo=dotenv&logoColor=black) | Environment variable management |

### Dev Tooling

| Technology | Purpose |
|---|---|
| ![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=flat&logo=prettier&logoColor=black) | Code formatting |
| ![concurrently](https://img.shields.io/badge/concurrently-222222?style=flat) | Run frontend & backend simultaneously |
| ![nodemon](https://img.shields.io/badge/nodemon-76D04B?style=flat&logo=nodemon&logoColor=white) | Backend auto-restart on file changes |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `>= 20.19.0` or `>= 22.12.0`
- **npm**

### 1. Clone the repository

```bash
git clone https://github.com/your-username/MarketScanner.git
cd MarketScanner
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
MORALIS_API_KEY=your_moralis_api_key
MOBULA_API_KEY=your_mobula_api_key
CMC_API_KEY=your_coinmarketcap_api_key
```

| Variable | Where to get it |
|---|---|
| `MORALIS_API_KEY` | [moralis.io](https://moralis.io) |
| `MOBULA_API_KEY` | [mobula.io](https://mobula.io) |
| `CMC_API_KEY` | [coinmarketcap.com/api](https://coinmarketcap.com/api) |

### 4. Run in development mode

This starts the Vite frontend (port `5173`) and the Express backend (port `3000`) concurrently:

```bash
npm run dev
```

Or run them separately:

```bash
npm run dev:frontend   # Vite dev server
npm run dev:backend    # Express backend with nodemon
```

### 5. Build for production

```bash
npm run build
```

---

## 📝 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start frontend + backend concurrently |
| `npm run dev:frontend` | Start Vite dev server only |
| `npm run dev:backend` | Start Express backend with nodemon |
| `npm run build` | Build the frontend for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run oxlint + ESLint with auto-fix |
| `npm run format` | Format source files with Prettier |

---

## 📄 License

This project is built for portfolio demonstration purposes.