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
      bgColor: '#008080'
    },
    {
      total: shortenLargeNumbers(sellerProfile?.completedJobs),
      title: 'Completed Orders',
      bgColor: '#00BFA6'
    },
    {
      total: shortenLargeNumbers(sellerProfile?.ongoingJobs),
      title: 'Ongoing Orders',
      bgColor: '#4B0082'
    },
    {
      total: shortenLargeNumbers(sellerProfile?.ratingsCount),
      title: 'Ratings & Reviews',
      bgColor: '#008080'
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
        <div className="relative mt-6 mb-8 w-full">
          <div className="relative bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 rounded-2xl shadow-lg border border-gray-200/60 overflow-hidden">
            <div className="h-0.5 bg-gradient-to-r from-primary/60 via-accent/60 to-secondary/60"></div>

            <div className="p-4 sm:p-6 md:p-12">
              <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-12">
                <div className="flex-shrink-0 flex flex-col items-center md:items-start">
                  <div className="relative group">
                    <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 p-0.5 shadow-lg group-hover:shadow-xl transition-all duration-300">
                        <LazyLoadImage
                          src={sellerProfile?.profilePicture}
                          alt="Profile"
                          className="h-full w-full rounded-xl object-cover bg-white shadow-sm"
                          placeholderSrc="https://placehold.co/330x220?text=Profile+Image"
                          effect="blur"
                          wrapperClassName="w-full h-full rounded-xl overflow-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-4 md:mt-6 w-full max-w-xs space-y-2 sm:space-y-3">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 shadow-sm">
                      <div className="flex items-center justify-center gap-2 sm:gap-3">
                        <div className="flex items-center gap-1 p-1 sm:p-2">
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
                          <div className="flex flex-col items-center">
                            <span className="text-lg sm:text-xl font-bold text-amber-700">
                              {rating(sellerProfile.ratingSum / sellerProfile.ratingsCount)}
                            </span>
                            <span className="text-xs text-amber-600 font-medium">out of 5</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-4 sm:space-y-6 text-center md:text-left">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      {!showItemEdit.fullname && (
                        <div className="space-y-2 sm:space-y-3">
                          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-800 leading-tight tracking-tight">
                            {sellerProfile?.fullName}
                          </h1>
                          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3">
                            <div className="inline-flex items-center gap-2 bg-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-gray-200 shadow-sm">
                              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                              <span className="text-xs sm:text-sm font-medium text-slate-600">
                                @{lowerCase(`${sellerProfile?.username}`)}
                              </span>
                            </div>
                            <div className="inline-flex items-center gap-2 bg-emerald-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-emerald-200 shadow-sm">
                              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                              <span className="text-xs sm:text-sm font-medium text-emerald-700">Verified</span>
                            </div>
                          </div>
                        </div>
                      )}
                      {showItemEdit.fullname && (
                        <div className="space-y-4">
                          <Suspense>
                            <TextInput
                              className="w-full rounded-xl border-2 border-gray-200 bg-white px-5 py-4 text-xl font-semibold text-gray-900 placeholder:text-gray-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                              placeholder="Enter your full name"
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
                          <div className="flex gap-3">
                            <Suspense>
                              <Button
                                className="rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                                label="Update"
                                onClick={() => {
                                  if (sellerProfile && setSellerProfile) {
                                    setSellerProfile({ ...sellerProfile, fullName: sellerProfileItem.fullname });
                                    setShowItemEdit({ ...showItemEdit, fullname: false });
                                  }
                                }}
                              />
                              <Button
                                className="rounded-xl bg-gray-100 px-8 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200"
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
                    </div>
                    {showEditIcons && !showItemEdit.fullname && (
                      <FaPencilAlt
                        onClick={() => setShowItemEdit({ ...showItemEdit, fullname: !showItemEdit.fullname })}
                        className="cursor-pointer text-gray-400 hover:text-primary transition-colors p-2 hover:bg-gray-50 rounded-lg"
                      />
                    )}
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      {!showItemEdit.oneliner && (
                        <div className="bg-white/70 rounded-xl px-4 sm:px-6 py-3 sm:py-4 border border-gray-200/80 shadow-sm backdrop-blur-sm">
                          <p className="text-base sm:text-lg md:text-xl text-slate-700 leading-relaxed font-medium italic">
                            "{sellerProfile?.oneliner || 'Ready to bring your vision to life'}"
                          </p>
                        </div>
                      )}
                      {showItemEdit.oneliner && (
                        <div className="space-y-4">
                          <Suspense>
                            <div className="relative">
                              <TextInput
                                className="w-full rounded-xl border-2 border-gray-200 bg-white px-5 py-4 text-lg text-gray-900 placeholder:text-gray-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="Enter your tagline (max 70 characters)"
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
                              <div className="absolute bottom-3 right-4 text-xs text-gray-400">{sellerProfileItem.oneliner.length}/70</div>
                            </div>
                          </Suspense>
                          <div className="flex gap-3">
                            <Suspense>
                              <Button
                                className="rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                                label="Update"
                                onClick={() => {
                                  if (sellerProfile && setSellerProfile) {
                                    setSellerProfile({ ...sellerProfile, oneliner: sellerProfileItem.oneliner });
                                    setShowItemEdit({ ...showItemEdit, oneliner: false });
                                  }
                                }}
                              />
                              <Button
                                className="rounded-xl bg-gray-100 px-8 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200"
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
                    </div>
                    {showEditIcons && !showItemEdit.oneliner && (
                      <FaPencilAlt
                        className="cursor-pointer text-gray-400 hover:text-primary transition-colors p-2 hover:bg-gray-50 rounded-lg"
                        onClick={() => setShowItemEdit({ ...showItemEdit, oneliner: true, fullname: false })}
                      />
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    {sellerProfile?.recentDelivery && (
                      <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200 shadow-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-green-700">Recently active</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200 shadow-sm">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm font-medium text-blue-700">
                        Responds in{' '}
                        {sellerProfile?.responseTime
                          ? `${sellerProfile.responseTime} hour${sellerProfile.responseTime !== 1 ? 's' : ''}`
                          : '1 hour'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-lg border border-purple-200 shadow-sm">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-sm font-medium text-purple-700">
                        Member since {sellerProfile?.createdAt ? new Date(sellerProfile.createdAt).getFullYear() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {gridInfo.map((info: IGigInfo, index: number) => (
          <div
            key={uuidv4()}
            className={`group relative overflow-hidden rounded-xl px-6 py-6 text-on-primary shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 transform cursor-pointer ${
              index === 0
                ? 'bg-gradient-to-br from-primary to-primary/90 hover:from-primary/95 hover:to-primary'
                : index === 1
                  ? 'bg-gradient-to-br from-accent to-accent/90 hover:from-accent/95 hover:to-accent'
                  : index === 2
                    ? 'bg-gradient-to-br from-secondary to-secondary/90 hover:from-secondary/95 hover:to-secondary'
                    : 'bg-gradient-to-br from-primary/80 to-primary/70 hover:from-primary/85 hover:to-primary/75'
            }`}
          >
            <div className="absolute top-0 right-0 w-12 h-12 bg-white/10 rounded-full -translate-y-6 translate-x-6 group-hover:scale-125 transition-transform duration-300"></div>

            <div className="relative z-10 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-bold font-themeFont leading-none mb-2 group-hover:scale-105 transition-transform duration-200">
                {info.total}
              </span>
              <span className="text-xs font-medium opacity-90 leading-relaxed uppercase tracking-wide">{info.title}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProfileHeader;
