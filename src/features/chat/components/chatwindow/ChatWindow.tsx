import { filter, find } from 'lodash';
import { ChangeEvent, FC, FormEvent, ReactElement, useEffect, useRef, useState } from 'react';
import { FaPaperclip, FaPaperPlane } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { IBuyerDocument } from 'src/features/buyer/interfaces/buyer.interface';
import { useGetBuyerByUsernameQuery } from 'src/features/buyer/services/buyer.service';
import { useGetGigByIdQuery } from 'src/features/gigs/services/gigs.service';
import Button from 'src/shared/button/Button';
import { updateNotification } from 'src/shared/header/reducers/notification.reducer';
import TextInput from 'src/shared/inputs/TextInput';
import OfferModal from 'src/shared/modals/OfferModal';
import { checkFile, fileType, readAsBase64 } from 'src/shared/utils/image-utils.service';
import { TimeAgo } from 'src/shared/utils/timeago.utils';
import { firstLetterUppercase, showErrorToast } from 'src/shared/utils/utils.service';
import { socket, socketService } from 'src/sockets/socket.service';
import { useAppDispatch, useAppSelector } from 'src/store/store';
import { v4 as uuidv4 } from 'uuid';

import useChatScrollToBottom from '../../hooks/useChatScrollToBottom';
import { IChatWindowProps, IMessageDocument } from '../../interfaces/chat.interface';
import { useSaveChatMessageMutation } from '../../services/chat.service';
import ChatFile from './ChatFile';
import ChatImagePreview from './ChatImagePreview';
import ChatOffer from './ChatOffer';

const MESSAGE_STATUS = {
  EMPTY: '',
  IS_LOADING: false,
  LOADING: true
};
const NOT_EXISTING_ID = '649db27404c0c7b7d4b112ec';

const ChatWindow: FC<IChatWindowProps> = ({ chatMessages, isLoading, setSkip }): ReactElement => {
  const seller = useAppSelector((state) => state.seller);
  const authUser = useAppSelector((state) => state.authUser);
  const fileRef = useRef<HTMLInputElement>(null);
  const scrollRef = useChatScrollToBottom([]);
  const { username } = useParams<string>();
  const receiverUsername = useRef<string>(MESSAGE_STATUS.EMPTY);
  const receiverRef = useRef<IBuyerDocument>();
  const singleMessageRef = useRef<IMessageDocument>();
  const [showImagePreview, setShowImagePreview] = useState<boolean>(MESSAGE_STATUS.IS_LOADING);
  const [displayCustomOffer, setDisplayCustomOffer] = useState<boolean>(MESSAGE_STATUS.IS_LOADING);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState<boolean>(MESSAGE_STATUS.IS_LOADING);
  const [message, setMessage] = useState<string>(MESSAGE_STATUS.EMPTY);
  const dispatch = useAppDispatch();
  const { data: buyerData, isSuccess: isBuyerSuccess } = useGetBuyerByUsernameQuery(`${firstLetterUppercase(`${username}`)}`);
  const { data } = useGetGigByIdQuery(singleMessageRef.current ? `${singleMessageRef.current?.gigId}` : NOT_EXISTING_ID);
  const [saveChatMessage] = useSaveChatMessageMutation();

  if (isBuyerSuccess) {
    receiverRef.current = buyerData.buyer;
  }

  if (chatMessages.length) {
    singleMessageRef.current = chatMessages[chatMessages.length - 1];
  }

  const handleFileChange = (event: ChangeEvent): void => {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    if (target.files) {
      const file: File = target.files[0];
      if (!checkFile(file)) {
        setSelectedFile(file);
        setShowImagePreview(MESSAGE_STATUS.LOADING);
      }
    }
  };

  const setChatMessage = (event: ChangeEvent): void => {
    setMessage((event.target as HTMLInputElement).value);
  };

  const sendMessage = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    if (setSkip) {
      setSkip(true);
    }

    if (!message && !selectedFile) {
      return;
    }
    try {
      setIsUploadingFile(MESSAGE_STATUS.LOADING);
      const messageBody: IMessageDocument = {
        conversationId: singleMessageRef?.current?.conversationId,
        hasConversationId: true,
        body: message,
        gigId: singleMessageRef?.current?.gigId,
        sellerId: singleMessageRef?.current?.sellerId,
        buyerId: singleMessageRef?.current?.buyerId,
        senderUsername: `${authUser?.username}`,
        senderPicture: `${authUser?.profilePicture}`,
        receiverUsername: receiverRef?.current?.username,
        receiverPicture: receiverRef?.current?.profilePicture,
        isRead: false,
        hasOffer: false
      };
      if (selectedFile) {
        const dataImage: string | ArrayBuffer | null = await readAsBase64(selectedFile);
        messageBody.file = dataImage as string;
        messageBody.body = messageBody.body ? messageBody.body : '1 file sent';
        messageBody.fileType = fileType(selectedFile);
        messageBody.fileName = selectedFile.name;
        messageBody.fileSize = `${selectedFile.size}`;
      }
      await saveChatMessage(messageBody).unwrap();
      setSelectedFile(null);
      setShowImagePreview(MESSAGE_STATUS.IS_LOADING);
      setMessage(MESSAGE_STATUS.EMPTY);
      setIsUploadingFile(MESSAGE_STATUS.IS_LOADING);
    } catch (error) {
      setMessage(MESSAGE_STATUS.EMPTY);
      setIsUploadingFile(MESSAGE_STATUS.IS_LOADING);
      showErrorToast('Error sending message.');
    }
  };

  useEffect(() => {
    const list: IMessageDocument[] = filter(chatMessages, (item: IMessageDocument) => !item.isRead && item.receiverUsername === username);
    dispatch(updateNotification({ hasUnreadMessage: list.length > 0 }));
  }, [chatMessages, dispatch, username]);

  useEffect(() => {
    socketService.setupSocketConnection();
    socket.emit('getLoggedInUsers', '');
    socket.on('online', (data: string[]) => {
      receiverUsername.current = find(data, (name: string) => name === receiverRef?.current?.username) as string;
    });
  }, []);

  return (
    <>
      {!isLoading && displayCustomOffer && (
        <OfferModal
          header="Create Custom Offer"
          gigTitle={data && data?.gig?.title ? data?.gig?.title : ''}
          singleMessage={singleMessageRef?.current}
          receiver={receiverRef?.current}
          authUser={authUser}
          cancelBtnHandler={() => setDisplayCustomOffer(MESSAGE_STATUS.IS_LOADING)}
        />
      )}
      {!isLoading && (
        <div className="h-full w-full flex flex-col bg-background">
          <div className="flex w-full flex-col border-b border-border-default bg-surface px-6 py-4 shadow-sm flex-shrink-0">
            {receiverUsername.current === receiverRef?.current?.username ? (
              <>
                <div className="text-lg font-themeFont font-bold text-primary">{firstLetterUppercase(`${username}`)}</div>
                <div className="flex gap-2 items-center pb-1 text-sm font-normal text-accent">
                  Online
                  <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse ring-2 ring-accent/30"></span>
                </div>
              </>
            ) : (
              <>
                <div className="py-2 text-lg font-themeFont font-bold text-primary">{firstLetterUppercase(`${username}`)}</div>
                <span className="text-sm font-normal text-muted">Offline</span>
              </>
            )}
          </div>
          <div className="flex-1 bg-background overflow-hidden">
            <div
              className="h-full w-full flex flex-col overflow-y-auto px-4 pt-6 pb-12 scroll-smooth"
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
              {chatMessages.map((message: IMessageDocument) => (
                <div
                  key={uuidv4()}
                  className={`mb-4 flex ${message.senderUsername === authUser.username ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex max-w-[70%] ${message.senderUsername === authUser.username ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}
                  >
                    <img
                      className={`h-8 w-8 object-cover rounded-full ring-2 ring-border-default flex-shrink-0 ${message.senderUsername === authUser.username ? 'ml-2' : 'mr-2'}`}
                      src={message.senderPicture}
                      alt="Profile"
                    />
                    <div className={`flex flex-col ${message.senderUsername === authUser.username ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`flex gap-x-2 pb-1 items-center ${message.senderUsername === authUser.username ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        <span className="font-themeFont font-semibold text-primary text-xs">{message.senderUsername}</span>
                        <span className="text-xs font-normal text-muted">{TimeAgo.dayMonthYear(`${message.createdAt}`)}</span>
                      </div>
                      <div
                        className={`rounded-2xl px-4 py-3 max-w-full transition-all duration-300 ${
                          message.senderUsername === authUser.username
                            ? 'bg-primary text-on-primary rounded-br-md'
                            : 'bg-surface text-primary border border-border-default rounded-bl-md shadow-sm'
                        }`}
                      >
                        <span className="text-sm leading-relaxed break-words">{message.body}</span>
                        {message.hasOffer && <ChatOffer message={message} seller={seller} gig={data?.gig} />}
                        {message.file && <ChatFile message={message} />}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="h-20"></div>
            </div>
          </div>
          <div className="flex-shrink-0 flex flex-col bg-surface border-t border-border-default">
            {showImagePreview && (
              <ChatImagePreview
                image={URL.createObjectURL(selectedFile as File)}
                file={selectedFile as File}
                isLoading={isUploadingFile}
                message={message}
                handleChange={setChatMessage}
                onSubmit={sendMessage}
                onRemoveImage={() => {
                  setSelectedFile(null);
                  setShowImagePreview(MESSAGE_STATUS.IS_LOADING);
                }}
              />
            )}
            {!showImagePreview && (
              <div className="bottom-0 left-0 right-0 z-0 p-4">
                <form onSubmit={sendMessage} className="mb-3 w-full">
                  <TextInput
                    type="text"
                    name="message"
                    value={message}
                    className="w-full rounded-lg border border-border-default bg-surface p-4 text-sm font-normal text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    placeholder="Type your message..."
                    onChange={(event: ChangeEvent) => setMessage((event.target as HTMLInputElement).value)}
                  />
                </form>
                <div className="flex cursor-pointer flex-row justify-between items-center">
                  <div className="flex gap-4 items-center">
                    {!showImagePreview && (
                      <FaPaperclip
                        className="text-muted hover:text-primary transition-colors duration-300 cursor-pointer"
                        size={18}
                        onClick={() => fileRef?.current?.click()}
                      />
                    )}
                    {!showImagePreview && singleMessageRef.current && singleMessageRef.current.sellerId === seller?._id && (
                      <Button
                        className="rounded-lg bg-secondary hover:bg-secondary-hover px-6 py-3 text-center text-sm font-themeFont font-semibold text-on-primary focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all duration-300 md:px-4 md:py-2 md:text-base"
                        disabled={false}
                        label="Add Offer"
                        onClick={() => setDisplayCustomOffer(MESSAGE_STATUS.LOADING)}
                      />
                    )}
                    <TextInput
                      name="chatFile"
                      ref={fileRef}
                      type="file"
                      style={{ display: 'none' }}
                      onClick={() => {
                        if (fileRef.current) {
                          fileRef.current.value = '';
                        }
                      }}
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button
                      className="rounded-lg bg-primary hover:bg-primary-hover px-6 py-3 text-center text-sm font-themeFont font-semibold text-on-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300 md:px-4 md:py-2 md:text-base"
                      disabled={false}
                      label={<FaPaperPlane className="self-center" />}
                      onClick={sendMessage}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWindow;
