import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { useState } from 'react';

// Simple email format check (avoids relying on browser-native type="email" validation)
const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

export const Contact = () => {
  // Controlled field state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Per-field inline errors (replaces browser-native `required` tooltip)
  const [fieldErrors, setFieldErrors] = useState({ name: '', email: '', message: '' });

  // Overall submission success state
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess('');

    // --- Custom JS validation (replaces all `required` HTML attributes) ---
    const errors = { name: '', email: '', message: '' };
    let hasError = false;

    if (!name.trim()) {
      errors.name = 'Please enter your name.';
      hasError = true;
    }
    if (!email.trim()) {
      errors.email = 'Please enter your email address.';
      hasError = true;
    } else if (!isValidEmail(email)) {
      errors.email = 'Please enter a valid email address.';
      hasError = true;
    }
    if (!message.trim()) {
      errors.message = 'Please write a message before submitting.';
      hasError = true;
    }

    setFieldErrors(errors);
    if (hasError) return;
    // -----------------------------------------------------------------------

    // Preserve original success behavior
    setSuccess('Thank you! Your message has been received.');
    // Reset form on successful submission
    setName('');
    setEmail('');
    setMessage('');
    setFieldErrors({ name: '', email: '', message: '' });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 pt-28 md:pt-32 text-left">
      <div className="mb-10 space-y-2">
        <span className="text-[10px] font-sans font-bold text-stayora-black/45 uppercase tracking-widest block">
          • Reach Out
        </span>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-stayora-black leading-tight tracking-tight select-none">
          Contact Us
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Contact Info */}
        <div className="space-y-6">
          <p className="text-base text-stayora-black/70 leading-relaxed font-sans">
            Have a question about a listing, a booking, or hosting on Stayora? Get in touch with our support team.
          </p>
          
          <div className="space-y-4 pt-6 border-t border-[#E5E5E5]">
            <div>
              <span className="block text-[10px] font-bold text-stayora-black/40 uppercase tracking-wider mb-1">Email Support</span>
              <a href="mailto:stayorasupport@gmail.com" className="text-base font-semibold text-stayora-black hover:text-stayora-red transition-colors">
                stayorasupport@gmail.com
              </a>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-stayora-black/40 uppercase tracking-wider mb-1">Phone Support</span>
              <span className="text-base font-semibold text-stayora-black">
                +1 (555) 019-2834
              </span>
            </div>
          </div>
        </div>

        {/* Contact Form — noValidate suppresses any remaining browser-native validation UI */}
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 border border-[#E5E5E5] space-y-4 rounded-none" noValidate>
          <h2 className="font-editorial text-xl font-medium text-stayora-black mb-4">Send a message</h2>
          
          {success && (
            <div className="p-3 bg-green-50 text-green-800 border border-green-200 rounded-none text-sm font-semibold">
              {success}
            </div>
          )}

          {/* Name field — fully controlled, no `required` attribute */}
          <div>
            <Input
              id="name"
              label="Name"
              placeholder="Your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: '' }));
              }}
              autoComplete="name"
            />
            {fieldErrors.name && (
              <p className="text-stayora-red text-xs font-semibold mt-1.5">{fieldErrors.name}</p>
            )}
          </div>

          {/* Email field — fully controlled, no `required` attribute */}
          <div>
            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="Your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
              }}
              autoComplete="email"
            />
            {fieldErrors.email && (
              <p className="text-stayora-red text-xs font-semibold mt-1.5">{fieldErrors.email}</p>
            )}
          </div>
          
          {/* Message field — fully controlled, no `required` attribute */}
          <div>
            <Textarea
              id="msg"
              label="Message"
              rows={4}
              placeholder="How can we help?"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (fieldErrors.message) setFieldErrors((prev) => ({ ...prev, message: '' }));
              }}
            />
            {fieldErrors.message && (
              <p className="text-stayora-red text-xs font-semibold mt-1.5">{fieldErrors.message}</p>
            )}
          </div>

          <Button type="submit" variant="primary" className="w-full rounded-none">Send Message</Button>
        </form>
      </div>
    </div>
  );
};
