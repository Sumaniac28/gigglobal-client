import { AxiosResponse } from 'axios';
import { FC, ReactElement } from 'react';
import { FaDownload, FaRegFileArchive, FaRegPlayCircle } from 'react-icons/fa';
import { checkUrlExtension } from 'src/shared/utils/image-utils.service';
import { bytesToSize, downloadFile, getFileBlob, showErrorToast } from 'src/shared/utils/utils.service';

import { IChatMessageProps } from '../../interfaces/chat.interface';

const ChatFile: FC<IChatMessageProps> = ({ message }): ReactElement => {
  const downloadChatFile = async (url: string, fileName: string): Promise<void> => {
    try {
      const response: AxiosResponse = await getFileBlob(url);
      const blobUrl: string = URL.createObjectURL(new Blob([response.data]));
      downloadFile(blobUrl, fileName);
    } catch (error) {
      showErrorToast('Error downloading file.');
    }
  };

  return (
    <div className="flex w-64 min-w-[100%] flex-col bg-surface rounded-lg shadow-sm border border-border-default overflow-hidden">
      <div className="z-1 mt-2 flex flex-col">
        {checkUrlExtension(`${message.fileType}`) === 'image' && (
          <img className="h-36 w-64 object-cover rounded-t-lg" src={message.file} alt="Shared image" />
        )}
        {checkUrlExtension(`${message.fileType}`) === 'zip' && (
          <div className="relative flex h-[120px] w-64 items-center justify-center rounded-t-lg bg-accent/10">
            <FaRegFileArchive className="text-accent" size={32} />
          </div>
        )}
        {checkUrlExtension(`${message.fileType}`) === 'video' && (
          <div className="relative flex h-[150px] w-64 items-center justify-center rounded-t-lg bg-accent/10">
            <FaRegPlayCircle className="text-accent" size={32} />
            <video width="100%" src="" className="absolute inset-0 w-full h-full object-cover rounded-t-lg" />
          </div>
        )}
      </div>
      <div className="flex w-auto justify-between items-center p-3 bg-surface border-t border-border-default">
        <div
          className="flex gap-2 truncate items-center cursor-pointer text-primary hover:text-primary-hover transition-colors duration-300"
          onClick={() => downloadChatFile(`${message.file}`, `${message.fileName}`)}
        >
          <FaDownload size={12} className="flex-shrink-0" />
          <span className="truncate text-sm font-medium">{message.fileName}</span>
        </div>
        <span className="truncate text-xs text-muted ml-2 flex-shrink-0">({bytesToSize(parseInt(`${message.fileSize}`))})</span>
      </div>
    </div>
  );
};

export default ChatFile;
