import { FC, ReactNode } from 'react';

const ChatLayout: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="flex flex-col h-screen w-full">
    <div className="flex flex-1 flex-col min-h-0">{children}</div>
  </div>
);

export default ChatLayout;
