import { FC, ReactElement, useContext, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ChatBox from 'src/features/chat/components/chatbox/ChatBox';
import { IChatBuyerProps, IChatSellerProps } from 'src/features/chat/interfaces/chat.interface';
import { GigContext } from 'src/features/gigs/context/GigContext';
import { ILanguage } from 'src/features/sellers/interfaces/seller.interface';
import Button from 'src/shared/button/Button';
import ApprovalModal from 'src/shared/modals/ApprovalModal';
import { IApprovalModalContent } from 'src/shared/modals/interfaces/modal.interface';
import StarRating from 'src/shared/rating/StarRating';
import { TimeAgo } from 'src/shared/utils/timeago.utils';
import { lowerCase, rating, shortenLargeNumbers } from 'src/shared/utils/utils.service';
import { useAppSelector } from 'src/store/store';
import { v4 as uuidv4 } from 'uuid';

const GigSeller: FC = (): ReactElement => {
  const authUser = useAppSelector((state) => state.authUser);
  const buyer = useAppSelector((state) => state.buyer);
  const { gig, seller } = useContext(GigContext);
  const [approvalModalContent, setApprovalModalContent] = useState<IApprovalModalContent>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showChatBox, setShowChatBox] = useState<boolean>(false);
  const chatSeller: IChatSellerProps = {
    username: `${seller.username}`,
    _id: `${seller._id}`,
    profilePicture: `${seller.profilePicture}`,
    responseTime: parseInt(`${seller.responseTime}`)
  };
  const chatBuyer: IChatBuyerProps = {
    username: `${buyer.username}`,
    _id: `${buyer._id}`,
    profilePicture: `${buyer.profilePicture}`
  };

  return (
    <>
      {showModal && <ApprovalModal approvalModalContent={approvalModalContent} hideCancel={true} onClick={() => setShowModal(false)} />}
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-themeFont font-bold text-primary mb-4">About The Seller</h4>

          <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
            <img
              className="h-20 w-20 rounded-full object-cover ring-2 ring-accent/20 shadow-sm"
              src={gig.profilePicture}
              alt="Seller profile"
            />

            <div className="flex-1 text-center sm:text-left space-y-2">
              <Link
                to={`/seller_profile/${lowerCase(`${gig.username}`)}/${gig.sellerId}/view`}
                className="block hover:underline decoration-accent/50 transition-colors duration-300"
              >
                <span className="text-lg font-themeFont font-bold text-primary hover:text-accent">{gig.username}</span>
              </Link>

              <p className="text-sm text-muted leading-relaxed">{seller.oneliner}</p>

              <div className="flex items-center justify-center sm:justify-start gap-2">
                <div className="flex items-center">
                  <StarRating value={rating(parseInt(`${gig.ratingSum}`) / parseInt(`${gig.ratingsCount}`))} size={16} />
                </div>
                <span className="text-sm font-semibold text-accent">
                  ({shortenLargeNumbers(gig?.ratingsCount)} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-default pt-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-muted font-medium">From</span>
              <p className="font-themeFont font-semibold text-primary">{seller.country}</p>
            </div>

            <div className="space-y-1">
              <span className="text-muted font-medium">Member since</span>
              <p className="font-themeFont font-semibold text-primary">{TimeAgo.formatDateToMonthAndYear(`${seller.createdAt}`)}</p>
            </div>

            <div className="space-y-1">
              <span className="text-muted font-medium">Avg. response time</span>
              <p className="font-themeFont font-semibold text-primary">
                {seller.responseTime} hour{seller.responseTime > 1 ? 's' : ''}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-muted font-medium">Languages</span>
              <div className="flex flex-wrap gap-1">
                {seller?.languages?.map((language: ILanguage) => (
                  <span
                    key={uuidv4()}
                    className="px-2 py-1 bg-accent/10 border border-accent/30 rounded-full text-xs font-medium text-primary"
                  >
                    {language.language}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-default pt-6">
          <Button
            disabled={authUser.username === gig.username}
            className={`w-full flex items-center justify-center gap-3 rounded-lg px-6 py-3 font-themeFont font-semibold transition-all duration-300 ${
              authUser.username === gig.username
                ? 'bg-muted/20 text-muted cursor-not-allowed'
                : 'bg-accent hover:bg-accent/90 text-on-primary shadow-sm hover:shadow-md transform hover:scale-[1.02]'
            }`}
            label={
              <>
                <span>Contact Seller</span>
                <FaArrowRight className="text-sm" />
              </>
            }
            onClick={() => {
              if (authUser && !authUser.emailVerified) {
                setApprovalModalContent({
                  header: 'Email Verification Notice',
                  body: 'Please verify your email before you continue.',
                  btnText: 'OK',
                  btnColor: 'bg-accent hover:bg-accent/90'
                });
                setShowModal(true);
              } else {
                setShowChatBox((item: boolean) => !item);
              }
            }}
          />

          {authUser.username === gig.username && (
            <p className="text-xs text-muted text-center mt-2">This is your own gig</p>
          )}
        </div>

        {showChatBox && (
          <div className="border-t border-default pt-6">
            <ChatBox seller={chatSeller} buyer={chatBuyer} gigId={`${gig.id}`} onClose={() => setShowChatBox(false)} />
          </div>
        )}
      </div>
    </>
  );
};

export default GigSeller;
