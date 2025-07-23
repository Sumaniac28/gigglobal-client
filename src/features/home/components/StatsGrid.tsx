import { FaBolt, FaCheckCircle, FaRocket } from 'react-icons/fa';

const StatsGrid = () => {
  return (
    <section className="mx-auto mt-12 w-[92%] max-w-7xl bg-background px-2 sm:px-4">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:grid-rows-5">
        {/* Left Block */}
        <div className="rounded-2xl bg-surface p-6 shadow-lg ring-1 ring-border-default transition-all duration-300 hover:shadow-xl hover:ring-accent/30 backdrop-blur-sm lg:col-span-3 lg:row-span-3 lg:col-start-1 lg:row-start-1">
          <div className="flex flex-col justify-between h-full gap-6">
            <div className="flex items-center gap-4">
              <FaRocket className="text-4xl text-accent" />
              <h3 className="text-2xl sm:text-3xl font-themeFont font-bold text-primary">10K+ Gigs Sold</h3>
            </div>
            <p className="text-base leading-7 text-muted">
              Our global community has sold over <span className="text-primary font-semibold">10,000 gigs</span> across 100+ categories —
              trusted, vetted, and delivered with excellence.
            </p>
          </div>
        </div>

        {/* Right Block */}
        <div className="rounded-2xl bg-surface p-6 shadow-lg ring-1 ring-border-default transition-all duration-300 hover:shadow-xl hover:ring-accent/30 backdrop-blur-sm lg:col-span-2 lg:row-span-3 lg:col-start-4 lg:row-start-1">
          <div className="flex flex-col justify-between h-full gap-6">
            <div className="flex items-center gap-4">
              <FaBolt className="text-4xl text-accent" />
              <h3 className="text-2xl sm:text-3xl font-themeFont font-bold text-primary">Instant Delivery</h3>
            </div>
            <p className="text-base leading-7 text-muted">
              Experience lightning-fast turnaround with our streamlined workflow and{' '}
              <span className="text-primary font-semibold">smart automation</span> built for speed.
            </p>
          </div>
        </div>

        {/* Bottom Full Width Block */}
        <div className="rounded-2xl bg-surface p-6 shadow-lg ring-1 ring-border-default transition-all duration-300 hover:shadow-xl hover:ring-accent/30 backdrop-blur-sm lg:col-span-5 lg:row-span-2 lg:col-start-1 lg:row-start-4">
          <div className="flex flex-col justify-between h-full gap-6">
            <div className="flex items-center gap-4">
              <FaCheckCircle className="text-4xl text-accent" />
              <h3 className="text-2xl sm:text-3xl font-themeFont font-bold text-primary">Verified Quality</h3>
            </div>
            <p className="text-base leading-7 text-muted">
              Every gig undergoes a <span className="text-primary font-semibold">rigorous manual review</span> so you receive nothing less
              than professional-grade results — every single time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsGrid;
