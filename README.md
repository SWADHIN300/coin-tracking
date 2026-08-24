# Coin Tracking

A real-time cryptocurrency tracking platform for monitoring live prices, market trends, and portfolio performance across major digital assets like BTC, ETH, and SOL.

**Live Demo:** [coin-tracking-three.vercel.app](https://coin-tracking-three.vercel.app/)

## Features

- **Live Market Data** — Real-time prices, market cap, and trading volume sourced from the CoinGecko API
- **Interactive Charts** — Candlestick charts and TradingView widgets for technical analysis
- **Coin Explorer** — Paginated coin listings, detailed per-coin pages, trending assets, and category browsing
- **Search** — Command-palette style search modal for quickly finding any tracked asset
- **Currency Converter** — Convert between cryptocurrencies and fiat at live rates
- **Portfolio Tracking** — Authenticated users can log holdings and track portfolio value over time
- **Liquidity Pool Board** — View and track liquidity pool positions
- **Authentication** — Email/password sign-up and sign-in with secure session handling (NextAuth + bcrypt)
- **Light/Dark Theme** — Full theme support via a persistent theme toggle

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS, Radix UI primitives
- **Charts:** Lightweight Charts, TradingView widgets
- **Auth:** NextAuth, bcryptjs
- **Database/ORM:** PostgreSQL, Prisma
- **Data Fetching:** SWR
- **Validation:** Zod
- **Market Data Source:** [CoinGecko API](https://www.coingecko.com/en/api)

## Project Structure

```
block-coin/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   # NextAuth route handler
│   │   └── coingecko/            # CoinGecko API proxy route
│   ├── coins/                    # Coin listing + [id] detail pages
│   ├── portfolio/                # Portfolio dashboard, actions
│   ├── sign-in/, sign-up/        # Auth pages
│   └── page.tsx                  # Home page
├── components/
│   ├── auth/                     # Sign-in/sign-up forms
│   ├── home/                     # Hero, trending, categories, news
│   ├── portfolio/                # Holdings form, liquidity pool board
│   ├── ui/                       # Reusable UI primitives
│   └── ...                       # Charts, search modal, converter, etc.
├── lib/                          # Utilities, API clients
├── prisma/
│   └── schema.prisma             # Database schema
└── types/                        # Shared TypeScript types
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/SWADHIN300/coin-tracking.git
   cd coin-tracking
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (see `.env.example`) — you'll need a PostgreSQL connection string and NextAuth secret.
4. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

Deployed on [Vercel](https://vercel.com/). Ensure environment variables (database URL, NextAuth secret) are configured in your deployment environment before deploying.

## License

This project is open-source under the MIT License.
