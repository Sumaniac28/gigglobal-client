import { FC, ReactElement, useContext } from 'react';
import { FaMapMarkerAlt, FaRegClock, FaUserAlt } from 'react-icons/fa';
import { SellerContext } from 'src/features/sellers/context/SellerContext';
import { TimeAgo } from 'src/shared/utils/timeago.utils';

const AboutMe: FC = (): ReactElement => {
  const { sellerProfile } = useContext(SellerContext);

  return (
    <>
      {sellerProfile ? (
        <div className="mt-6 rounded-md border border-[#D1D5DB] bg-white">
          <div className="flex items-center justify-between border-b border-[#D1D5DB] px-4 py-3">
            <h4 className="text-sm font-bold text-[#111111] md:text-base">ABOUT ME</h4>
          </div>

          <ul className="list-none divide-y divide-[#D1D5DB]">
            <li className="flex justify-between items-start px-4 py-3 text-sm text-[#4B5563] md:text-base">
              <div className="flex items-start gap-2">
                <FaMapMarkerAlt className="mt-0.5 text-[#14B8A6]" />
                <span className="font-bold text-[#111111]">From</span>
              </div>
              <div>{sellerProfile.country}</div>
            </li>

            <li className="flex justify-between items-start px-4 py-3 text-sm text-[#4B5563] md:text-base">
              <div className="flex items-start gap-2">
                <FaUserAlt className="mt-0.5 text-[#14B8A6]" />
                <span className="font-bold text-[#111111]">Member since</span>
              </div>
              <div>{TimeAgo.formatDateToMonthAndYear(`${sellerProfile.createdAt}`)}</div>
            </li>

            <li className="flex justify-between items-start px-4 py-3 text-sm text-[#4B5563] md:text-base">
              <div className="flex items-start gap-2">
                <FaRegClock className="mt-0.5 text-[#14B8A6]" />
                <span className="font-bold text-[#111111]">Avg. Response Time</span>
              </div>
              <div>
                {sellerProfile.responseTime} hour
                {sellerProfile.responseTime === 1 ? '' : 's'}
              </div>
            </li>
          </ul>
        </div>
      ) : null}
    </>
  );
};

export default AboutMe;
