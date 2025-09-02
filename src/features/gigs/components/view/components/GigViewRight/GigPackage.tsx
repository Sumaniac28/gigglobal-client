import { FC, ReactElement, useContext, useState } from 'react';
import { FaArrowRight, FaRegClock } from 'react-icons/fa';
import { createSearchParams, NavigateFunction, useNavigate } from 'react-router-dom';
import { GigContext } from 'src/features/gigs/context/GigContext';
import { IOffer } from 'src/features/order/interfaces/order.interface';
import Button from 'src/shared/button/Button';
import ApprovalModal from 'src/shared/modals/ApprovalModal';
import { IApprovalModalContent } from 'src/shared/modals/interfaces/modal.interface';
import { useAppSelector } from 'src/store/store';

const GigPackage: FC = (): ReactElement => {
  const authUser = useAppSelector((state) => state.authUser);
  const { gig } = useContext(GigContext);
  const [approvalModalContent, setApprovalModalContent] = useState<IApprovalModalContent>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const navigate: NavigateFunction = useNavigate();

  const continueToCheck = () => {
    const deliveryInDays: number = parseInt(gig.expectedDelivery.split(' ')[0]);
    const newDate: Date = new Date();
    newDate.setDate(newDate.getDate() + deliveryInDays);
    const offerParams: IOffer = {
      gigTitle: gig.title,
      description: gig.basicDescription,
      price: gig.price,
      deliveryInDays,
      oldDeliveryDate: `${newDate}`,
      newDeliveryDate: `${newDate}`,
      accepted: false,
      cancelled: false
    };
    navigate(`/gig/checkout/${gig.id}?${createSearchParams({ offer: JSON.stringify(offerParams) })}`, { state: gig });
  };

  return (
    <>
      {showModal && <ApprovalModal approvalModalContent={approvalModalContent} hideCancel={true} onClick={() => setShowModal(false)} />}
      <div className="bg-surface rounded-xl border border-default shadow-sm overflow-hidden">
        {/* Price Header */}
        <div className="bg-primary px-6 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-on-primary/80">Starting at</span>
            <h4 className="text-xl font-themeFont font-bold text-on-primary">${gig.price}</h4>
          </div>
        </div>

        {/* Package Content */}
        <div className="p-6 space-y-4">
          <div>
            <h5 className="text-lg font-themeFont font-bold text-primary mb-2">{gig.basicTitle}</h5>
            <p className="text-sm text-muted leading-relaxed">{gig.basicDescription}</p>
          </div>

          <div className="flex items-center gap-3 p-3 bg-accent/5 rounded-lg border border-accent/20">
            <FaRegClock className="text-accent text-lg" />
            <span className="text-sm font-themeFont font-semibold text-primary">{gig.expectedDelivery}</span>
          </div>

          <Button
            disabled={authUser.username === gig.username}
            className={`w-full flex items-center justify-center gap-3 rounded-lg px-6 py-4 font-themeFont font-semibold text-base transition-all duration-300 ${
              authUser.username === gig.username
                ? 'bg-muted/20 text-muted cursor-not-allowed'
                : 'bg-primary hover:bg-primary/90 text-on-primary shadow-sm hover:shadow-md transform hover:scale-[1.02]'
            }`}
            label={
              <>
                <span>Continue to Order</span>
                <FaArrowRight className="text-sm" />
              </>
            }
            onClick={() => {
              if (authUser && !authUser.emailVerified) {
                setApprovalModalContent({
                  header: 'Email Verification Notice',
                  body: 'Please verify your email before you continue.',
                  btnText: 'OK',
                  btnColor: 'bg-primary hover:bg-primary/90'
                });
                setShowModal(true);
              } else {
                continueToCheck();
              }
            }}
          />

          {authUser.username === gig.username && (
            <p className="text-xs text-muted text-center">You cannot order your own gig</p>
          )}
        </div>
      </div>
    </>
  );
};

export default GigPackage;
