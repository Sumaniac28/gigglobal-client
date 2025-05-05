import { FaGithub, FaLinkedin, FaMailBulk, FaPhone, FaTwitter } from 'react-icons/fa';

const Contact = () => {
  return (
    <section className="bg-[#0f0f0f] text-gray-100 px-4 py-6 sm:px-6 lg:px-8">
    <div className="max-w-2xl mx-auto space-y-4 text-center sm:text-left">
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-themeFont font-bold text-white">Contact Us</h2>
        <p className="text-sm text-gray-400 max-w-md mx-auto sm:mx-0">
          Got a project or just want to say hi? We'll reply in a few hours.
        </p>
      </div>
  
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-300">
        <div className="flex items-center gap-2">
          <FaMailBulk className="text-blue-500" />
          <span>contact@yourdomain.com</span>
        </div>
        <div className="flex items-center gap-2">
          <FaPhone className="text-blue-500" />
          <span>+1 234 567 890</span>
        </div>
      </div>
  
      <div className="flex justify-center sm:justify-start gap-3 pt-2">
        <a href="#" className="text-gray-400 hover:text-blue-400 transition">
          <FaTwitter size={14} />
        </a>
        <a href="#" className="text-gray-400 hover:text-blue-400 transition">
          <FaLinkedin size={14} />
        </a>
        <a href="#" className="text-gray-400 hover:text-blue-400 transition">
          <FaGithub size={14} />
        </a>
      </div>
    </div>
  </section>
  
  );
};

export default Contact;
