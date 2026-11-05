import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useScan } from '../context/ScanContext';
import { Sparkles, Send, Bot } from 'lucide-react';

export const AIAssistantPage: React.FC = () => {
  const { user } = useAuth();
  const { activeScan } = useScan();

  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; source?: string }>>([
    {
      role: 'assistant',
      text: `Hello! I am your **FINEPRINT Food Safety Assistant**.\n\nAsk me anything about food ingredients, INS chemical additives, or FSSAI safety standards. How can I help you?`,
      source: 'FINEPRINT AI',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sampleQuestions = [
    'What does INS 621 (MSG) actually do in food?',
    'Is palm oil really bad for heart health?',
    'How do I spot hidden sugars on packaged labels?',
    'What are the safest healthy snacks for evening tea?',
  ];

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || input;
    if (!textToSend.trim() || loading) return;

    const newMessages = [...messages, { role: 'user' as const, text: textToSend }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await api.chatAssistant({
        message: textToSend,
        history: newMessages.map((m) => ({ role: m.role, content: m.text })),
        active_product: activeScan
          ? {
              name: activeScan.product_name,
              ingredients_text: activeScan.ingredient_analysis?.raw_text,
              nutrition_facts: activeScan.nutrition_facts,
              overall_score: activeScan.overall_score,
            }
          : null,
      });

      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          text: res.reply,
          source: res.source,
        },
      ]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          text: 'I apologize, but I encountered an error connecting to the food knowledge engine. Please try again.',
          source: 'System',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex items-center space-x-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 shadow-sm">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">AI Food Intelligence Assistant</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Grounded in Indian FSSAI regulations, scientific research, and your declared allergies.
          </p>
        </div>
      </div>

      {/* Currently Attached Scanned Product Context (if any) */}
      {activeScan && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between text-xs text-slate-800">
          <div className="flex items-center space-x-2">
            <span className="font-bold uppercase tracking-wider text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full">
              Active Context
            </span>
            <span className="font-bold text-slate-900">{activeScan.product_name}</span>
            <span className="text-emerald-700 font-bold">({activeScan.overall_score}/10)</span>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">Questions will use this product's data</span>
        </div>
      )}

      {/* Chat Messages Log */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm min-h-[420px] max-h-[550px] overflow-y-auto space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-3 ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`p-4 rounded-2xl max-w-[85%] sm:max-w-[75%] text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-none shadow-md shadow-emerald-600/20'
                  : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none'
              }`}
            >
              <div
                className={`prose prose-sm max-w-none ${m.role === 'user' ? 'text-white' : 'text-slate-800'}`}
                dangerouslySetInnerHTML={{
                  __html: m.text
                    .replace(/\n\n/g, '<br/><br/>')
                    .replace(/\*\*(.*?)\*\*/g, `<strong class="${m.role === 'user' ? 'text-white' : 'text-slate-950'} font-bold">$1</strong>`)
                    .replace(/\*(.*?)\*/g, '<em>$1</em>'),
                }}
              />
              {m.source && (
                <div className={`text-[10px] mt-2 text-right ${m.role === 'user' ? 'text-emerald-100' : 'text-slate-400'}`}>
                  Engine: {m.source}
                </div>
              )}
            </div>

            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold shadow-xs">
                {user?.full_name ? user.full_name[0] : 'U'}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-xs text-slate-500 italic pl-11">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
            <span>Consulting food knowledge engine...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="flex flex-wrap gap-2">
        {sampleQuestions.map((q, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSend(q)}
            className="text-xs bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 px-3.5 py-2 rounded-full border border-slate-200 transition-colors shadow-xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about food safety, ingredients, or nutrition..."
          className="flex-1 px-4 py-2 bg-transparent text-sm text-slate-900 focus:outline-none placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center space-x-1 shadow-md shadow-emerald-600/20"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5 ml-1" />
        </button>
      </form>
    </div>
  );
};
