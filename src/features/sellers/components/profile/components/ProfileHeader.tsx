import 'react-lazy-load-image-component/src/effects/blur.css';

import { ChangeEvent, FC, lazy, LazyExoticComponent, ReactElement, Suspense, useEffect, useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { IGigInfo } from 'src/features/gigs/interfaces/gig.interface';
import { IProfileHeaderProps, ISellerProfileItem, IShowEditItem } from 'src/features/sellers/interfaces/seller.interface';
import StarRating from 'src/shared/rating/StarRating';
import { lowerCase, rating, shortenLargeNumbers } from 'src/shared/utils/utils.service';
import { v4 as uuidv4 } from 'uuid';
import { IButtonProps, ITextInputProps } from 'src/shared/shared.interface';

const Button: LazyExoticComponent<FC<IButtonProps>> = lazy(() => import('src/shared/button/Button'));
const TextInput: LazyExoticComponent<FC<ITextInputProps>> = lazy(() => import('src/shared/inputs/TextInput'));

const ProfileHeader: FC<IProfileHeaderProps> = ({ sellerProfile, showHeaderInfo, showEditIcons, setSellerProfile }): ReactElement => {
  const [showItemEdit, setShowItemEdit] = useState<IShowEditItem>({
    fullname: false,
    oneliner: false
  });
  const [sellerProfileItem, setSellerProfileItem] = useState<ISellerProfileItem>({
    fullname: `${sellerProfile?.fullName}`,
    oneliner: `${sellerProfile?.oneliner}`
  });
  const gridInfo: IGigInfo[] = [
    {
      total: shortenLargeNumbers(sellerProfile?.totalGigs),
      title: 'Total Gigs',
      bgColor: '#50b5ff'
    },
    {
      total: shortenLargeNumbers(sellerProfile?.completedJobs),
      title: 'Completed Orders',
      bgColor: '#f7b124'
    },
    {
      total: shortenLargeNumbers(sellerProfile?.ongoingJobs),
      title: 'Ongoing Orders',
      bgColor: '#8553ee'
    },
    {
      total: shortenLargeNumbers(sellerProfile?.ratingsCount),
      title: 'Ratings & Reviews',
      bgColor: '#ff8b7b'
    }
  ];

  useEffect(() => {
    if (sellerProfile) {
      setSellerProfileItem({ ...sellerProfile, fullname: `${sellerProfile.fullName}`, oneliner: `${sellerProfile.oneliner}` });
    }
  }, [sellerProfile?.fullName, sellerProfile?.oneliner]);

  return (
    <>
      {showHeaderInfo && (
        <div className="mt-5 mb-5 w-full border border-[#333] bg-white px-6 py-8 shadow-lg backdrop-blur-md sm:px-10 md:px-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-start lg:items-center">
            <div className="mx-auto flex-shrink-0">
              <div className="h-24 w-24 md:h-28 md:w-28 lg:h-32 lg:w-32">
                <LazyLoadImage
                  src={sellerProfile?.profilePicture}
                  alt="Profile"
                  className="h-full w-full rounded-full object-cover shadow-lg"
                  placeholderSrc="https://placehold.co/330x220?text=Profile+Image"
                  effect="blur"
                  wrapperClassName="w-full h-full rounded-full"
                />
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-6">
              <div className="flex flex-col items-center text-center md:items-start md:text-left">
                <div className="flex items-center font-themeFont text-2xl font-semibold text-gray-900 sm:text-4xl">
                  {!showItemEdit.fullname && sellerProfile?.fullName}
                  {showEditIcons && !showItemEdit.fullname && (
                    <FaPencilAlt
                      onClick={() => setShowItemEdit({ ...showItemEdit, fullname: !showItemEdit.fullname })}
                      className="ml-2 cursor-pointer text-sm text-teal-600 hover:text-teal-500"
                    />
                  )}
                </div>

                {showItemEdit.fullname && (
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                    <Suspense>
                      <TextInput
                        className="w-full rounded border border-[#4B5563] bg-white p-2 text-sm text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none"
                        placeholder="Fullname"
                        type="text"
                        name="fullname"
                        value={sellerProfileItem.fullname}
                        onChange={(event: ChangeEvent) =>
                          setSellerProfileItem({
                            ...sellerProfileItem,
                            fullname: (event.target as HTMLInputElement).value
                          })
                        }
                      />
                    </Suspense>
                    <div className="flex gap-2">
                      <Suspense>
                        <Button
                          className="rounded bg-teal-500 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-600"
                          label="Update"
                          onClick={() => {
                            if (sellerProfile && setSellerProfile) {
                              setSellerProfile({ ...sellerProfile, fullName: sellerProfileItem.fullname });
                              setShowItemEdit({ ...showItemEdit, fullname: false });
                            }
                          }}
                        />
                        <Button
                          className="rounded bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
                          label="Cancel"
                          onClick={() => {
                            setSellerProfileItem({ ...sellerProfileItem, fullname: `${sellerProfile?.fullName}` });
                            setShowItemEdit({ ...showItemEdit, fullname: false });
                          }}
                        />
                      </Suspense>
                    </div>
                  </div>
                )}

                <span className="mt-1 text-lg text-gray-500">@{lowerCase(`${sellerProfile?.username}`)}</span>

                <div className="mt-1 flex items-center gap-2 text-xl text-gray-700">
                  {!showItemEdit.oneliner && sellerProfile?.oneliner}
                  {showEditIcons && !showItemEdit.oneliner && (
                    <FaPencilAlt
                      className="cursor-pointer text-sm text-teal-600 hover:text-teal-500"
                      onClick={() => setShowItemEdit({ ...showItemEdit, oneliner: true, fullname: false })}
                    />
                  )}
                </div>

                {showItemEdit.oneliner && (
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                    <Suspense>
                      <TextInput
                        className="w-full rounded border border-[#4B5563] bg-white p-2 text-sm text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none"
                        placeholder="Oneliner"
                        type="text"
                        name="oneliner"
                        value={sellerProfileItem.oneliner}
                        maxLength={70}
                        onChange={(event: ChangeEvent) =>
                          setSellerProfileItem({
                            ...sellerProfileItem,
                            oneliner: (event.target as HTMLInputElement).value
                          })
                        }
                      />
                    </Suspense>
                    <div className="flex gap-2">
                      <Suspense>
                        <Button
                          className="rounded bg-teal-500 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-600"
                          label="Update"
                          onClick={() => {
                            if (sellerProfile && setSellerProfile) {
                              setSellerProfile({ ...sellerProfile, oneliner: sellerProfileItem.oneliner });
                              setShowItemEdit({ ...showItemEdit, oneliner: false });
                            }
                          }}
                        />
                        <Button
                          className="rounded bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
                          label="Cancel"
                          onClick={() => {
                            setShowItemEdit({ ...showItemEdit, oneliner: false });
                            setSellerProfileItem({
                              ...sellerProfileItem,
                              oneliner: `${sellerProfile?.oneliner}`
                            });
                          }}
                        />
                      </Suspense>
                    </div>
                  </div>
                )}

                <div className="mt-3 flex items-center gap-2">
                  <div className="text-yellow-500">
                    <StarRating
                      value={
                        sellerProfile?.ratingSum && sellerProfile.ratingsCount
                          ? rating(sellerProfile.ratingSum / sellerProfile.ratingsCount)
                          : 0
                      }
                      size={16}
                    />
                  </div>
                  {sellerProfile?.ratingSum && sellerProfile.ratingsCount && (
                    <span className="rounded bg-orange-500 px-2 py-0.5 text-xs font-semibold text-gray-700">
                      {rating(sellerProfile.ratingSum / sellerProfile.ratingsCount)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {gridInfo.map((info: IGigInfo) => (
          <div
            key={uuidv4()}
            style={{ backgroundColor: info.bgColor }}
            className="flex flex-col items-center justify-center rounded-xl px-4 py-6 text-white shadow-md"
          >
            <span className="text-2xl font-bold">{info.total}</span>
            <span className="text-sm font-medium opacity-90">{info.title}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProfileHeader;
