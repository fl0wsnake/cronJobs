import * as nodemailer from "nodemailer"
const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD
  }
})

export let send = (subject, message, subs) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        from: "modafinilcat notifier <modafinilcat@notifier.info>",
        to: subs.join(", "),
        subject: subject,
        html: `<p>${message}</p>`
      },
      (err, info) => {
        if (err) {
          reject(err)
        } else {
          resolve(info.messageId)
        }
      }
    )
  })
}
