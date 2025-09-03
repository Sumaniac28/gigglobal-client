import { ChangeEvent, FC, ReactElement } from 'react';
import { FaCircleNotch, FaRegFileArchive, FaTimes } from 'react-icons/fa';
import TextInput from 'src/shared/inputs/TextInput';
import { validateImage } from 'src/shared/utils/image-utils.service';
import { bytesToSize } from 'src/shared/utils/utils.service';

import { IFilePreviewProps } from '../../interfaces/chat.interface';

const ChatImagePreview: FC<IFilePreviewProps> = ({
  image,
  file,
  isLoading,
  message,
  handleChange,
  onSubmit,
  onRemoveImage
}): ReactElement => {
  return (
    <div className="left-0 top-0 z-50 h-[190px] w-full border-t border-border-default bg-surface shadow-lg">
      <>
        {!isLoading ? (
          <>
            <div className="mb-2 w-full p-4">
              <form onSubmit={onSubmit}>
                <TextInput
                  name="message"
                  type="text"
                  value={message}
                  className="w-full rounded-lg border border-border-default bg-surface p-3 text-sm font-normal text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  placeholder="Add a message with your file..."
                  onChange={(event: ChangeEvent) => handleChange(event)}
                />
              </form>
            </div>
            <div className="absolute flex w-full cursor-pointer justify-between border-t border-border-default bg-surface p-4">
              {validateImage(file, 'image') ? (
                <img className="h-24 w-40 rounded-lg object-cover shadow-sm ring-2 ring-border-default" src={image} alt="Preview" />
              ) : (
                <div className="flex h-24 w-40 flex-col items-center justify-center truncate rounded-lg border border-border-default bg-accent/10 p-3">
                  <FaRegFileArchive className="text-accent mb-2" size={24} />
                  <span className="max-w-[100%] overflow-hidden truncate text-xs font-themeFont font-semibold text-primary">
                    {file.name}
                  </span>
                  <p className="text-xs text-muted mt-1">{bytesToSize(file.size)}</p>
                </div>
              )}

              <FaTimes
                className="text-muted hover:text-primary transition-colors duration-300 cursor-pointer"
                size={20}
                onClick={onRemoveImage}
              />
            </div>
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-accent/5">
            <FaCircleNotch className="mr-3 h-10 w-10 animate-spin text-primary" size={40} />
            <span className="text-primary font-themeFont font-medium mt-2">Uploading file...</span>
          </div>
        )}
      </>
    </div>
  );
};

export default ChatImagePreview;
