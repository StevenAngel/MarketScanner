import express from 'express'
import { XMLParser } from 'fast-xml-parser'
import cors from 'cors'
import rateLimit from "express-rate-limit";
import dotenv from 'dotenv'
dotenv.config()
const app = express()
const parser = new XMLParser();
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

app.use(express.json())
app.use(cors())

// Endpoint to get rss feed from cointelegraph and sort data
app.get('/rss', async (req, res) => {
    const feed = await fetch('https://cointelegraph.com/rss', {
        headers: {
            // Gängiger User-Agent String für Chrome
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8'
        }
    }).then(res => res.text()).catch(err => console.error(err))
    // Parse xml to json
    const parsed = parser.parse(feed).rss.channel.item
    const news = []
    const allCategories = []
    parsed.forEach(element => {
        let categories = null
        if (!Array.isArray(element.category)) {
            categories = [element.category]
        } else {
            categories = element.category
        }

        categories.forEach(cat => {
            if (!allCategories.includes(cat)) allCategories.push(cat)
        })
        const imageUrl = element.description.split("src=")[1].match(/"(.*?)"/)[1]
        news.push({ title: element.title, link: element.link, imageUrl, categories })
    });
    res.send({ news, allCategories })
})

// Endpoint to get portfolio from user, uses moralis for the data
app.post('/portfolio', limiter, async (req, res) => {
    const formattedResponse = []
    const wallet = req.body.wallet
    const chain = req.body.chain
    const options = {
        method: 'GET',
        headers: {
            'X-API-Key': process.env.MORALIS_API_KEY
        }
    };

    const tokenBalances = fetch(`https://deep-index.moralis.io/api/v2.2/wallets/${wallet}/tokens?chain=${chain}&exclude_spam=true&max_token_inactivity=30&min_pair_side_liquidity_usd=1&exclude_native=false`, options)
        .then(res => res.json())
        .catch(err => console.error(err));

    tokenBalances.result.forEach(element => {
        formattedResponse.push({ symbol: element.symbol, logo: element.logo, balance: element.balance_formatted, usdValue: element.usd_value, usdPrice: element.usd_price, portfolioPercent: element.portfolio_percentage })
    })
    res.send(formattedResponse)
})

app.listen('3000', () => {
    console.log('Running on http://localhost:3000')
})