import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import '../styles/contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page">
      {/* Title Section */}
      <div className="contact-title-section">
        <h1 className="contact-page-title">Get in Touch</h1>
        <p className="contact-page-subtitle">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
      </div>

      {/* Main Content */}
      <div className="contact-container">
        <div className="contact-content">
          {/* Contact Info */}
          <div className="contact-info-section">
            <div className="contact-info-item">
              <div className="contact-info-icon">
                <Mail />
              </div>
              <div className="contact-info-text">
                <h3>Email Address</h3>
                <p><a href="mailto:support@wisdomwave.com" style={{ color: 'inherit' }}>support@wisdomwave.com</a></p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">
                <Phone />
              </div>
              <div className="contact-info-text">
                <h3>Phone Number</h3>
                <p><a href="tel:+12345678901" style={{ color: 'inherit' }}>+1 (234) 567-8901</a></p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">
                <MapPin />
              </div>
              <div className="contact-info-text">
                <h3>Office Location</h3>
                <p>123 Education Street<br />Learning City, LC 12345<br />United States</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-section">
            <h2>Send us a Message</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form-group-row">
                <div className="contact-form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div className="contact-form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="contact-form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this about?"
                  required
                />
              </div>

              <div className="contact-form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  required
                ></textarea>
              </div>

              <button type="submit" className="contact-btn">
                <Send />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="contact-footer">
        <p>&copy; 2026 Wisdom Wave. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Contact;
