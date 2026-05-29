export default {
  async fetch(request) {
    const url = new URL(request.url)
    const q = url.searchParams.get('q')
    const locale = url.searchParams.get('locale') || 'ru'
    const apiUrl = `https://autocomplete.travelpayouts.com/places2?term=${encodeURIComponent(q)}&locale=${locale}&types[]=city&types[]=airport`
    try {
      const res = await fetch(apiUrl)
      const data = await res.json()
      return new Response(JSON.stringify(data.slice(0, 7)), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      })
    } catch(e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 })
    }
  }
}
