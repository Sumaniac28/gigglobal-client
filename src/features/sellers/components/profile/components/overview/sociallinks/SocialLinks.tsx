import { FC, lazy, LazyExoticComponent, ReactElement, Suspense, useContext, useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { SellerContext } from 'src/features/sellers/context/SellerContext';
import { v4 as uuidv4 } from 'uuid';

import { ISocialEditLinksProps } from 'src/features/sellers/interfaces/seller.interface';

const SocialLinksEditField: LazyExoticComponent<FC<ISocialEditLinksProps>> = lazy(
  () => import('src/features/sellers/components/profile/components/overview/sociallinks/SocialLinksEditField')
);

const SocialLinks: FC = (): ReactElement => {
  const [showSocialLinkAddForm, setShowSocialLinkAddForm] = useState<boolean>(false);
  const [showSocialLinkEditForm, setShowSocialLinkEditForm] = useState<boolean>(false);
  const [selectedSocialLink, setSelectedSocialLink] = useState<string>();
  const { sellerProfile, showEditIcons } = useContext(SellerContext);

  return (
    <div className="mt-6 rounded-md border border-[#D1D5DB] bg-white">
      <div className="flex items-center justify-between border-b border-[#D1D5DB] px-4 py-3">
        <h4 className="text-sm font-bold text-[#111111] md:text-base">SOCIAL LINKS</h4>
        {showEditIcons && (
          <span
            onClick={() => {
              setShowSocialLinkAddForm(!showSocialLinkAddForm);
              setShowSocialLinkEditForm(false);
            }}
            className="cursor-pointer text-sm text-[#14B8A6] hover:text-[#0F766E] md:text-base"
          >
            Add New
          </span>
        )}
      </div>

      <ul className="list-none divide-y divide-[#D1D5DB]">
        {showSocialLinkAddForm && (
          <li className="px-4 py-3">
            <Suspense>
              <SocialLinksEditField type="add" setShowSocialLinksAddForm={setShowSocialLinkAddForm} />
            </Suspense>
          </li>
        )}

        {!showSocialLinkAddForm && sellerProfile.socialLinks.length > 0 && (
          <>
            {sellerProfile.socialLinks.map((link: string) => (
              <li key={uuidv4()} className="flex items-center justify-between px-4 py-3 text-sm text-[#4B5563] md:text-base">
                {!showSocialLinkEditForm && (
                  <div className="flex items-center">
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#14B8A6] hover:text-[#0F766E] hover:underline"
                    >
                      {link}
                    </a>
                  </div>
                )}

                {showSocialLinkEditForm && selectedSocialLink === link && (
                  <SocialLinksEditField
                    type="edit"
                    selectedLink={selectedSocialLink}
                    setShowSocialLinksEditForm={setShowSocialLinkEditForm}
                  />
                )}

                {!showSocialLinkEditForm && showEditIcons && (
                  <div className="text-[#14B8A6] hover:text-[#0F766E]">
                    <FaPencilAlt
                      onClick={() => {
                        setSelectedSocialLink(link);
                        setShowSocialLinkAddForm(false);
                        setShowSocialLinkEditForm(!showSocialLinkEditForm);
                      }}
                      size="14"
                      className="cursor-pointer"
                    />
                  </div>
                )}
              </li>
            ))}
          </>
        )}

        {!sellerProfile?.socialLinks.length && <li className="px-4 py-3 text-sm text-[#4B5563]">No information</li>}
      </ul>
    </div>
  );
};

export default SocialLinks;
