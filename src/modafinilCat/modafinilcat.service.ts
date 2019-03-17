import * as cheerio from 'cheerio'
import axios from 'axios'
import * as R from 'ramda'

export async function fetchPresentModas() {
    let $ = cheerio.load(
        await axios.get('https://modafinilcat.com.ua/').then(resp => resp.data)
    )
    let presentModas = $(
        'a.b-product-buy-link>div>h2:not(:has(span:contains(Временно отсутствует)))'
    )
        .toArray()
        .map(h => h.childNodes[2].data)

    return presentModas
}
