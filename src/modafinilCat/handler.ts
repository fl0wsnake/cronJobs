import {APIGatewayEvent, Callback, Context, Handler} from 'aws-lambda'
import * as R from 'ramda'
import * as s3 from './bucket.service'
import * as modafinilcat from './modafinilcat.service'
import * as tg from './telegram.service'

export async function check(
    event: APIGatewayEvent,
    context: Context,
    lambdaCallback: Callback
) {
    try {
        await s3.init()

        // fetch previously present modas from the bucket
        let {modas: previouslyPresentModas} = await s3.fetchPresentModas()

        // fetch present modas from the website
        let presentModas = await modafinilcat.fetchPresentModas()

        // update bucket with new present modas
        await s3.putPresentModas({modas: presentModas})

        // diff changes
        let appeared = R.difference(presentModas, previouslyPresentModas)
        let disappeared = R.difference(previouslyPresentModas, presentModas)

        // formatting output messages
        let updatesFormatted = R.concat(
            appeared.map(moda => '+' + moda),
            disappeared.map(moda => '-' + moda)
        ).join('\n')
        let presentModasFormatted = presentModas.join(', ')

        // notify subs if there are any changes
        if (updatesFormatted.length > 0) {
            tg.send(`{updatesFormatted}`)
            tg.send('Present modas:')
            tg.send(presentModas)
        }

        // finalize lambda execution
        lambdaCallback(
            null,
            JSON.stringify({
                updates: updatesFormatted,
                modas: presentModasFormatted
            })
        )
    } catch (err) {
        lambdaCallback(err)
    }
}
