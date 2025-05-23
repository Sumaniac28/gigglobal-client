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
    <div className="rounded-md border border-[#D1D5DB] bg-white">
      <div className="flex items-center justify-between border-b border-[#D1D5DB] px-4 py-3">
        <h4 className="text-sm font-bold text-[#111111] md:text-base">DESCRIPTION</h4>
        {showEditIcons && !showDescriptionEditForm && (
          <span
            onClick={() => setShowDescriptionEditForm(true)}
            className="cursor-pointer text-sm text-[#14B8A6] hover:text-[#0F766E] md:text-base"
          >
            Edit Description
          </span>
        )}
      </div>

      <div className="py-3 px-4 text-sm text-[#4B5563] md:text-base break-words whitespace-pre-wrap">
        {!showDescriptionEditForm && <div>{sellerProfile.description}</div>}

        {showDescriptionEditForm && (
          <div className="flex w-full flex-col">
            <div className="mb-4">
              <Suspense>
                <TextAreaInput
                  className="block w-full rounded border border-[#D1D5DB] p-2.5 text-sm text-[#111111] focus:border-[#14B8A6] focus:ring-[#14B8A6]"
                  placeholder="Write description..."
                  name="description"
                  value={description}
                  rows={5}
                  maxLength={600}
                  onChange={(event: ChangeEvent) => setDescription((event.target as HTMLInputElement).value)}
                />
              </Suspense>
            </div>

            <div className="mb-2 flex gap-3">
              <Suspense>
                <Button
                  disabled={!description}
                  className={`rounded bg-[#14B8A6] px-6 py-2 text-sm font-bold text-white hover:bg-[#0F766E] focus:outline-none md:text-md ${
                    !description ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'
                  }`}
                  label="Update"
                  onClick={() => {
                    if (setSellerProfile) {
                      setSellerProfile({ ...sellerProfile, description });
                      setShowDescriptionEditForm(false);
                    }
                  }}
                />
                <Button
                  className="rounded bg-[#E5E7EB] px-6 py-2 text-sm font-bold text-[#111111] hover:bg-[#D1D5DB] focus:outline-none md:text-md"
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
