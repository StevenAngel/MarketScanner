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
    // const feed = await fetch('https://cointelegraph.com/rss', {
    //     headers: {
    //         // Gängiger User-Agent String für Chrome
    //         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    //         'Accept': 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8'
    //     }
    // }).then(res => res.text()).catch(err => console.error(err))
    // // Parse xml to json
    // const parsed = parser.parse(feed).rss.channel.item
    // const news = []
    // const allCategories = new Set([])
    // parsed.forEach(element => {
    //     let categories = null
    //     if (!Array.isArray(element.category)) {
    //         categories = [element.category]
    //     } else {
    //         categories = element.category
    //     }

    //     categories.forEach(cat => allCategories.add(cat))
    //     const imageUrl = element.description.split("src=")[1].match(/"(.*?)"/)[1]
    //     news.push({ title: element.title, link: element.link, imageUrl, categories })
    // });
    // res.send({ news, allCategories: Array.from(allCategories) })

    // const feed = await fetch('https://decrypt.co/feed', {
    //     headers: {
    //         // Gängiger User-Agent String für Chrome
    //         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    //         'Accept': 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8'
    //     }
    // }).then(res => res.text()).catch(err => console.error(err))
    // Parse xml to json
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
        console.log(element)
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