import * as R from 'ramda'

function makeLink(moda) {
    return `[${moda}](https://modafinilcat.com.ua/${R.toLower(moda)})`
}

export function format(present, appeared, disappeared) {
    let updatesFormatted = R.concat(
        appeared.map(moda => '+' + moda),
        disappeared.map(moda => '-' + moda)
    )
        .map(makeLink)
        .join('\n')
    let presentFormatted = present.map(makeLink).join('\n')

    let message = `
[ModafinilCat](https://modafinilcat.com.ua/)
Updates:
${updatesFormatted}
Currently present:
${present}
`

    return message
}
