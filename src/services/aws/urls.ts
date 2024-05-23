import { env } from "app/config/env"

export const shopifyUrls = {

  payments:{
    'all': `${env.AWS_HOSTNAME}/v1/stats`,
  },

}