import { FC, ReactElement, useContext } from 'react';
import { FaCircleNotch } from 'react-icons/fa';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { GigContext } from 'src/features/gigs/context/GigContext';

const GigLeftOverview: FC = (): ReactElement => {
  const { gig, isSuccess, isLoading } = useContext(GigContext);

  return (
    <div className="relative flex h-[400px] sm:h-[500px] lg:h-[600px] cursor-pointer justify-center bg-surface rounded-xl overflow-hidden border border-default shadow-sm group">
      {!isLoading && isSuccess && (
        <LazyLoadImage
          src={gig.coverImage}
          alt="Gig Cover Image"
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
          placeholderSrc="https://placehold.co/600x400?text=Gig+Image"
          effect="blur"
        />
      )}
      {isLoading && !isSuccess && (
        <div className="flex h-full w-full items-center justify-center bg-surface">
          <div className="flex flex-col items-center gap-4">
            <FaCircleNotch className="animate-spin text-4xl text-accent" />
            <span className="text-sm font-themeFont font-medium text-muted">Loading image...</span>
          </div>
        </div>
      )}

      {/* Subtle overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
};

export default GigLeftOverview;
