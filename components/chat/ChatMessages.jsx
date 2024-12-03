export default function ChatMessages({ messages }) {
    return (
      <div className="flex-1 overflow-y-auto scrollbar-hide scroll-smooth p-4 space-y-4"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isSender ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${message.isSender ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
            >
              <p>{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }
  