import { ChangeEvent, FC, ReactElement, useRef, useState } from 'react';
import { FaCircleNotch, FaPaperclip, FaRegFile, FaTimes } from 'react-icons/fa';
import { IDeliveredWork } from 'src/features/order/interfaces/order.interface';
import { useDeliverOrderMutation } from 'src/features/order/services/order.service';

import Button from '../button/Button';
import TextAreaInput from '../inputs/TextAreaInput';
import TextInput from '../inputs/TextInput';
import { checkFile, fileType, readAsBase64 } from '../utils/image-utils.service';
import { bytesToSize, showErrorToast, showSuccessToast } from '../utils/utils.service';
import { IModalProps } from './interfaces/modal.interface';
import ModalBg from './ModalBg';

const DeliverWorkModal: FC<IModalProps> = ({ order, onClose }): ReactElement => {
  const [description, setDescription] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showImagePreview, setShowImagePreview] = useState<boolean>(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [deliverOrder, { isLoading }] = useDeliverOrderMutation();

  const handleFileChange = (event: ChangeEvent): void => {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    if (target.files) {
      const file: File = target.files[0];
      if (!checkFile(file)) {
        setSelectedFile(file);
        setShowImagePreview(true);
      }
    }
  };

  const deliverWork = async (): Promise<void> => {
    try {
      const selectedWorkFile = selectedFile as File;
      const dataImage: string | ArrayBuffer | null = await readAsBase64(selectedWorkFile);
      const completedWork: IDeliveredWork = {
        message: description,
        file: dataImage as string,
        fileType: fileType(selectedWorkFile as File),
        fileSize: selectedWorkFile.size,
        fileName: selectedWorkFile.name
      };
      await deliverOrder({ orderId: `${order?.orderId}`, body: completedWork });
      showSuccessToast('Order delivered successfully.');
      if (onClose) {
        onClose();
      }
    } catch (error) {
      showErrorToast('Error deliverying order.');
    }
  };

  return (
    <ModalBg>
      <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
        {isLoading && (
          <div className="fixed inset-0 z-[140] flex items-center justify-center bg-background/80">
            <div className="flex flex-col items-center justify-center rounded-2xl bg-surface border border-default shadow-lg p-8">
              <FaCircleNotch className="animate-spin text-accent mb-2" size={40} />
              <span className="text-primary font-themeFont text-lg">Uploading...</span>
            </div>
          </div>
        )}
        <div className="w-full max-w-lg rounded-2xl bg-surface border border-default shadow-2xl p-6 text-primary font-themeFont transition-all duration-300">
          <div className="mb-4 w-full text-left border-b border-default pb-2">
            <h4 className="text-lg sm:text-xl font-bold font-themeFont text-primary leading-6">Deliver your work</h4>
            <p className="text-sm text-muted font-themeFont">Images, PDFs, Videos or Zip: Max. 1GB</p>
          </div>
          <div className="mb-6">
            <TextAreaInput
              className="w-full rounded-md border border-default bg-surface px-3 py-2.5 text-sm text-primary font-themeFont placeholder:text-muted transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              name="description"
              placeholder="Add a response to buyer..."
              value={description}
              rows={4}
              onChange={(event: ChangeEvent) => setDescription((event.target as HTMLTextAreaElement).value)}
            />
          </div>
          {showImagePreview ? (
            <div className="mb-6">
              <div className="flex items-center gap-4 rounded-md border border-default bg-background p-3">
                <div className="flex flex-col items-center justify-center h-20 w-24 rounded bg-surface border border-default">
                  <FaRegFile className="text-muted mb-2" size={28} />
                  <span className="w-24 truncate text-xs font-bold text-primary font-themeFont">{selectedFile?.name}</span>
                  <p className="text-xs text-muted font-themeFont">{bytesToSize(parseInt(`${selectedFile?.size}`))}</p>
                </div>
                <FaTimes
                  onClick={() => {
                    setSelectedFile(null);
                    setShowImagePreview(false);
                  }}
                  className="ml-2 cursor-pointer text-muted hover:text-primary transition-all duration-300"
                  size={20}
                />
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileRef?.current?.click()}
              className="mt-2 flex w-full sm:w-1/2 cursor-pointer gap-2 rounded-md bg-background border border-default px-4 py-2 items-center transition-all duration-300 hover:bg-surface"
            >
              <FaPaperclip className="text-accent" />
              <span className="text-sm text-primary font-themeFont">Upload work</span>
              <TextInput
                name="chatFile"
                ref={fileRef}
                type="file"
                style={{ display: 'none' }}
                onClick={() => {
                  if (fileRef?.current) {
                    fileRef.current.value = '';
                  }
                }}
                onChange={handleFileChange}
              />
            </div>
          )}
          <div className="flex justify-end gap-3 mt-6">
            <Button
              className="rounded-md bg-secondary px-6 py-3 text-center text-sm font-semibold font-themeFont text-on-primary transition-all duration-300 hover:bg-secondary focus:outline-none"
              label="Cancel"
              onClick={onClose}
            />
            <Button
              disabled={!description || !selectedFile}
              className={`rounded-md px-6 py-3 text-center text-sm font-semibold font-themeFont text-on-primary transition-all duration-300 ${
                !description || !selectedFile ? 'cursor-not-allowed bg-muted' : 'bg-primary hover:bg-primary focus:outline-none'
              }`}
              label="Deliver"
              onClick={deliverWork}
            />
          </div>
        </div>
      </div>
    </ModalBg>
  );
};

export default DeliverWorkModal;
