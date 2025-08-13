import { FC, lazy, LazyExoticComponent, ReactElement, Suspense, useContext, useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { SellerContext } from 'src/features/sellers/context/SellerContext';
import { ILanguage, ILanguageEditFieldsProps } from 'src/features/sellers/interfaces/seller.interface';
import { v4 as uuidv4 } from 'uuid';

const LanguageFields: LazyExoticComponent<FC<ILanguageEditFieldsProps>> = lazy(
  () => import('src/features/sellers/components/profile/components/overview/language/LanguageFields')
);

const Language: FC = (): ReactElement => {
  const [showLanguageAddForm, setShowLanguageAddForm] = useState<boolean>(false);
  const [showLanguageEditForm, setShowLanguageEditForm] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<ILanguage>();
  const { sellerProfile, showEditIcons } = useContext(SellerContext);

  return (
    <div className="mt-8 rounded-lg border border-default bg-surface shadow-sm">
      <div className="flex items-center justify-between border-b border-default px-6 py-4 bg-background rounded-t-lg">
        <h4 className="text-lg font-bold font-themeFont text-primary leading-6 md:text-xl">LANGUAGE SKILLS</h4>
        {showEditIcons && !showLanguageAddForm && (
          <button
            onClick={() => {
              setShowLanguageAddForm(!showLanguageAddForm);
              setShowLanguageEditForm(false);
            }}
            className="inline-flex items-center px-4 py-2 text-sm font-semibold font-themeFont text-primary bg-accent hover:bg-accent rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 shadow-sm hover:shadow-md md:text-base"
          >
            <span className="text-on-primary">+ Add New</span>
          </button>
        )}
      </div>

      <ul className="list-none divide-y divide-default">
        {showLanguageAddForm && (
          <li className="px-6 py-6 bg-background">
            <LanguageFields type="add" setShowLanguageAddForm={setShowLanguageAddForm} />
          </li>
        )}

        {!showLanguageAddForm &&
          sellerProfile?.languages.map((lang: ILanguage) => (
            <li
              key={uuidv4()}
              className="group flex items-center justify-between px-6 py-5 hover:bg-background transition-all duration-300"
            >
              {!showLanguageEditForm && (
                <div className="flex items-center gap-3 text-base font-medium text-primary leading-6 md:text-lg flex-1 min-w-0">
                  <div className="font-bold font-themeFont text-primary">{lang.language}</div>
                  <span className="text-border-default font-medium">—</span>
                  <div className="bg-secondary text-on-primary px-3 py-1 rounded-full text-xs font-medium">{lang.level}</div>
                </div>
              )}

              {showLanguageEditForm && selectedLanguage?._id === lang._id && (
                <div className="w-full">
                  <Suspense>
                    <LanguageFields type="edit" selectedLanguage={lang} setShowLanguageEditForm={setShowLanguageEditForm} />
                  </Suspense>
                </div>
              )}

              {!showLanguageEditForm && showEditIcons && (
                <div className="flex items-center ml-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={() => {
                      setSelectedLanguage(lang);
                      setShowLanguageEditForm(!showLanguageEditForm);
                      setShowLanguageAddForm(false);
                    }}
                    className="p-2 text-primary hover:text-on-primary bg-transparent hover:bg-primary rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label="Edit language skill"
                  >
                    <FaPencilAlt size="14" />
                  </button>
                </div>
              )}
            </li>
          ))}

        {sellerProfile?.languages.length === 0 && !showLanguageAddForm && !showLanguageEditForm && (
          <li className="px-6 py-12 text-center">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center">
                <span className="text-2xl text-muted">🌐</span>
              </div>
              <div className="text-base text-muted font-medium leading-6">No language skills added yet</div>
              <div className="text-sm text-muted leading-5 text-center max-w-sm">
                Add your language proficiency to showcase your communication abilities
              </div>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Language;
