const axios = require('axios');
import https from 'https'

const adapter = (baseURL: string) => {
  return axios.create({
    baseURL: baseURL,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    httpsAgent: new https.Agent({   
      rejectUnauthorized: false
    }),
  });
}

export default adapter