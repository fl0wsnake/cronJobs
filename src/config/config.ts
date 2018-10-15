import * as nconf from 'nconf'

export let config = nconf.env({
    separator: '__',
    parseValues: true,
    whitelist: ['modafinilCat__s3__bucket', 'modafinilCat__s3__object', 'modafinilCat__tg__token', 'modafinilCat__tg__chatId']
}).get()
