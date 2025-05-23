import { FC, lazy, LazyExoticComponent, ReactElement, Suspense, useContext, useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { SellerContext } from 'src/features/sellers/context/SellerContext';
import { IExperience, IExperienceEditProps } from 'src/features/sellers/interfaces/seller.interface';
import { v4 as uuidv4 } from 'uuid';

const ExperienceFields: LazyExoticComponent<FC<IExperienceEditProps>> = lazy(
  () => import('src/features/sellers/components/profile/components/overview/experience/ExperienceFields')
);

const Experience: FC = (): ReactElement => {
  const [showExperienceAddForm, setShowExperienceAddForm] = useState<boolean>(false);
  const [showExperienceEditForm, setShowExperienceEditForm] = useState<boolean>(false);
  const [selectedExperience, setSelectedExperience] = useState<IExperience>();
  const { showEditIcons, sellerProfile } = useContext(SellerContext);

  return (
    <div className="mt-6 rounded-md border border-[#D1D5DB] bg-white">
      <div className="flex items-center justify-between border-b border-[#D1D5DB] px-4 py-3">
        <h4 className="text-sm font-bold text-[#111111] md:text-base">EXPERIENCE</h4>
        {showEditIcons && !showExperienceAddForm && (
          <span
            className="cursor-pointer text-sm text-[#14B8A6] hover:text-[#0F766E] md:text-base"
            onClick={() => setShowExperienceAddForm(!showExperienceAddForm)}
          >
            Add New
          </span>
        )}
      </div>

      <ul className="list-none divide-y divide-[#D1D5DB]">
        {showExperienceAddForm && (
          <li className="px-4 py-3">
            <ExperienceFields type="add" setShowExperienceAddForm={setShowExperienceAddForm} />
          </li>
        )}

        {!showExperienceAddForm &&
          sellerProfile?.experience.map((experience: IExperience) => (
            <li key={uuidv4()} className="flex items-start justify-between px-4 py-3 text-sm text-[#4B5563] md:text-base">
              {!showExperienceEditForm && (
                <div className="flex flex-col">
                  <div className="font-bold text-[#111111]">{experience.title}</div>
                  <div>{experience.company}</div>
                  <div>
                    {experience.startDate} – {experience.endDate}
                  </div>
                </div>
              )}

              {showExperienceEditForm && selectedExperience?._id === experience._id && (
                <Suspense>
                  <ExperienceFields
                    type="edit"
                    selectedExperience={selectedExperience}
                    setShowExperienceEditForm={setShowExperienceEditForm}
                  />
                </Suspense>
              )}

              {!showExperienceEditForm && showEditIcons && (
                <div className="text-[#14B8A6] hover:text-[#0F766E]">
                  <FaPencilAlt
                    size="14"
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedExperience(experience);
                      setShowExperienceEditForm(!showExperienceEditForm);
                      setShowExperienceAddForm(false);
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

export default Experience;
