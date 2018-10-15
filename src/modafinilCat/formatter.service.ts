import * as R from 'ramda'

function makeLink(moda) {
    return `[${moda}](https://modafinilcat.com.ua/${R.toLower(moda)})`
}

export function format(present, appeared, disappeared) {
    let updatesFormatted = R.concat(
        appeared.map(makeLink).map(modaLink => '+ ' + modaLink),
        disappeared.map(makeLink).map(modaLink => '- ' + modaLink)
    )
        .join('\n')
    let presentFormatted = present.map(makeLink).join('\n')

    let message = `
*Updates*:
${updatesFormatted}
*Currently present*:
${presentFormatted}
`

    return message
}
