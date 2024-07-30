import { binanceusdm } from 'ccxt'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)

    try {
        const candels = {}
        console.log(query.markets)
        const binance = new binanceusdm({
            options: { defaultType: 'future', adjustForTimeDifference: true },
            enableRateLimit: true
        })
        for (const market of query.markets) {
            candels[market] = await binance.fetchOHLCV(market, "5m", undefined, 50)
        }
        
        return {
            candels
        }
    } catch (error) {
        return error.message
    }
  })