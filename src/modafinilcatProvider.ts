import * as cheerio from "cheerio"
import axios from "axios"
import * as R from "ramda"

const modas = ["Artvigil", "Modalert", "Modvigil", "Waklert", "Modawake"]

export let fetchPresentModas = async () => {
    let $ = cheerio.load(
      await axios.get("https://modafinilcat.com.ua/").then(resp => resp.data)
    )
    let absent = $(
      "a.b-product-buy-link>div>h2:has(span:contains(Временно отсутствует))"
    )
      .toArray()
      .map(h => h.childNodes[2].data)
    return R.difference(modas, absent)
}

