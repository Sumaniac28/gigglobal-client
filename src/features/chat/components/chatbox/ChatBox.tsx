import { ChangeEvent, FC, FormEvent, ReactElement, RefObject, useRef, useState } from 'react';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';
import Button from 'src/shared/button/Button';
import TextInput from 'src/shared/inputs/TextInput';
import { IResponse } from 'src/shared/shared.interface';
import { generateRandomNumber, showErrorToast } from 'src/shared/utils/utils.service';
import { useAppSelector } from 'src/store/store';
import { v4 as uuidv4 } from 'uuid';

import useChatScrollToBottom from '../../hooks/useChatScrollToBottom';
import { IChatBoxProps, IConversationDocument, IMessageDocument } from '../../interfaces/chat.interface';
import { useGetConversationQuery, useGetMessagesQuery, useSaveChatMessageMutation } from '../../services/chat.service';
import ChatBoxSkeleton from './ChatBoxSkeleton';

const ChatBox: FC<IChatBoxProps> = ({ seller, buyer, gigId, onClose }): ReactElement => {
  const authUser = useAppSelector((state) => state.authUser);
  const [message, setMessage] = useState<string>('');
  const conversationIdRef = useRef<string>(`${generateRandomNumber(15)}`);
  const { data: conversationData, isSuccess: isConversationSuccess } = useGetConversationQuery({
    senderUsername: `${seller.username}`,
    receiverUsername: `${buyer.username}`
  });
  const {
    data: messageData,
    isLoading: isMessageLoading,
    isSuccess: isMessageSuccess
  } = useGetMessagesQuery(
    { senderUsername: `${seller.username}`, receiverUsername: `${buyer.username}` },
    { refetchOnMountOrArgChange: true }
  );
  let chatMessages: IMessageDocument[] = [];

  if (isConversationSuccess && conversationData.conversations && conversationData.conversations.length) {
    conversationIdRef.current = (conversationData.conversations[0] as IConversationDocument).conversationId;
  }
  if (isMessageSuccess) {
    chatMessages = messageData.messages as IMessageDocument[];
  }

  const scrollRef: RefObject<HTMLDivElement> = useChatScrollToBottom(chatMessages);
  const [saveChatMessage] = useSaveChatMessageMutation();

  const sendMessage = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    if (!message) {
      return;
    }
    try {
      const messageBody: IMessageDocument = {
        conversationId: conversationIdRef.current,
        hasConversationId: conversationData && conversationData.conversations && conversationData.conversations.length > 0,
        body: message,
        gigId,
        sellerId: seller._id,
        buyerId: buyer._id,
        senderUsername: authUser.username === seller.username ? seller.username : buyer.username,
        senderPicture: authUser.username === seller.username ? seller.profilePicture : buyer.profilePicture,
        receiverUsername: authUser.username !== seller.username ? seller.username : buyer.username,
        receiverPicture: authUser.username !== seller.username ? seller.profilePicture : buyer.profilePicture,
        isRead: false,
        hasOffer: false
      };
      const response: IResponse = await saveChatMessage(messageBody).unwrap();
      setMessage('');
      conversationIdRef.current = `${response.conversationId}`;
    } catch (error) {
      showErrorToast('Error sending message.');
    }
  };

  return (
    <>
      {isMessageLoading && !chatMessages ? (
        <ChatBoxSkeleton />
      ) : (
        <div className="fixed bottom-0 left-2 right-2 h-[400px] max-h-[500px] w-auto border border-border-default bg-surface shadow-2xl rounded-t-lg md:left-8 md:h-96 md:max-h-[500px] md:w-96">
          <div className="flex items-center space-x-4 border-b border-border-default bg-surface px-5 py-4 rounded-t-lg">
            <img
              src={authUser.username !== seller.username ? seller.profilePicture : buyer.profilePicture}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-border-default"
              alt="profile image"
            />
            <div className="w-full font-medium">
              <div className="flex w-full cursor-pointer justify-between text-sm font-themeFont font-bold text-primary md:text-base">
                <span>{authUser.username !== seller.username ? seller.username : buyer.username}</span>
                <FaTimes
                  className="flex self-center text-muted hover:text-primary transition-colors duration-300 cursor-pointer"
                  onClick={onClose}
                />
              </div>
              <div className="text-xs text-muted">
                Avg. response time: {seller.responseTime} hour{seller.responseTime === 1 ? '' : 's'}
              </div>
            </div>
          </div>

          <div className="h-[500px] overflow-y-scroll bg-background md:h-full">
            <div
              className="my-2 flex h-[280px] flex-col overflow-y-scroll px-4 pt-6 pb-12 md:h-[72%]"
              ref={scrollRef}
              onWheel={(e) => {
                const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
                const isAtTop = scrollTop === 0;
                const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

                if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
                  e.preventDefault();
                }
              }}
            >
              {chatMessages.map((msg: IMessageDocument) => (
                <div
                  key={uuidv4()}
                  className={`my-3 flex max-w-[300px] gap-y-6 text-sm ${
                    msg.senderUsername === authUser.username ? 'flex-row-reverse self-end' : ''
                  }`}
                >
                  <img
                    src={
                      msg.senderUsername === authUser.username
                        ? authUser.profilePicture || ''
                        : authUser.username === seller.username
                          ? buyer.profilePicture
                          : seller.profilePicture
                    }
                    className={`h-8 w-8 rounded-full object-cover ring-1 ring-border-default ${msg.senderUsername === authUser.username ? 'hidden' : ''}`}
                    alt="profile image"
                  />
                  <p
                    className={`ml-2 max-w-[200px] rounded-2xl px-4 py-3 text-start text-sm font-normal leading-relaxed md:max-w-[220px] transition-all duration-300 ${
                      msg.senderUsername === authUser.username
                        ? 'max-w-[200px] rounded-2xl bg-primary text-on-primary shadow-sm'
                        : 'bg-surface text-primary border border-border-default shadow-sm'
                    }`}
                  >
                    {msg.body}
                  </p>
                </div>
              ))}
              <div className="h-16"></div>
            </div>
          </div>

          <form
            onSubmit={sendMessage}
            className="absolute bottom-0 left-0 right-0 mb-1 flex px-2 bg-surface border-t border-border-default rounded-b-lg"
          >
            <TextInput
              type="text"
              name="message"
              value={message}
              placeholder="Type your message..."
              className="mb-0 w-full rounded-l-lg border-0 bg-surface p-3 text-sm font-normal text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
              onChange={(event: ChangeEvent) => setMessage((event.target as HTMLInputElement).value)}
            />
            <Button
              className="rounded-r-lg bg-primary hover:bg-primary-hover px-6 text-center text-sm font-themeFont font-semibold text-on-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300 md:px-3 md:text-base"
              label={<FaPaperPlane className="self-center" />}
            />
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBox;
