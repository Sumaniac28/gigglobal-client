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
    <section className="flex justify-center items-center px-4 sm:px-6 lg:px-8 py-12 md:py-16 bg-background">
      <div className="max-w-6xl w-full rounded-2xl overflow-hidden shadow-lg border border-default bg-surface grid grid-cols-1 lg:grid-cols-2 transition-all duration-300">
        {/* Text Column */}
        <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center order-2 lg:order-1">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-themeFont font-bold mb-4 sm:mb-6 text-primary leading-tight">
            How <span className="text-accent">GigGlobal</span> works?
          </h2>
          <p className="text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed text-muted">
            Find quality scholars, experts, and freelancers for your next project.
          </p>

          <div className="relative">
            <div className="border-l-2 border-accent/30 pl-6 ml-4 space-y-6 sm:space-y-8">
              {steps.map((step, index) => (
                <div key={index} className="relative group">
                  <div className="absolute -left-10 top-1 w-7 h-7 rounded-full bg-primary text-on-primary font-bold text-sm flex items-center justify-center shadow-md ring-2 ring-surface transition-all duration-300 group-hover:bg-accent">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-themeFont font-semibold text-primary mb-2 group-hover:text-accent transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Image Column */}
        <div className="relative h-64 lg:h-auto order-1 lg:order-2">
          <img src="/src/assets/HowItWorks.jpg" alt="How GigGlobal Works" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />

          <div className="absolute bottom-4 left-4 px-3 py-2 bg-surface/90 backdrop-blur-sm rounded-lg border border-default shadow-sm">
            <p className="text-sm font-themeFont font-semibold text-primary">Join thousands of professionals</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
