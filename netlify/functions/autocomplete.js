exports.handler = async (event) => {
  const { q, locale } = event.queryStringParameters
  if (!q || q.length < 2) return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify([]) }
  const token = process.env.VITE_TP_TOKEN
  const lang = locale || 'ru'
  const url = `https://autocomplete.travelpayouts.com/places2?term=${encodeURIComponent(q)}&locale=${lang}&types[]=city&types[]=airport`
  try {
    const res = await fetch(url)
    const data = await res.json()
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(data.slice(0, 7))
    }
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) }
  }
}
