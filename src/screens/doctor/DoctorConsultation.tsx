import { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, MessageSquare, PhoneOff, Lock, Send, FileText, Stethoscope } from 'lucide-react';
import { useNav } from '@/lib/nav';
import { MobilePage, MobileContent } from '@/components/MobileLayout';
import { Avatar, VerifiedBadge } from '@/components/ui';
import { Button } from '@/components/Button';

export function DoctorConsultation() {
  const { navigate, selectAppointment } = useNav();
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [messages, setMessages] = useState<{ from: 'doctor' | 'patient'; text: string }[]>([
    { from: 'patient', text: 'Hello Doctor, thank you for seeing me.' },
    { from: 'doctor', text: 'Hello Nimali, please describe your symptoms.' },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { from: 'doctor', text: input }]);
    setInput('');
  };

  if (callEnded) {
    return (
      <MobilePage>
        <MobileContent className="flex flex-col items-center justify-center text-center py-12 space-y-4">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
            <PhoneOff className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Consultation Ended</h1>
          <p className="text-gray-500">Create a prescription for this consultation.</p>
          <Button size="lg" fullWidth onClick={() => navigate('doctor-prescription')}>
            <FileText className="w-4 h-4" /> Create Prescription
          </Button>
          <Button size="lg" variant="outline" fullWidth onClick={() => navigate('doctor-dashboard')}>
            Back to Dashboard
          </Button>
        </MobileContent>
      </MobilePage>
    );
  }

  return (
    <MobilePage>
      <div className="flex-1 flex flex-col bg-gray-900 relative">
        {/* Patient video (main) */}
        <div className="flex-1 relative flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary-900 via-gray-900 to-gray-800" />
          <div className="relative z-10 flex flex-col items-center gap-3">
            <Avatar name="Nimali Perera" size={100} />
            <div className="text-center">
              <p className="font-bold text-white text-lg">Nimali Perera</p>
              <p className="text-sm text-gray-300">Patient</p>
            </div>
          </div>

          {/* Doctor video (PiP) */}
          <div className="absolute top-4 right-4 w-24 h-32 rounded-xl overflow-hidden bg-gray-700 border-2 border-gray-600 flex items-center justify-center">
            {videoOff ? (
              <div className="flex flex-col items-center gap-1">
                <Avatar name="Dr. Kasun Perera" size={36} />
                <span className="text-xs text-gray-400">You</span>
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
                <Avatar name="Dr. Kasun Perera" size={36} />
              </div>
            )}
          </div>

          {/* Secure banner */}
          <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-sm px-3 py-1.5">
            <Lock className="w-3.5 h-3.5 text-success-400" />
            <span className="text-xs font-medium text-white">Secure Consultation</span>
          </div>

          {/* Timer */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/40 backdrop-blur-sm px-4 py-1.5">
            <span className="text-sm font-mono text-white">00:02:15</span>
          </div>
        </div>

        {/* Chat */}
        {chatOpen && (
          <div className="absolute inset-0 z-20 bg-white flex flex-col animate-slide-up">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Chat with Patient</h3>
              <button onClick={() => setChatOpen(false)} className="text-sm text-primary-600 font-medium">Close</button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'doctor' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.from === 'doctor' ? 'bg-secondary-600 text-white' : 'bg-gray-100 text-gray-800'
                  }`}>{m.text}</div>
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
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-secondary-400 focus:ring-2 focus:ring-secondary-100 outline-none text-sm"
              />
              <button onClick={sendMessage} className="p-2.5 rounded-xl bg-secondary-600 text-white">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-gray-900 px-6 py-6 flex items-center justify-center gap-4">
          <button onClick={() => setMuted(!muted)} className={`w-14 h-14 rounded-full flex items-center justify-center ${muted ? 'bg-error-500' : 'bg-gray-700'}`}>
            {muted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
          </button>
          <button onClick={() => setVideoOff(!videoOff)} className={`w-14 h-14 rounded-full flex items-center justify-center ${videoOff ? 'bg-error-500' : 'bg-gray-700'}`}>
            {videoOff ? <VideoOff className="w-6 h-6 text-white" /> : <Video className="w-6 h-6 text-white" />}
          </button>
          <button onClick={() => setChatOpen(true)} className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </button>
          <button onClick={() => setCallEnded(true)} className="w-14 h-14 rounded-full bg-error-600 flex items-center justify-center hover:bg-error-700">
            <PhoneOff className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </MobilePage>
  );
}
