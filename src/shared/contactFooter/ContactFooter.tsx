import { FC, ReactElement } from "react"
import { FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa"

const ContactFooter:FC = ():ReactElement => {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto w-[90%] max-w-7xl py-10 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
        {/* Brand & Mission */}
        <div>
          <h2 className="text-xl font-bold font-themeFont text-white">GigGlobal</h2>
          <p className="mt-2 text-sm text-[#D1D5DB]">
            Connecting top talent with people who need things done — fast and professionally.
          </p>
        </div>

        {/* Explore Links */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-white uppercase tracking-wider">Explore</h3>
          <ul className="space-y-2 text-sm text-[#D1D5DB]">
            <li><a href="#" className="hover:text-[#14B8A6]">About</a></li>
            <li><a href="#" className="hover:text-[#14B8A6]">Blog</a></li>
            <li><a href="#" className="hover:text-[#14B8A6]">FAQs</a></li>
            <li><a href="#" className="hover:text-[#14B8A6]">Contact</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-white uppercase tracking-wider">Legal</h3>
          <ul className="space-y-2 text-sm text-[#D1D5DB]">
            <li><a href="#" className="hover:text-[#14B8A6]">Terms of Service</a></li>
            <li><a href="#" className="hover:text-[#14B8A6]">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-white uppercase tracking-wider">Follow Us</h3>
          <div className="flex space-x-5 text-[#D1D5DB]">
            <a href="#" className="hover:text-[#14B8A6]" title="Follow us on Twitter"><FaTwitter size={20} /></a>
            <a href="#" className="hover:text-[#14B8A6]" title="Follow us on LinkedIn"><FaLinkedin size={20} /></a>
            <a href="#" className="hover:text-[#14B8A6]" title="Follow us on Instagram"><FaInstagram size={20} /></a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-[#4B5563] py-4 text-center text-xs text-[#D1D5DB]">
        © {new Date().getFullYear()} GigGlobal. All rights reserved.
      </div>
    </footer>
  )
}

export default ContactFooter