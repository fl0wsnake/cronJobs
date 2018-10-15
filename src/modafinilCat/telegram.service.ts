import * as TelegramBot from 'node-telegram-bot-api'
import {tg as config} from './config'

const opts: TelegramBot.SendMessageOptions = {
    parse_mode: 'Markdown',
    disable_web_page_preview: true
}


// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(config.token, {polling: true})

export async function send(message) {
    await bot.sendMessage(config.chatId, message, opts)
}
