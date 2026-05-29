import { useEffect, useState } from 'react'
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth'
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'
import './App.css'

const firebaseApp = initializeApp({
  apiKey: 'AIzaSyDEkK_AmQ0bZWQWpirW4X5U2uwJdkbn4-0',
  authDomain: 'rasskye-1cf37.firebaseapp.com',
  projectId: 'rasskye-1cf37',
  storageBucket: 'rasskye-1cf37.firebasestorage.app',
  messagingSenderId: '685854140033',
  appId: '1:685854140033:web:927752439435702108ce30'
});
const firebaseAuth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const CURRENCIES = { rub: { symbol: "₽", name: "RUB", flag: "🇷🇺" }, usd: { symbol: "$", name: "USD", flag: "🇺🇸" }, eur: { symbol: "€", name: "EUR", flag: "🇪🇺" } }
const generateRefCode = (uid) => uid.slice(0, 8).toUpperCase();


async function fetchRates() { try { const res = await fetch("https://api.exchangerate-api.com/v4/latest/RUB"); const data = await res.json(); return { usd: data.rates.USD, eur: data.rates.EUR } } catch { return { usd: 0.011, eur: 0.010 } } }

function convertPrice(p, c, r) { if (c==="rub") return p; if (c==="usd") return Math.round(p * r.usd); return Math.round(p * r.eur); }

function formatPrice(a, c) { const s = CURRENCIES[c].symbol; return c==="rub" ? a.toLocaleString("ru-RU")+" "+s : s+a.toLocaleString("en-US"); }

const LANG = {
  ru: {
    title: 'Путешествуйте выгодно!',
    subtitle: 'Авиабилеты, туры, отели — всё в одном месте',
    services: 'Все сервисы',
    flights: 'Авиабилеты',
    trains: 'Поезда',
    tours: 'Туры',
    hotels: 'Отели',
    insurance: 'Страховка',
    hotTours: '🔥 Горящие туры',
    specialOffers: '⭐️ Специальные предложения',
    destinations: '✈️ Популярные направления',
    excursions: '🎭 Экскурсии',
    footerHome: '🏠 Главная',
    footerAbout: 'ℹ️ О нас',
    footerContacts: '📞 Контакты',
  },
  en: {
    title: 'Travel Smart!',
    subtitle: 'Flights, tours, hotels — all in one place',
    services: 'All Services',
    flights: 'Flights',
    trains: 'Trains',
    tours: 'Tours',
    hotels: 'Hotels',
    insurance: 'Insurance',
    hotTours: '🔥 Hot Tours',
    specialOffers: '⭐️ Special Offers',
    destinations: '✈️ Popular Destinations',
    excursions: '🎭 Excursions',
    footerHome: '🏠 Home',
    footerAbout: 'ℹ️ About',
    footerContacts: '📞 Contacts',
  }
}

const DESTINATIONS = [
  { name: { ru: 'Турция', en: 'Turkey' }, price: 'от 28 000 ₽', priceRub: 28000, url: 'https://travelata.tpk.lu/N5aNnOKQ', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80' },
  { name: { ru: 'Египет', en: 'Egypt' }, price: 'от 35 000 ₽', priceRub: 35000, url: 'https://travelata.tpk.lu/N5aNnOKQ', img: 'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=400&q=80' },
  { name: { ru: 'Таиланд', en: 'Thailand' }, price: 'от 52 000 ₽', priceRub: 52000, url: 'https://travelata.tpk.lu/N5aNnOKQ', img: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400&q=80' },
  { name: { ru: 'ОАЭ', en: 'UAE' }, price: 'от 45 000 ₽', priceRub: 45000, url: 'https://travelata.tpk.lu/N5aNnOKQ', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80' },
  { name: { ru: 'Греция', en: 'Greece' }, price: 'от 40 000 ₽', priceRub: 40000, url: 'https://travelata.tpk.lu/N5aNnOKQ', img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&q=80' },
  { name: { ru: 'Мальдивы', en: 'Maldives' }, price: 'от 120 000 ₽', priceRub: 120000, url: 'https://travelata.tpk.lu/N5aNnOKQ', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80' },
]

const SERVICES = [
  { icon: '✈️', name: { ru: 'Авиабилеты', en: 'Flights' }, url: 'https://aviasales.tpk.lu/HUJG5wlT' },
  { icon: '🚂', name: { ru: 'Поезда', en: 'Trains' }, url: 'https://tutu.tpk.lu/e9tdxDVM' },
  { icon: '🏨', name: { ru: 'Отели', en: 'Hotels' }, url: 'https://ostrovok.tpk.lu/kLTTObej' },
  { icon: '🌍', name: { ru: 'Яндекс Тревел', en: 'Yandex Travel' }, url: 'https://yandex.tpk.lu/iTIv7hqq' },
  { icon: '🚕', name: { ru: 'Кивитакси', en: 'KiwiTaxi' }, url: 'https://kiwitaxi.tpk.lu/ztSiFByu' },
  { icon: '🚗', name: { ru: 'Трансфер', en: 'Transfer' }, url: 'https://gettransfer.tpk.lu/4GprVYvq' },
  { icon: '🚙', name: { ru: 'Аренда авто', en: 'Car Rental' }, url: 'https://getrentacar.tpk.lu/3yiVaLER' },
  { icon: '📱', name: { ru: 'Есим', en: 'eSIM' }, url: 'https://yesim.tpk.lu/KfRZZBJn' },
  { icon: '🎟️', name: { ru: 'Экскурсии', en: 'Excursions' }, url: 'https://tiqets.tpk.lu/r1rZSkqx' },
  { icon: '🏠', name: { ru: 'Авито Трэвел', en: 'Avito Travel' }, url: 'https://avito.tpk.lu/B1vgWiUS' },
  { icon: '🔑', name: { ru: 'Отелло', en: 'Otello' }, url: 'https://otello.tpk.lu/jDOyI1NE' },
  { icon: '🌴', name: { ru: 'Travelata', en: 'Travelata' }, url: 'https://travelata.tpk.lu/N5aNnOKQ' },
  { icon: '🛡️', name: { ru: 'Cherehapa', en: 'Cherehapa' }, url: 'https://cherehapa.tpk.lu/xV4At24K' },
  { icon: '⛵', name: { ru: 'LaVoyage', en: 'LaVoyage' }, url: 'https://lavoyage.tpk.lu/dgaihSJ3' },
  { icon: '🗺️', name: { ru: 'OnlineTours', en: 'OnlineTours' }, url: 'https://onlinetours.tpk.lu/CqZ6cARF' },
  { icon: '🏖️', name: { ru: 'Level.Travel', en: 'Level.Travel' }, url: 'https://level.tpk.lu/0zb498sT' },
  { icon: '🎭', name: { ru: 'Tripster', en: 'Tripster' }, url: 'https://tripster.tpk.lu/WzNY4VHD' },
  { icon: '📋', name: { ru: 'Сравни.ру', en: 'Sravni.ru' }, url: 'https://sravni.tpk.lu/cxaaAmQv' },
  { icon: '🛡️', name: { ru: 'Tripinsurance', en: 'Tripinsurance' }, url: 'https://tripinsurance.tpk.lu/92EID4sn' },
  { icon: '🏡', name: { ru: 'Суточно.ру', en: 'Sutochno.ru' }, url: 'https://sutochno.tpk.lu/K2JsUujl' },
]

function loadWidget(containerId, scriptId, src) {
  const existing = document.getElementById(scriptId)
  if (existing) existing.remove()
  const container = document.getElementById(containerId)
  if (!container) return
  container.innerHTML = ''
  const script = document.createElement('script')
  script.id = scriptId
  script.async = true
  script.charset = 'utf-8'
  script.src = src
  container.appendChild(script)
}

function App() {
  const [lang, setLang] = useState('ru')
  const [transport, setTransport] = useState('flights')
  const [visible, setVisible] = useState(false)
  const [page, setPage] = useState('home')
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [showProfile, setShowProfile] = useState(false)
  const [copied, setCopied] = useState(false)
  const [currency, setCurrency] = useState("rub")
  const [rates, setRates] = useState({ usd: 0.011, eur: 0.010 })

  const t = LANG[lang]

  const handleAuth = async () => {
    if (!user) {
      try {
        const result = await signInWithPopup(firebaseAuth, new GoogleAuthProvider())
        const u = result.user
        const ref = doc(db, 'users', u.uid)
        const snap = await getDoc(ref)
        if (!snap.exists()) {
          await setDoc(ref, {
            name: u.displayName,
            email: u.email,
            refCode: generateRefCode(u.uid),
            points: 0,
            refs: 0,
            createdAt: new Date().toISOString()
          })
        }
      } catch(e) { console.error(e); }
    } else {
      setShowProfile(false)
      try { await signOut(firebaseAuth); } catch(e) { console.error(e); }
    }
  }

  const loadUserData = async (u) => {
    if (!u) { setUserData(null); return; }
    const ref = doc(db, 'users', u.uid)
    const snap = await getDoc(ref)
    if (snap.exists()) setUserData(snap.data())
  }

  useEffect(() => {
    const id = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(id)
  }, [])

  useEffect(() => {

  return onAuthStateChanged(firebaseAuth, (u) => {
      setUser(u)
      loadUserData(u)
    })
  }, [])

  useEffect(() => {
    switch(transport) {
      case 'flights':
        loadWidget('aviasales-container', 'tp-widget-script',
          `https://tpwidg.com/content?currency=${lang==='ru'?'rub':'usd'}&trs=533294&shmarker=732972&show_hotels=false&powered_by=true&locale=${lang}&searchUrl=www.aviasales.com%2Fsearch&primary_override=%234f46e5&color_button=%234f46e5&color_icons=%237c3aed&dark=%23ffffff&light=%23f8fafc&secondary=%2364748b&special=%234f46e5&color_focused=%234f46e5&border_radius=14&plain=false&promo_id=7879&campaign_id=100`)
        break
      case 'trains':
  loadWidget('trains-container', 'tutu-widget-script',
    'https://tpwidg.com/content?trs=533294&shmarker=732972&tab1=1&tabDef=1&powered_by=true&color_scheme=basic_white&hide_logo=true&campaign_id=45&promo_id=1809')
  break
      case 'tours':
        loadWidget('tours-container', 'travelata-search-script',
          'https://tpwidg.com/content?trs=533294&shmarker=732972&locale=ru&powered_by=true&border_radius=5&plain=true&color_background=%23ffffff&color_button=%234f46e5&color_button_text=%23ffffff&promo_id=4694&campaign_id=43')
        break
      case 'hotels':
        loadWidget('hotels-container', 'yandex-hotels-script',
          'https://tpwidg.com/content?trs=533294&shmarker=732972&sorting=popular&theme=light&powered_by=true&campaign_id=193&promo_id=8582')
        break
      case 'insurance':
        loadWidget('insurance-container', 'cherehapa-script',
          'https://tpwidg.com/content?trs=533294&shmarker=732972&countryGroups=schengen&medicine=30000&powered_by=true&promo_id=2458&campaign_id=24')
        break
    }
  }, [transport, lang])

  useEffect(() => {
    const existing = document.getElementById('travelata-tizer-script')
    if (existing) return
    const container = document.getElementById('travelata-tizer-container')
    if (!container) return
    const contId = 'tat' + Math.random().toString().replace('.', '')
    const div = document.createElement('div')
    div.id = contId
    container.appendChild(div)
    window._tat = window._tat || []
    window._tat.push({
      id: contId,
      affiliateurl: 'https://travelata.tpk.lu/N5aNnOKQ',
      countries: [0],
      cellWidth: 160,
      columns: 5,
      rows: 3,
      WLURL: ''
    })
    const script = document.createElement('script')
    script.id = 'travelata-tizer-script'
    script.type = 'text/javascript'
    script.charset = 'UTF-8'
    script.async = true
    script.src = '//traf.travelata.ru/tat.js'
    container.appendChild(script)
  }, [])

  useEffect(() => {
    const existing = document.getElementById('leveltravel-special-script')
    if (existing) return
    const container = document.getElementById('leveltravel-special-container')
    if (!container) return
    container.innerHTML = ''
    const script = document.createElement('script')
    script.id = 'leveltravel-special-script'
    script.async = true
    script.charset = 'utf-8'
    script.src = 'https://tpwidg.com/content?currency=USD&trs=533294&shmarker=732972&origin_iata=MOW&destination_iata=AZ&locale=ru&powered_by=true&min_lines=5&responsive=true&promo_id=4098&campaign_id=26'
    container.appendChild(script)
  }, [])

  useEffect(() => {
    const existing = document.getElementById('leveltravel-directions-script')
    if (existing) return
    const container = document.getElementById('leveltravel-directions-container')
    if (!container) return
    container.innerHTML = ''
    const script = document.createElement('script')
    script.id = 'leveltravel-directions-script'
    script.async = true
    script.charset = 'utf-8'
    script.src = 'https://tpwidg.com/content?trs=533294&shmarker=732972&departure=Moscow&destination=29386&start_date=WEEK&nights=4..6&adults=2&kids=0&redirect=_blank&powered_by=true&campaign_id=26&promo_id=8286'
    container.appendChild(script)
  }, [])

  useEffect(() => {
    const existing = document.getElementById('tripster-script')
    if (existing) return
    const container = document.getElementById('tripster-container')
    if (!container) return
    container.innerHTML = ''
    const script = document.createElement('script')
    script.id = 'tripster-script'
    script.async = true
    script.charset = 'utf-8'
    script.src = 'https://tpwidg.com/content?trs=533294&shmarker=732972&type=experience&num=3&widget_template=horizontal&logo=true&notitle=false&nolistbutton=false&price=false&widgetbar=false&widgetbar_position=top&powered_by=true&promo_id=4217&campaign_id=11'
    container.appendChild(script)
  }, [])

  const refLink = userData ? `https://rasskye.com?ref=${userData.refCode}` : ''
  const copyRef = () => {
    navigator.clipboard.writeText(refLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`app ${visible ? 'app--visible' : ''}`}>

      <header className="header">
        <div className="header-inner">
          <div className="logo-text">Rasskye <span>Travel</span></div>
          <div className="header-right">
            <button className="auth-btn" onClick={user ? () => setShowProfile(true) : handleAuth}>
              {user ? (user.displayName || 'Профиль') : 'Войти'}
            </button>
            <div className="currency-switcher">{Object.entries(CURRENCIES).map(([k,v]) => (<button key={k} className={currency===k?"active":""} onClick={()=>setCurrency(k)}>{v.flag} {v.name}</button>))}</div>
            <div className="lang-switcher">
              <button className={lang === 'ru' ? 'active' : ''} onClick={() => setLang('ru')}>🇷🇺 RU</button>
              <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>🇬🇧 EN</button>
            </div>
          </div>
        </div>
      </header>

      <div className="hero">
        <div className="hero-content">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
      </div>

      <div className="search-wrapper">
        <div className="search-box">
          <div className="transport-tabs">
            <button className={transport==='flights'?'active':''} onClick={() => setTransport('flights')}>✈️ {t.flights}</button>
            <button className={transport==='trains'?'active':''} onClick={() => setTransport('trains')}>🚂 {t.trains}</button>
            <button className={transport==='tours'?'active':''} onClick={() => setTransport('tours')}>🌴 {t.tours}</button>
            <button className={transport==='hotels'?'active':''} onClick={() => setTransport('hotels')}>🏨 {t.hotels}</button>
            <button className={transport==='insurance'?'active':''} onClick={() => setTransport('insurance')}>🛡️ {t.insurance}</button>
          </div>
          {transport==='flights' && <div id="aviasales-container" style={{minHeight:'400px',width:'100%'}}></div>}
          {transport==='trains' && (
  <div style={{textAlign:'center',padding:'3rem 1rem'}}>
    <div style={{fontSize:'3rem',marginBottom:'1rem'}}>🚂</div>
    <h3 style={{fontSize:'1.3rem',fontWeight:'700',color:'#1e293b',marginBottom:'0.5rem'}}>Билеты на поезда</h3>
    <p style={{color:'#64748b',marginBottom:'1.5rem'}}>Поиск и покупка ЖД билетов через Tutu.ru</p>
    <a href="https://tutu.tpk.lu/e9tdxDVM" target="_blank" rel="noreferrer">
      <button className="search-btn">🔍 Найти билеты на поезд →</button>
    </a>
  </div>
)}
          {transport==='tours' && <div id="tours-container" style={{minHeight:'300px',width:'100%'}}></div>}
          {transport==='hotels' && <div id="hotels-container" style={{minHeight:'300px',width:'100%'}}></div>}
          {transport==='insurance' && <div style={{background:'#fff',borderRadius:'12px',padding:'16px'}}><div id="insurance-container" style={{minHeight:'280px',width:'100%'}}></div></div>}
        </div>
      </div>

      <div className="main-content">

        <div className="partners" style={{marginTop:'1.5rem'}}>
          <div className="partner-badge">Aviasales</div>
          <div className="partner-badge">Travelata</div>
          <div className="partner-badge">Яндекс.Путешествия</div>
          <div className="partner-badge">Level.Travel</div>
          <div className="partner-badge">OnlineTours</div>
          <div className="partner-badge">Tutu.ru</div>
          <div className="partner-badge">Cherehapa</div>
        </div>

        <h2 className="section-title" style={{marginTop:'2rem'}}>{t.destinations}</h2>
        <div className="destinations-grid" style={{marginBottom:'2.5rem'}}>
          {DESTINATIONS.map((d, i) => (
            <a key={i} href={d.url} target="_blank" rel="noreferrer" className="dest-card">
              <img src={d.img} alt={d.name[lang]} className="dest-img" />
              <div className="dest-info">
                <h3>{d.name[lang]}</h3>
                <span>{currency==="rub" ? d.price : formatPrice(convertPrice(d.priceRub, currency, rates), currency)}</span>
              </div>
            </a>
          ))}
        </div>

        <div style={{marginBottom:'2.5rem',background:'#fff',borderRadius:'20px',padding:'2rem',boxShadow:'0 2px 16px rgba(79,70,229,0.08)',border:'1px solid #e2e8f0'}}>
          <h2 className="section-title" style={{marginBottom:'1.5rem'}}>{t.hotTours}</h2>
          <div id="travelata-tizer-container" style={{width:'100%'}}></div>
        </div>

        <div style={{marginBottom:'2.5rem',background:'#fff',borderRadius:'20px',padding:'2rem',boxShadow:'0 2px 16px rgba(79,70,229,0.08)',border:'1px solid #e2e8f0'}}>
          <h2 className="section-title" style={{marginBottom:'1.5rem'}}>{t.specialOffers}</h2>
          <div id="leveltravel-special-container" style={{width:'100%',minHeight:'200px'}}></div>
        </div>

        <div style={{marginBottom:'2.5rem',background:'#fff',borderRadius:'20px',padding:'2rem',boxShadow:'0 2px 16px rgba(79,70,229,0.08)',border:'1px solid #e2e8f0'}}>
          <h2 className="section-title" style={{marginBottom:'1.5rem'}}>🌍 Туры по направлениям</h2>
          <div id="leveltravel-directions-container" style={{width:'100%',minHeight:'200px'}}></div>
        </div>

        <div style={{marginBottom:'2.5rem',background:'#fff',borderRadius:'20px',padding:'2rem',boxShadow:'0 2px 16px rgba(79,70,229,0.08)',border:'1px solid #e2e8f0'}}>
          <h2 className="section-title" style={{marginBottom:'1.5rem'}}>{t.excursions}</h2>
          <div id="tripster-container" style={{width:'100%',minHeight:'150px'}}></div>
        </div>

        <div className="services-section">
          <h2>{t.services}</h2>
          <div className="services-grid">
            {SERVICES.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noreferrer" className="service-card" style={{animationDelay:`${i*40}ms`}}>
                <span className="service-icon">{s.icon}</span>
                <span className="service-name">{s.name[lang]}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <footer className="site-footer">
        <button onClick={() => setPage('home')} className={page==='home'?'active':''}>{t.footerHome}</button>
        <button onClick={() => setPage('about')} className={page==='about'?'active':''}>{t.footerAbout}</button>
        <button onClick={() => setPage('contacts')} className={page==='contacts'?'active':''}>{t.footerContacts}</button>
      </footer>

      {showProfile && userData && (
        <div className="page-overlay" onClick={() => setShowProfile(false)}>
          <div className="page-modal" onClick={e => e.stopPropagation()}>
            <button className="page-close" onClick={() => setShowProfile(false)}>✕</button>
            <h2>👤 Личный кабинет</h2>
            <p style={{marginBottom:'8px',color:'#1e293b'}}><strong>{userData.name}</strong></p>
            <p style={{marginBottom:'20px',color:'#94a3b8',fontSize:'13px'}}>{userData.email}</p>
            <div style={{display:'flex',gap:'12px',marginBottom:'20px'}}>
              <div style={{flex:1,background:'#eef2ff',borderRadius:'14px',padding:'16px',textAlign:'center',border:'1px solid #c7d2fe'}}>
                <div style={{fontSize:'1.8rem',fontWeight:'800',color:'#4f46e5'}}>{userData.points}</div>
                <div style={{fontSize:'0.75rem',color:'#94a3b8',marginTop:'4px'}}>баллов</div>
              </div>
              <div style={{flex:1,background:'#eef2ff',borderRadius:'14px',padding:'16px',textAlign:'center',border:'1px solid #c7d2fe'}}>
                <div style={{fontSize:'1.8rem',fontWeight:'800',color:'#4f46e5'}}>{userData.refs}</div>
                <div style={{fontSize:'0.75rem',color:'#94a3b8',marginTop:'4px'}}>друзей</div>
              </div>
            </div>
            <div style={{background:'#f8fafc',borderRadius:'14px',padding:'16px',marginBottom:'12px',border:'1px solid #e2e8f0'}}>
              <div style={{fontSize:'0.75rem',color:'#94a3b8',marginBottom:'8px'}}>Прогресс до скидки</div>
              <div style={{background:'#e2e8f0',borderRadius:'99px',height:'8px',marginBottom:'8px'}}><div style={{background:'linear-gradient(90deg,#4f46e5,#7c3aed)',borderRadius:'99px',height:'8px',width:`${Math.min((userData.points/1000)*100,100)}%`,transition:'width 0.3s'}}></div></div>
              <div style={{fontSize:'0.75rem',color:'#64748b',marginBottom:'16px'}}>{userData.points>=1000?'✅ Доступна скидка 1000 ₽!':`${userData.points} / 1000 баллов — ещё ${1000-userData.points} до скидки`}</div>
            <div style={{fontSize:'0.75rem',color:'#94a3b8',marginBottom:'8px'}}>Ваш реферальный код</div>
              <div style={{fontSize:'1.4rem',fontWeight:'800',letterSpacing:'3px',color:'#4f46e5'}}>{userData.refCode}</div>
            </div>
            <button onClick={copyRef} style={{width:'100%',padding:'0.9rem',borderRadius:'14px',border:'none',background:'linear-gradient(135deg,#4f46e5,#7c3aed)',color:'#fff',fontSize:'0.95rem',fontWeight:'700',cursor:'pointer',marginBottom:'10px'}}>
              {copied?'✅ Ссылка скопирована!':'🔗 Пригласить друга'}
            </button>
            <button onClick={handleAuth} style={{width:'100%',padding:'0.7rem',borderRadius:'14px',border:'1.5px solid #e2e8f0',background:'transparent',color:'#94a3b8',fontSize:'0.85rem',cursor:'pointer'}}>
              Выйти
            </button>
          </div>
        </div>
      )}

      {page === 'about' && (
        <div className="page-overlay" onClick={() => setPage('home')}>
          <div className="page-modal" onClick={e => e.stopPropagation()}>
            <button className="page-close" onClick={() => setPage('home')}>✕</button>
            <h2>О нас</h2>
            <p>Rasskye Travel — сервис поиска дешёвых авиабилетов, туров и отелей. Мы помогаем путешественникам находить лучшие цены по всему миру.</p>
            <p>Мы работаем с надёжными партнёрами — Aviasales, Travelata, Яндекс.Путешествия и другими.</p>
            <p>Наша миссия — сделать путешествия доступными для каждого.</p>
          </div>
        </div>
      )}

      {page === 'contacts' && (
        <div className="page-overlay" onClick={() => setPage('home')}>
          <div className="page-modal" onClick={e => e.stopPropagation()}>
            <button className="page-close" onClick={() => setPage('home')}>✕</button>
            <h2>Контакты</h2>
            <p style={{marginBottom:'12px',color:'#94a3b8',fontSize:'13px'}}>По всем вопросам — ответим в течение 24 часов</p>
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              <a href="mailto:info@rasskye.com" className="contact-card" style={{textDecoration:'none'}}>
                <div className="contact-card__icon">📧</div>
                <div className="contact-card__text"><h3>info@rasskye.com</h3><p>Напишите нам на email</p></div>
                <div className="contact-card__btn">Написать →</div>
              </a>
              <a href="https://t.me/rasskye_travel" target="_blank" rel="noreferrer" className="contact-card" style={{textDecoration:'none'}}>
                <div className="contact-card__icon">✈️</div>
                <div className="contact-card__text"><h3>Telegram</h3><p>@rasskye_travel</p></div>
                <div className="contact-card__btn">Открыть →</div>
              </a>
              <a href="https://instagram.com/rasskye_travel" target="_blank" rel="noreferrer" className="contact-card contact-card--insta" style={{textDecoration:'none'}}>
                <div className="contact-card__icon">📸</div>
                <div className="contact-card__text"><h3>Instagram</h3><p>@rasskye_travel</p></div>
                <div className="contact-card__btn contact-card__btn--insta">Открыть →</div>
              </a>
              <a href="https://wa.me/79366666667" target="_blank" rel="noreferrer" className="contact-card contact-card--wa" style={{textDecoration:'none'}}>
                <div className="contact-card__icon">💬</div>
                <div className="contact-card__text"><h3>WhatsApp</h3><p>+7 936 666-66-67</p></div>
                <div className="contact-card__btn contact-card__btn--wa">Написать →</div>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App