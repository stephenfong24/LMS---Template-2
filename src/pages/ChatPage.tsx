import { ChangeEvent, FormEvent, useRef, useState } from 'react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  attachments?: string[];
}

const starter: ChatMessage[] = [
  {
    id: 'm1',
    role: 'assistant',
    text: 'I am UW Copilot Chat. Ask about risk drivers, document insights, or score explanations.',
  },
];

const generateAnswer = (prompt: string, files: string[]) => {
  const lower = prompt.toLowerCase();
  if (files.length > 0) {
    return `Received ${files.length} file(s): ${files.join(', ')}. I can summarize key underwriting signals once document extraction is complete.`;
  }
  if (lower.includes('risk')) {
    return 'Key risk factors include leverage trend, liquidity pressure, and customer concentration. I recommend validating debt service coverage and covenant headroom.';
  }
  if (lower.includes('document') || lower.includes('upload')) {
    return 'You can upload PDF or Excel files here. I will use the extracted metrics to explain risk impact and underwriting actions.';
  }
  if (lower.includes('score')) {
    return 'Risk score is generated from financial profile and sector risk. Underwriters can override score with rationale in Case Assessment.';
  }
  return 'I can help interpret AI risk outputs, summarize financial metrics, and explain next underwriting actions.';
};

export function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(starter);
  const [input, setInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onChooseFiles = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) {
      return;
    }

    const incoming = Array.from(fileList);
    setSelectedFiles((prev) => {
      const merged = [...prev];
      for (const item of incoming) {
        if (!merged.some((existing) => existing.name === item.name && existing.size === item.size)) {
          merged.push(item);
        }
      }
      return merged;
    });
    event.target.value = '';
  };

  const removeFile = (fileName: string) => {
    setSelectedFiles((prev) => prev.filter((file) => file.name !== fileName));
  };

  const onSend = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const prompt = input.trim();
    if (!prompt && selectedFiles.length === 0) {
      return;
    }

    const uploadedNames = selectedFiles.map((file) => file.name);
    const userText = prompt || 'Please analyze the attached files.';

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: userText,
      attachments: uploadedNames,
    };

    const assistantMessage: ChatMessage = {
      id: `a-${Date.now() + 1}`,
      role: 'assistant',
      text: generateAnswer(userText, uploadedNames),
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput('');
    setSelectedFiles([]);
  };

  return (
    <section className="page">
      <div className="page-header-row">
        <div>
          <h1>UW Copilot Chat</h1>
          <p className="page-subtitle">Ask risk questions and get underwriting explanations instantly</p>
        </div>
      </div>

      <article className="card chat-card">
        <div className="chat-log">
          {messages.map((message) => (
            <div key={message.id} className={message.role === 'assistant' ? 'chat-msg assistant' : 'chat-msg user'}>
              <strong>{message.role === 'assistant' ? 'UW Copilot' : 'You'}</strong>
              <p>{message.text}</p>
              {message.attachments && message.attachments.length > 0 && (
                <div className="chat-attachments">
                  {message.attachments.map((name) => (
                    <span key={name} className="file-chip">
                      {name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <form className="chat-form" onSubmit={onSend}>
          {selectedFiles.length > 0 && (
            <div className="chat-file-list">
              {selectedFiles.map((file) => (
                <button key={file.name} type="button" className="file-chip removable" onClick={() => removeFile(file.name)}>
                  {file.name} x
                </button>
              ))}
            </div>
          )}

          <div className="chat-input-shell">
            <button type="button" className="upload-icon-btn" onClick={onChooseFiles} aria-label="Upload files">
              +
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.xlsx,.xls,.csv,.doc,.docx"
              className="hidden-file-input"
              onChange={onFileChange}
            />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message UW Copilot"
              className="chat-text-input"
            />
            <button className="button chat-send-btn" type="submit">
              Send
            </button>
          </div>
        </form>
      </article>
    </section>
  );
}