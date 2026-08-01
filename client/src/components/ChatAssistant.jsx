import { useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { useSiteData } from '../context/SiteDataContext';

const starterPrompts = [
  'ما هي خطوات التصرف في حالة طارئة؟',
  'Est-ce que vous proposez le transport pour dialyse ?',
  'How can I book an ambulance quickly?'
];

function ChatAssistant() {
  const { content, apiBaseUrl } = useSiteData();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Bonjour. Je suis l assistant EMAS. Je peux vous aider pour l urgence, le transport medical, la dialyse et la prise en charge.'
    }
  ]);
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const listRef = useRef(null);

  const phone = content?.phone || '+212 522 49 16 16';
  const phoneDigits = phone.replace(/[^\d+]/g, '');
  const whatsappDigits = phone.replace(/\D/g, '');
  const endpoint = useMemo(() => `${apiBaseUrl}/api/assistant/chat`, [apiBaseUrl]);

  const pushMessage = (role, contentText) => {
    setMessages((prev) => [...prev, { role, content: contentText }]);
    setTimeout(() => {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    }, 10);
  };

  const sendMessage = async (value) => {
    const nextText = String(value || text).trim();
    if (!nextText || isSending) return;

    setErrorMessage('');
    setText('');
    setIsSending(true);
    pushMessage('user', nextText);

    try {
      const historyForApi = [...messages, { role: 'user', content: nextText }]
        .filter((item) => item.role === 'user' || item.role === 'assistant')
        .slice(-8);

      const response = await axios.post(endpoint, { messages: historyForApi });
      const reply = String(response.data?.reply || '').trim();
      if (!reply) {
        throw new Error('Empty assistant response');
      }
      pushMessage('assistant', reply);
    } catch {
      setErrorMessage('Le chat est temporairement indisponible. Merci de nous appeler directement.');
      pushMessage('assistant', `Le chat est temporairement indisponible. Vous pouvez nous appeler au ${phone}.`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="chat-assistant">
      {isOpen && (
        <section className="chat-panel" aria-label="EMAS AI assistant">
          <header className="chat-header">
            <div>
              <strong>EMAS Assistant</strong>
              <p>Urgence, transport et orientation rapide.</p>
            </div>
            <button type="button" className="chat-close" onClick={() => setIsOpen(false)} aria-label="Close chat">
              <i className="bi bi-x-lg" />
            </button>
          </header>

          <div className="chat-starters">
            {starterPrompts.map((prompt) => (
              <button key={prompt} type="button" onClick={() => sendMessage(prompt)} disabled={isSending}>
                {prompt}
              </button>
            ))}
          </div>

          <div className="chat-messages" ref={listRef}>
            {messages.map((item, index) => (
              <article key={`${item.role}-${index}`} className={`chat-bubble ${item.role === 'user' ? 'chat-user' : 'chat-bot'}`}>
                {item.content}
              </article>
            ))}
          </div>

          {errorMessage && <p className="chat-error">{errorMessage}</p>}

          <form
            className="chat-input-row"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
          >
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Ecrivez votre message..."
              maxLength={500}
              disabled={isSending}
            />
            <button type="submit" disabled={isSending || !text.trim()}>
              {isSending ? '...' : 'Send'}
            </button>
          </form>

          <div className="chat-quick-contact">
            <a href={`tel:${phoneDigits}`}><i className="bi bi-telephone-fill" /> {phone}</a>
            <a href={`https://wa.me/${whatsappDigits}`} target="_blank" rel="noreferrer"><i className="bi bi-whatsapp" /> WhatsApp</a>
          </div>
        </section>
      )}

      <button type="button" className="chat-launcher" onClick={() => setIsOpen((prev) => !prev)} aria-label="Open assistant">
        <i className={`bi ${isOpen ? 'bi-x-lg' : 'bi-chat-dots-fill'}`} />
      </button>
    </div>
  );
}

export default ChatAssistant;
