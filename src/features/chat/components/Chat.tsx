import { FC, ReactElement, useEffect, useRef, useState } from 'react';
import { FaArrowLeft, FaBars } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

import { IMessageDocument } from '../interfaces/chat.interface';
import { useGetUserMessagesQuery } from '../services/chat.service';
import { chatMessageReceived } from '../services/chat.utils';
import ChatList from './chatlist/ChatList';
import ChatWindow from './chatwindow/ChatWindow';

const Chat: FC = (): ReactElement => {
  const { conversationId } = useParams<string>();
  const chatMessages = useRef<IMessageDocument[]>([]);
  const [skip, setSkip] = useState<boolean>(false);
  const [chatMessagesData, setChatMessagesData] = useState<IMessageDocument[]>([]);
  const [showChatList, setShowChatList] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const { data, isSuccess, isLoading, isError } = useGetUserMessagesQuery(`${conversationId}`, { skip });

  useEffect(() => {
    if (isSuccess) {
      setChatMessagesData(data?.messages as IMessageDocument[]);
    }
  }, [isSuccess, data?.messages]);

  useEffect(() => {
    chatMessageReceived(`${conversationId}`, chatMessagesData, chatMessages.current, setChatMessagesData);
  }, [chatMessagesData, conversationId]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile && conversationId) {
      setShowChatList(false);
    }
  }, [conversationId, isMobile]);

  const toggleChatList = () => {
    setShowChatList(!showChatList);
  };

  return (
    <div className="flex-1 h-0 min-h-0 flex border border-border-default bg-surface shadow-lg rounded-lg lg:container lg:mx-auto overflow-hidden relative">
      {isMobile && (
        <>
          <div
            className={`absolute inset-0 z-20 bg-surface transition-transform duration-300 ease-in-out ${
              showChatList ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-border-default bg-surface">
                <h2 className="text-lg font-themeFont font-bold text-primary">Conversations</h2>
                <button
                  onClick={toggleChatList}
                  aria-label="Toggle chat menu"
                  className="p-2 rounded-lg hover:bg-muted/10 transition-colors duration-200"
                >
                  <FaBars className="h-5 w-5 text-muted" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <ChatList />
              </div>
            </div>
          </div>

          <div
            className={`absolute inset-0 z-10 bg-surface transition-transform duration-300 ease-in-out ${
              showChatList ? 'translate-x-full' : 'translate-x-0'
            }`}
          >
            <div className="flex flex-col h-full">
              {conversationId && chatMessagesData.length > 0 ? (
                <>
                  <div className="flex items-center p-4 border-b border-border-default bg-surface">
                    <button
                      onClick={toggleChatList}
                      aria-label="Back to conversations"
                      className="p-2 rounded-lg hover:bg-muted/10 transition-colors duration-200 mr-3"
                    >
                      <FaArrowLeft className="h-5 w-5 text-muted" />
                    </button>
                    <h2 className="text-lg font-themeFont font-bold text-primary">Chat</h2>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <ChatWindow setSkip={setSkip} chatMessages={chatMessagesData} isLoading={isLoading} isError={isError} />
                  </div>
                </>
              ) : (
                <div className="flex flex-col h-full">
                  <div className="flex items-center p-4 border-b border-border-default bg-surface">
                    <button
                      onClick={toggleChatList}
                      aria-label="Back to conversations"
                      className="p-2 rounded-lg hover:bg-muted/10 transition-colors duration-200 mr-3"
                    >
                      <FaArrowLeft className="h-5 w-5 text-muted" />
                    </button>
                    <h2 className="text-lg font-themeFont font-bold text-primary">Chat</h2>
                  </div>
                  <div className="flex-1 flex items-center justify-center text-muted font-themeFont">
                    Select a conversation to start messaging
                  </div>
                </div>
              )}
            </div>
          </div>

          {!showChatList && <div className="absolute inset-0 bg-black/20 z-5 transition-opacity duration-300" onClick={toggleChatList} />}
        </>
      )}

      {!isMobile && (
        <>
          <div className="flex flex-col w-full h-full overflow-hidden lg:w-1/3 lg:border-r lg:border-border-default">
            <ChatList />
          </div>

          <div className="flex-col h-full hidden w-full overflow-hidden md:w-2/3 lg:flex">
            {conversationId && chatMessagesData.length > 0 ? (
              <ChatWindow setSkip={setSkip} chatMessages={chatMessagesData} isLoading={isLoading} isError={isError} />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted font-themeFont">Select a user to chat with.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;
