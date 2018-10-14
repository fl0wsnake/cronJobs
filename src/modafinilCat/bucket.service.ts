import * as AWS from 'aws-sdk'
import {s3 as config} from './config'
const s3 = new AWS.S3()

export async function init() {
    return s3
        .createBucket({
            Bucket: config.bucket
        })
        .promise()
}

export async function fetchPresentModas() {
    try {
        let response = await s3
            .getObject({
                Bucket: config.bucket,
                Key: config.object
            })
            .promise()
        let body = response.Body.toString()
        let result = JSON.parse(body)

        return result
    } catch (err) {
        let defaultValue = {
            modasPresent: []
        }

        await s3
            .putObject({
                Bucket: config.bucket,
                Key: config.object,
                Body: JSON.stringify(defaultValue)
            })
            .promise()

        return defaultValue
    }
}

export async function putPresentModas(presentModas) {
    putObject(config.object, presentModas)
}

async function putObject(objectName, value) {
    return s3
        .putObject({
            Bucket: config.bucket,
            Key: objectName,
            Body: JSON.stringify(value)
        })
        .promise()
}
