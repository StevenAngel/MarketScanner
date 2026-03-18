import express from 'express'
import Parser from 'rss-parser';
import cors from 'cors'
import rateLimit from "express-rate-limit";
import dotenv from 'dotenv'
const app = express()
const parser = new Parser();
const limiter = rateLimit({
    windowMs: 1000, // 1 second
    max: 1, // max 1 requests per IP
    handler: (req, res) => {
        res.status(429).json({
            error: "RATE_LIMIT",
            message: "Too many requests.",
            retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
        });
    }
});

const moralisMobulaChain = {
    eth: "ethereum",
    bsc: "bsc",
    arbitrum: "arbitrum",
    polygon: "polygon",
    base: "base"
}

dotenv.config()
app.use(express.json())
app.use(cors())

// Endpoint to get rss feed from cointelegraph and sort data
app.get('/rss', async (req, res) => {
    const parsed = await parser.parseURL("https://decrypt.co/feed")
    const news = []
    const allCategories = new Set([])
    parsed.items.forEach(element => {
        let categories = null
        if (!Array.isArray(element.categories)) {
            if (element.categories != '') categories = [element.categories]
        } else {
            const internalCategories = []
            element.categories.forEach(element => {
                if (element != '') internalCategories.push(element)
            });
            categories = internalCategories
        }

        categories.forEach(cat => allCategories.add(cat))
        const imageUrl = element.enclosure.url
        news.push({ title: element.title, link: element.link, categories, imageUrl, author: element.creator, date: element.isoDate, content: element.contentSnippet })
    });
    res.send({ news, allCategories: Array.from(allCategories) })
})

// Endpoint to get portfolio from user, uses moralis for the data
app.post('/portfolio', limiter, async (req, res) => {
    const wallet = req.body.wallet
    const chain = req.body.chain
    const portfolio = await getPortfolio(wallet, chain)
    const portfolioHistory = await getPortfolioHistory(portfolio, chain)
    res.send({ portfolio, portfolioHistory })
})

// Endpoint to get a coins history
app.post('/coinHistory', async (req, res) => {
    const coin = req.body.coin || "BTC"
    let startTime = req.body.timestamp
    let candles = []
    do {
        const requestUrl = startTime ? `https://fapi.binance.com/fapi/v1/klines?symbol=${coin}USDT&interval=1d&startTime=${startTime}` : `https://fapi.binance.com/fapi/v1/klines?symbol=${coin}USDT&interval=1d`
        const coinHistory = await fetch(requestUrl).then(res => res.json()).catch(err => console.error(err))
        candles = [...candles, ...coinHistory.map(val => { return { time: val[0], price: val[4] } })]
        startTime = candles[candles.length - 1].time
    } while (candles[candles.length - 1].time <= Date.now() - (1000 * 60 * 60 * 24)) // Last candle < 24h
    res.send(candles)
})

// Endpoint to get coin data
app.post('/coinData', async (req, res) => {
    const coin = req.body.coin.toUpperCase() || "BTC"
    const data = await fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?symbol=${coin}`, {
        headers: {
            "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY
        }
    }).then(res => res.json()).catch(err => console.error(err))
    const transformedData = { symbol: coin, name: data.data[coin][0].name, description: data.data[coin][0].description, logo: data.data[coin][0].logo, website: data.data[coin][0].urls.website[0], twitter: data.data[coin][0].urls.twitter[0], explorer: data.data[coin][0].urls.explorer[0], reddit: data.data[coin][0].urls.reddit[0], technicalDocs: data.data[coin][0].urls.technical_doc[0], sourceCode: data.data[coin][0].urls.source_code[0], launched: data.data[coin][0].date_launched }
    res.send(transformedData)
})

app.listen('3000', () => {
    console.log('Running on http://localhost:3000')
})

async function getPortfolio(wallet, chain) {
    const options = {
        method: 'GET',
        headers: {
            'X-API-Key': process.env.MORALIS_API_KEY
        }
    };

    const tokenBalances = await fetch(`https://deep-index.moralis.io/api/v2.2/wallets/${wallet}/tokens?chain=${chain}&exclude_spam=true&max_token_inactivity=30&min_pair_side_liquidity_usd=1`, options)
        .then(res => res.json())
        .catch(err => console.error(err));

    const formattedResponse = tokenBalances.result.filter(token => token.usd_value > 0.01).map(element => {
        return { symbol: element.symbol, logo: element.logo, balance: element.balance_formatted, usdValue: element.usd_value, usdPrice: element.usd_price, portfolioPercent: element.portfolio_percentage, address: element.token_address }
    })

    return formattedResponse
}

// Get history from all tokens in users wallet using mobula api
async function getPortfolioHistory(tokens, chain) {
    const mobulaChain = moralisMobulaChain[chain]
    const from = Date.now() - (365 * 2 * 24 * 60 * 60 * 1000) // 1 year in past
    // Map request history + token data for each token
    const tokensHistory = tokens.map(async (element) => {
        const requestUrl = `https://api.mobula.io/api/1/market/history?asset=${element.address}&blockchain=${mobulaChain}&period=1d&from=${from}`
        const tokenHistory = await fetch(requestUrl, {
            method: 'GET',
            headers: {
                "Authorization": process.env.MOBULA_API_KEY
            }
        }).then(res => res.json()).catch(err => console.error(err));

        return { ...element, history: tokenHistory.data.price_history }
    })

    const tokensWithHistory = await Promise.all(tokensHistory)
    const protfolioHistory = transformPortfolioHistory(tokensWithHistory)
    return protfolioHistory
}

/**
 * Transform the portfolio history. In goes each token with its own balance, history, value, etc.
 * Out: calculated all tokens balance*price to specific time in history. Format: [time, porfolioValueOfAllTokens]
 */
function transformPortfolioHistory(tokens) {
    const timeMap = {}
    tokens.forEach(token => {
        const tokenBalance = Number(token.balance)
        // historyElement == [time, price]
        token.history.forEach(historyElement => {
            if (!timeMap[historyElement[0]]) timeMap[historyElement[0]] = 0
            timeMap[historyElement[0]] += tokenBalance * historyElement[1]
        })
    })
    const protfolioHistory = Object.entries(timeMap).map(([ts, price]) => {
        const timestamp = new Date(Number(ts)).toLocaleDateString()
        return { timestamp, price }
    })
    return protfolioHistory
}