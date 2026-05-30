import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button, Card } from '@/components';
import { ContactInfoItem } from '@/components/molecules';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const inputClass = "w-full px-4 py-2.5 border border-border rounded-xl text-sm text-gray-900 bg-white transition-all duration-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-gray-400";

  return (
    <div className="bg-gray-50/50 min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 flex-1 w-full">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 lg:mb-14">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
            Get in <span className="text-primary">Touch</span>
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-primary to-primary-600 mx-auto rounded-full mb-5" />
          <p className="text-gray-500 text-base">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <ContactInfoItem
              icon={Mail}
              title="Email Address"
              content={<a href="mailto:support@wisdomwave.com" className="text-gray-600 hover:text-primary transition-colors text-sm">support@wisdomwave.com</a>}
            />
            <ContactInfoItem
              icon={Phone}
              title="Phone Number"
              content={<a href="tel:+12345678901" className="text-gray-600 hover:text-primary transition-colors text-sm">+1 (234) 567-8901</a>}
            />
            <ContactInfoItem
              icon={MapPin}
              title="Office Location"
              content={<p className="text-gray-500 text-sm leading-relaxed m-0">123 Education Street<br />Learning City, LC 12345<br />United States</p>}
            />
          </div>

          {/* Form */}
          <Card className="lg:col-span-3 bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" className={inputClass} required />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" className={inputClass} required />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="subject" className="text-sm font-medium text-gray-700">Subject</label>
                <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="What is this about?" className={inputClass} required />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-sm font-medium text-gray-700">Message</label>
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Write your message here..." className={`${inputClass} resize-y min-h-[120px]`} required />
              </div>

              <Button type="submit" className="mt-2 bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-md shadow-[rgba(255,165,0,0.15)] hover:shadow-lg hover:shadow-[rgba(255,165,0,0.25)] transition-all h-auto active:scale-[0.97] inline-flex items-center gap-2 self-start">
                <Send size={16} />
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </div>

      <footer className="bg-gray-950 text-center py-5 text-gray-600 text-xs mt-auto">
        <p>&copy; 2026 Wisdom Wave. All rights reserved.</p>
      </footer>
    </div>
  );
}
