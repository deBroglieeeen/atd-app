import { NextApiRequest, NextApiResponse } from 'next'
import slack from '../../lib/slack'

module.exports = async (req: NextApiRequest, res: NextApiResponse) => {
  const { message } = req.body

  if (typeof message === 'undefined') {
    res.writeHead(400).end('Invalid body: message')
  }

  if (req.method === 'POST') {
    // Slackのチャンネルにテキストを通知する
    await slack.sendToSlack(message)
    res.writeHead(201).end('Created')
  } else {
    // POST以外のメソッドは受け付けない
    res.writeHead(405).end('Method Not Allowed')
  }
}
