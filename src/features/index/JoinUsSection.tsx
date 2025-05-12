import { FC, ReactElement } from "react";

const JoinUsSection:FC = ():ReactElement => {
  return (
    <section className="w-full flex items-center justify-center px-6 py-12">
  <div className="max-w-6xl w-full text-center p-6 sm:p-10 bg-gradient-to-r from-[#14B8A6] to-[#0F766E] rounded-3xl shadow-lg border border-[#E5E7EB]">
    {/* Heading */}
    <h1 className="text-3xl sm:text-4xl md:text-5xl font-themeFont font-extrabold text-white leading-tight tracking-tight">
      Join Our Network of Talented Freelancers
    </h1>
    <p className="mt-4 text-[#E5E7EB] text-base sm:text-lg md:text-xl max-w-3xl mx-auto">
      Whether you're an expert or just getting started, our platform offers the tools, resources, and support you need to thrive.
    </p>

    {/* Join Us Button */}
    <div className="mt-6 sm:mt-8">
      <a
        href="/join"
        className="inline-block py-3 px-6 sm:px-8 text-white font-semibold text-lg sm:text-xl bg-black rounded-full"
      >
        Join Us Today
      </a>
    </div>
  </div>
</section>

  );
};

export default JoinUsSection;
