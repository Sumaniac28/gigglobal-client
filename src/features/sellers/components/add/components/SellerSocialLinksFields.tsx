import { ChangeEvent, FC, ReactElement } from 'react';
import { ISocialLinksProps } from 'src/features/sellers/interfaces/seller.interface';
import Button from 'src/shared/button/Button';
import TextInput from 'src/shared/inputs/TextInput';

const SellerSocialLinksFields: FC<ISocialLinksProps> = ({ socialFields, setSocialFields }): ReactElement => {
  const adSocialLinkFields = (): void => {
    if (setSocialFields && socialFields) {
      setSocialFields([...socialFields, '']);
    }
  };

  const removeSocialLinkFields = (index: number): void => {
    if (socialFields && setSocialFields && socialFields.length > 1) {
      const data: string[] = [...socialFields];
      data.splice(index, 1);
      setSocialFields([...data]);
    }
  };

  const handleSocialLinksFieldsChange = (event: ChangeEvent, index: number): void => {
    if (setSocialFields && socialFields) {
      const target: HTMLInputElement = event.target as HTMLInputElement;
      const data: string[] = [...socialFields];
      data[index] = target.value;
      setSocialFields([...data]);
    }
  };

  return (
    <>
      <div className="bg-[#F9FAFB] mt-8 px-4 py-6 sm:px-6 md:px-10 lg:px-16 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="pb-4 text-xl font-bold text-[#111111]">Social Links</h2>
          <Button
            onClick={adSocialLinkFields}
            className="h-8 rounded-md bg-[#14B8A6] px-5 text-sm font-semibold text-white transition hover:bg-[#0F766E] focus:outline-none"
            label="Add More"
          />
        </div>
        {socialFields?.map((input: string, index: number) => (
          <div key={index}>
            <TextInput
              className="w-full rounded-md border border-[#E5E7EB] p-3 text-sm text-[#111111] placeholder-[#9CA3AF] focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6] transition"
              placeholder="Social media link"
              type="text"
              name="url"
              value={input}
              onChange={(event: ChangeEvent) => handleSocialLinksFieldsChange(event, index)}
            />
            <div className="my-4">
              {socialFields.length > 1 && index > 0 && (
                <Button
                  className="h-8 rounded-md bg-red-500 px-5 text-sm font-semibold text-white transition hover:bg-red-400 focus:outline-none"
                  onClick={() => removeSocialLinkFields(index)}
                  label="Delete"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SellerSocialLinksFields;
