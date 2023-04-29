import { IncomingWebhook } from '@slack/webhook'
import { SLACK_WEBHOOK_URL } from '../config/server'

const slack = {
  sendToSlack: async (text: string) => {
    const url = SLACK_WEBHOOK_URL
    const webhook = new IncomingWebhook(url)
    await webhook.send({ text })
  },
}

export default slack
