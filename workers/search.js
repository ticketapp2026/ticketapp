const AIRLINES = {
  'SU': 'Аэрофлот', 'S7': 'S7 Airlines', 'UT': 'ЮТэйр', 'U6': 'Уральские авиалинии',
  'FV': 'Россия', 'DP': 'Победа', 'N4': 'Nordwind', '5N': 'Smartavia',
  'TK': 'Turkish Airlines', 'LH': 'Lufthansa', 'AF': 'Air France',
  'BA': 'British Airways', 'KL': 'KLM', 'OS': 'Austrian Airlines',
  'SK': 'SAS', 'AY': 'Finnair', 'LO': 'LOT Polish Airlines',
  'OK': 'Czech Airlines', 'W6': 'Wizz Air', 'FR': 'Ryanair',
  'U2': 'easyJet', 'VY': 'Vueling', 'IB': 'Iberia', 'EK': 'Emirates',
  'QR': 'Qatar Airways', 'EY': 'Etihad', 'FZ': 'flydubai',
  'G9': 'Air Arabia', 'WY': 'Oman Air', 'GF': 'Gulf Air',
  'PC': 'Pegasus Airlines', 'XQ': 'SunExpress', 'HY': 'Uzbekistan Airways',
  'KC': 'Air Astana', 'B2': 'Belavia', 'PS': 'Ukraine International',
  'JU': 'Air Serbia', 'OU': 'Croatia Airlines', 'A9': 'Georgian Airways',
  'QS': 'SmartWings', 'FB': 'Bulgaria Air', 'RO': 'TAROM',
  'LY': 'El Al', 'MS': 'EgyptAir', 'AT': 'Royal Air Maroc',
  'ET': 'Ethiopian Airlines', 'KQ': 'Kenya Airways', 'AI': 'Air India',
  '6E': 'IndiGo', 'SQ': 'Singapore Airlines', 'CX': 'Cathay Pacific',
  'NH': 'ANA', 'JL': 'Japan Airlines', 'KE': 'Korean Air',
  'OZ': 'Asiana Airlines', 'CA': 'Air China', 'MU': 'China Eastern',
  'CZ': 'China Southern', 'TG': 'Thai Airways', 'MH': 'Malaysia Airlines',
  'VN': 'Vietnam Airlines', 'AA': 'American Airlines', 'DL': 'Delta Air Lines',
  'UA': 'United Airlines', 'AC': 'Air Canada', 'AM': 'Aeromexico',
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const origin = url.searchParams.get('origin')
    const destination = url.searchParams.get('destination')
    const depart_date = url.searchParams.get('depart_date')
    const currency = url.searchParams.get('currency') || 'rub'
    const token = env.VITE_TP_TOKEN

    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }

    if (!origin || !destination || !depart_date) {
      return new Response(JSON.stringify({ error: 'Missing params' }), { status: 400, headers })
    }

    try {
      const [cheapRes, latestRes] = await Promise.all([
        fetch(`https://api.travelpayouts.com/v1/prices/cheap?origin=${origin}&destination=${destination}&depart_date=${depart_date}&token=${token}&currency=${currency}`),
        fetch(`https://api.travelpayouts.com/v2/prices/latest?origin=${origin}&destination=${destination}&period_type=specific_date&depart_date=${depart_date}&token=${token}&currency=${currency}&limit=10&sorting=price&unique=false`)
      ])

      const cheapData = await cheapRes.json()
      const latestData = await latestRes.json()

      const enriched = {}

      if (latestData.data && latestData.data.length > 0) {
        for (const item of latestData.data) {
          const dest = item.destination
          if (!enriched[dest] || item.value < enriched[dest].price) {
            enriched[dest] = {
              price: item.value,
              depart_date: item.depart_date,
              return_date: item.return_date || null,
              duration: item.duration || null,
              number_of_changes: item.number_of_changes != null ? item.number_of_changes : null,
              airline: item.airline ? (AIRLINES[item.airline] || item.airline) : null,
              airline_code: item.airline || null,
              flight_number: item.flight_number || null,
            }
          }
        }
      }

      if (cheapData.data) {
        for (const [dest, flights] of Object.entries(cheapData.data)) {
          const flight = Object.values(flights)[0]
          if (!enriched[dest]) {
            enriched[dest] = {
              price: flight.price,
              depart_date: flight.depart_date,
              return_date: flight.return_date || null,
              duration: flight.duration || null,
              number_of_changes: flight.number_of_changes != null ? flight.number_of_changes : null,
              airline: flight.airline ? (AIRLINES[flight.airline] || flight.airline) : null,
              airline_code: flight.airline || null,
              flight_number: flight.flight_number || null,
            }
          }
        }
      }

      if (Object.keys(enriched).length === 0) {
        return new Response(JSON.stringify({ data: null }), { headers })
      }

      const result = {}
      for (const [dest, data] of Object.entries(enriched)) {
        result[dest] = { 0: data }
      }

      return new Response(JSON.stringify({ data: result }), { headers })

    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers })
    }
  }
}
