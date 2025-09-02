import { FC, ReactElement } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { IGigPaginateProps, ISellerGig } from 'src/features/gigs/interfaces/gig.interface';
import { v4 as uuidv4 } from 'uuid';

let itemOffset = 1;

const GigPaginate: FC<IGigPaginateProps> = ({
  gigs,
  totalGigs,
  showNumbers,
  itemsPerPage,
  setItemFrom,
  setPaginationType
}): ReactElement => {
  const paginationCount: number[] = [...Array(Math.ceil((totalGigs as number) / itemsPerPage)).keys()];

  return (
    <div className="flex w-full justify-center">
      <nav className="flex items-center gap-2">
        <button
          className={`flex items-center justify-center p-3 rounded-lg transition-all duration-300 ${
            itemOffset - 1 > 0
              ? 'border border-default text-primary hover:border-accent hover:bg-accent hover:text-on-primary shadow-sm'
              : 'cursor-not-allowed text-muted opacity-50 border border-default/30'
          }`}
          onClick={() => {
            if (itemOffset - 1 > 0) {
              itemOffset -= 1;
              setPaginationType('backward');
              const firstItem: ISellerGig = gigs[0];
              setItemFrom(`${firstItem.sortId}`);
            }
          }}
          disabled={itemOffset - 1 <= 0}
        >
          <FaArrowLeft className="text-sm" />
        </button>

        {showNumbers && (
          <div className="flex items-center gap-1 mx-2">
            {paginationCount.map((_, index: number) => (
              <button
                key={uuidv4()}
                className={`px-4 py-2 rounded-lg font-themeFont font-medium transition-all duration-300 ${
                  itemOffset === index + 1
                    ? 'bg-accent text-on-primary shadow-sm border border-accent'
                    : 'text-primary hover:text-accent hover:bg-accent/10 border border-default'
                }`}
                onClick={() => {
                  const selectedPage = index + 1;
                  itemOffset += 1;
                  if (itemOffset < index + 1) {
                    setPaginationType('forward');
                    setItemFrom(`${selectedPage * itemsPerPage - itemsPerPage}`);
                  } else if (itemOffset > index + 1) {
                    const selectedCount = selectedPage * itemsPerPage + 1;
                    setPaginationType('backward');
                    setItemFrom(`${selectedCount}`);
                  }
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}

        <button
          className={`flex items-center justify-center p-3 rounded-lg transition-all duration-300 ${
            itemOffset < paginationCount.length
              ? 'border border-default text-primary hover:border-accent hover:bg-accent hover:text-on-primary shadow-sm'
              : 'cursor-not-allowed text-muted opacity-50 border border-default/30'
          }`}
          onClick={() => {
            if (itemOffset + 1 <= paginationCount.length) {
              itemOffset += 1;
              setPaginationType('forward');
              const lastItem: ISellerGig = gigs[gigs.length - 1];
              setItemFrom(`${lastItem.sortId}`);
            }
          }}
          disabled={itemOffset >= paginationCount.length}
        >
          <FaArrowRight className="text-sm" />
        </button>
      </nav>
    </div>
  );
};

export default GigPaginate;
