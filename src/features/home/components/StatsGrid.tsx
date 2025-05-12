import { FaBolt, FaCheckCircle, FaRocket } from "react-icons/fa"

const StatsGrid = () => {
  return (
    <section className="mx-auto mt-10 w-[90%] max-w-7xl">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:grid-rows-5">
        {/* Large Left Block */}
        <div className="rounded-xl bg-black p-6 shadow-sm ring-1 ring-[#1F2937] lg:col-span-3 lg:row-span-3 lg:col-start-1 lg:row-start-1">
          <div className="flex flex-col justify-between h-full">
            <div className="flex items-center gap-4">
              <FaRocket className="text-3xl text-[#14B8A6]" />
              <h3 className="text-xl font-bold text-white sm:text-2xl">10K+ Gigs Sold</h3>
            </div>
            <p className="mt-2 text-sm text-[#D1D5DB]">
              Our global community has sold over 10,000 gigs across 100+ categories with trust and quality.
            </p>
          </div>
        </div>

        {/* Top Right Block */}
        <div className="rounded-xl bg-black p-6 shadow-sm ring-1 ring-[#1F2937] lg:col-span-2 lg:row-span-3 lg:col-start-4 lg:row-start-1">
          <div className="flex flex-col justify-between h-full">
            <div className="flex items-center gap-4">
              <FaBolt className="text-3xl text-[#14B8A6]" />
              <h3 className="text-xl font-bold text-white sm:text-2xl">Instant Delivery</h3>
            </div>
            <p className="mt-2 text-sm text-[#D1D5DB]">
              Get gigs delivered faster with our optimized gig workflow and smart automation.
            </p>
          </div>
        </div>

        {/* Bottom Full Width Block */}
        <div className="rounded-xl bg-black p-6 shadow-sm ring-1 ring-[#1F2937] lg:col-span-5 lg:row-span-2 lg:col-start-1 lg:row-start-4">
          <div className="flex flex-col justify-between h-full">
            <div className="flex items-center gap-4">
              <FaCheckCircle className="text-3xl text-[#14B8A6]" />
              <h3 className="text-xl font-bold text-white sm:text-2xl">Verified Quality</h3>
            </div>
            <p className="mt-2 text-sm text-[#D1D5DB]">
              Every gig goes through a manual quality check so you always get professional results you can rely on.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StatsGrid