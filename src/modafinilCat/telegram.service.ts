import * as TelegramBot from 'node-telegram-bot-api'
import {tg as config} from './config'

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(config.token, {polling: true})

export async function send(message) {
    await bot.sendMessage(config.chatId, message)
}
