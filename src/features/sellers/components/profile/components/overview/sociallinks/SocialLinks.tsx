import { FC, lazy, ReactElement, Suspense, useContext, useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { SellerContext } from 'src/features/sellers/context/SellerContext';
import { v4 as uuidv4 } from 'uuid';

const SocialLinksEditField = lazy(
  () => import('./SocialLinksEditField')
);

const SocialLinks: FC = (): ReactElement => {
  const [showSocialLinkAddForm, setShowSocialLinkAddForm] = useState<boolean>(false);
  const [showSocialLinkEditForm, setShowSocialLinkEditForm] = useState<boolean>(false);
  const [selectedSocialLink, setSelectedSocialLink] = useState<string>();
  const { sellerProfile, showEditIcons } = useContext(SellerContext);

  return (
    <div className="mt-8 rounded-lg border border-default bg-surface shadow-sm">
      <div className="flex items-center justify-between border-b border-default px-6 py-4 bg-background rounded-t-lg">
        <h4 className="text-lg font-bold font-themeFont text-primary leading-6 md:text-xl">SOCIAL LINKS</h4>
        {showEditIcons && !showSocialLinkAddForm && (
          <button
            onClick={() => {
              setShowSocialLinkAddForm(!showSocialLinkAddForm);
              setShowSocialLinkEditForm(false);
            }}
            className="inline-flex items-center px-4 py-2 text-sm font-semibold font-themeFont text-primary bg-accent hover:bg-accent rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 shadow-sm hover:shadow-md md:text-base"
          >
            <span className="text-on-primary">+ Add New</span>
          </button>
        )}
      </div>

      <ul className="list-none divide-y divide-default">
        {showSocialLinkAddForm && (
          <li className="px-6 py-6 bg-background">
            <Suspense>
              <SocialLinksEditField type="add" setShowSocialLinksAddForm={setShowSocialLinkAddForm} />
            </Suspense>
          </li>
        )}

        {!showSocialLinkAddForm &&
          sellerProfile.socialLinks.map((link: string) => (
            <li
              key={uuidv4()}
              className="group flex items-center justify-between px-6 py-5 hover:bg-background transition-all duration-300"
            >
              {!showSocialLinkEditForm && (
                <div className="flex items-center flex-1 min-w-0">
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-accent font-medium font-themeFont hover:underline transition-all duration-300 truncate text-base md:text-lg"
                    title={link}
                  >
                    {link}
                  </a>
                </div>
              )}

              {showSocialLinkEditForm && selectedSocialLink === link && (
                <div className="w-full">
                  <Suspense>
                    <SocialLinksEditField
                      type="edit"
                      selectedLink={selectedSocialLink}
                      setShowSocialLinksEditForm={setShowSocialLinkEditForm}
                    />
                  </Suspense>
                </div>
              )}

              {!showSocialLinkEditForm && showEditIcons && (
                <div className="flex items-center ml-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={() => {
                      setSelectedSocialLink(link);
                      setShowSocialLinkAddForm(false);
                      setShowSocialLinkEditForm(!showSocialLinkEditForm);
                    }}
                    className="p-2 text-primary hover:text-on-primary bg-transparent hover:bg-primary rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label="Edit social link"
                  >
                    <FaPencilAlt size="14" />
                  </button>
                </div>
              )}
            </li>
          ))}

        {sellerProfile?.socialLinks.length === 0 && !showSocialLinkAddForm && !showSocialLinkEditForm && (
          <li className="px-6 py-12 text-center">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center">
                <span className="text-2xl text-muted">🔗</span>
              </div>
              <div className="text-base text-muted font-medium leading-6">No social links added yet</div>
              <div className="text-sm text-muted leading-5 text-center max-w-sm">
                Add your social media profiles to showcase your online presence and connect with clients
              </div>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
};

export default SocialLinks;
