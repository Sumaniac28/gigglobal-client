import { FC, ReactElement, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { faqs } from 'src/shared/utils/static-data';

const IndexFAQ:FC = ():ReactElement => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="w-[90%] max-w-4xl mx-auto my-12">
      <h2 className="text-2xl font-bold font-themeFont text-center text-[#111111] sm:text-3xl mb-4">Frequently Asked Questions</h2>
      <p className="text-sm text-center text-[#4B5563] mb-8">Everything you need to know about working with freelancers on our platform.</p>

      <div className="divide-y divide-[#E5E7EB] border border-[#E5E7EB] rounded-xl bg-[#F9FAFB] overflow-hidden">
        {faqs.map((faq, index) => (
          <div key={index} className="group">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors duration-200 hover:bg-[#F3F4F6] focus:outline-none"
            >
              <span className="text-[#111111] font-medium">{faq.question}</span>
              {openIndex === index ? <FaChevronUp className="text-[#14B8A6]" /> : <FaChevronDown className="text-[#4B5563]" />}
            </button>

            <div
              className={`px-6 pb-4 text-sm text-[#4B5563] transition-all duration-300 ${
                openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 overflow-hidden opacity-0'
              }`}
            >
              {faq.answer}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default IndexFAQ;
