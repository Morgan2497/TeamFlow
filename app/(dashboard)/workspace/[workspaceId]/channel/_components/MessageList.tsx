import { MessageItem } from "./message/MessageItem";

const messages = [
  {
    id: 1,
    message: "Hello, how are you?",
    date: new Date(),
    avatar: "https://avatar.vercel.sh/morgan",
    userName: "Morgan Kim",
  },
  {
    id: 2,
    message: "I'm good, thank you!",
    date: new Date(),
    avatar: "https://avatar.vercel.sh/morgan",
    userName: "Sumi Kim",
  },
];

export function MessageList() {
  return (
    <div className="relative h-full">
      <div className="h-full overflow-y-auto px-4">
        {messages.map((message) => (
          <MessageItem key={message.id} {...message} />
        ))}
      </div>
    </div>
  );
}
