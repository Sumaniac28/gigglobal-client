import { FC, ReactElement } from 'react';
import { FaAngleRight, FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { IBreadCrumbProps } from 'src/shared/shared.interface';

const Breadcrumb: FC<IBreadCrumbProps> = ({ breadCrumbItems }): ReactElement => {
  return (
    <nav className="flex px-5 py-6 text-white bg-black border-b border-gray-300">
      <ol className="container mx-auto px-6 md:px-12 lg:px-6 inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-bold uppercase text-white hover:text-[#14B8A6] transition-colors duration-200"
          >
            <FaHome className="mr-2 h-4 w-4 text-white hover:text-[#14B8A6] transition-colors duration-200" />
            Home
          </Link>
        </li>

        {breadCrumbItems.map((item: string) => (
          <li key={uuidv4()} className="flex items-center">
            <FaAngleRight className="h-6 w-6 text-[#14B8A6]" />
            <a href="#" className="ml-1 text-sm font-bold uppercase text-white hover:text-[#0F766E] transition-colors duration-200 md:ml-2">
              {item}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
