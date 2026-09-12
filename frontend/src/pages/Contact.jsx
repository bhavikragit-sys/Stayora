import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { useState } from 'react';

export const Contact = () => {
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess('Thank you! Your message has been received.');
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

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 border border-[#E5E5E5] space-y-4 rounded-none">
          <h2 className="font-editorial text-xl font-medium text-stayora-black mb-4">Send a message</h2>
          
          {success && (
            <div className="p-3 bg-green-50 text-green-800 border border-green-150 rounded-none text-sm font-semibold">
              {success}
            </div>
          )}

          <Input id="name" label="Name" placeholder="Your name" required />
          <Input id="email" type="email" label="Email" placeholder="Your email" required />
          
          <Textarea 
            id="msg"
            label="Message"
            required
            rows={4}
            placeholder="How can we help?"
          />

          <Button type="submit" variant="primary" className="w-full rounded-none">Send Message</Button>
        </form>
      </div>
    </div>
  );
};
