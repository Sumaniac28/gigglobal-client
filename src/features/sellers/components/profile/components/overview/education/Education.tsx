import { FC, lazy, LazyExoticComponent, ReactElement, Suspense, useContext, useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { SellerContext } from 'src/features/sellers/context/SellerContext';
import { IEducation, IEducationEditProps } from 'src/features/sellers/interfaces/seller.interface';
import { v4 as uuidv4 } from 'uuid';

const EducationFields: LazyExoticComponent<FC<IEducationEditProps>> = lazy(
  () => import('src/features/sellers/components/profile/components/overview/education/EducationFields')
);

const Education: FC = (): ReactElement => {
  const [showEducationAddForm, setShowEducationAddForm] = useState<boolean>(false);
  const [showEducationEditForm, setShowEducationEditForm] = useState<boolean>(false);
  const [selectedEducation, setSelectedEducation] = useState<IEducation>();
  const { showEditIcons, sellerProfile } = useContext(SellerContext);

  return (
    <div className="mt-6 rounded-md border border-[#D1D5DB] bg-white">
      <div className="flex items-center justify-between border-b border-[#D1D5DB] px-4 py-3">
        <h4 className="text-sm font-bold text-[#111111] md:text-base">EDUCATION</h4>
        {showEditIcons && !showEducationAddForm && (
          <span
            className="cursor-pointer text-sm text-[#14B8A6] hover:text-[#0F766E] md:text-base"
            onClick={() => {
              setShowEducationAddForm(!showEducationAddForm);
              setShowEducationEditForm(false);
            }}
          >
            Add New
          </span>
        )}
      </div>

      <ul className="list-none divide-y divide-[#D1D5DB]">
        {showEducationAddForm && (
          <li className="px-4 py-3">
            <Suspense>
              <EducationFields type="add" setShowEducationAddForm={setShowEducationAddForm} />
            </Suspense>
          </li>
        )}

        {!showEducationAddForm &&
          sellerProfile?.education.map((education: IEducation) => (
            <li key={uuidv4()} className="flex justify-between px-4 py-3 text-sm text-[#4B5563] md:text-base">
              {!showEducationEditForm && (
                <div className="flex flex-col">
                  <div className="font-bold text-[#111111] pb-1">
                    {education.major} {education.title}
                  </div>
                  <div>
                    {education.university}, {education.country}, Graduated {education.year}
                  </div>
                </div>
              )}

              {showEducationEditForm && selectedEducation?._id === education._id && (
                <EducationFields type="edit" selectedEducation={selectedEducation} setShowEducationEditForm={setShowEducationEditForm} />
              )}

              {!showEducationEditForm && showEditIcons && (
                <div className="text-[#14B8A6] hover:text-[#0F766E]">
                  <FaPencilAlt
                    size="14"
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedEducation(education);
                      setShowEducationEditForm(!showEducationEditForm);
                      setShowEducationAddForm(false);
                    }}
                  />
                </div>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Education;
