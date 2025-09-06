import { FC, ReactElement } from 'react';

import Button from '../button/Button';
import { IApprovalModalContent, IModalProps } from './interfaces/modal.interface';
import ModalBg from './ModalBg';

const ApprovalModal: FC<IModalProps> = ({ approvalModalContent, hideCancel = false, onClick, onClose }): ReactElement => {
  const { header, body, btnText, btnColor } = approvalModalContent as IApprovalModalContent;

  return (
    <ModalBg>
      <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
        <div className="relative w-full max-w-md rounded-2xl bg-surface border border-default shadow-2xl p-6 text-primary font-themeFont transition-all duration-300">
          <div className="mb-4 border-b border-default pb-2">
            <h4 className="text-lg sm:text-xl font-bold font-themeFont text-primary leading-6 tracking-tight">{header}</h4>
          </div>
          <div className="mb-6 text-base text-muted font-themeFont leading-6">{body}</div>
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            {!hideCancel && (
              <Button
                className="rounded-md bg-secondary px-6 py-3 text-center text-sm font-semibold font-themeFont text-on-primary transition-all duration-300 hover:bg-secondary focus:outline-none"
                label="Cancel"
                onClick={onClose}
              />
            )}
            <Button
              className={`rounded-md px-6 py-3 text-center text-sm font-semibold font-themeFont text-on-primary transition-all duration-300 ${btnColor || 'bg-primary'} hover:bg-primary focus:outline-none`}
              label={`${btnText}`}
              onClick={onClick}
            />
          </div>
        </div>
      </div>
    </ModalBg>
  );
};

export default ApprovalModal;
