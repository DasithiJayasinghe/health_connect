import { useState } from 'react';
import { Star, ShieldCheck, Lock, Heart, Send } from 'lucide-react';
import { useNav } from '@/lib/nav';
import { MobilePage, MobileContent, MobileHeader } from '@/components/MobileLayout';
import { Button } from '@/components/Button';

export function PatientFeedback() {
  const { navigate, showToast } = useNav();
  const [rating, setRating] = useState(0);
  const [confidence, setConfidence] = useState<boolean | null>(null);
  const [safe, setSafe] = useState<boolean | null>(null);
  const [returnAgain, setReturnAgain] = useState<boolean | null>(null);
  const [text, setText] = useState('');

  const handleSubmit = () => {
    showToast('Thank you for your feedback!');
    navigate('patient-dashboard');
  };

  return (
    <MobilePage>
      <MobileHeader title="Patient Feedback" />
      <MobileContent className="space-y-5">
        <div className="text-center py-4">
          <h1 className="font-display text-2xl font-bold text-gray-900">How was your consultation?</h1>
          <p className="mt-2 text-sm text-gray-500">Your feedback helps us maintain trust and quality.</p>
        </div>

        {/* Star rating */}
        <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm text-center">
          <p className="text-sm font-medium text-gray-700 mb-3">Rate your experience</p>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                onClick={() => setRating(i)}
                className="transition-transform hover:scale-110 active:scale-95"
              >
                <Star
                  className={`w-10 h-10 transition-colors ${
                    i <= rating ? 'fill-warning-400 text-warning-400' : 'fill-gray-100 text-gray-200'
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="mt-2 text-sm font-medium text-primary-600 animate-fade-in">
              {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
            </p>
          )}
        </div>

        {/* Questions */}
        <div className="space-y-3">
          <Question
            icon={<ShieldCheck className="w-5 h-5 text-primary-600" />}
            question="Did the doctor's verification information increase your confidence?"
            value={confidence}
            onChange={setConfidence}
          />
          <Question
            icon={<Lock className="w-5 h-5 text-success-600" />}
            question="Did you feel safe during the online consultation?"
            value={safe}
            onChange={setSafe}
          />
          <Question
            icon={<Heart className="w-5 h-5 text-error-500" />}
            question="Would you use HealthConnect again?"
            value={returnAgain}
            onChange={setReturnAgain}
          />
        </div>

        {/* Text feedback */}
        <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Additional comments (optional)</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="Share more about your experience..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-sm text-gray-900 resize-none"
          />
        </div>

        <Button size="lg" fullWidth onClick={handleSubmit}>
          <Send className="inline w-4 h-4 mr-1" /> Submit Feedback
        </Button>
      </MobileContent>
    </MobilePage>
  );
}

function Question({
  icon,
  question,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  question: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
      <div className="flex items-start gap-3 mb-3">
        <div className="shrink-0 mt-0.5">{icon}</div>
        <p className="text-sm font-medium text-gray-700">{question}</p>
      </div>
      <div className="flex gap-2 ml-8">
        <button
          onClick={() => onChange(true)}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            value === true ? 'bg-success-50 text-success-700 border-2 border-success-300' : 'border-2 border-gray-200 text-gray-500'
          }`}
        >
          Yes
        </button>
        <button
          onClick={() => onChange(false)}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            value === false ? 'bg-error-50 text-error-700 border-2 border-error-300' : 'border-2 border-gray-200 text-gray-500'
          }`}
        >
          No
        </button>
      </div>
    </div>
  );
}
