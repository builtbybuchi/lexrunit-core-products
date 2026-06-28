import React from 'react';

interface WhatsAppMockupProps {
  className?: string;
  rotate?: boolean;
}

export function WhatsAppMockup({ className = '', rotate = false }: WhatsAppMockupProps) {
  return (
    <div className={`relative w-full max-w-md ${className}`}>
      <div className={`bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-[8px] border-gray-900 relative z-10 ${rotate ? 'transform rotate-2 hover:rotate-0 transition-all duration-500' : ''}`}>
        {/* Header */}
        <div className="bg-[#075E54] p-4 flex items-center gap-3 text-white">
          <div className="w-10 h-10 rounded-full bg-white overflow-hidden flex items-center justify-center p-1">
            <img 
              src="https://res.cloudinary.com/dlvffw5wt/image/upload/v1782541050/2-removebg-preview_yei74a.png" 
              alt="Dr. Andre" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h3 className="font-bold text-sm">Dr. Andre</h3>
            <p className="text-xs text-white/80">Online</p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="bg-[#E5DDD5] h-[400px] p-4 flex flex-col gap-4 overflow-hidden relative">
          {/* Subtle WhatsApp-style background pattern */}
          <div className="absolute inset-0 opacity-20" style={{ 
            backgroundImage: 'url("https://res.cloudinary.com/dlvffw5wt/image/upload/v1775344548/Dr_Andre_hj5naj.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mixBlendMode: 'multiply'
          }}></div>

          <div className="self-end bg-[#DCF8C6] p-3 rounded-lg rounded-tr-none shadow-sm max-w-[85%] relative z-10">
            <p className="text-sm text-gray-800">Hi Dr. Andre, I've been feeling tired lately and have headaches. What could be wrong?</p>
            <span className="text-[10px] text-gray-500 block text-right mt-1">10:42 AM</span>
          </div>

          <div className="self-start bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%] relative z-10">
            <p className="text-sm text-gray-800">Hello! I'm here to help. Those symptoms could have several causes. Let me ask a few questions to better understand your situation.</p>
            <span className="text-[10px] text-gray-500 block text-right mt-1">10:42 AM</span>
          </div>

          <div className="self-start bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%] relative z-10">
            <p className="text-sm text-gray-800">Are you getting enough sleep (7-8 hours)? And how much water do you drink daily?</p>
            <span className="text-[10px] text-gray-500 block text-right mt-1">10:43 AM</span>
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-[#f0f0f0] p-3 flex items-center gap-2">
          <div className="flex-grow bg-white rounded-full h-10 px-4 flex items-center text-gray-400 text-sm">Type a message...</div>
          <div className="w-10 h-10 bg-[#075E54] rounded-full flex items-center justify-center text-white shrink-0">
            <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
          </div>
        </div>
      </div>
    </div>
  );
}
