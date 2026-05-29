exports.handler = async (event) => {
  const { origin, destination, depart_date, currency } = event.queryStringParameters
  const token = process.env.VITE_TP_TOKEN
  const cur = currency || 'usd'
  const url = `https://api.travelpayouts.com/v1/prices/cheap?origin=${origin}&destination=${destination}&depart_date=${depart_date}&token=${token}&currency=${cur}`
  try {
    const res = await fetch(url)
    const data = await res.json()
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(data)
    }
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) }
  }
}
