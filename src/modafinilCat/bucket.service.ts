import * as AWS from 'aws-sdk'
import {s3 as config} from './config'
const s3 = new AWS.S3()

export async function init() {
    try {
    let result = await s3
        .createBucket({
            Bucket: config.bucket
        })
        .promise()
        return result
    } catch (error) {
        if (error.code !== 'BucketAlreadyOwnedByYou') {
            throw error
        }
    }
}

export async function fetchPresent() {
    try {
        let response = await getPresent()
        let body = response.Body.toString()
        let result = JSON.parse(body)
        let present = result.modas

        return present
    } catch (error) {
        if (error.code === 'NoSuchBucket' || error.code=== 'NoSuchKey') {
            let defaultValue = {
                modas: []
            }

            await s3
                .putObject({
                    Bucket: config.bucket,
                    Key: config.object,
                    Body: JSON.stringify(defaultValue)
                })
                .promise()

            return defaultValue
        } else {
            throw error
        }
    }
}

export async function getPresent() {
    let result = await getObject(config.object)
    return result
}

export async function putPresent(present) {
    let result = await putObject(config.object, {modas: present})
    return result
}

async function getObject(key) {
    let result = await s3
        .getObject({
            Bucket: config.bucket,
            Key: key
        })
        .promise()
    return result
}

async function putObject(key, value) {
    let result = await s3
        .putObject({
            Bucket: config.bucket,
            Key: key,
            Body: JSON.stringify(value)
        })
        .promise()
    return result
}
