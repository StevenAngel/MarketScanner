import express from 'express'
import { XMLParser } from 'fast-xml-parser'
import cors from 'cors'

const app = express()
const parser = new XMLParser();

app.use(express.json())
app.use(cors())

app.get('/rss', async (req, res) => {
    const feed = await fetch('https://news.bitcoin.com/feed/', {
        headers: {
            // Ein gängiger User-Agent String für Chrome
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8'
        }
    }).then(res => res.text()).catch(err => console.error(err))

    // Parse xml to json
    const news = parser.parse(feed).rss.channel.item
    res.send(news)
})

app.listen('3000', () => {
    console.log('Running on http://localhost:3000')
})