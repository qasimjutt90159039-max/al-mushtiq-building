import React from 'react';
import { MessageSquare } from 'lucide-react';

export const WhatsAppFloatingButton: React.FC = () => {
  const whatsappNum = '923013242408';

  const handleClick = () => {
    const text = `Hello Al Mushtaq Building Material Store,\n\nI am visiting your website and have an inquiry regarding building materials and price quotations in Rahim Yar Khan.\n\nPlease assist me.\n\nThank you.`;
    window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Direct WhatsApp Inquiry"
      className="fixed bottom-6 right-6 z-40 bg-[#16803C] hover:bg-[#126b32] text-white p-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group focus:outline-none focus:ring-4 focus:ring-emerald-300"
    >
      <div className="relative">
        <MessageSquare className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#F4B942] rounded-full animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#F4B942] rounded-full"></span>
      </div>
      <span className="text-xs font-bold hidden md:inline-block pr-1 group-hover:inline-block">
        WhatsApp Us
      </span>
    </button>
  );
};
