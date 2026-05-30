import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth'
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import './App.css'

const firebaseApp = initializeApp({
  apiKey: 'AIzaSyDEkK_AmQ0bZWQWpirW4X5U2uwJdkbn4-0',
  authDomain: 'rasskye-1cf37.firebaseapp.com',
  projectId: 'rasskye-1cf37',
  storageBucket: 'rasskye-1cf37.firebasestorage.app',
  messagingSenderId: '685854140033',
  appId: '1:685854140033:web:927752439435702108ce30'
})
const firebaseAuth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)

const generateRefCode = (uid) => uid.slice(0, 8).toUpperCase()

const CURRENCIES = {
  rub: { symbol: '₽', name: 'RUB', flag: '🇷🇺' },
  usd: { symbol: '$', name: 'USD', flag: '🇺🇸' },
  eur: { symbol: '€', name: 'EUR', flag: '🇪🇺' },
  try: { symbol: '₺', name: 'TRY', flag: '🇹🇷' },
  aed: { symbol: 'د.إ', name: 'AED', flag: '🇦🇪' },
  gel: { symbol: '₾', name: 'GEL', flag: '🇬🇪' },
  amd: { symbol: '֏', name: 'AMD', flag: '🇦🇲' },
  gbp: { symbol: '£', name: 'GBP', flag: '🇬🇧' },
  cny: { symbol: '¥', name: 'CNY', flag: '🇨🇳' },
  kzt: { symbol: '₸', name: 'KZT', flag: '🇰🇿' },
  kgs: { symbol: 'с', name: 'KGS', flag: '🇰🇬' },
  tjs: { symbol: 'SM', name: 'TJS', flag: '🇹🇯' },
  bam: { symbol: 'KM', name: 'BAM', flag: '🇧🇦' },
}

const LANGUAGES = [
  { code: 'ru', label: 'RU', flag: '🇷🇺', name: 'Русский' },
  { code: 'en', label: 'EN', flag: '🇬🇧', name: 'English' },
  { code: 'tr', label: 'TR', flag: '🇹🇷', name: 'Türkçe' },
  { code: 'de', label: 'DE', flag: '🇩🇪', name: 'Deutsch' },
  { code: 'hy', label: 'HY', flag: '🇦🇲', name: 'Հայերեն' },
  { code: 'bs', label: 'BS', flag: '🇧🇦', name: 'Bosanski' },
  { code: 'kk', label: 'KK', flag: '🇰🇿', name: 'Қазақша' },
  { code: 'ky', label: 'KY', flag: '🇰🇬', name: 'Кыргызча' },
  { code: 'tg', label: 'TG', flag: '🇹🇯', name: 'Тоҷикӣ' },
  { code: 'ce', label: 'CE', flag: '🏔️', name: 'Нохчийн' },
]

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
    login: 'Войти',
    profile: '👤 Профиль',
    passengers: '🧳 Пассажиры',
    myPassengers: '🧳 Мои пассажиры',
    passengersSubtitle: 'Данные сохраняются и автоматически подставляются при бронировании',
    noPassengers: 'Пассажиры ещё не добавлены',
    addPassenger: '+ Добавить пассажира',
    newPassenger: '➕ Новый пассажир',
    editPassenger: '✏️ Редактирование пассажира',
    intlPassport: '🌍 Загранпаспорт',
    ruPassport: '🇷🇺 Паспорт РФ',
    intlHint: '✈️ Имя и фамилия — латиницей, как в загранпаспорте. Отчество не указывается.',
    ruHint: '🇷🇺 Данные вводятся кириллицей, как в паспорте гражданина РФ.',
    firstName: 'Имя (латиницей)',
    lastName: 'Фамилия (латиницей)',
    firstNameRu: 'Имя',
    lastNameRu: 'Фамилия',
    middleName: 'Отчество',
    birthDate: 'Дата рождения',
    gender: 'Пол',
    male: 'Мужской',
    female: 'Женский',
    citizenship: 'Гражданство',
    passportNumber: 'Номер загранпаспорта',
    passportExpiry: 'Срок действия (дата окончания)',
    passportSeries: 'Серия паспорта',
    passportNumberRu: 'Номер паспорта',
    passportIssueDate: 'Дата выдачи',
    passportCode: 'Код подразделения',
    save: '✅ Сохранить',
    saving: 'Сохранение...',
    cancel: 'Отмена',
    logout: 'Выйти',
    inviteFriend: '🔗 Пригласить друга',
    copied: '✅ Ссылка скопирована!',
    points: 'баллов',
    friends: 'друзей',
    progressTitle: 'Прогресс до скидки',
    refCode: 'Ваш реферальный код',
    discountAvail: '✅ Доступна скидка 1000 ₽!',
    toDiscount: 'до скидки',
    cabinet: '👤 Личный кабинет',
    about: 'О нас',
    aboutText1: 'Rasskye Travel — сервис поиска дешёвых авиабилетов, туров и отелей.',
    aboutText2: 'Мы работаем с надёжными партнёрами — Aviasales, Travelata, Яндекс.Путешествия и другими.',
    aboutText3: 'Наша миссия — сделать путешествия доступными для каждого.',
    contacts: 'Контакты',
    contactsSubtitle: 'По всем вопросам — ответим в течение 24 часов',
    writeUs: 'Напишите нам на email',
    open: 'Открыть →',
    write: 'Написать →',
    trainsTitle: 'Билеты на поезда',
    trainsSubtitle: 'Поиск и покупка ЖД билетов через Tutu.ru',
    trainsBtn: '🔍 Найти билеты на поезд →',
    directions: '🌍 Туры по направлениям',
    partners: ['Aviasales', 'Travelata', 'Яндекс.Путешествия', 'Level.Travel', 'OnlineTours', 'Tutu.ru', 'Cherehapa'],
    legal: 'Реквизиты и оферта',
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
    login: 'Login',
    profile: '👤 Profile',
    passengers: '🧳 Passengers',
    myPassengers: '🧳 My Passengers',
    passengersSubtitle: 'Data is saved and auto-filled when booking',
    noPassengers: 'No passengers added yet',
    addPassenger: '+ Add Passenger',
    newPassenger: '➕ New Passenger',
    editPassenger: '✏️ Edit Passenger',
    intlPassport: '🌍 International Passport',
    ruPassport: '🇷🇺 Russian Passport',
    intlHint: '✈️ First and last name in Latin letters, as in passport. No middle name.',
    ruHint: '🇷🇺 Data entered in Cyrillic, as in Russian passport.',
    firstName: 'First Name (Latin)',
    lastName: 'Last Name (Latin)',
    firstNameRu: 'First Name',
    lastNameRu: 'Last Name',
    middleName: 'Middle Name',
    birthDate: 'Date of Birth',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    citizenship: 'Citizenship',
    passportNumber: 'Passport Number',
    passportExpiry: 'Expiry Date',
    passportSeries: 'Passport Series',
    passportNumberRu: 'Passport Number',
    passportIssueDate: 'Issue Date',
    passportCode: 'Division Code',
    save: '✅ Save',
    saving: 'Saving...',
    cancel: 'Cancel',
    logout: 'Logout',
    inviteFriend: '🔗 Invite Friend',
    copied: '✅ Link Copied!',
    points: 'points',
    friends: 'friends',
    progressTitle: 'Progress to discount',
    refCode: 'Your referral code',
    discountAvail: '✅ Discount 1000 ₽ available!',
    toDiscount: 'to discount',
    cabinet: '👤 My Account',
    about: 'About Us',
    aboutText1: 'Rasskye Travel — service for finding cheap flights, tours and hotels.',
    aboutText2: 'We work with trusted partners — Aviasales, Travelata, Yandex Travel and others.',
    aboutText3: 'Our mission — make travel affordable for everyone.',
    contacts: 'Contacts',
    contactsSubtitle: 'We will respond within 24 hours',
    writeUs: 'Send us an email',
    open: 'Open →',
    write: 'Write →',
    trainsTitle: 'Train Tickets',
    trainsSubtitle: 'Search and buy train tickets via Tutu.ru',
    trainsBtn: '🔍 Find train tickets →',
    directions: '🌍 Tours by Destination',
    partners: ['Aviasales', 'Travelata', 'Yandex Travel', 'Level.Travel', 'OnlineTours', 'Tutu.ru', 'Cherehapa'],
    legal: 'Legal & Offer',
  },
  tr: {
    title: 'Akıllıca Seyahat Edin!',
    subtitle: 'Uçuşlar, turlar, oteller — hepsi bir arada',
    services: 'Tüm Hizmetler',
    flights: 'Uçuşlar',
    trains: 'Trenler',
    tours: 'Turlar',
    hotels: 'Oteller',
    insurance: 'Sigorta',
    hotTours: '🔥 Sıcak Turlar',
    specialOffers: '⭐️ Özel Teklifler',
    destinations: '✈️ Popüler Destinasyonlar',
    excursions: '🎭 Geziler',
    footerHome: '🏠 Ana Sayfa',
    footerAbout: 'ℹ️ Hakkımızda',
    footerContacts: '📞 İletişim',
    login: 'Giriş',
    profile: '👤 Profil',
    passengers: '🧳 Yolcular',
    myPassengers: '🧳 Yolcularım',
    passengersSubtitle: 'Veriler kaydedilir ve rezervasyonda otomatik doldurulur',
    noPassengers: 'Henüz yolcu eklenmedi',
    addPassenger: '+ Yolcu Ekle',
    newPassenger: '➕ Yeni Yolcu',
    editPassenger: '✏️ Yolcuyu Düzenle',
    intlPassport: '🌍 Uluslararası Pasaport',
    ruPassport: '🇷🇺 Rus Pasaportu',
    intlHint: '✈️ Ad ve soyad Latin harfleriyle, pasaportdaki gibi. Orta ad yok.',
    ruHint: '🇷🇺 Veriler Kiril harfleriyle girilir.',
    firstName: 'Ad (Latin)',
    lastName: 'Soyad (Latin)',
    firstNameRu: 'Ad',
    lastNameRu: 'Soyad',
    middleName: 'İkinci Ad',
    birthDate: 'Doğum Tarihi',
    gender: 'Cinsiyet',
    male: 'Erkek',
    female: 'Kadın',
    citizenship: 'Vatandaşlık',
    passportNumber: 'Pasaport Numarası',
    passportExpiry: 'Son Kullanma Tarihi',
    passportSeries: 'Pasaport Serisi',
    passportNumberRu: 'Pasaport Numarası',
    passportIssueDate: 'Veriliş Tarihi',
    passportCode: 'Bölüm Kodu',
    save: '✅ Kaydet',
    saving: 'Kaydediliyor...',
    cancel: 'İptal',
    logout: 'Çıkış',
    inviteFriend: '🔗 Arkadaş Davet Et',
    copied: '✅ Bağlantı Kopyalandı!',
    points: 'puan',
    friends: 'arkadaş',
    progressTitle: 'İndirime ilerleme',
    refCode: 'Referans kodunuz',
    discountAvail: '✅ İndirim mevcut!',
    toDiscount: 'indirime kalan',
    cabinet: '👤 Hesabım',
    about: 'Hakkımızda',
    aboutText1: 'Rasskye Travel — ucuz uçuş, tur ve otel bulma servisi.',
    aboutText2: 'Aviasales, Travelata ve diğer güvenilir ortaklarla çalışıyoruz.',
    aboutText3: 'Misyonumuz — seyahati herkes için erişilebilir kılmak.',
    contacts: 'İletişim',
    contactsSubtitle: '24 saat içinde yanıt vereceğiz',
    writeUs: 'Bize e-posta gönderin',
    open: 'Aç →',
    write: 'Yaz →',
    trainsTitle: 'Tren Biletleri',
    trainsSubtitle: 'Tutu.ru üzerinden tren bileti arayın',
    trainsBtn: '🔍 Tren bileti bul →',
    directions: '🌍 Destinasyona Göre Turlar',
    partners: ['Aviasales', 'Travelata', 'Yandex Travel', 'Level.Travel', 'OnlineTours', 'Tutu.ru', 'Cherehapa'],
    legal: 'Yasal & Teklif',
  },
  de: {
    title: 'Reisen Sie günstig!',
    subtitle: 'Flüge, Touren, Hotels — alles an einem Ort',
    services: 'Alle Dienste',
    flights: 'Flüge',
    trains: 'Züge',
    tours: 'Touren',
    hotels: 'Hotels',
    insurance: 'Versicherung',
    hotTours: '🔥 Heiße Touren',
    specialOffers: '⭐️ Sonderangebote',
    destinations: '✈️ Beliebte Reiseziele',
    excursions: '🎭 Ausflüge',
    footerHome: '🏠 Startseite',
    footerAbout: 'ℹ️ Über uns',
    footerContacts: '📞 Kontakt',
    login: 'Anmelden',
    profile: '👤 Profil',
    passengers: '🧳 Passagiere',
    myPassengers: '🧳 Meine Passagiere',
    passengersSubtitle: 'Daten werden gespeichert und beim Buchen automatisch ausgefüllt',
    noPassengers: 'Noch keine Passagiere hinzugefügt',
    addPassenger: '+ Passagier hinzufügen',
    newPassenger: '➕ Neuer Passagier',
    editPassenger: '✏️ Passagier bearbeiten',
    intlPassport: '🌍 Internationaler Reisepass',
    ruPassport: '🇷🇺 Russischer Pass',
    intlHint: '✈️ Vor- und Nachname in lateinischen Buchstaben, wie im Pass. Kein zweiter Vorname.',
    ruHint: '🇷🇺 Daten werden in Kyrillisch eingegeben.',
    firstName: 'Vorname (Latein)',
    lastName: 'Nachname (Latein)',
    firstNameRu: 'Vorname',
    lastNameRu: 'Nachname',
    middleName: 'Zweiter Vorname',
    birthDate: 'Geburtsdatum',
    gender: 'Geschlecht',
    male: 'Männlich',
    female: 'Weiblich',
    citizenship: 'Staatsangehörigkeit',
    passportNumber: 'Reisepassnummer',
    passportExpiry: 'Ablaufdatum',
    passportSeries: 'Passserie',
    passportNumberRu: 'Passnummer',
    passportIssueDate: 'Ausstellungsdatum',
    passportCode: 'Abteilungscode',
    save: '✅ Speichern',
    saving: 'Wird gespeichert...',
    cancel: 'Abbrechen',
    logout: 'Abmelden',
    inviteFriend: '🔗 Freund einladen',
    copied: '✅ Link kopiert!',
    points: 'Punkte',
    friends: 'Freunde',
    progressTitle: 'Fortschritt zum Rabatt',
    refCode: 'Ihr Empfehlungscode',
    discountAvail: '✅ Rabatt verfügbar!',
    toDiscount: 'bis zum Rabatt',
    cabinet: '👤 Mein Konto',
    about: 'Über uns',
    aboutText1: 'Rasskye Travel — Service zur Suche nach günstigen Flügen, Touren und Hotels.',
    aboutText2: 'Wir arbeiten mit zuverlässigen Partnern zusammen.',
    aboutText3: 'Unsere Mission — Reisen für jeden erschwinglich machen.',
    contacts: 'Kontakt',
    contactsSubtitle: 'Wir antworten innerhalb von 24 Stunden',
    writeUs: 'Schreiben Sie uns eine E-Mail',
    open: 'Öffnen →',
    write: 'Schreiben →',
    trainsTitle: 'Zugtickets',
    trainsSubtitle: 'Zugtickets über Tutu.ru suchen und kaufen',
    trainsBtn: '🔍 Zugtickets finden →',
    directions: '🌍 Touren nach Reiseziel',
    partners: ['Aviasales', 'Travelata', 'Yandex Travel', 'Level.Travel', 'OnlineTours', 'Tutu.ru', 'Cherehapa'],
    legal: 'Rechtliches & Angebot',
  },
  hy: {
    title: 'Ճամփորդեք ձեռնտու!',
    subtitle: 'Թռիչքներ, շրջագայություններ, հյուրանոցներ — ամեն ինչ մեկ տեղում',
    services: 'Բոլոր ծառայությունները',
    flights: 'Թռիչքներ',
    trains: 'Գնացքներ',
    tours: 'Շրջագայություններ',
    hotels: 'Հյուրանոցներ',
    insurance: 'Ապահովագրություն',
    hotTours: '🔥 Տաք շրջագայություններ',
    specialOffers: '⭐️ Հատուկ առաջարկներ',
    destinations: '✈️ Հայտնի ուղղություններ',
    excursions: '🎭 Էքսկուրսիաներ',
    footerHome: '🏠 Գլխավոր',
    footerAbout: 'ℹ️ Մեր մասին',
    footerContacts: '📞 Կապ',
    login: 'Մուտք',
    profile: '👤 Պրոֆիլ',
    passengers: '🧳 Ուղևորներ',
    myPassengers: '🧳 Իմ ուղևորները',
    passengersSubtitle: 'Տվյալները պահվում են և ավտոմատ լրացվում ամրագրման ժամանակ',
    noPassengers: 'Ուղևորներ դեռ չեն ավելացված',
    addPassenger: '+ Ավելացնել ուղևոր',
    newPassenger: '➕ Նոր ուղևոր',
    editPassenger: '✏️ Խմբագրել ուղևորին',
    intlPassport: '🌍 Անձնագիր',
    ruPassport: '🇷🇺 Ռուսական անձնագիր',
    intlHint: '✈️ Անուն և ազգանուն լատինատառ, ինչպես անձնագրում։',
    ruHint: '🇷🇺 Տվյալները մուտքագրվում են կիրիլիցայով։',
    firstName: 'Անուն (լատինատառ)',
    lastName: 'Ազգանուն (լատինատառ)',
    firstNameRu: 'Անուն',
    lastNameRu: 'Ազգանուն',
    middleName: 'Հայրանուն',
    birthDate: 'Ծննդյան ամսաթիվ',
    gender: 'Սեռ',
    male: 'Արական',
    female: 'Իգական',
    citizenship: 'Քաղաքացիություն',
    passportNumber: 'Անձնագրի համար',
    passportExpiry: 'Վավերականության ժամկետ',
    passportSeries: 'Անձնագրի սերիա',
    passportNumberRu: 'Անձնագրի համար',
    passportIssueDate: 'Տրման ամսաթիվ',
    passportCode: 'Բաժնի կոդ',
    save: '✅ Պահել',
    saving: 'Պահվում է...',
    cancel: 'Չեղարկել',
    logout: 'Ելք',
    inviteFriend: '🔗 Հրավիրել ընկեր',
    copied: '✅ Հղումը պատճենված է!',
    points: 'միավոր',
    friends: 'ընկեր',
    progressTitle: 'Զեղչի առաջընթաց',
    refCode: 'Ձեր հղման կոդը',
    discountAvail: '✅ Զեղչ հասանելի է!',
    toDiscount: 'մինչև զեղչ',
    cabinet: '👤 Իմ հաշիվը',
    about: 'Մեր մասին',
    aboutText1: 'Rasskye Travel — էժան թռիչքների, շրջագայությունների և հյուրանոցների որոնման ծառայություն։',
    aboutText2: 'Մենք աշխատում ենք վստահելի գործընկերների հետ։',
    aboutText3: 'Մեր առաքելությունը — ճամփորդությունները դարձնել մատչելի բոլորի համար։',
    contacts: 'Կապ',
    contactsSubtitle: 'Կպատասխանենք 24 ժամվա ընթացքում',
    writeUs: 'Գրեք մեզ',
    open: 'Բացել →',
    write: 'Գրել →',
    trainsTitle: 'Գնացքի տոմսեր',
    trainsSubtitle: 'Գնացքի տոմսեր Tutu.ru-ի միջոցով',
    trainsBtn: '🔍 Գտնել գնացքի տոմսեր →',
    directions: '🌍 Շրջագայություններ ըստ ուղղության',
    partners: ['Aviasales', 'Travelata', 'Yandex Travel', 'Level.Travel', 'OnlineTours', 'Tutu.ru', 'Cherehapa'],
    legal: 'Իրավական & Առաջարկ',
  },
  bs: {
    title: 'Putujte pametno!',
    subtitle: 'Letovi, ture, hoteli — sve na jednom mjestu',
    services: 'Sve usluge',
    flights: 'Letovi',
    trains: 'Vozovi',
    tours: 'Ture',
    hotels: 'Hoteli',
    insurance: 'Osiguranje',
    hotTours: '🔥 Vruće ture',
    specialOffers: '⭐️ Posebne ponude',
    destinations: '✈️ Popularne destinacije',
    excursions: '🎭 Izleti',
    footerHome: '🏠 Početna',
    footerAbout: 'ℹ️ O nama',
    footerContacts: '📞 Kontakt',
    login: 'Prijava',
    profile: '👤 Profil',
    passengers: '🧳 Putnici',
    myPassengers: '🧳 Moji putnici',
    passengersSubtitle: 'Podaci se čuvaju i automatski popunjavaju pri rezervaciji',
    noPassengers: 'Još nema dodanih putnika',
    addPassenger: '+ Dodaj putnika',
    newPassenger: '➕ Novi putnik',
    editPassenger: '✏️ Uredi putnika',
    intlPassport: '🌍 Međunarodni pasoš',
    ruPassport: '🇷🇺 Ruski pasoš',
    intlHint: '✈️ Ime i prezime latiničnim slovima, kao u pasošu.',
    ruHint: '🇷🇺 Podaci se unose ćirilicom.',
    firstName: 'Ime (latinica)',
    lastName: 'Prezime (latinica)',
    firstNameRu: 'Ime',
    lastNameRu: 'Prezime',
    middleName: 'Srednje ime',
    birthDate: 'Datum rođenja',
    gender: 'Spol',
    male: 'Muški',
    female: 'Ženski',
    citizenship: 'Državljanstvo',
    passportNumber: 'Broj pasoša',
    passportExpiry: 'Datum isteka',
    passportSeries: 'Serija pasoša',
    passportNumberRu: 'Broj pasoša',
    passportIssueDate: 'Datum izdavanja',
    passportCode: 'Kod odjela',
    save: '✅ Sačuvaj',
    saving: 'Čuvanje...',
    cancel: 'Otkaži',
    logout: 'Odjava',
    inviteFriend: '🔗 Pozovi prijatelja',
    copied: '✅ Link kopiran!',
    points: 'bodova',
    friends: 'prijatelja',
    progressTitle: 'Napredak do popusta',
    refCode: 'Vaš referalni kod',
    discountAvail: '✅ Popust dostupan!',
    toDiscount: 'do popusta',
    cabinet: '👤 Moj nalog',
    about: 'O nama',
    aboutText1: 'Rasskye Travel — servis za pronalazak jeftinih letova, tura i hotela.',
    aboutText2: 'Sarađujemo s pouzdanim partnerima.',
    aboutText3: 'Naša misija — učiniti putovanja dostupnim svima.',
    contacts: 'Kontakt',
    contactsSubtitle: 'Odgovorićemo u roku od 24 sata',
    writeUs: 'Pišite nam email',
    open: 'Otvori →',
    write: 'Piši →',
    trainsTitle: 'Vozne karte',
    trainsSubtitle: 'Pretraži i kupi vozne karte putem Tutu.ru',
    trainsBtn: '🔍 Nađi vozne karte →',
    directions: '🌍 Ture po destinaciji',
    partners: ['Aviasales', 'Travelata', 'Yandex Travel', 'Level.Travel', 'OnlineTours', 'Tutu.ru', 'Cherehapa'],
    legal: 'Pravno & Ponuda',
  },
  kk: {
    title: 'Тиімді саяхат етіңіз!',
    subtitle: 'Ұшулар, турлар, қонақүйлер — бәрі бір жерде',
    services: 'Барлық қызметтер',
    flights: 'Ұшулар',
    trains: 'Пойыздар',
    tours: 'Турлар',
    hotels: 'Қонақүйлер',
    insurance: 'Сақтандыру',
    hotTours: '🔥 Ыстық турлар',
    specialOffers: '⭐️ Арнайы ұсыныстар',
    destinations: '✈️ Танымал бағыттар',
    excursions: '🎭 Экскурсиялар',
    footerHome: '🏠 Басты бет',
    footerAbout: 'ℹ️ Біз туралы',
    footerContacts: '📞 Байланыс',
    login: 'Кіру',
    profile: '👤 Профиль',
    passengers: '🧳 Жолаушылар',
    myPassengers: '🧳 Менің жолаушыларым',
    passengersSubtitle: 'Деректер сақталады және брондау кезінде автоматты түрде толтырылады',
    noPassengers: 'Жолаушылар әлі қосылмаған',
    addPassenger: '+ Жолаушы қосу',
    newPassenger: '➕ Жаңа жолаушы',
    editPassenger: '✏️ Жолаушыны өңдеу',
    intlPassport: '🌍 Халықаралық паспорт',
    ruPassport: '🇷🇺 Ресей паспорты',
    intlHint: '✈️ Аты-жөні латын әріптерімен, паспорттағыдай.',
    ruHint: '🇷🇺 Деректер кириллицамен енгізіледі.',
    firstName: 'Аты (латынша)',
    lastName: 'Тегі (латынша)',
    firstNameRu: 'Аты',
    lastNameRu: 'Тегі',
    middleName: 'Әкесінің аты',
    birthDate: 'Туған күні',
    gender: 'Жынысы',
    male: 'Еркек',
    female: 'Әйел',
    citizenship: 'Азаматтығы',
    passportNumber: 'Паспорт нөмірі',
    passportExpiry: 'Жарамдылық мерзімі',
    passportSeries: 'Паспорт сериясы',
    passportNumberRu: 'Паспорт нөмірі',
    passportIssueDate: 'Берілген күні',
    passportCode: 'Бөлім коды',
    save: '✅ Сақтау',
    saving: 'Сақталуда...',
    cancel: 'Болдырмау',
    logout: 'Шығу',
    inviteFriend: '🔗 Досты шақыру',
    copied: '✅ Сілтеме көшірілді!',
    points: 'ұпай',
    friends: 'дос',
    progressTitle: 'Жеңілдікке дейінгі прогресс',
    refCode: 'Сіздің реферал кодыңыз',
    discountAvail: '✅ Жеңілдік қол жетімді!',
    toDiscount: 'жеңілдікке дейін',
    cabinet: '👤 Менің кабинетім',
    about: 'Біз туралы',
    aboutText1: 'Rasskye Travel — арзан рейстер, турлар және қонақүйлер іздеу қызметі.',
    aboutText2: 'Біз сенімді серіктестермен жұмыс істейміз.',
    aboutText3: 'Біздің миссиямыз — саяхатты барлығына қолжетімді ету.',
    contacts: 'Байланыс',
    contactsSubtitle: '24 сағат ішінде жауап береміз',
    writeUs: 'Бізге email жіберіңіз',
    open: 'Ашу →',
    write: 'Жазу →',
    trainsTitle: 'Пойыз билеттері',
    trainsSubtitle: 'Tutu.ru арқылы пойыз билеттерін іздеу',
    trainsBtn: '🔍 Пойыз билеттерін табу →',
    directions: '🌍 Бағыт бойынша турлар',
    partners: ['Aviasales', 'Travelata', 'Yandex Travel', 'Level.Travel', 'OnlineTours', 'Tutu.ru', 'Cherehapa'],
    legal: 'Заңды & Ұсыныс',
  },
  ky: {
    title: 'Акылдуу саякат кылыңыз!',
    subtitle: 'Учуулар, турлар, мейманканалар — баары бир жерде',
    services: 'Бардык кызматтар',
    flights: 'Учуулар',
    trains: 'Поездлер',
    tours: 'Турлар',
    hotels: 'Мейманканалар',
    insurance: 'Камсыздандыруу',
    hotTours: '🔥 Ысык турлар',
    specialOffers: '⭐️ Атайын сунуштар',
    destinations: '✈️ Популярдуу багыттар',
    excursions: '🎭 Экскурсиялар',
    footerHome: '🏠 Башкы бет',
    footerAbout: 'ℹ️ Биз жөнүндө',
    footerContacts: '📞 Байланыш',
    login: 'Кирүү',
    profile: '👤 Профиль',
    passengers: '🧳 Жолоочулар',
    myPassengers: '🧳 Менин жолоочуларым',
    passengersSubtitle: 'Маалыматтар сакталат жана брондоодо автоматтык толтурулат',
    noPassengers: 'Жолоочулар азырынча кошулган жок',
    addPassenger: '+ Жолоочу кошуу',
    newPassenger: '➕ Жаңы жолоочу',
    editPassenger: '✏️ Жолоочуну өзгөртүү',
    intlPassport: '🌍 Эл аралык паспорт',
    ruPassport: '🇷🇺 Орус паспорту',
    intlHint: '✈️ Аты-жөнү латын тамгалары менен, паспорттогудай.',
    ruHint: '🇷🇺 Маалыматтар кириллица менен киргизилет.',
    firstName: 'Аты (латынча)',
    lastName: 'Фамилиясы (латынча)',
    firstNameRu: 'Аты',
    lastNameRu: 'Фамилиясы',
    middleName: 'Атасынын аты',
    birthDate: 'Туулган күнү',
    gender: 'Жынысы',
    male: 'Эркек',
    female: 'Аял',
    citizenship: 'Жарандыгы',
    passportNumber: 'Паспорт номери',
    passportExpiry: 'Жарактуулук мөөнөтү',
    passportSeries: 'Паспорт сериясы',
    passportNumberRu: 'Паспорт номери',
    passportIssueDate: 'Берилген күнү',
    passportCode: 'Бөлүм коду',
    save: '✅ Сактоо',
    saving: 'Сакталууда...',
    cancel: 'Жокко чыгаруу',
    logout: 'Чыгуу',
    inviteFriend: '🔗 Досту чакыруу',
    copied: '✅ Шилтеме көчүрүлдү!',
    points: 'упай',
    friends: 'дос',
    progressTitle: 'Арзандатууга прогресс',
    refCode: 'Сиздин реферал кодуңуз',
    discountAvail: '✅ Арзандатуу жеткиликтүү!',
    toDiscount: 'арзандатууга чейин',
    cabinet: '👤 Менин кабинетим',
    about: 'Биз жөнүндө',
    aboutText1: 'Rasskye Travel — арзан учуулар, турлар жана мейманканаларды издөө кызматы.',
    aboutText2: 'Биз ишенимдүү өнөктөштөр менен иштейбиз.',
    aboutText3: 'Биздин миссиябыз — саякатты баарына жеткиликтүү кылуу.',
    contacts: 'Байланыш',
    contactsSubtitle: '24 саат ичинде жооп беребиз',
    writeUs: 'Бизге email жөнөтүңүз',
    open: 'Ачуу →',
    write: 'Жазуу →',
    trainsTitle: 'Поезд билеттери',
    trainsSubtitle: 'Tutu.ru аркылуу поезд билеттерин издөө',
    trainsBtn: '🔍 Поезд билеттерин табуу →',
    directions: '🌍 Багыт боюнча турлар',
    partners: ['Aviasales', 'Travelata', 'Yandex Travel', 'Level.Travel', 'OnlineTours', 'Tutu.ru', 'Cherehapa'],
    legal: 'Юридикалык & Сунуш',
  },
  tg: {
    title: 'Сафари фоиданок!',
    subtitle: 'Парвозҳо, турҳо, меҳмонхонаҳо — ҳама дар як ҷо',
    services: 'Ҳамаи хизматҳо',
    flights: 'Парвозҳо',
    trains: 'Қаторҳо',
    tours: 'Турҳо',
    hotels: 'Меҳмонхонаҳо',
    insurance: 'Суғурта',
    hotTours: '🔥 Турҳои гарм',
    specialOffers: '⭐️ Пешниҳодҳои махсус',
    destinations: '✈️ Самтҳои маъмул',
    excursions: '🎭 Экскурсияҳо',
    footerHome: '🏠 Саҳифаи асосӣ',
    footerAbout: 'ℹ️ Дар бораи мо',
    footerContacts: '📞 Тамос',
    login: 'Даромадан',
    profile: '👤 Профил',
    passengers: '🧳 Мусофирон',
    myPassengers: '🧳 Мусофирони ман',
    passengersSubtitle: 'Маълумот нигоҳ дошта мешавад ва ҳангоми бронирование автоматӣ пур карда мешавад',
    noPassengers: 'Мусофирон ҳанӯз илова нашудаанд',
    addPassenger: '+ Илова кардани мусофир',
    newPassenger: '➕ Мусофири нав',
    editPassenger: '✏️ Таҳрири мусофир',
    intlPassport: '🌍 Шиноснома',
    ruPassport: '🇷🇺 Шиноснома РФ',
    intlHint: '✈️ Ном ва насаб бо ҳарфҳои лотинӣ, мисли дар шиноснома.',
    ruHint: '🇷🇺 Маълумот бо кириллӣ ворид карда мешавад.',
    firstName: 'Ном (лотинӣ)',
    lastName: 'Насаб (лотинӣ)',
    firstNameRu: 'Ном',
    lastNameRu: 'Насаб',
    middleName: 'Номи падар',
    birthDate: 'Санаи таввалуд',
    gender: 'Ҷинс',
    male: 'Мард',
    female: 'Зан',
    citizenship: 'Шаҳрвандӣ',
    passportNumber: 'Рақами шиноснома',
    passportExpiry: 'Санаи анҷом',
    passportSeries: 'Серияи шиноснома',
    passportNumberRu: 'Рақами шиноснома',
    passportIssueDate: 'Санаи додан',
    passportCode: 'Рамзи бахш',
    save: '✅ Нигоҳ доштан',
    saving: 'Нигоҳ дошта мешавад...',
    cancel: 'Бекор кардан',
    logout: 'Баромадан',
    inviteFriend: '🔗 Даъват кардани дӯст',
    copied: '✅ Пайванд нусхабардорӣ шуд!',
    points: 'хол',
    friends: 'дӯст',
    progressTitle: 'Пешрафт то тахфиф',
    refCode: 'Рамзи реферали шумо',
    discountAvail: '✅ Тахфиф дастрас аст!',
    toDiscount: 'то тахфиф',
    cabinet: '👤 Кабинети ман',
    about: 'Дар бораи мо',
    aboutText1: 'Rasskye Travel — хидмати ҷустуҷӯи парвозҳо, турҳо ва меҳмонхонаҳои арзон.',
    aboutText2: 'Мо бо шарикони боэтимод кор мекунем.',
    aboutText3: 'Миссияи мо — сафарро барои ҳама дастрас кардан.',
    contacts: 'Тамос',
    contactsSubtitle: 'Дар давоми 24 соат ҷавоб медиҳем',
    writeUs: 'Ба мо email фиристед',
    open: 'Кушодан →',
    write: 'Навиштан →',
    trainsTitle: 'Билети қатор',
    trainsSubtitle: 'Ҷустуҷӯ ва харидани билети қатор тавассути Tutu.ru',
    trainsBtn: '🔍 Ёфтани билети қатор →',
    directions: '🌍 Турҳо аз рӯи самт',
    partners: ['Aviasales', 'Travelata', 'Yandex Travel', 'Level.Travel', 'OnlineTours', 'Tutu.ru', 'Cherehapa'],
    legal: 'Ҳуқуқӣ & Пешниҳод',
  },
  ce: {
    title: 'Хаза лела!',
    subtitle: 'Кеманаш, туташ, гостиницаш — цхьаьна меттехь',
    services: 'Дерриге гIуллакхаш',
    flights: 'Кеманаш',
    trains: 'Поездаш',
    tours: 'Туташ',
    hotels: 'Гостиницаш',
    insurance: 'Страховка',
    hotTours: '🔥 ТӀехьара туташ',
    specialOffers: '⭐️ Тайп-тайпана предложенеш',
    destinations: '✈️ ЦӀена маршруташ',
    excursions: '🎭 Экскурсяш',
    footerHome: '🏠 Чуьра аг',
    footerAbout: 'ℹ️ Вайн хьокъехь',
    footerContacts: '📞 Уьйр',
    login: 'Чу ваха',
    profile: '👤 Профиль',
    passengers: '🧳 Сайлархой',
    myPassengers: '🧳 Сан сайлархой',
    passengersSubtitle: 'Хаамаш сохранитьде йо бронь йийцарца автоматически чекхйоу',
    noPassengers: 'Сайлархой юьхьанца ца тоьллина',
    addPassenger: '+ Сайлар тIетоха',
    newPassenger: '➕ КерлачуСайлар',
    editPassenger: '✏️ Сайлар хийца',
    intlPassport: '🌍 Международни паспорт',
    ruPassport: '🇷🇺 Оьрсийн паспорт',
    intlHint: '✈️ ЦӀе латинан элпаш тIехь, паспортехь мел ду санна.',
    ruHint: '🇷🇺 Хаамаш кириллицехь язде йо.',
    firstName: 'Цӏе (латиница)',
    lastName: 'Фамили (латиница)',
    firstNameRu: 'Цӏе',
    lastNameRu: 'Фамили',
    middleName: 'ДАйн цӏе',
    birthDate: 'Вина де',
    gender: 'Сий',
    male: 'Стаг',
    female: 'Зуда',
    citizenship: 'Гражданство',
    passportNumber: 'Паспортан номер',
    passportExpiry: 'Чекхдалар де',
    passportSeries: 'Паспортан серия',
    passportNumberRu: 'Паспортан номер',
    passportIssueDate: 'Делла де',
    passportCode: 'Отделан код',
    save: '✅ Сохранить',
    saving: 'Сохраняется...',
    cancel: 'Отмена',
    logout: 'Арадаха',
    inviteFriend: '🔗 Доттагӏа хIоттадала',
    copied: '✅ Хьажориг копировалла!',
    points: 'очко',
    friends: 'доттагӏий',
    progressTitle: 'Скидкина прогресс',
    refCode: 'Хьан реферал код',
    discountAvail: '✅ Скидка ю!',
    toDiscount: 'скидкина кхаччалц',
    cabinet: '👤 Сан кабинет',
    about: 'Вайн хьокъехь',
    aboutText1: 'Rasskye Travel — жима ахчанах кеманаш, туташ, гостиницаш лохучу гIуллакх.',
    aboutText2: 'Вай нийсачу партнераша цхьаьна болх беш ду.',
    aboutText3: 'Вайн миссия — дерригенна гIо дар сайлархошна.',
    contacts: 'Уьйр',
    contactsSubtitle: '24 сахьт юкъахь жоп лур ду',
    writeUs: 'Вайна email язде',
    open: 'Схьаюха →',
    write: 'Яздан →',
    trainsTitle: 'Поездан билеташ',
    trainsSubtitle: 'Tutu.ru чухула поездан билеташ лаха',
    trainsBtn: '🔍 Поездан билеташ лаха →',
    directions: '🌍 Маршрутехь туташ',
    partners: ['Aviasales', 'Travelata', 'Yandex Travel', 'Level.Travel', 'OnlineTours', 'Tutu.ru', 'Cherehapa'],
    legal: 'Юридически & Предложени',
  },
}

const DESTINATIONS = [
  { name: { ru: 'Турция', en: 'Turkey', tr: 'Türkiye', de: 'Türkei', hy: 'Թուրքիա', bs: 'Turska', kk: 'Түркия', ky: 'Түркия', tg: 'Туркия', ce: 'Турци' }, price: 'от 28 000 ₽', priceRub: 28000, url: 'https://travelata.tpk.lu/N5aNnOKQ', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80' },
  { name: { ru: 'Египет', en: 'Egypt', tr: 'Mısır', de: 'Ägypten', hy: 'Եգիպտոս', bs: 'Egipat', kk: 'Египет', ky: 'Египет', tg: 'Миср', ce: 'Египет' }, price: 'от 35 000 ₽', priceRub: 35000, url: 'https://travelata.tpk.lu/N5aNnOKQ', img: 'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=400&q=80' },
  { name: { ru: 'Таиланд', en: 'Thailand', tr: 'Tayland', de: 'Thailand', hy: 'Թաիլանդ', bs: 'Tajland', kk: 'Тайланд', ky: 'Таиланд', tg: 'Таиланд', ce: 'Таиланд' }, price: 'от 52 000 ₽', priceRub: 52000, url: 'https://travelata.tpk.lu/N5aNnOKQ', img: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400&q=80' },
  { name: { ru: 'ОАЭ', en: 'UAE', tr: 'BAE', de: 'VAE', hy: 'ԱՄԷ', bs: 'UAE', kk: 'БАӘ', ky: 'БАЭ', tg: 'ААИ', ce: 'ОАЭ' }, price: 'от 45 000 ₽', priceRub: 45000, url: 'https://travelata.tpk.lu/N5aNnOKQ', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80' },
  { name: { ru: 'Греция', en: 'Greece', tr: 'Yunanistan', de: 'Griechenland', hy: 'Հունաստան', bs: 'Grčka', kk: 'Греция', ky: 'Греция', tg: 'Юнон', ce: 'Греци' }, price: 'от 40 000 ₽', priceRub: 40000, url: 'https://travelata.tpk.lu/N5aNnOKQ', img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&q=80' },
  { name: { ru: 'Мальдивы', en: 'Maldives', tr: 'Maldivler', de: 'Malediven', hy: 'Մալդիվներ', bs: 'Maldivi', kk: 'Мальдивтер', ky: 'Мальдивдер', tg: 'Малдив', ce: 'Мальдиваш' }, price: 'от 120 000 ₽', priceRub: 120000, url: 'https://travelata.tpk.lu/N5aNnOKQ', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80' },
]

const SERVICES = [
  { icon: '✈️', name: { ru: 'Авиабилеты', en: 'Flights', tr: 'Uçuşlar', de: 'Flüge', hy: 'Թռիչքներ', bs: 'Letovi', kk: 'Ұшулар', ky: 'Учуулар', tg: 'Парвозҳо', ce: 'Кеманаш' }, url: 'https://aviasales.tpk.lu/HUJG5wlT' },
  { icon: '🚂', name: { ru: 'Поезда', en: 'Trains', tr: 'Trenler', de: 'Züge', hy: 'Գնացքներ', bs: 'Vozovi', kk: 'Пойыздар', ky: 'Поездлер', tg: 'Қаторҳо', ce: 'Поездаш' }, url: 'https://tutu.tpk.lu/e9tdxDVM' },
  { icon: '🏨', name: { ru: 'Отели', en: 'Hotels', tr: 'Oteller', de: 'Hotels', hy: 'Հյուրանոցներ', bs: 'Hoteli', kk: 'Қонақүйлер', ky: 'Мейманканалар', tg: 'Меҳмонхонаҳо', ce: 'Гостиницаш' }, url: 'https://ostrovok.tpk.lu/kLTTObej' },
  { icon: '🌍', name: { ru: 'Яндекс Тревел', en: 'Yandex Travel', tr: 'Yandex Seyahat', de: 'Yandex Reisen', hy: 'Yandex Travel', bs: 'Yandex Travel', kk: 'Яндекс Сапар', ky: 'Яндекс Саякат', tg: 'Яндекс Сафар', ce: 'Яндекс Сайлар' }, url: 'https://yandex.tpk.lu/iTIv7hqq' },
  { icon: '🚕', name: { ru: 'Кивитакси', en: 'KiwiTaxi', tr: 'KiwiTaxi', de: 'KiwiTaxi', hy: 'KiwiTaxi', bs: 'KiwiTaxi', kk: 'KiwiTaxi', ky: 'KiwiTaxi', tg: 'KiwiTaxi', ce: 'KiwiTaxi' }, url: 'https://kiwitaxi.tpk.lu/ztSiFByu' },
  { icon: '🚗', name: { ru: 'Трансфер', en: 'Transfer', tr: 'Transfer', de: 'Transfer', hy: 'Տրանսֆեր', bs: 'Transfer', kk: 'Трансфер', ky: 'Трансфер', tg: 'Трансфер', ce: 'Трансфер' }, url: 'https://gettransfer.tpk.lu/4GprVYvq' },
  { icon: '🚙', name: { ru: 'Аренда авто', en: 'Car Rental', tr: 'Araç Kiralama', de: 'Mietwagen', hy: 'Մեքենա վարձ', bs: 'Rent a car', kk: 'Авто жалдау', ky: 'Авто ижарасы', tg: 'Иҷораи мошин', ce: 'Машина лаца' }, url: 'https://getrentacar.tpk.lu/3yiVaLER' },
  { icon: '📱', name: { ru: 'Есим', en: 'eSIM', tr: 'eSIM', de: 'eSIM', hy: 'eSIM', bs: 'eSIM', kk: 'eSIM', ky: 'eSIM', tg: 'eSIM', ce: 'eSIM' }, url: 'https://yesim.tpk.lu/KfRZZBJn' },
  { icon: '🎟️', name: { ru: 'Экскурсии', en: 'Excursions', tr: 'Geziler', de: 'Ausflüge', hy: 'Էքսկուրսիաներ', bs: 'Izleti', kk: 'Экскурсиялар', ky: 'Экскурсиялар', tg: 'Экскурсияҳо', ce: 'Экскурсяш' }, url: 'https://tiqets.tpk.lu/r1rZSkqx' },
  { icon: '🏠', name: { ru: 'Авито Трэвел', en: 'Avito Travel', tr: 'Avito Travel', de: 'Avito Travel', hy: 'Avito Travel', bs: 'Avito Travel', kk: 'Avito Travel', ky: 'Avito Travel', tg: 'Avito Travel', ce: 'Avito Travel' }, url: 'https://avito.tpk.lu/B1vgWiUS' },
  { icon: '🔑', name: { ru: 'Отелло', en: 'Otello', tr: 'Otello', de: 'Otello', hy: 'Otello', bs: 'Otello', kk: 'Otello', ky: 'Otello', tg: 'Otello', ce: 'Otello' }, url: 'https://otello.tpk.lu/jDOyI1NE' },
  { icon: '🌴', name: { ru: 'Travelata', en: 'Travelata', tr: 'Travelata', de: 'Travelata', hy: 'Travelata', bs: 'Travelata', kk: 'Travelata', ky: 'Travelata', tg: 'Travelata', ce: 'Travelata' }, url: 'https://travelata.tpk.lu/N5aNnOKQ' },
  { icon: '🛡️', name: { ru: 'Cherehapa', en: 'Cherehapa', tr: 'Cherehapa', de: 'Cherehapa', hy: 'Cherehapa', bs: 'Cherehapa', kk: 'Cherehapa', ky: 'Cherehapa', tg: 'Cherehapa', ce: 'Cherehapa' }, url: 'https://cherehapa.tpk.lu/xV4At24K' },
  { icon: '⛵', name: { ru: 'LaVoyage', en: 'LaVoyage', tr: 'LaVoyage', de: 'LaVoyage', hy: 'LaVoyage', bs: 'LaVoyage', kk: 'LaVoyage', ky: 'LaVoyage', tg: 'LaVoyage', ce: 'LaVoyage' }, url: 'https://lavoyage.tpk.lu/dgaihSJ3' },
  { icon: '🗺️', name: { ru: 'OnlineTours', en: 'OnlineTours', tr: 'OnlineTours', de: 'OnlineTours', hy: 'OnlineTours', bs: 'OnlineTours', kk: 'OnlineTours', ky: 'OnlineTours', tg: 'OnlineTours', ce: 'OnlineTours' }, url: 'https://onlinetours.tpk.lu/CqZ6cARF' },
  { icon: '🏖️', name: { ru: 'Level.Travel', en: 'Level.Travel', tr: 'Level.Travel', de: 'Level.Travel', hy: 'Level.Travel', bs: 'Level.Travel', kk: 'Level.Travel', ky: 'Level.Travel', tg: 'Level.Travel', ce: 'Level.Travel' }, url: 'https://level.tpk.lu/0zb498sT' },
  { icon: '🎭', name: { ru: 'Tripster', en: 'Tripster', tr: 'Tripster', de: 'Tripster', hy: 'Tripster', bs: 'Tripster', kk: 'Tripster', ky: 'Tripster', tg: 'Tripster', ce: 'Tripster' }, url: 'https://tripster.tpk.lu/WzNY4VHD' },
  { icon: '📋', name: { ru: 'Сравни.ру', en: 'Sravni.ru', tr: 'Sravni.ru', de: 'Sravni.ru', hy: 'Sravni.ru', bs: 'Sravni.ru', kk: 'Sravni.ru', ky: 'Sravni.ru', tg: 'Sravni.ru', ce: 'Sravni.ru' }, url: 'https://sravni.tpk.lu/cxaaAmQv' },
  { icon: '🛡️', name: { ru: 'Tripinsurance', en: 'Tripinsurance', tr: 'Tripinsurance', de: 'Tripinsurance', hy: 'Tripinsurance', bs: 'Tripinsurance', kk: 'Tripinsurance', ky: 'Tripinsurance', tg: 'Tripinsurance', ce: 'Tripinsurance' }, url: 'https://tripinsurance.tpk.lu/92EID4sn' },
  { icon: '🏡', name: { ru: 'Суточно.ру', en: 'Sutochno.ru', tr: 'Sutochno.ru', de: 'Sutochno.ru', hy: 'Sutochno.ru', bs: 'Sutochno.ru', kk: 'Sutochno.ru', ky: 'Sutochno.ru', tg: 'Sutochno.ru', ce: 'Sutochno.ru' }, url: 'https://sutochno.tpk.lu/K2JsUujl' },
]

async function fetchRates() {
  try {
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/RUB')
    const data = await res.json()
    return data.rates
  } catch { return {} }
}

function convertPrice(p, c, rates) {
  if (c === 'rub') return p
  const rate = rates[c.toUpperCase()]
  if (!rate) return p
  return Math.round(p * rate)
}

function formatPrice(a, c) {
  const cur = CURRENCIES[c]
  if (!cur) return a
  return c === 'rub' ? a.toLocaleString('ru-RU') + ' ' + cur.symbol : cur.symbol + a.toLocaleString('en-US')
}

function Dropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])
  const current = options.find(o => o.value === value)
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '10px', padding: '6px 12px', color: '#fff', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap', minWidth: '80px' }}
      >
        {current?.flag} {current?.label} <span style={{ fontSize: '0.6rem', opacity: 0.7 }}>▼</span>
      </button>
      {open && (
        <div style={{ position: 'absolute', top: '110%', right: 0, background: '#fff', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', zIndex: 9999, minWidth: '160px', maxHeight: '280px', overflowY: 'auto', border: '1px solid #e2e8f0' }}>
          {options.map(o => (
            <button key={o.value} onClick={() => { onChange(o.value); setOpen(false) }}
              style={{ width: '100%', padding: '9px 14px', border: 'none', background: value === o.value ? '#eef2ff' : 'transparent', color: value === o.value ? '#4f46e5' : '#1e293b', fontWeight: value === o.value ? '700' : '500', fontSize: '0.88rem', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {o.flag} {o.label} {o.name && <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{o.name}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const EMPTY_INTL = { docType: 'international', firstName: '', lastName: '', birthDate: '', gender: 'male', citizenship: 'RU', passportNumber: '', passportExpiry: '' }
const EMPTY_RU = { docType: 'russian', firstNameRu: '', lastNameRu: '', middleNameRu: '', birthDate: '', gender: 'male', passportSeries: '', passportNumber: '', passportIssueDate: '', passportCode: '' }

const iStyle = { width: '100%', padding: '0.7rem 0.9rem', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', color: '#1e293b', background: '#f8fafc' }
const lStyle = { fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px', display: 'block', fontWeight: '600', letterSpacing: '0.03em' }
const rStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }

function PassengerForm({ initial, onSave, onCancel, saving, t }) {
  const initDoc = initial?.docType || 'international'
  const [docType, setDocType] = useState(initDoc)
  const [intl, setIntl] = useState(initDoc === 'international' ? { ...EMPTY_INTL, ...initial } : { ...EMPTY_INTL })
  const [ru, setRu] = useState(initDoc === 'russian' ? { ...EMPTY_RU, ...initial } : { ...EMPTY_RU })
  const setI = (k, v) => setIntl(f => ({ ...f, [k]: v }))
  const setR = (k, v) => setRu(f => ({ ...f, [k]: v }))
  const handleSave = () => docType === 'international' ? onSave({ ...intl, docType: 'international' }) : onSave({ ...ru, docType: 'russian' })

  return (
    <div>
      <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', borderRadius: '12px', padding: '4px', marginBottom: '16px' }}>
        {['international', 'russian'].map(type => (
          <button key={type} onClick={() => setDocType(type)} style={{ flex: 1, padding: '0.6rem', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '0.82rem', background: docType === type ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : '#f1f5f9', color: docType === type ? '#fff' : '#64748b', transition: 'all 0.2s' }}>
            {type === 'international' ? t.intlPassport : t.ruPassport}
          </button>
        ))}
      </div>

      {docType === 'international' && <>
        <div style={{ background: '#f0f9ff', borderRadius: '10px', padding: '10px 12px', marginBottom: '14px', fontSize: '0.78rem', color: '#0369a1' }}>{t.intlHint}</div>
        <div style={rStyle}>
          <div><label style={lStyle}>{t.firstName}</label><input style={iStyle} placeholder="IVAN" value={intl.firstName} onChange={e => setI('firstName', e.target.value.toUpperCase())} /></div>
          <div><label style={lStyle}>{t.lastName}</label><input style={iStyle} placeholder="IVANOV" value={intl.lastName} onChange={e => setI('lastName', e.target.value.toUpperCase())} /></div>
        </div>
        <div style={rStyle}>
          <div><label style={lStyle}>{t.birthDate}</label><input style={iStyle} type="date" value={intl.birthDate} onChange={e => setI('birthDate', e.target.value)} /></div>
          <div><label style={lStyle}>{t.gender}</label>
            <select style={{ ...iStyle, cursor: 'pointer' }} value={intl.gender} onChange={e => setI('gender', e.target.value)}>
              <option value="male">{t.male}</option><option value="female">{t.female}</option>
            </select>
          </div>
        </div>
        <div style={rStyle}>
          <div><label style={lStyle}>{t.citizenship}</label>
            <select style={{ ...iStyle, cursor: 'pointer' }} value={intl.citizenship} onChange={e => setI('citizenship', e.target.value)}>
              <option value="RU">🇷🇺 Россия</option>
              <option value="BY">🇧🇾 Беларусь</option>
              <option value="KZ">🇰🇿 Казахстан</option>
              <option value="KG">🇰🇬 Кыргызстан</option>
              <option value="TJ">🇹🇯 Таджикистан</option>
              <option value="UA">🇺🇦 Украина</option>
              <option value="UZ">🇺🇿 Узбекистан</option>
              <option value="AZ">🇦🇿 Азербайджан</option>
              <option value="AM">🇦🇲 Армения</option>
              <option value="TR">🇹🇷 Türkiye</option>
              <option value="DE">🇩🇪 Deutschland</option>
              <option value="OTHER">🌍 Other</option>
            </select>
          </div>
          <div><label style={lStyle}>{t.passportNumber}</label><input style={iStyle} placeholder="123456789" maxLength={9} value={intl.passportNumber} onChange={e => setI('passportNumber', e.target.value.replace(/\D/g, ''))} /></div>
        </div>
        <div style={{ marginBottom: '10px' }}><label style={lStyle}>{t.passportExpiry}</label><input style={{ ...iStyle, width: 'calc(50% - 5px)' }} type="date" value={intl.passportExpiry} onChange={e => setI('passportExpiry', e.target.value)} /></div>
      </>}

      {docType === 'russian' && <>
        <div style={{ background: '#f0fdf4', borderRadius: '10px', padding: '10px 12px', marginBottom: '14px', fontSize: '0.78rem', color: '#15803d' }}>{t.ruHint}</div>
        <div style={rStyle}>
          <div><label style={lStyle}>{t.lastNameRu}</label><input style={iStyle} placeholder="Иванов" value={ru.lastNameRu} onChange={e => setR('lastNameRu', e.target.value)} /></div>
          <div><label style={lStyle}>{t.firstNameRu}</label><input style={iStyle} placeholder="Иван" value={ru.firstNameRu} onChange={e => setR('firstNameRu', e.target.value)} /></div>
        </div>
        <div style={{ marginBottom: '10px' }}><label style={lStyle}>{t.middleName}</label><input style={iStyle} placeholder="Иванович" value={ru.middleNameRu} onChange={e => setR('middleNameRu', e.target.value)} /></div>
        <div style={rStyle}>
          <div><label style={lStyle}>{t.birthDate}</label><input style={iStyle} type="date" value={ru.birthDate} onChange={e => setR('birthDate', e.target.value)} /></div>
          <div><label style={lStyle}>{t.gender}</label>
            <select style={{ ...iStyle, cursor: 'pointer' }} value={ru.gender} onChange={e => setR('gender', e.target.value)}>
              <option value="male">{t.male}</option><option value="female">{t.female}</option>
            </select>
          </div>
        </div>
        <div style={rStyle}>
          <div><label style={lStyle}>{t.passportSeries}</label><input style={iStyle} placeholder="1234" maxLength={4} value={ru.passportSeries} onChange={e => setR('passportSeries', e.target.value.replace(/\D/g, ''))} /></div>
          <div><label style={lStyle}>{t.passportNumberRu}</label><input style={iStyle} placeholder="567890" maxLength={6} value={ru.passportNumber} onChange={e => setR('passportNumber', e.target.value.replace(/\D/g, ''))} /></div>
        </div>
        <div style={rStyle}>
          <div><label style={lStyle}>{t.passportIssueDate}</label><input style={iStyle} type="date" value={ru.passportIssueDate} onChange={e => setR('passportIssueDate', e.target.value)} /></div>
          <div><label style={lStyle}>{t.passportCode}</label><input style={iStyle} placeholder="123-456" maxLength={7} value={ru.passportCode} onChange={e => { let v = e.target.value.replace(/[^\d-]/g, ''); if (v.length === 3 && !v.includes('-')) v = v + '-'; setR('passportCode', v) }} /></div>
        </div>
      </>}

      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
        <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
          {saving ? t.saving : t.save}
        </button>
        <button onClick={onCancel} style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', border: '1.5px solid #e2e8f0', background: 'transparent', color: '#94a3b8', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer' }}>
          {t.cancel}
        </button>
      </div>
    </div>
  )
}

function PassengerCard({ p, index, onEdit, onDelete }) {
  const isIntl = p.docType === 'international'
  const name = isIntl ? `${p.firstName} ${p.lastName}` : `${p.lastNameRu} ${p.firstNameRu} ${p.middleNameRu || ''}`.trim()
  const docNum = isIntl ? p.passportNumber : `${p.passportSeries} ${p.passportNumber}`
  const initials = name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
  return (
    <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '14px 16px', border: '1px solid #e2e8f0', marginBottom: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: isIntl ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : 'linear-gradient(135deg,#059669,#10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '0.9rem', flexShrink: 0 }}>
          {initials || (p.gender === 'female' ? '👩' : '👨')}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name || '—'}</div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '3px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ background: isIntl ? '#eef2ff' : '#f0fdf4', color: isIntl ? '#4f46e5' : '#15803d', borderRadius: '99px', padding: '1px 8px', fontWeight: '600' }}>{isIntl ? '🌍' : '🇷🇺'}</span>
            {docNum && <span>№ {docNum}</span>}
            {p.birthDate && <span>{p.birthDate}</span>}
            {isIntl && p.passportExpiry && <span>→ {p.passportExpiry}</span>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          <button onClick={() => onEdit(index)} style={{ padding: '6px 10px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: '#fff', color: '#4f46e5', fontSize: '0.8rem', cursor: 'pointer' }}>✏️</button>
          <button onClick={() => onDelete(index)} style={{ padding: '6px 10px', borderRadius: '8px', border: '1.5px solid #fee2e2', background: '#fff', color: '#ef4444', fontSize: '0.8rem', cursor: 'pointer' }}>🗑️</button>
        </div>
      </div>
    </div>
  )
}

function loadWidget(containerId, scriptId, src) {
  const existing = document.getElementById(scriptId)
  if (existing) existing.remove()
  const container = document.getElementById(containerId)
  if (!container) return
  container.innerHTML = ''
  const script = document.createElement('script')
  script.id = scriptId; script.async = true; script.charset = 'utf-8'; script.src = src
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
  const [currency, setCurrency] = useState('rub')
  const [rates, setRates] = useState({})
  const [profileTab, setProfileTab] = useState('main')
  const [passengers, setPassengers] = useState([])
  const [editingIndex, setEditingIndex] = useState(null)
  const [savingPassenger, setSavingPassenger] = useState(false)

  const t = LANG[lang] || LANG.ru

  useEffect(() => { fetchRates().then(setRates) }, [])
  useEffect(() => { const id = setTimeout(() => setVisible(true), 50); return () => clearTimeout(id) }, [])
  useEffect(() => { return onAuthStateChanged(firebaseAuth, (u) => { setUser(u); loadUserData(u) }) }, [])

  useEffect(() => {
    switch(transport) {
      case 'flights': loadWidget('aviasales-container', 'tp-widget-script', `https://tpwidg.com/content?currency=${lang==='ru'?'rub':'usd'}&trs=533294&shmarker=732972&show_hotels=false&powered_by=true&locale=${lang==='ru'?'ru':'en'}&searchUrl=www.aviasales.com%2Fsearch&primary_override=%234f46e5&color_button=%234f46e5&color_icons=%237c3aed&dark=%23ffffff&light=%23f8fafc&secondary=%2364748b&special=%234f46e5&color_focused=%234f46e5&border_radius=14&plain=false&promo_id=7879&campaign_id=100`); break
      case 'trains': loadWidget('trains-container', 'tutu-widget-script', 'https://tpwidg.com/content?trs=533294&shmarker=732972&tab1=1&tabDef=1&powered_by=true&color_scheme=basic_white&hide_logo=true&campaign_id=45&promo_id=1809'); break
      case 'tours': loadWidget('tours-container', 'travelata-search-script', 'https://tpwidg.com/content?trs=533294&shmarker=732972&locale=ru&powered_by=true&border_radius=5&plain=true&color_background=%23ffffff&color_button=%234f46e5&color_button_text=%23ffffff&promo_id=4694&campaign_id=43'); break
      case 'hotels': loadWidget('hotels-container', 'yandex-hotels-script', 'https://tpwidg.com/content?trs=533294&shmarker=732972&sorting=popular&theme=light&powered_by=true&campaign_id=193&promo_id=8582'); break
      case 'insurance': loadWidget('insurance-container', 'cherehapa-script', 'https://tpwidg.com/content?trs=533294&shmarker=732972&countryGroups=schengen&medicine=30000&powered_by=true&promo_id=2458&campaign_id=24'); break
    }
  }, [transport, lang])

  useEffect(() => {
    const existing = document.getElementById('travelata-tizer-script'); if (existing) return
    const container = document.getElementById('travelata-tizer-container'); if (!container) return
    const contId = 'tat' + Math.random().toString().replace('.', '')
    const div = document.createElement('div'); div.id = contId; container.appendChild(div)
    window._tat = window._tat || []
    window._tat.push({ id: contId, affiliateurl: 'https://travelata.tpk.lu/N5aNnOKQ', countries: [0], cellWidth: 160, columns: 5, rows: 3, WLURL: '' })
    const script = document.createElement('script'); script.id = 'travelata-tizer-script'; script.type = 'text/javascript'; script.charset = 'UTF-8'; script.async = true; script.src = '//traf.travelata.ru/tat.js'; container.appendChild(script)
  }, [])

  useEffect(() => {
    const existing = document.getElementById('leveltravel-special-script'); if (existing) return
    const container = document.getElementById('leveltravel-special-container'); if (!container) return
    container.innerHTML = ''
    const script = document.createElement('script'); script.id = 'leveltravel-special-script'; script.async = true; script.charset = 'utf-8'; script.src = 'https://tpwidg.com/content?currency=USD&trs=533294&shmarker=732972&origin_iata=MOW&destination_iata=AZ&locale=ru&powered_by=true&min_lines=5&responsive=true&promo_id=4098&campaign_id=26'; container.appendChild(script)
  }, [])

  useEffect(() => {
    const existing = document.getElementById('leveltravel-directions-script'); if (existing) return
    const container = document.getElementById('leveltravel-directions-container'); if (!container) return
    container.innerHTML = ''
    const script = document.createElement('script'); script.id = 'leveltravel-directions-script'; script.async = true; script.charset = 'utf-8'; script.src = 'https://tpwidg.com/content?trs=533294&shmarker=732972&departure=Moscow&destination=29386&start_date=WEEK&nights=4..6&adults=2&kids=0&redirect=_blank&powered_by=true&campaign_id=26&promo_id=8286'; container.appendChild(script)
  }, [])

  useEffect(() => {
    const existing = document.getElementById('tripster-script'); if (existing) return
    const container = document.getElementById('tripster-container'); if (!container) return
    container.innerHTML = ''
    const script = document.createElement('script'); script.id = 'tripster-script'; script.async = true; script.charset = 'utf-8'; script.src = 'https://tpwidg.com/content?trs=533294&shmarker=732972&type=experience&num=3&widget_template=horizontal&logo=true&notitle=false&nolistbutton=false&price=false&widgetbar=false&widgetbar_position=top&powered_by=true&promo_id=4217&campaign_id=11'; container.appendChild(script)
  }, [])

  const handleAuth = async () => {
    if (!user) {
      try {
        const result = await signInWithPopup(firebaseAuth, new GoogleAuthProvider())
        const u = result.user
        const ref = doc(db, 'users', u.uid)
        const snap = await getDoc(ref)
        if (!snap.exists()) await setDoc(ref, { name: u.displayName, email: u.email, refCode: generateRefCode(u.uid), points: 0, refs: 0, passengers: [], createdAt: new Date().toISOString() })
      } catch(e) { console.error(e) }
    } else {
      setShowProfile(false)
      try { await signOut(firebaseAuth) } catch(e) { console.error(e) }
    }
  }

  const loadUserData = async (u) => {
    if (!u) { setUserData(null); setPassengers([]); return }
    const snap = await getDoc(doc(db, 'users', u.uid))
    if (snap.exists()) { const data = snap.data(); setUserData(data); setPassengers(data.passengers || []) }
  }

  const savePassengers = async (newList) => {
    if (!user) return
    setSavingPassenger(true)
    try { await updateDoc(doc(db, 'users', user.uid), { passengers: newList }); setPassengers(newList) } catch(e) { console.error(e) }
    setSavingPassenger(false)
  }

  const handleSavePassenger = async (form) => {
    const updated = [...passengers]
    if (editingIndex === -1) updated.push(form)
    else updated[editingIndex] = form
    await savePassengers(updated)
    setEditingIndex(null)
  }

  const refLink = userData ? `https://rasskye.com?ref=${userData.refCode}` : ''
  const copyRef = () => { navigator.clipboard.writeText(refLink); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  const tabStyle = (active) => ({
    flex: 1, padding: '0.6rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
    fontWeight: '700', fontSize: '0.85rem', transition: 'all 0.2s',
    background: active ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : 'transparent',
    color: active ? '#fff' : '#94a3b8',
  })

  const langOptions = LANGUAGES.map(l => ({ value: l.code, label: l.label, flag: l.flag, name: l.name }))
  const currOptions = Object.entries(CURRENCIES).map(([k, v]) => ({ value: k, label: v.name, flag: v.flag }))

  const destName = (d) => d.name[lang] || d.name.en || d.name.ru

  return (
    <div className={`app ${visible ? 'app--visible' : ''}`}>
      <header className="header">
        <div className="header-inner">
          <div className="logo-text">Rasskye <span>Travel</span></div>
          <div className="header-right">
            <button className="auth-btn" onClick={user ? () => { setShowProfile(true); setProfileTab('main'); setEditingIndex(null) } : handleAuth}>
              {user ? (user.displayName?.[0]?.toUpperCase() || '?') : t.login}
            </button>
            <Dropdown value={currency} options={currOptions} onChange={setCurrency} />
            <Dropdown value={lang} options={langOptions} onChange={setLang} />
          </div>
        </div>
      </header>

      <div className="hero">
        <div className="hero-content"><h1>{t.title}</h1><p>{t.subtitle}</p></div>
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
              <h3 style={{fontSize:'1.3rem',fontWeight:'700',color:'#1e293b',marginBottom:'0.5rem'}}>{t.trainsTitle}</h3>
              <p style={{color:'#64748b',marginBottom:'1.5rem'}}>{t.trainsSubtitle}</p>
              <a href="https://tutu.tpk.lu/e9tdxDVM" target="_blank" rel="noreferrer">
                <button className="search-btn">{t.trainsBtn}</button>
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
          {t.partners.map((p, i) => <div key={i} className="partner-badge">{p}</div>)}
        </div>

        <h2 className="section-title" style={{marginTop:'2rem'}}>{t.destinations}</h2>
        <div className="destinations-grid" style={{marginBottom:'2.5rem'}}>
          {DESTINATIONS.map((d, i) => (
            <a key={i} href={d.url} target="_blank" rel="noreferrer" className="dest-card">
              <img src={d.img} alt={destName(d)} className="dest-img" />
              <div className="dest-info">
                <h3>{destName(d)}</h3>
                <span>{formatPrice(convertPrice(d.priceRub, currency, rates), currency)}</span>
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
          <h2 className="section-title" style={{marginBottom:'1.5rem'}}>{t.directions}</h2>
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
                <span className="service-name">{s.name[lang] || s.name.ru}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <footer className="site-footer">
        <button onClick={() => setPage('home')} className={page==='home'?'active':''}>{t.footerHome}</button>
        <button onClick={() => setPage('about')} className={page==='about'?'active':''}>{t.footerAbout}</button>
        <a href="/legal" target="_blank" style={{color:'#94a3b8',fontSize:'0.8rem',textDecoration:'none'}}>{t.legal}</a>
        <button onClick={() => setPage('contacts')} className={page==='contacts'?'active':''}>{t.footerContacts}</button>
      </footer>

      {showProfile && userData && createPortal(
        <div className="page-overlay" onClick={() => { setShowProfile(false); setEditingIndex(null) }}>
          <div className="page-modal" onClick={e => e.stopPropagation()}>
            <button className="page-close" onClick={() => { setShowProfile(false); setEditingIndex(null) }}>✕</button>
            <div style={{display:'flex',gap:'6px',background:'#f1f5f9',borderRadius:'12px',padding:'4px',marginBottom:'20px'}}>
              <button style={tabStyle(profileTab==='main')} onClick={() => { setProfileTab('main'); setEditingIndex(null) }}>{t.profile}</button>
              <button style={tabStyle(profileTab==='passengers')} onClick={() => { setProfileTab('passengers'); setEditingIndex(null) }}>
                {t.passengers} {passengers.length > 0 && <span style={{background:'rgba(255,255,255,0.3)',borderRadius:'99px',padding:'1px 6px',fontSize:'0.75rem',marginLeft:'4px'}}>{passengers.length}</span>}
              </button>
            </div>

            {profileTab === 'main' && <>
              <h2 style={{marginBottom:'4px'}}>{t.cabinet}</h2>
              <p style={{marginBottom:'8px',color:'#1e293b'}}><strong>{userData.name}</strong></p>
              <p style={{marginBottom:'20px',color:'#94a3b8',fontSize:'13px'}}>{userData.email}</p>
              <div style={{display:'flex',gap:'12px',marginBottom:'20px'}}>
                <div style={{flex:1,background:'#eef2ff',borderRadius:'14px',padding:'16px',textAlign:'center',border:'1px solid #c7d2fe'}}>
                  <div style={{fontSize:'1.8rem',fontWeight:'800',color:'#4f46e5'}}>{userData.points}</div>
                  <div style={{fontSize:'0.75rem',color:'#94a3b8',marginTop:'4px'}}>{t.points}</div>
                </div>
                <div style={{flex:1,background:'#eef2ff',borderRadius:'14px',padding:'16px',textAlign:'center',border:'1px solid #c7d2fe'}}>
                  <div style={{fontSize:'1.8rem',fontWeight:'800',color:'#4f46e5'}}>{userData.refs}</div>
                  <div style={{fontSize:'0.75rem',color:'#94a3b8',marginTop:'4px'}}>{t.friends}</div>
                </div>
              </div>
              <div style={{background:'#f8fafc',borderRadius:'14px',padding:'16px',marginBottom:'12px',border:'1px solid #e2e8f0'}}>
                <div style={{fontSize:'0.75rem',color:'#94a3b8',marginBottom:'8px'}}>{t.progressTitle}</div>
                <div style={{background:'#e2e8f0',borderRadius:'99px',height:'8px',marginBottom:'8px'}}>
                  <div style={{background:'linear-gradient(90deg,#4f46e5,#7c3aed)',borderRadius:'99px',height:'8px',width:`${Math.min((userData.points/1000)*100,100)}%`,transition:'width 0.3s'}}></div>
                </div>
                <div style={{fontSize:'0.75rem',color:'#64748b',marginBottom:'16px'}}>
                  {userData.points>=1000 ? t.discountAvail : `${userData.points} / 1000 ${t.points} — ${1000-userData.points} ${t.toDiscount}`}
                </div>
                <div style={{fontSize:'0.75rem',color:'#94a3b8',marginBottom:'8px'}}>{t.refCode}</div>
                <div style={{fontSize:'1.4rem',fontWeight:'800',letterSpacing:'3px',color:'#4f46e5'}}>{userData.refCode}</div>
              </div>
              <button onClick={copyRef} style={{width:'100%',padding:'0.9rem',borderRadius:'14px',border:'none',background:'linear-gradient(135deg,#4f46e5,#7c3aed)',color:'#fff',fontSize:'0.95rem',fontWeight:'700',cursor:'pointer',marginBottom:'10px'}}>
                {copied ? t.copied : t.inviteFriend}
              </button>
              <button onClick={handleAuth} style={{width:'100%',padding:'0.7rem',borderRadius:'14px',border:'1.5px solid #e2e8f0',background:'transparent',color:'#94a3b8',fontSize:'0.85rem',cursor:'pointer'}}>
                {t.logout}
              </button>
            </>}

            {profileTab === 'passengers' && <>
              <h2 style={{marginBottom:'4px'}}>{t.myPassengers}</h2>
              <p style={{marginBottom:'16px',color:'#94a3b8',fontSize:'13px'}}>{t.passengersSubtitle}</p>
              {editingIndex === null && <>
                {passengers.length === 0 && (
                  <div style={{textAlign:'center',padding:'2rem 0',color:'#94a3b8'}}>
                    <div style={{fontSize:'3rem',marginBottom:'8px'}}>🧳</div>
                    <div style={{fontSize:'0.9rem'}}>{t.noPassengers}</div>
                  </div>
                )}
                {passengers.map((p, i) => <PassengerCard key={i} p={p} index={i} onEdit={setEditingIndex} onDelete={async (idx) => await savePassengers(passengers.filter((_,ii) => ii !== idx))} />)}
                {passengers.length < 9 && (
                  <button onClick={() => setEditingIndex(-1)} style={{width:'100%',padding:'0.85rem',borderRadius:'14px',border:'2px dashed #c7d2fe',background:'#f5f3ff',color:'#4f46e5',fontWeight:'700',fontSize:'0.9rem',cursor:'pointer',marginTop:'4px'}}>
                    {t.addPassenger}
                  </button>
                )}
              </>}
              {editingIndex !== null && <>
                <div style={{fontSize:'0.85rem',fontWeight:'700',color:'#4f46e5',marginBottom:'14px'}}>
                  {editingIndex === -1 ? t.newPassenger : `${t.editPassenger} ${editingIndex + 1}`}
                </div>
                <PassengerForm initial={editingIndex === -1 ? null : passengers[editingIndex]} onSave={handleSavePassenger} onCancel={() => setEditingIndex(null)} saving={savingPassenger} t={t} />
              </>}
            </>}
          </div>
        </div>,
        document.body
      )}

      {page === 'about' && createPortal(
        <div className="page-overlay" onClick={() => setPage('home')}>
          <div className="page-modal" onClick={e => e.stopPropagation()}>
            <button className="page-close" onClick={() => setPage('home')}>✕</button>
            <h2>{t.about}</h2>
            <p>{t.aboutText1}</p><p>{t.aboutText2}</p><p>{t.aboutText3}</p>
          </div>
        </div>,
        document.body
      )}

      {page === 'contacts' && createPortal(
        <div className="page-overlay" onClick={() => setPage('home')}>
          <div className="page-modal" onClick={e => e.stopPropagation()}>
            <button className="page-close" onClick={() => setPage('home')}>✕</button>
            <h2>{t.contacts}</h2>
            <p style={{marginBottom:'12px',color:'#94a3b8',fontSize:'13px'}}>{t.contactsSubtitle}</p>
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              <a href="mailto:info@rasskye.com" className="contact-card" style={{textDecoration:'none'}}>
                <div className="contact-card__icon">📧</div>
                <div className="contact-card__text"><h3>info@rasskye.com</h3><p>{t.writeUs}</p></div>
                <div className="contact-card__btn">{t.write}</div>
              </a>
              <a href="https://t.me/rasskye_travel" target="_blank" rel="noreferrer" className="contact-card" style={{textDecoration:'none'}}>
                <div className="contact-card__icon">✈️</div>
                <div className="contact-card__text"><h3>Telegram</h3><p>@rasskye_travel</p></div>
                <div className="contact-card__btn">{t.open}</div>
              </a>
              <a href="https://instagram.com/rasskye_travel" target="_blank" rel="noreferrer" className="contact-card contact-card--insta" style={{textDecoration:'none'}}>
                <div className="contact-card__icon">📸</div>
                <div className="contact-card__text"><h3>Instagram</h3><p>@rasskye_travel</p></div>
                <div className="contact-card__btn contact-card__btn--insta">{t.open}</div>
              </a>
              <a href="https://wa.me/79366666667" target="_blank" rel="noreferrer" className="contact-card contact-card--wa" style={{textDecoration:'none'}}>
                <div className="contact-card__icon">💬</div>
                <div className="contact-card__text"><h3>WhatsApp</h3><p>+7 936 666-66-67</p></div>
                <div className="contact-card__btn contact-card__btn--wa">{t.write}</div>
              </a>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

export default App