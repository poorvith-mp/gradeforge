import React, { useState, useEffect } from 'react';
import { generateShareUrl } from '../../utils/attribution';
import { encodePlanToUrl } from '../../utils/sharePlan';
import { useGrade } from '../../context/GradeContext';
import { X, Copy, Check, MessageCircle, Share2, Send, FileSpreadsheet, Globe } from 'lucide-react';

interface ShareModalProps {
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ onClose }) => {
  const { state } = useGrade();
  const [tab, setTab] = useState<'app' | 'plan'>('plan');
  const [copiedApp, setCopiedApp] = useState(false);
  const [copiedPlan, setCopiedPlan] = useState(false);
  const [planUrl, setPlanUrl] = useState<string>('');
  const [planError, setPlanError] = useState<string>('');

  const appShareUrl = generateShareUrl('direct_share');
  const appShareText = 'Calculate SGPA & CGPA easily without spreadsheets. Features VTU, Anna Univ, and Target CGPA planning!';

  useEffect(() => {
    if (state.semesters.length > 0) {
      encodePlanToUrl(state).then((res) => {
        if (res.success && res.url) {
          setPlanUrl(res.url);
          setPlanError('');
        } else {
          setPlanError(res.error || 'Failed to encode plan.');
        }
      });
    } else {
      setPlanUrl('');
    }
  }, [state]);

  const handleCopyApp = () => {
    navigator.clipboard.writeText(appShareUrl);
    setCopiedApp(true);
    setTimeout(() => setCopiedApp(false), 2500);
  };

  const handleCopyPlan = () => {
    if (!planUrl) return;
    navigator.clipboard.writeText(planUrl);
    setCopiedPlan(true);
    setTimeout(() => setCopiedPlan(false), 2500);
  };

  const handleWhatsApp = () => {
    const textToShare = tab === 'plan' && planUrl ? `Check out my academic plan on GradeForge: ${planUrl}` : `${appShareText} ${appShareUrl}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(textToShare)}`;
    window.open(url, '_blank');
  };

  const handleTwitter = () => {
    const textToShare = tab === 'plan' && planUrl ? 'Check out my academic grade calculation on GradeForge!' : appShareText;
    const urlToShare = tab === 'plan' && planUrl ? planUrl : appShareUrl;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(textToShare)}&url=${encodeURIComponent(urlToShare)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-md bg-paper border border-gpline shadow-2xl p-6 relative"
        role="dialog"
        aria-labelledby="share-modal-title"
      >
        <div className="flex items-center justify-between pb-3.5 border-b border-gpline mb-5">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-gpblue" />
            <h2 id="share-modal-title" className="text-xl font-serif font-bold text-ink m-0">
              Share GradeForge
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 text-gpmuted hover:text-ink transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-gpline mb-4 font-mono text-xs">
          <button
            type="button"
            onClick={() => setTab('plan')}
            className={`flex-1 py-2 font-bold border-b-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'plan' ? 'border-gpblue text-gpblue bg-gpwash/40' : 'border-transparent text-gpmuted hover:text-ink'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" /> Share My Plan
          </button>
          <button
            type="button"
            onClick={() => setTab('app')}
            className={`flex-1 py-2 font-bold border-b-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'app' ? 'border-gpblue text-gpblue bg-gpwash/40' : 'border-transparent text-gpmuted hover:text-ink'
            }`}
          >
            <Globe className="w-3.5 h-3.5" /> Share Calculator
          </button>
        </div>

        {tab === 'plan' ? (
          <div>
            <p className="text-xs sm:text-sm text-gpmuted mb-3">
              Share a read-only link to your exact grades and target simulations. Anyone with this link can view your entered subjects.
            </p>

            {planError ? (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs font-mono mb-4">
                {planError}
              </div>
            ) : !planUrl ? (
              <div className="p-3 bg-gpwash border border-gpline text-gpmuted text-xs font-mono mb-4">
                Add at least one semester with subjects to generate a shareable plan link.
              </div>
            ) : (
              <div className="flex items-center gap-2 p-1.5 border border-gpline bg-bg mb-4">
                <input
                  type="text"
                  readOnly
                  value={planUrl}
                  className="w-full px-2 py-1 bg-transparent text-ink font-mono text-xs focus:outline-none overflow-ellipsis"
                />
                <button
                  type="button"
                  onClick={handleCopyPlan}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-gpblue text-white text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer shrink-0"
                >
                  {copiedPlan ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Link
                    </>
                  )}
                </button>
              </div>
            )}

            <p className="text-[11px] font-mono text-gpmuted mb-4">
              All plan data is encoded directly into the URL fragment (#plan). It stays in the browser and never touches any server.
            </p>
          </div>
        ) : (
          <div>
            <p className="text-xs sm:text-sm text-gpmuted mb-4">
              Help your classmates calculate their SGPA and simulate their Target CGPA with zero ads and complete privacy.
            </p>

            {/* Copy Link Input */}
            <div className="flex items-center gap-2 p-1.5 border border-gpline bg-bg mb-4">
              <input
                type="text"
                readOnly
                value={appShareUrl}
                className="w-full px-2 py-1 bg-transparent text-ink font-mono text-xs focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyApp}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-gpblue text-white text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer shrink-0"
              >
                {copiedApp ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Quick Social Buttons */}
        <div className="grid grid-cols-2 gap-2.5 mb-2">
          <button
            type="button"
            onClick={handleWhatsApp}
            className="inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" /> Share on WhatsApp
          </button>

          <button
            type="button"
            onClick={handleTwitter}
            className="inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-sky-500 text-white text-xs font-bold hover:bg-sky-600 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" /> Share on X / Twitter
          </button>
        </div>
      </div>
    </div>
  );
};
