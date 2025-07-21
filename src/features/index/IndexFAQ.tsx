import { FC, ReactElement, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { faqs } from 'src/shared/utils/static-data';

const IndexFAQ: FC = (): ReactElement => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="w-full bg-background py-12 md:py-16 lg:py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/2 via-transparent to-primary/2 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-themeFont font-bold text-primary mb-4 sm:mb-6 leading-tight tracking-tight">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent font-extrabold">
              Questions
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted leading-relaxed max-w-2xl mx-auto font-medium">
            Everything you need to know about working with freelancers on our platform.
          </p>

          {/* Decorative Line */}
          <div className="flex items-center justify-center mt-6 sm:mt-8">
            <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-accent/40"></div>
            <div className="mx-4 w-2 h-2 rounded-full bg-accent animate-pulse"></div>
            <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-accent/40"></div>
          </div>
        </div>

        {/* Enhanced FAQ Container */}
        <div className="bg-surface rounded-2xl lg:rounded-3xl border border-default shadow-xl backdrop-blur-sm relative overflow-hidden">
          {/* Subtle Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-accent/5 pointer-events-none"></div>

          <div className="divide-y divide-default relative z-10">
            {faqs.map((faq, index) => (
              <div key={index} className="group transition-all duration-300 ease-out relative">
                {/* FAQ Button */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-7 text-left 
                  transition-all duration-300 ease-out hover:bg-background/50 focus:outline-none 
                  focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-surface focus:bg-background/50 
                  group-hover:shadow-sm relative overflow-hidden"
                >
                  {/* Button Background Hover Effect */}
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-accent/5 via-primary/3 to-secondary/5 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"
                  ></div>

                  <span
                    className="text-primary font-themeFont font-semibold text-sm sm:text-base lg:text-lg 
                  leading-relaxed pr-4 transition-all duration-300 ease-out group-hover:text-accent relative z-10"
                  >
                    {faq.question}
                  </span>

                  <div className="flex-shrink-0 ml-2 relative z-10">
                    <div
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-background border border-default 
                    flex items-center justify-center transition-all duration-300 ease-out
                    group-hover:border-accent/40 group-hover:bg-accent/10 group-hover:scale-110"
                    >
                      {openIndex === index ? (
                        <FaChevronUp className="text-accent w-3 h-3 sm:w-4 sm:h-4 transition-all duration-300 ease-out" />
                      ) : (
                        <FaChevronDown
                          className="text-muted group-hover:text-accent w-3 h-3 sm:w-4 sm:h-4 
                        transition-all duration-300 ease-out group-hover:rotate-180"
                        />
                      )}
                    </div>
                  </div>
                </button>

                {/* FAQ Answer with Enhanced Animation */}
                <div
                  className={`transition-all duration-500 ease-out overflow-hidden ${
                    openIndex === index ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-4 sm:px-6 lg:px-8 pb-5 sm:pb-6 lg:pb-7">
                    {/* Enhanced Answer Container */}
                    <div className="relative">
                      {/* Left Border Accent */}

                      {/* Answer Content */}
                      <div className="pl-4 sm:pl-6 lg:pl-8 pr-2">
                        <p
                          className="text-xs sm:text-sm md:text-base text-muted leading-relaxed font-medium 
                          transition-all duration-300 ease-out"
                        >
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active State Indicator */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent to-primary 
                transition-all duration-300 ease-out ${openIndex === index ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'}`}
                ></div>
              </div>
            ))}
          </div>

          {/* Container Border Glow */}
          <div className="absolute inset-0 rounded-2xl lg:rounded-3xl ring-1 ring-accent/10 pointer-events-none"></div>
        </div>

        {/* Enhanced Decorative Bottom Elements */}
        <div className="flex justify-center mt-8 sm:mt-10 lg:mt-12">
          <div className="flex items-center space-x-4 px-6 py-3 bg-surface rounded-full border border-default shadow-lg backdrop-blur-sm">
            <div className="h-4 w-px bg-default"></div>

            <span className="text-xs font-medium text-muted font-themeFont">{faqs.length} Questions</span>
          </div>
        </div>

        {/* Background Corner Accents */}
        <div
          className="absolute top-8 left-8 w-16 h-16 bg-accent/5 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="absolute bottom-8 right-8 w-20 h-20 bg-primary/5 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: '3s' }}
        ></div>
        <div
          className="absolute top-1/3 right-12 w-12 h-12 bg-secondary/5 rounded-full blur-lg animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
      </div>
    </section>
  );
};

export default IndexFAQ;
