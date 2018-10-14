import * as cheerio from 'cheerio'
import axios from 'axios'
import * as R from 'ramda'

const modas = ['Artvigil', 'Modalert', 'Modvigil', 'Waklert', 'Modawake']

export async function fetchPresent() {
    let $ = cheerio.load(
        await axios.get('https://modafinilcat.com.ua/').then(resp => resp.data)
    )
    let absent = $(
        'a.b-product-buy-link>div>h2:has(span:contains(Временно отсутствует))'
    )
        .toArray()
        .map(h => h.childNodes[2].data)
    let diff = R.difference(modas, absent)

    return diff
}
