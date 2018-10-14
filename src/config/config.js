import nconf from 'nconf'

let config = nconf.env({
    separator: '__',
    lowerCase: true,
    parseValues: true,
}).get()

console.log(`function is operating with the next config: ${config}`)

export default config