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
    <div className="border border-[#D1D5DB] bg-white rounded-md">
      <div className="flex items-center justify-between border-b border-[#D1D5DB] px-4 py-3">
        <h4 className="text-sm font font-bold text-[#111111] md:text-base">LANGUAGE SKILLS</h4>
        {showEditIcons && (
          <span
            onClick={() => {
              setShowLanguageAddForm(!showLanguageAddForm);
              setShowLanguageEditForm(false);
            }}
            className="cursor-pointer text-sm text-[#14B8A6] hover:text-[#0F766E] md:text-base"
          >
            Add New
          </span>
        )}
      </div>

      <ul className="list-none divide-y divide-[#D1D5DB]">
        {showLanguageAddForm && (
          <li className="px-4 py-3">
            <LanguageFields type="add" setShowLanguageAddForm={setShowLanguageAddForm} />
          </li>
        )}

        {!showLanguageAddForm &&
          sellerProfile?.languages.map((lang: ILanguage) => (
            <li key={uuidv4()} className="flex items-center justify-between px-4 py-3">
              {!showLanguageEditForm && (
                <div className="flex text-sm text-[#4B5563] md:text-base">
                  <div className="mr-2 font-bold text-[#111111]">{lang.language}</div>
                  <div className="mr-2">-</div>
                  <div>{lang.level}</div>
                </div>
              )}

              {showLanguageEditForm && selectedLanguage?._id === lang._id && (
                <Suspense>
                  <LanguageFields type="edit" selectedLanguage={lang} setShowLanguageEditForm={setShowLanguageEditForm} />
                </Suspense>
              )}

              {!showLanguageEditForm && showEditIcons && (
                <div className="text-[#14B8A6] hover:text-[#0F766E]">
                  <FaPencilAlt
                    onClick={() => {
                      setSelectedLanguage(lang);
                      setShowLanguageEditForm(!showLanguageEditForm);
                      setShowLanguageAddForm(false);
                    }}
                    size="14"
                    className="cursor-pointer"
                  />
                </div>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Language;
