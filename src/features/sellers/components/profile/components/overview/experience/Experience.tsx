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
    <div className="mt-8 rounded-lg border border-default bg-surface shadow-sm">
      <div className="flex items-center justify-between border-b border-default px-6 py-4 bg-background rounded-t-lg">
        <h4 className="text-lg font-bold font-themeFont text-primary leading-6 md:text-xl">EXPERIENCE</h4>
        {showEditIcons && !showExperienceAddForm && (
          <button
            onClick={() => setShowExperienceAddForm(!showExperienceAddForm)}
            className="inline-flex items-center px-4 py-2 text-sm font-semibold font-themeFont text-primary bg-accent hover:bg-accent rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 shadow-sm hover:shadow-md md:text-base"
          >
            <span className="text-on-primary">+ Add New</span>
          </button>
        )}
      </div>

      <ul className="list-none divide-y divide-default">
        {showExperienceAddForm && (
          <li className="px-6 py-6 bg-background">
            <ExperienceFields type="add" setShowExperienceAddForm={setShowExperienceAddForm} />
          </li>
        )}

        {!showExperienceAddForm &&
          sellerProfile?.experience.map((experience: IExperience) => (
            <li key={uuidv4()} className="group flex items-start justify-between px-6 py-5 hover:bg-background transition-all duration-300">
              {!showExperienceEditForm && (
                <div className="flex flex-col space-y-3 flex-1 min-w-0">
                  <div className="text-base font-bold font-themeFont text-primary leading-6 md:text-lg">{experience.title}</div>

                  <div className="text-sm text-muted font-semibold leading-5 md:text-base">{experience.company}</div>

                  <div className="flex items-center gap-2 text-sm text-muted leading-5">
                    <div className="bg-primary text-on-primary px-3 py-1 rounded-full text-xs font-medium">{experience.startDate}</div>
                    <span className="text-border-default font-medium">—</span>
                    <div className="bg-secondary text-on-primary px-3 py-1 rounded-full text-xs font-medium">{experience.endDate}</div>
                  </div>
                </div>
              )}

              {showExperienceEditForm && selectedExperience?._id === experience._id && (
                <div className="w-full">
                  <Suspense>
                    <ExperienceFields
                      type="edit"
                      selectedExperience={selectedExperience}
                      setShowExperienceEditForm={setShowExperienceEditForm}
                    />
                  </Suspense>
                </div>
              )}

              {!showExperienceEditForm && showEditIcons && (
                <div className="flex items-center ml-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={() => {
                      setSelectedExperience(experience);
                      setShowExperienceEditForm(!showExperienceEditForm);
                      setShowExperienceAddForm(false);
                    }}
                    className="p-2 text-primary hover:text-on-primary bg-transparent hover:bg-primary rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label="Edit experience"
                  >
                    <FaPencilAlt size="14" />
                  </button>
                </div>
              )}
            </li>
          ))}

        {sellerProfile?.experience.length === 0 && !showExperienceAddForm && !showExperienceEditForm && (
          <li className="px-6 py-12 text-center">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center">
                <span className="text-2xl text-muted">💼</span>
              </div>
              <div className="text-base text-muted font-medium leading-6">No work experience added yet</div>
              <div className="text-sm text-muted leading-5 text-center max-w-sm">
                Add your professional experience to showcase your career journey and expertise
              </div>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Experience;
