import React, { useState, useEffect } from 'react';
import './App.css';

const SERVICES = [
  { id: 'hair', name: 'Soch turmaklash', duration: '1 soat', price: "150 000 so'm" },
  { id: 'makeup', name: 'Pardoz (Makeup)', duration: '1.5 soat', price: "250 000 so'm" },
  { id: 'manicure', name: 'Manikur & Pedikur', duration: '1 soat', price: "120 000 so'm" },
  { id: 'coloring', name: 'Soch boyash', duration: '2 soat', price: "300 000 so'm" },
];

const TIME_SLOTS = [
  '09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00', '19:30'
];

export default function App() {
  const [selectedService, setSelectedService] = useState('hair');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({ name: '', phone: '' });
  
  // Faqat shu brauzerdagi foydalanuvchining shaxsiy bronlari (localStorage orqali maxfiy saqlanadi)
  const [myBookings, setMyBookings] = useState(() => {
    const saved = localStorage.getItem('my_beauty_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [notification, setNotification] = useState('');

  // Bronlar o'zgarganda brauzer xotirasiga saqlash
  useEffect(() => {
    localStorage.setItem('my_beauty_bookings', JSON.stringify(myBookings));
  }, [myBookings]);

  // Vaqt band qilinganligini tekshirish
  const isSlotBooked = (date, time) => {
    return myBookings.some(slot => slot.date === date && slot.time === time);
  };

  const handleBooking = (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !formData.name || !formData.phone) {
      alert("Iltimos, barcha maydonlarni to'ldiring!");
      return;
    }

    const currentServiceObj = SERVICES.find(s => s.id === selectedService);

    const newBooking = {
      id: Date.now(),
      serviceName: currentServiceObj.name,
      date: selectedDate,
      time: selectedTime,
      ...formData
    };

    setMyBookings([...myBookings, newBooking]);
    setNotification(`Rahmat, ${formData.name}! Sizning broningiz muvaffaqiyatli saqlandi.`);
    
    // Formani tozalash
    setSelectedTime('');
    setFormData({ name: '', phone: '' });

    setTimeout(() => setNotification(''), 5000);
  };

  // Faqat o'zining bronini bekor qilish
  const handleCancelBooking = (id) => {
    setMyBookings(myBookings.filter(slot => slot.id !== id));
    setNotification("Broningiz muvaffaqiyatli bekor qilindi.");
    setTimeout(() => setNotification(''), 4000);
  };

  return (
    <div className="app-container">
      {/* Header / Hero Section */}
      <header className="hero">
        <div className="hero-overlay">
          <nav className="navbar">
            <div className="logo">✨ Glamour Beauty</div>
            <div className="contact-quick">
              <span>📞 +998 (90) 123-45-67</span>
            </div>
          </nav>
          <div className="hero-content">
            <h1>Go'zalligingizni Bizga Ishoning</h1>
            <p>Eng zamonaviy soch turmaklash va go'zallik xizmatlari uchun onlayn navbat oling</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {notification && <div className="notification-toast">{notification}</div>}

        <div className="booking-grid">
          {/* Xizmatlar va Joy bron qilish bo'limi */}
          <section className="card booking-section">
            <h2>1. Xizmatni tanlang</h2>
            <div className="services-list">
              {SERVICES.map((service) => (
                <div
                  key={service.id}
                  className={`service-card ${selectedService === service.id ? 'active' : ''}`}
                  onClick={() => setSelectedService(service.id)}
                >
                  <div>
                    <h3>{service.name}</h3>
                    <p className="duration">⏳ {service.duration}</p>
                  </div>
                  <span className="price">{service.price}</span>
                </div>
              ))}
            </div>

            <h2>2. Sana va bo'sh vaqtni tanlang</h2>
            <div className="date-picker">
              <label>Sana:</label>
              <input
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTime('');
                }}
              />
            </div>

            {selectedDate ? (
              <div className="time-slots">
                <p>Mavjud bo'sh vaqtlar:</p>
                <div className="slots-grid">
                  {TIME_SLOTS.map((time) => {
                    const booked = isSlotBooked(selectedDate, time);
                    return (
                      <button
                        key={time}
                        disabled={booked}
                        className={`slot-btn ${selectedTime === time ? 'selected' : ''} ${booked ? 'booked' : ''}`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time} {booked ? '(Band)' : ''}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="info-text">Bo'sh vaqtlarni ko'rish uchun avval sanani tanlang.</p>
            )}

            <h2>3. Ma'lumotlaringiz</h2>
            <form onSubmit={handleBooking} className="booking-form">
              <input
                type="text"
                placeholder="Ismingiz"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <input
                type="tel"
                placeholder="Telefon raqamingiz (+998...)"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
              <button type="submit" className="submit-btn" disabled={!selectedTime}>
                Bron Qilishni Tasdiqlash
              </button>
            </form>
          </section>

          {/* Faqat foydalanuvchining o'ziga ko'rinadigan shaxsiy kabinet / bronlar bo'limi */}
          <aside className="card info-section">
            <h2>Mening Shaxsiy Bronlarim 🔒</h2>
            {myBookings.length === 0 ? (
              <p className="info-text">Sizda hozircha faol bronlar yo'q. (Bu yerda faqat sizning shaxsiy vaqtlaringiz ko'rinadi)</p>
            ) : (
              <div className="my-bookings-list">
                {myBookings.map((item) => (
                  <div key={item.id} className="booking-ticket">
                    <div className="ticket-header">
                      <strong>{item.serviceName}</strong>
                      <button 
                        className="cancel-btn" 
                        onClick={() => handleCancelBooking(item.id)}
                        title="Bekor qilish"
                      >
                        ✕
                      </button>
                    </div>
                    <p>👤 {item.name} ({item.phone})</p>
                    <p>📅 <strong>{item.date}</strong> | ⏰ <strong>{item.time}</strong></p>
                  </div>
                ))}
              </div>
            )}

            <h2>Biz haqimizda</h2>
            <div className="info-item">
              <h3>📍 Manzil</h3>
              <p>Toshkent shahri, Yunusobod tumani, Amir Temur ko'chasi 45-uy</p>
              <p className="sub-text">(Mo'ljal: Minor metro bekati)</p>
            </div>

            <div className="info-item">
              <h3>📞 Telefon</h3>
              <p>+998 (90) 123-45-67</p>
              <p>+998 (71) 200-00-00</p>
            </div>

            <div className="info-item">
              <h3>⏰ Ish vaqti</h3>
              <p>Dushanba - Yakshanba</p>
              <p>09:00 - 21:00 (Haftasiz dam olishsiz)</p>
            </div>

            <div className="map-placeholder">
              <p>🗺️ Xarita (Google Map / Yandex Map)</p>
            </div>
          </aside>
        </div>
      </main>

      <footer className="footer">
        <p>© 2026 Glamour Beauty Salon. Barcha huquqlar himoyalangan.</p>
      </footer>
    </div>
  );
}