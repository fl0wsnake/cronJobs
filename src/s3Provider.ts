import * as AWS from "aws-sdk"
const s3 = new AWS.S3()
const BUCKET = "modafinilcat-notifier"

let fetchObjectWithDefault = (objectName, defaultValue = {}) =>
  s3
    .getObject({
      Bucket: BUCKET,
      Key: objectName
    })
    .promise()
    .then(obj => JSON.parse(obj.Body.toString()))
    .catch(async err => {
      await s3
        .putObject({
          Bucket: BUCKET,
          Key: objectName,
          Body: JSON.stringify(defaultValue)
        })
        .promise()
      return defaultValue
    })

let putObject = (objectName, value = {}) =>
  s3
    .putObject({
      Bucket: BUCKET,
      Key: objectName,
      Body: JSON.stringify(value)
    })
    .promise()

export let createBucket = () =>
  s3
    .createBucket({
      Bucket: BUCKET
    })
    .promise()
    .catch(err => err)

export let fetchPresentModas = () =>
  fetchObjectWithDefault("presentModas.json", {
    modas: []
  })

export let fetchSubs = () =>
  fetchObjectWithDefault("subs.json", {
    subs: []
  })

export let putPresentModas = presentModas =>
  putObject("presentModas.json", presentModas)
