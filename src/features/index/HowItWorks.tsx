import { FC, ReactElement } from 'react';

const HowItWorks: FC = (): ReactElement => {
  const steps = [
    {
      title: 'Create an account',
      desc: 'Join the platform and set up your profile.'
    },
    {
      title: 'Browse Experts',
      desc: 'Find professionals who match your needs.'
    },
    {
      title: 'Contact Experts',
      desc: 'Start a conversation to discuss the project.'
    },
    {
      title: 'Collaborate',
      desc: 'Work directly with your chosen expert to deliver results.'
    }
  ];

  return (
    <section className="flex justify-center items-center px-6 py-16 bg-[#F9FAFB]">
      <div className="max-w-6xl w-full rounded-3xl overflow-hidden shadow-lg border border-[#E5E7EB] backdrop-blur-lg bg-gradient-to-r from-[#F9FAFB] via-white to-[#F9FAFB] grid grid-cols-1 md:grid-cols-2">
        {/* Text Column */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl font-themeFont font-extrabold mb-6 tracking-tight text-[#111111]">
            How <span className="text-[#14B8A6]">GigGlobal</span> works?
          </h2>
          <p className="text-lg md:text-xl mb-8 leading-relaxed text-[#4B5563]">
            Find quality scholars, experts, and freelancers for your next academic or business project.
          </p>

          <div className="relative">
            <div className="border-l border-[#E5E7EB] pl-[1.05rem] ml-3 space-y-10">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="absolute -left-7 top-1 w-6 h-6 rounded-full bg-[#14B8A6] text-white font-bold text-sm flex items-center justify-center shadow-md ring-2 ring-white/20">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-[#14B8A6] mb-1">{step.title}</h3>
                  <p className="text-[#4B5563]">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Image Column */}
        <div className="relative h-64 md:h-auto">
          <img src="/src/assets/HowItWorks.jpg" alt="How GigGlobal Works" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/40 to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
