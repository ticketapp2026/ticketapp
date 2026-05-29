
import { useEffect, useState } from 'react'
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth'
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
window.togglePanel = async () => {
  const user = firebaseAuth.currentUser;
  if (!user) {
    try { await signInWithPopup(firebaseAuth, new GoogleAuthProvider()); } catch(e) { console.error(e); }
  }
};

const LANG = {
  ru: {
    title: 'Самые дешёвые билеты — авиа, автобус, поезд',
    services: '🧳 Полезные сервисы',
    flights: 'Авиабилеты',
    trains: 'Поезда',
    buses: 'Автобусы',
    searchOnTutu: 'Найти на Tutu.ru →',
    hotTours: 'Горящие туры',
    hotToursDesc: 'Авторские туры по всему миру — найди своё путешествие',
    delayed: 'Задержали рейс?',
    delayedDesc: 'Получи до 600€ компенсации за задержку или отмену рейса',
    trainHint: 'Поиск билетов на поезда через Tutu.ru — надёжный партнёр',
    busHint: 'Поиск билетов на автобусы через Tutu.ru',
    footerHome: '🏠 Главная',
    footerAbout: 'ℹ️ О нас',
    footerContacts: '📞 Контакты',
  },
  en: {
    title: 'Cheapest flights — air, bus, train',
    services: '🧳 Travel Services',
    flights: 'Flights',
    trains: 'Trains',
    buses: 'Buses',
    searchOnTutu: 'Search on Tutu.ru →',
    hotTours: 'Hot Tours',
    hotToursDesc: 'Author tours worldwide — find your journey',
    delayed: 'Flight delayed?',
    delayedDesc: 'Get up to €600 compensation for delay or cancellation',
    trainHint: 'Train tickets via Tutu.ru — reliable partner',
    busHint: 'Bus tickets via Tutu.ru',
    footerHome: '🏠 Home',
    footerAbout: 'ℹ️ About',
    footerContacts: '📞 Contacts',
  }
}

const SERVICES = [
  { icon: '✈️', name: { ru: 'Авиабилеты', en: 'Flights' }, url: 'https://aviasales.tpk.lu/HUJG5wlT' },
  { icon: '🚂', name: { ru: 'Поезда и автобусы', en: 'Trains & Buses' }, url: 'https://tutu.tpk.lu/e9tdxDVM' },
  { icon: '🏨', name: { ru: 'Отели', en: 'Hotels' }, url: 'https://ostrovok.tpk.lu/kLTTObej' },
  { icon: '🌍', name: { ru: 'Яндекс Путешествия', en: 'Yandex Travel' }, url: 'https://yandex.tpk.lu/iTIv7hqq' },
  { icon: '🚕', name: { ru: 'Кивитакси', en: 'KiwiTaxi' }, url: 'https://kiwitaxi.tpk.lu/ztSiFByu' },
  { icon: '🚗', name: { ru: 'Трансфер', en: 'Transfer' }, url: 'https://gettransfer.tpk.lu/4GprVYvq' },
  { icon: '🚙', name: { ru: 'Аренда авто', en: 'Car Rental' }, url: 'https://getrentacar.tpk.lu/3yiVaLER' },
  { icon: '📱', name: { ru: 'Есим', en: 'eSIM' }, url: 'https://yesim.tpk.lu/KfRZZBJn' },
  { icon: '🎟️', name: { ru: 'Экскурсии', en: 'Excursions' }, url: 'https://tiqets.tpk.lu/r1rZSkqx' },
  { icon: '🏠', name: { ru: 'Авито Трэвел', en: 'Avito Travel' }, url: 'https://avito.tpk.lu/B1vgWiUS' },
  { icon: '🔑', name: { ru: 'Отелло', en: 'Otello' }, url: 'https://otello.tpk.lu/jDOyI1NE' },
]

function App() {
  const [lang, setLang] = useState('ru')
  const [transport, setTransport] = useState('flights')
  const [visible, setVisible] = useState(false)
  const [page, setPage] = useState('home')
  const [user, setUser] = useState(null)

  const t = LANG[lang]

  useEffect(() => {
    const id = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(id)
  }, [])

  useEffect(() => {
    return onAuthStateChanged(firebaseAuth, (u) => setUser(u))
  }, [])

  useEffect(() => {
    if (transport === 'buses') {
      const existing = document.getElementById('unitiki-script')
      if (existing) existing.remove()
      const container = document.getElementById('unitiki-container')
      if (container) container.innerHTML = ''
      const script = document.createElement('script')
      script.id = 'unitiki-script'
      script.async = true
      script.charset = 'utf-8'
      script.src = 'https://tpwidg.com/content?currency=RUB&trs=533294&shmarker=732972&powered_by=true&title=%D0%91%D0%B8%D0%BB%D0%B5%D1%82%D1%8B%20%D0%BD%D0%B0%20%D0%B0%D0%B2%D1%82%D0%BE%D0%B1%D1%83%D1%81&subtitle=%D0%9F%D0%BE%D0%B8%D1%81%D0%BA%20%D0%B8%20%D0%BF%D0%BE%D0%BA%D1%83%D0%BF%D0%BA%D0%B0%20%D0%BE%D0%BD%D0%BB%D0%B0%D0%B9%D0%BD&button=%D0%9D%D0%B0%D0%B9%D1%82%D0%B8&logo=1&background_color=1e1b4b&title_color=ffffff&subtitle_color=a5b4fc&button_color=6366f1&button_text_color=ffffff&campaign_id=58&promo_id=8018'
      if (container) container.appendChild(script)
      return
    }
    if (transport !== 'flights') return
    const existing = document.getElementById('tp-widget-script')
    if (existing) existing.remove()
    const container = document.getElementById('aviasales-container')
    if (container) container.innerHTML = ''
    const script = document.createElement('script')
    script.id = 'tp-widget-script'
    script.async = true
    script.charset = 'utf-8'
    script.src = 'https://tpwidg.com/content?currency=' + (lang === 'ru' ? 'rub' : 'usd') + '&trs=533294&shmarker=732972&show_hotels=false&powered_by=true&locale=' + lang + '&searchUrl=www.aviasales.com%2Fsearch&primary_override=%236366f1&color_button=%236366f1&color_icons=%238b5cf6&dark=%231a1535&light=%23FFFFFF&secondary=%23a5b4fc&special=%236366f1&color_focused=%236366f1&border_radius=14&plain=false&promo_id=7879&campaign_id=100'
    if (container) container.appendChild(script)
  }, [transport, lang])

  return (
    <div className={`app ${visible ? 'app--visible' : ''}`}>
      <div className="bg-orb bg-orb--1" />
      <div className="bg-orb bg-orb--2" />
      <div className="bg-orb bg-orb--3" />

      <header className="header">
        <div className="header-top">
          <button className="auth-btn" onClick={() => window.togglePanel && window.togglePanel()}>
            {user ? (user.displayName || 'Профиль') : 'Войти'}
          </button>
          <div className="lang-switcher">
            <button className={lang === 'ru' ? 'active' : ''} onClick={() => setLang('ru')}>🇷🇺 RU</button>
            <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>🇬🇧 EN</button>
          </div>
        </div>
        <div className="logo">
          <h1>🌍 Discover the World</h1>
          <p>{t.title}</p>
        </div>
      </header>

      <div className="search-box">
        <div className="transport-tabs">
          <button className={transport === 'flights' ? 'active' : ''} onClick={() => setTransport('flights')}>✈️ {t.flights}</button>
          <button className={transport === 'trains' ? 'active' : ''} onClick={() => setTransport('trains')}>🚂 {t.trains}</button>
          <button className={transport === 'buses' ? 'active' : ''} onClick={() => setTransport('buses')}>🚌 {t.buses}</button>
        </div>
        {transport === 'flights' && (
          <div id="aviasales-container" style={{minHeight: '400px', width: '100%'}}></div>
        )}
        {transport === 'trains' && (
          <div className="tutu-block">
            <p className="tutu-hint">{t.trainHint}</p>
            <a href="https://tutu.tpk.lu/e9tdxDVM" target="_blank" rel="noreferrer">
              <button className="search-btn">{t.searchOnTutu}</button>
            </a>
          </div>
        )}
        {transport === 'buses' && (
          <div id="unitiki-container" style={{width:'100%',minHeight:'120px'}}></div>
        )}
      </div>

      <div className="results">
        <a href="https://youtravel.me/?trs=533294&shmarker=732972" target="_blank" rel="noreferrer" className="compensation-card" style={{marginBottom:'0.75rem'}}>
          <div className="compensation-icon">🌴</div>
          <div className="compensation-text">
            <h3>{t.hotTours}</h3>
            <p>{t.hotToursDesc}</p>
          </div>
          <div className="compensation-arrow">→</div>
        </a>
        <a href="https://www.airhelp.com/ru/?trs=533294&shmarker=732972" target="_blank" rel="noreferrer" className="compensation-card">
          <div className="compensation-icon">✈️</div>
          <div className="compensation-text">
            <h3>{t.delayed}</h3>
            <p>{t.delayedDesc}</p>
          </div>
          <div className="compensation-arrow">→</div>
        </a>
        <div className="services-section">
          <h2>{t.services}</h2>
          <div className="services-grid">
            {SERVICES.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noreferrer" className="service-card" style={{ animationDelay: `${i * 40}ms` }}>
                <span className="service-icon">{s.icon}</span>
                <span className="service-name">{s.name[lang]}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <footer className="site-footer">
        <button onClick={() => setPage('home')} className={page === 'home' ? 'active' : ''}>{t.footerHome}</button>
        <button onClick={() => setPage('about')} className={page === 'about' ? 'active' : ''}>{t.footerAbout}</button>
        <button onClick={() => setPage('contacts')} className={page === 'contacts' ? 'active' : ''}>{t.footerContacts}</button>
      </footer>

      {page === 'about' && (
        <div className="page-overlay" onClick={() => setPage('home')}>
          <div className="page-modal" onClick={e => e.stopPropagation()}>
            <button className="page-close" onClick={() => setPage('home')}>✕</button>
            <h2>О нас</h2>
            <p>Rasskye — это сервис поиска дешёвых авиабилетов, туров и отелей. Мы помогаем путешественникам находить лучшие цены по всему миру.</p>
            <p>Мы работаем с надёжными партнёрами — Aviasales, Booking.com, Ostrovok и другими — чтобы вы всегда получали актуальные цены.</p>
            <p>Наша миссия — сделать путешествия доступными для каждого.</p>
          </div>
        </div>
      )}

      {page === 'contacts' && (
        <div className="page-overlay" onClick={() => setPage('home')}>
          <div className="page-modal" onClick={e => e.stopPropagation()}>
            <button className="page-close" onClick={() => setPage('home')}>✕</button>
            <h2>Контакты</h2>
            <p style={{marginBottom:'12px',opacity:0.6,fontSize:'13px'}}>По всем вопросам — ответим в течение 24 часов</p>
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              <a href="mailto:info@rasskye.com" className="contact-card" style={{textDecoration:'none'}}>
                <div className="contact-card__icon">📧</div>
                <div className="contact-card__text">
                  <h3>info@rasskye.com</h3>
                  <p>Напишите нам на email</p>
                </div>
                <div className="contact-card__btn">Написать →</div>
              </a>
              <a href="https://t.me/rasskye_travel" target="_blank" rel="noreferrer" className="contact-card" style={{textDecoration:'none'}}>
                <div className="contact-card__icon">✈️</div>
                <div className="contact-card__text">
                  <h3>Telegram</h3>
                  <p>@rasskye_travel</p>
                </div>
                <div className="contact-card__btn">Открыть →</div>
              </a>
              <a href="https://instagram.com/rasskye_travel" target="_blank" rel="noreferrer" className="contact-card contact-card--insta" style={{textDecoration:'none'}}>
                <div className="contact-card__icon">📸</div>
                <div className="contact-card__text">
                  <h3>Instagram</h3>
                  <p>@rasskye_travel</p>
                </div>
                <div className="contact-card__btn contact-card__btn--insta">Открыть →</div>
              </a>
              <a href="https://wa.me/79366666667" target="_blank" rel="noreferrer" className="contact-card contact-card--wa" style={{textDecoration:'none'}}>
                <div className="contact-card__icon">💬</div>
                <div className="contact-card__text">
                  <h3>WhatsApp</h3>
                  <p>+7 936 666-66-67</p>
                </div>
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