import { FC, lazy, ReactElement, Suspense, useRef } from 'react';
import { useParams } from 'react-router-dom';
import StickyBox from 'react-sticky-box';
import { ISellerDocument } from 'src/features/sellers/interfaces/seller.interface';
import { useGetSellerByIdQuery } from 'src/features/sellers/services/seller.service';
import CircularPageLoader from 'src/shared/page-loader/CircularPageLoader';
import { emptyGigData, emptySellerData } from 'src/shared/utils/static-data';
import { rating } from 'src/shared/utils/utils.service';
import { shortenLargeNumbers } from '../../../../shared/utils/utils.service';
import { GigContext } from 'src/features/gigs/context/GigContext';
import { ISellerGig } from '../../interfaces/gig.interface';
import { useGetGigByIdQuery, useGetMoreGigsLikeThisQuery } from '../../services/gigs.service';

const GigViewLeft = lazy(() => import('./components/GigViewLeft'));
const GigViewRight = lazy(() => import('./components/GigViewRight'));
const TopGigsView = lazy(() => import('src/shared/gigs/TopGigsView'));
const StarRating = lazy(() => import('src/shared/rating/StarRating'));

const GigView: FC = (): ReactElement => {
  const { gigId, sellerId } = useParams<string>();
  const { data: gigData, isSuccess: isGigDataSuccess, isLoading: isGigLoading } = useGetGigByIdQuery(`${gigId}`);
  const { data: sellerData, isSuccess: isSellerDataSuccess, isLoading: isSellerLoading } = useGetSellerByIdQuery(`${sellerId}`);
  const { data: moreGigsData, isSuccess: isMoreGigsSuccess, isLoading: isMoreGigsLoading } = useGetMoreGigsLikeThisQuery(`${gigId}`);
  const gig = useRef<ISellerGig>(emptyGigData);
  const seller = useRef<ISellerDocument>(emptySellerData);
  const moreGigs = useRef<ISellerGig[]>([]);

  const isLoading = isGigLoading && isSellerLoading && isMoreGigsLoading;

  if (isGigDataSuccess) {
    gig.current = gigData.gig as ISellerGig;
  }

  if (isSellerDataSuccess) {
    seller.current = sellerData.seller as ISellerDocument;
  }

  if (isMoreGigsSuccess) {
    moreGigs.current = moreGigsData.gigs as ISellerGig[];
  }

  return (
    <>
      {isLoading ? (
        <CircularPageLoader />
      ) : (
        <div className="min-h-screen bg-background">
          <main className="max-w-7xl container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {/* Hero Header Section */}
            <div className="mb-12">
              <div className="space-y-8">
                {/* Gig Title */}
                <div className="text-center lg:text-left">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-themeFont font-bold text-primary leading-tight tracking-tight mb-4">
                    {gig.current.title}
                  </h1>
                </div>

                {/* Seller Info Card */}
                <div className="bg-surface rounded-2xl border border-default shadow-lg p-6 lg:p-8 transition-all duration-300 hover:shadow-xl backdrop-blur-sm">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 lg:gap-8">
                    {/* Profile Image */}
                    <div className="flex-shrink-0">
                      <img
                        className="h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 rounded-full object-cover ring-4 ring-accent/20 shadow-xl transition-all duration-300 hover:ring-accent/40 hover:scale-105"
                        src={gig.current.profilePicture}
                        alt="Seller profile"
                      />
                    </div>

                    {/* Seller Details */}
                    <div className="flex-1 text-center sm:text-left space-y-4">
                      <div className="space-y-2">
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-themeFont font-bold text-primary">
                          {gig.current.username}
                        </h2>
                        <p className="text-sm sm:text-base text-muted leading-relaxed">
                          {seller.current.oneliner}
                        </p>
                      </div>

                      {/* Rating Section */}
                      {gig.current.ratingSum && gig.current.ratingsCount && gig.current.ratingSum >= 1 && gig.current.ratingsCount >= 1 && (
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                          <div className="flex items-center gap-3 bg-accent/10 px-5 py-3 rounded-full border border-accent/30 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="flex items-center">
                              <Suspense fallback={<div className="w-28 h-6 bg-muted/20 animate-pulse rounded" />}>
                                <StarRating value={rating(gig.current.ratingSum / gig.current.ratingsCount)} size={20} />
                              </Suspense>
                            </div>
                            <div className="flex items-center gap-2 text-sm lg:text-base">
                              <span className="font-themeFont font-bold text-accent">
                                {rating(gig.current.ratingSum / gig.current.ratingsCount) || '5.0'}
                              </span>
                              <span className="text-muted font-medium">
                                ({shortenLargeNumbers(gig.current.ratingsCount)} reviews)
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <GigContext.Provider
              value={{
                gig: gig.current,
                seller: seller.current,
                isSuccess: isGigDataSuccess,
                isLoading: isGigLoading
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 xl:gap-16">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 order-2 lg:order-1">
                  <Suspense fallback={
                    <div className="space-y-8">
                      <div className="w-full h-96 bg-surface animate-pulse rounded-2xl border border-default shadow-sm" />
                      <div className="w-full h-64 bg-surface animate-pulse rounded-2xl border border-default shadow-sm" />
                      <div className="w-full h-48 bg-surface animate-pulse rounded-2xl border border-default shadow-sm" />
                    </div>
                  }>
                    <GigViewLeft />
                  </Suspense>
                </div>

                {/* Right Column - Sidebar */}
                <div className="lg:col-span-1 order-1 lg:order-2">
                  <StickyBox offsetTop={40} offsetBottom={40}>
                    <Suspense fallback={
                      <div className="space-y-6">
                        <div className="w-full h-80 bg-surface animate-pulse rounded-2xl border border-default shadow-sm" />
                        <div className="w-full h-56 bg-surface animate-pulse rounded-2xl border border-default shadow-sm" />
                        <div className="w-full h-40 bg-surface animate-pulse rounded-2xl border border-default shadow-sm" />
                      </div>
                    }>
                      <GigViewRight />
                    </Suspense>
                  </StickyBox>
                </div>
              </div>
            </GigContext.Provider>

            {/* Related Gigs Section */}
            {moreGigs.current.length > 0 && (
              <div className="mt-20 lg:mt-24">
                <div className="bg-surface rounded-2xl border border-default shadow-lg p-8 lg:p-10 transition-all duration-300 hover:shadow-xl">
                  <div className="mb-8">
                    <h3 className="text-2xl lg:text-3xl font-themeFont font-bold text-primary mb-3">
                      Recommended for you
                    </h3>
                    <p className="text-muted font-medium leading-6">
                      Discover more amazing services from talented freelancers in our marketplace
                    </p>
                  </div>

                  <Suspense fallback={
                    <div className="space-y-6">
                      <div className="w-64 h-8 bg-muted/20 animate-pulse rounded" />
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="w-full h-72 bg-muted/10 animate-pulse rounded-xl border border-default" />
                        ))}
                      </div>
                    </div>
                  }>
                    <TopGigsView
                      gigs={moreGigs.current}
                      title=""
                      subTitle=""
                      width="w-80"
                      type="home"
                    />
                  </Suspense>
                </div>
              </div>
            )}
          </main>
        </div>
      )}
    </>
  );
};

export default GigView;
