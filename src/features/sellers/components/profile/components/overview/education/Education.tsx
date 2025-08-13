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
    <div className="mt-8 rounded-lg border border-default bg-surface shadow-sm">
      <div className="flex items-center justify-between border-b border-default px-6 py-4 bg-background rounded-t-lg">
        <h4 className="text-lg font-bold font-themeFont text-primary leading-6 md:text-xl">EDUCATION</h4>
        {showEditIcons && !showEducationAddForm && (
          <button
            onClick={() => {
              setShowEducationAddForm(!showEducationAddForm);
              setShowEducationEditForm(false);
            }}
            className="inline-flex items-center px-4 py-2 text-sm font-semibold font-themeFont text-primary bg-accent hover:bg-accent rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 shadow-sm hover:shadow-md md:text-base"
          >
            <span className="text-on-primary">+ Add New</span>
          </button>
        )}
      </div>

      <ul className="list-none divide-y divide-default">
        {showEducationAddForm && (
          <li className="px-6 py-6 bg-background">
            <Suspense>
              <EducationFields type="add" setShowEducationAddForm={setShowEducationAddForm} />
            </Suspense>
          </li>
        )}

        {!showEducationAddForm &&
          sellerProfile?.education.map((education: IEducation) => (
            <li key={uuidv4()} className="group flex justify-between items-start px-6 py-5 hover:bg-background transition-all duration-300">
              {!showEducationEditForm && (
                <div className="flex flex-col space-y-3 flex-1 min-w-0">
                  <div className="text-base font-bold font-themeFont text-primary leading-6 md:text-lg">
                    {education.major} {education.title}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div className="text-sm text-muted font-medium leading-5 md:text-base">{education.university}</div>
                    <div className="flex items-center gap-2 text-sm text-muted leading-5">
                      <span className="hidden sm:inline-block w-1 h-1 bg-muted rounded-full"></span>
                      <span className="bg-secondary text-on-primary px-2 py-1 rounded-full text-xs font-medium">{education.country}</span>
                      <span className="mx-1 text-border-default">•</span>
                      <span className="font-medium">Graduated {education.year}</span>
                    </div>
                  </div>
                </div>
              )}

              {showEducationEditForm && selectedEducation?._id === education._id && (
                <div className="w-full">
                  <EducationFields type="edit" selectedEducation={selectedEducation} setShowEducationEditForm={setShowEducationEditForm} />
                </div>
              )}

              {!showEducationEditForm && showEditIcons && (
                <div className="flex items-center ml-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={() => {
                      setSelectedEducation(education);
                      setShowEducationEditForm(!showEducationEditForm);
                      setShowEducationAddForm(false);
                    }}
                    className="p-2 text-primary hover:text-on-primary bg-transparent hover:bg-primary rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label="Edit education"
                  >
                    <FaPencilAlt size="14" />
                  </button>
                </div>
              )}
            </li>
          ))}

        {sellerProfile?.education.length === 0 && !showEducationAddForm && !showEducationEditForm && (
          <li className="px-6 py-12 text-center">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center">
                <span className="text-2xl text-muted">🎓</span>
              </div>
              <div className="text-base text-muted font-medium leading-6">No education history added yet</div>
              <div className="text-sm text-muted leading-5 text-center max-w-sm">
                Add your educational background to strengthen your professional profile
              </div>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Education;
