import React, { useState } from 'react';
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
  const [bookedSlots, setBookedSlots] = useState([]);
  const [notification, setNotification] = useState('');

  const isSlotBooked = (date, time) => {
    return bookedSlots.some(slot => slot.date === date && slot.time === time);
  };

  const handleBooking = (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !formData.name || !formData.phone) {
      alert("Iltimos, barcha maydonlarni to'ldiring!");
      return;
    }

    const newBooking = {
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      ...formData
    };

    setBookedSlots([...bookedSlots, { date: selectedDate, time: selectedTime }]);
    setNotification(`Rahmat, ${formData.name}! Bron muvaffaqiyatli tasdiqlandi.`);
    
    // Formani tozalash
    setSelectedTime('');
    setFormData({ name: '', phone: '' });

    setTimeout(() => setNotification(''), 5000);
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

          {/* Manzil va Aloqa bo'limi */}
          <aside className="card info-section">
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