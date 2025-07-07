import { FC, ReactElement, useContext } from 'react';
import { GigContext } from 'src/features/gigs/context/GigContext';
import { v4 as uuidv4 } from 'uuid';

const GigLeftAbout: FC = (): ReactElement => {
  const { gig } = useContext(GigContext);

  return (
    <>
      <div className="text-[#111111] font-semibold text-lg mt-10 pb-6">About This Gig</div>
      <div className="text-[#4B5563] pb-6">{gig.description}</div>
      <hr className="border-[#E5E7EB] my-3" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-4">
        <div className="flex flex-col">
          <span className="text-[#4B5563]">Main Categories</span>
          <span className="text-[#111111] font-normal">{gig.categories}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[#4B5563]">Sub Categories</span>
          <div className="flex flex-col">
            {gig?.subCategories.map((category: string, index: number) => (
              <span className="text-[#111111] font-normal" key={uuidv4()}>
                {`${category}${index !== gig.subCategories.length - 1 ? ',' : ''}`}&nbsp;
              </span>
            ))}
          </div>
        </div>
      </div>
      <hr className="border-[#E5E7EB] my-3" />
    </>
  );
};

export default GigLeftAbout;
