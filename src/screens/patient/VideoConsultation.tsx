import { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, MessageSquare, PhoneOff, Lock, Send, ShieldCheck } from 'lucide-react';
import { useNav } from '@/lib/nav';
import { MobilePage, MobileContent } from '@/components/MobileLayout';
import { Avatar, VerifiedBadge } from '@/components/ui';

export function VideoConsultation() {
  const { navigate } = useNav();
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ from: 'doctor' | 'patient'; text: string }[]>([
    { from: 'doctor', text: 'Hello Nimali, how are you feeling today?' },
    { from: 'patient', text: 'Hello Doctor, I have a mild fever and some fatigue.' },
    { from: 'doctor', text: 'I see. How long have you had these symptoms?' },
  ]);
  const [input, setInput] = useState('');
  const [callEnded, setCallEnded] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { from: 'patient', text: input }]);
    setInput('');
    setTimeout(() => {
      setMessages((m) => [...m, { from: 'doctor', text: 'Understood. Based on your symptoms, I recommend rest and plenty of fluids. I will prescribe medication for the fever.' }]);
    }, 1500);
  };

  if (callEnded) {
    return (
      <MobilePage>
        <MobileContent className="flex flex-col items-center justify-center text-center py-12">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <PhoneOff className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Consultation Ended</h1>
          <p className="mt-2 text-gray-500">Your consultation has been completed.</p>
          <button
            onClick={() => navigate('consultation-summary')}
            className="mt-6 px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
          >
            View Consultation Summary
          </button>
        </MobileContent>
      </MobilePage>
    );
  }

  return (
    <MobilePage>
      <div className="flex-1 flex flex-col bg-gray-900 relative">
        {/* Doctor video (main) */}
        <div className="flex-1 relative flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-gray-900 to-gray-800" />
          <div className="relative z-10 flex flex-col items-center gap-3">
            <Avatar name="Dr. Kasun Perera" size={100} />
            <div className="text-center">
              <div className="flex items-center gap-2 justify-center">
                <p className="font-bold text-white text-lg">Dr. Kasun Perera</p>
                <VerifiedBadge />
              </div>
              <p className="text-sm text-gray-300">General Physician</p>
            </div>
          </div>

          {/* Patient video (picture-in-picture) */}
          <div className="absolute top-4 right-4 w-24 h-32 rounded-xl overflow-hidden bg-gray-700 border-2 border-gray-600 flex items-center justify-center">
            {videoOff ? (
              <div className="flex flex-col items-center gap-1">
                <Avatar name="Nimali Perera" size={36} />
                <span className="text-xs text-gray-400">You</span>
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-secondary-600 to-secondary-800 flex items-center justify-center">
                <Avatar name="Nimali Perera" size={36} />
              </div>
            )}
          </div>

          {/* Secure banner */}
          <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-sm px-3 py-1.5">
            <Lock className="w-3.5 h-3.5 text-success-400" />
            <span className="text-xs font-medium text-white">Secure & Private Consultation</span>
          </div>

          {/* Timer */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/40 backdrop-blur-sm px-4 py-1.5">
            <span className="text-sm font-mono text-white">00:04:32</span>
          </div>
        </div>

        {/* Chat panel */}
        {chatOpen && (
          <div className="absolute inset-0 z-20 bg-white flex flex-col animate-slide-up">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Chat with Doctor</h3>
              <button onClick={() => setChatOpen(false)} className="text-sm text-primary-600 font-medium">Close</button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'patient' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.from === 'patient' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm"
              />
              <button onClick={sendMessage} className="p-2.5 rounded-xl bg-primary-600 text-white">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-gray-900 px-6 py-6 flex items-center justify-center gap-4">
          <button
            onClick={() => setMuted(!muted)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${muted ? 'bg-error-500' : 'bg-gray-700'}`}
          >
            {muted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
          </button>
          <button
            onClick={() => setVideoOff(!videoOff)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${videoOff ? 'bg-error-500' : 'bg-gray-700'}`}
          >
            {videoOff ? <VideoOff className="w-6 h-6 text-white" /> : <Video className="w-6 h-6 text-white" />}
          </button>
          <button
            onClick={() => setChatOpen(true)}
            className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center"
          >
            <MessageSquare className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={() => setCallEnded(true)}
            className="w-14 h-14 rounded-full bg-error-600 flex items-center justify-center hover:bg-error-700 transition-colors"
          >
            <PhoneOff className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </MobilePage>
  );
}
