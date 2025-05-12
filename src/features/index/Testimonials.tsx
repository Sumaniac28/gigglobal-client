import { FC, ReactElement } from 'react';
import { homeReviews } from 'src/shared/utils/static-data';

const Testimonials: FC = (): ReactElement => {
  const items = [...homeReviews, ...homeReviews];
  return (
    <section className="bg-[#F9FAFB] py-10">
      {/* <h2 className="w-[90%] max-w-4xl mx-auto text-center text-2xl font-bold font-themeFont text-[#111111] sm:text-3xl mb-6">What Our Users Say</h2> */}

      <div className="relative overflow-hidden">
        <div className="flex animate-marquee space-x-6 px-6">
          {items.map((rev, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-[80%] sm:w-64 md:w-72 lg:w-80 rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <img src={rev.avatar} alt={rev.name} className="h-16 w-16 rounded-full object-cover ring-2 ring-[#14B8A6]" />
                <div>
                  <p className="font-semibold text-[#111111]">{rev.name}</p>
                  <p className="text-sm text-[#4B5563]">{rev.role}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-[#4B5563] leading-relaxed">“{rev.text}”</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
    @keyframes marquee {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-marquee {
      animation: marquee 25s linear infinite;
    }
  `}</style>
    </section>
  );
};

export default Testimonials;
