import { FC, ReactElement } from "react"
import { FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa"

const ContactFooter:FC = ():ReactElement => {
  return (
    <footer className="bg-primary text-on-primary">
      <div className="mx-auto w-[90%] max-w-7xl py-10 sm:py-12 lg:py-16 grid grid-cols-1 gap-8 sm:gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand & Mission */}
        <div className="lg:col-span-1">
          <h2 className="text-xl sm:text-2xl font-bold font-themeFont text-on-primary leading-7">GigGlobal</h2>
          <p className="mt-3 text-sm sm:text-base text-on-primary text-opacity-80 leading-6 font-medium">
            Connecting top talent with people who need things done — fast and professionally.
          </p>
        </div>

        {/* Explore Links */}
        <div>
          <h3 className="mb-4 text-sm font-bold font-themeFont text-on-primary uppercase tracking-wider leading-5">Explore</h3>
          <ul className="space-y-3 text-sm sm:text-base">
            <li>
              <a href="#" className="text-on-primary text-opacity-80 hover:text-accent hover:text-opacity-100 transition-all duration-300 font-medium leading-6 hover:translate-x-1 inline-block">
                About
              </a>
            </li>
            <li>
              <a href="#" className="text-on-primary text-opacity-80 hover:text-accent hover:text-opacity-100 transition-all duration-300 font-medium leading-6 hover:translate-x-1 inline-block">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="text-on-primary text-opacity-80 hover:text-accent hover:text-opacity-100 transition-all duration-300 font-medium leading-6 hover:translate-x-1 inline-block">
                FAQs
              </a>
            </li>
            <li>
              <a href="#" className="text-on-primary text-opacity-80 hover:text-accent hover:text-opacity-100 transition-all duration-300 font-medium leading-6 hover:translate-x-1 inline-block">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="mb-4 text-sm font-bold font-themeFont text-on-primary uppercase tracking-wider leading-5">Legal</h3>
          <ul className="space-y-3 text-sm sm:text-base">
            <li>
              <a href="#" className="text-on-primary text-opacity-80 hover:text-accent hover:text-opacity-100 transition-all duration-300 font-medium leading-6 hover:translate-x-1 inline-block">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="text-on-primary text-opacity-80 hover:text-accent hover:text-opacity-100 transition-all duration-300 font-medium leading-6 hover:translate-x-1 inline-block">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="mb-4 text-sm font-bold font-themeFont text-on-primary uppercase tracking-wider leading-5">Follow Us</h3>
          <div className="flex space-x-4 sm:space-x-6">
            <a 
              href="#" 
              className="text-on-primary text-opacity-80 hover:text-accent hover:text-opacity-100 transition-all duration-300 hover:scale-110 hover:-translate-y-1 p-2 rounded-full hover:bg-accent hover:bg-opacity-10 backdrop-blur-sm" 
              title="Follow us on Twitter"
            >
              <FaTwitter size={20} className="sm:w-6 sm:h-6" />
            </a>
            <a 
              href="#" 
              className="text-on-primary text-opacity-80 hover:text-accent hover:text-opacity-100 transition-all duration-300 hover:scale-110 hover:-translate-y-1 p-2 rounded-full hover:bg-accent hover:bg-opacity-10 backdrop-blur-sm" 
              title="Follow us on LinkedIn"
            >
              <FaLinkedin size={20} className="sm:w-6 sm:h-6" />
            </a>
            <a 
              href="#" 
              className="text-on-primary text-opacity-80 hover:text-accent hover:text-opacity-100 transition-all duration-300 hover:scale-110 hover:-translate-y-1 p-2 rounded-full hover:bg-accent hover:bg-opacity-10 backdrop-blur-sm" 
              title="Follow us on Instagram"
            >
              <FaInstagram size={20} className="sm:w-6 sm:h-6" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-on-primary border-opacity-20 py-4 sm:py-6 text-center">
        <p className="text-xs sm:text-sm text-on-primary text-opacity-60 font-medium leading-5">
          © {new Date().getFullYear()} GigGlobal. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default ContactFooter