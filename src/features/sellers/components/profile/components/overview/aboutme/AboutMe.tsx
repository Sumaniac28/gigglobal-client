import { FC, ReactElement, useContext } from 'react';
import { FaMapMarkerAlt, FaRegClock, FaUserAlt } from 'react-icons/fa';
import { SellerContext } from 'src/features/sellers/context/SellerContext';
import { TimeAgo } from 'src/shared/utils/timeago.utils';

const AboutMe: FC = (): ReactElement => {
  const { sellerProfile } = useContext(SellerContext);

  return (
    <>
      {sellerProfile ? (
        <div className="mt-8 rounded-xl border border-default bg-surface shadow-sm overflow-hidden">
          {}
          <div className="flex items-center justify-between border-b border-default bg-background px-6 py-4">
            <h4 className="font-themeFont text-base font-bold text-primary md:text-lg tracking-wide">ABOUT ME</h4>
          </div>

          {}
          <ul className="list-none divide-y divide-default">
            {}
            <li className="flex justify-between items-start px-6 py-5 text-sm md:text-base hover:bg-background/50 transition-colors duration-200">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                  <FaMapMarkerAlt className="text-primary w-4 h-4" />
                </div>
                <span className="font-semibold text-primary">Location</span>
              </div>
              <div className="text-right">
                <span className="text-muted font-medium">{sellerProfile.country}</span>
              </div>
            </li>

            {}
            <li className="flex justify-between items-start px-6 py-5 text-sm md:text-base hover:bg-background/50 transition-colors duration-200">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                  <FaUserAlt className="text-primary w-4 h-4" />
                </div>
                <span className="font-semibold text-primary">Member since</span>
              </div>
              <div className="text-right">
                <span className="text-muted font-medium">{TimeAgo.formatDateToMonthAndYear(`${sellerProfile.createdAt}`)}</span>
              </div>
            </li>

            {}
            <li className="flex justify-between items-start px-6 py-5 text-sm md:text-base hover:bg-background/50 transition-colors duration-200">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                  <FaRegClock className="text-primary w-4 h-4" />
                </div>
                <span className="font-semibold text-primary">Avg. Response Time</span>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <span className="text-muted font-medium">
                    {sellerProfile.responseTime} hour{sellerProfile.responseTime === 1 ? '' : 's'}
                  </span>
                  {sellerProfile.responseTime <= 2 && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600 font-medium">Fast</span>
                    </div>
                  )}
                </div>
              </div>
            </li>
          </ul>
          <div className="bg-accent/5 border-t border-default px-6 py-4">
            <div className="flex items-center gap-2 text-xs text-muted">
              <svg className="w-3 h-3 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Verified profile information</span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default AboutMe;
