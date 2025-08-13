import { ChangeEvent, FC, lazy, LazyExoticComponent, ReactElement, Suspense, useContext, useState } from 'react';
import { SellerContext } from 'src/features/sellers/context/SellerContext';
import { IButtonProps, ITextInputProps } from 'src/shared/shared.interface';

const Button: LazyExoticComponent<FC<IButtonProps>> = lazy(() => import('src/shared/button/Button'));
const TextAreaInput: LazyExoticComponent<FC<ITextInputProps>> = lazy(() => import('src/shared/inputs/TextAreaInput'));

const Description: FC = (): ReactElement => {
  const { sellerProfile, setSellerProfile, showEditIcons } = useContext(SellerContext);
  const [showDescriptionEditForm, setShowDescriptionEditForm] = useState<boolean>(false);
  const [description, setDescription] = useState<string>(sellerProfile.description ? `${sellerProfile.description}` : '');

  return (
    <div className="rounded-lg border border-default bg-surface shadow-sm">
      <div className="flex items-center justify-between border-b border-default px-6 py-4 bg-background rounded-t-lg">
        <h4 className="text-lg font-bold font-themeFont text-primary leading-6 md:text-xl">DESCRIPTION</h4>
        {showEditIcons && !showDescriptionEditForm && (
          <button
            onClick={() => setShowDescriptionEditForm(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-semibold font-themeFont text-primary hover:text-on-primary bg-transparent hover:bg-primary border border-primary rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-sm hover:shadow-md md:text-base"
          >
            Edit Description
          </button>
        )}
      </div>

      <div className="p-6">
        {!showDescriptionEditForm && (
          <div className="min-h-[3rem]">
            {sellerProfile.description ? (
              <div className="text-base text-muted leading-7 md:text-lg break-words whitespace-pre-wrap font-normal">
                {sellerProfile.description}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 space-y-3">
                <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center">
                  <span className="text-2xl text-muted">📝</span>
                </div>
                <div className="text-base text-muted font-medium leading-6">No description added yet</div>
                <div className="text-sm text-muted leading-5 text-center max-w-sm">
                  Add a compelling description to showcase your skills and experience
                </div>
              </div>
            )}
          </div>
        )}

        {showDescriptionEditForm && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-primary font-themeFont leading-6">Professional Description</label>
              <div className="relative">
                <Suspense>
                  <TextAreaInput
                    className="block w-full rounded-lg border border-default bg-surface p-4 text-sm text-muted placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 resize-none"
                    placeholder="Write a compelling description of your skills, experience, and what makes you unique..."
                    name="description"
                    value={description}
                    rows={6}
                    maxLength={600}
                    onChange={(event: ChangeEvent) => setDescription((event.target as HTMLInputElement).value)}
                  />
                </Suspense>
                <div className="absolute bottom-3 right-3 text-xs text-muted font-medium">{description?.length || 0}/600</div>
              </div>
              <div className="text-xs text-muted leading-5">
                Share your expertise, achievements, and what clients can expect when working with you.
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-default">
              <Suspense>
                <Button
                  disabled={!description}
                  className={`w-full sm:w-auto rounded-lg px-8 py-3 text-sm font-bold font-themeFont text-on-primary focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg
                ${
                  !description
                    ? 'bg-primary cursor-not-allowed opacity-40'
                    : 'bg-primary hover:bg-primary cursor-pointer focus:ring-primary'
                }`}
                  label="Update Description"
                  onClick={() => {
                    if (setSellerProfile) {
                      setSellerProfile({ ...sellerProfile, description });
                      setShowDescriptionEditForm(false);
                    }
                  }}
                />
                <Button
                  className="w-full sm:w-auto rounded-lg bg-surface border border-default px-8 py-3 text-sm font-bold font-themeFont text-primary hover:bg-background hover:border-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 shadow-sm hover:shadow-md"
                  label="Cancel"
                  onClick={() => setShowDescriptionEditForm(false)}
                />
              </Suspense>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Description;
