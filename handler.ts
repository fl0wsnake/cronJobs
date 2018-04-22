import { APIGatewayEvent, Callback, Context, Handler } from "aws-lambda"
import * as R from "ramda"
import * as s3 from "./src/s3Provider"
import * as modafinilcat from "./src/modafinilcatProvider"
import * as email from "./src/emailProvider"

export const check: Handler = async (
  event: APIGatewayEvent,
  context: Context,
  cb: Callback
) => {
  try {
    await s3.createBucket()
    let { modas: previouslyPresentModas } = await s3.fetchPresentModas()
    let presentModas = await modafinilcat.fetchPresentModas()
    await s3.putPresentModas({ modas: presentModas })
    let plus = R.difference(presentModas, previouslyPresentModas)
    let minus = R.difference(previouslyPresentModas, presentModas)
    let { subs } = await s3.fetchSubs()
    let updatesFormatted = R.concat(
      plus.map(moda => "+" + moda),
      minus.map(moda => "-" + moda)
    ).join(", ")
    let presentModasFormatted = presentModas.join(", ")
    if (updatesFormatted.length > 0) {
      await email.send(updatesFormatted, presentModasFormatted, subs)
    }
    cb(
      null,
      JSON.stringify({
        updates: updatesFormatted,
        modas: presentModasFormatted
      })
    )
  } catch (err) {
    cb(err)
  }
}
