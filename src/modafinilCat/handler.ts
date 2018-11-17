import {APIGatewayEvent, Callback, Context, Handler} from 'aws-lambda'
import * as R from 'ramda'
import * as bucket from './bucket.service'
import * as modafinilcat from './modafinilcat.service'
import * as tg from './telegram.service'
import {format} from './formatter.service'

export async function modafinilCatCheckForUpdates(
    event: APIGatewayEvent,
    context: Context,
    lambdaCallback: Callback
) {
    try {
        await bucket.init()

        // fetch previously present modas from the bucket
        let previouslyPresent = await bucket.fetchPresent()

        // fetch present modas from the website
        let present = await modafinilcat.fetchPresent()

        // diff changes
        let appeared = R.difference(present, previouslyPresent)
        let disappeared = R.difference(previouslyPresent, present)

        // notify subs if there are any changes
        if (appeared.length > 0 || disappeared.length > 0) {
            // update bucket with new present modas
            await bucket.putPresent(present)

            let message = format(present, appeared, disappeared)

            tg.send(message)

            lambdaCallback(
                null,
                JSON.stringify({
                    present,
                    appeared,
                    disappeared
                })
            )
        } else {
            lambdaCallback(
                null,
                'No updates so far.'
            )
        }
    } catch (error) {
        lambdaCallback(error)
    }
}
