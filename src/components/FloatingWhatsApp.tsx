import React from 'react';
import { motion } from 'framer-motion';

interface FloatingWhatsAppProps {
  phone?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ phone = '8082812805' }) => {
  const cleanPhone = phone.replace(/\D/g, '');
  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const whatsappUrl = `https://wa.me/${formattedPhone}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.08 }}
      className="fixed bottom-6 right-6 z-[999] flex items-center gap-3 group"
    >
      {/* Tooltip Label */}
      <span className="px-3 py-1.5 rounded-xl bg-[#121212]/95 border border-white/10 text-[11px] font-semibold uppercase tracking-wider text-[#D7E2EA] opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none shadow-xl backdrop-blur-md">
        Chat on WhatsApp
      </span>

      {/* Floating Button Container with floating animation */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: 'easeInOut',
        }}
        className="w-14 h-14 rounded-full bg-[#25D366] shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] flex items-center justify-center transition-shadow duration-300 relative"
      >
        {/* Pulsing ring outline */}
        <div className="absolute inset-0 rounded-full border-2 border-[#25D366]/40 animate-ping" style={{ animationDuration: '2s' }} />

        {/* WhatsApp Brand SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white fill-white"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      </motion.div>
    </motion.a>
  );
};
