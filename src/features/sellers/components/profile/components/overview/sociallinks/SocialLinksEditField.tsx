import { cloneDeep, filter, findIndex } from 'lodash';
import { ChangeEvent, FC, ReactElement, useContext, useState } from 'react';
import { SellerContext } from 'src/features/sellers/context/SellerContext';
import { ISocialEditLinksProps } from 'src/features/sellers/interfaces/seller.interface';
import Button from 'src/shared/button/Button';
import TextInput from 'src/shared/inputs/TextInput';

const SocialLinksEditField: FC<ISocialEditLinksProps> = ({
  type,
  selectedLink,
  setShowSocialLinksAddForm,
  setShowSocialLinksEditForm
}): ReactElement => {
  const [socialLink, setSocialLink] = useState<string>(selectedLink ? `${selectedLink}` : '');
  const { sellerProfile, setSellerProfile } = useContext(SellerContext);

  const onHandleUpdate = (): void => {
    if (type === 'add') {
      const clonedSocialLinks: string[] = cloneDeep(sellerProfile.socialLinks) as string[];
      clonedSocialLinks.push(socialLink);
      if (setSellerProfile && setShowSocialLinksAddForm) {
        setSellerProfile({ ...sellerProfile, socialLinks: clonedSocialLinks });
        setShowSocialLinksAddForm(false);
      }
    } else {
      const itemIndex: number = findIndex(sellerProfile?.socialLinks, (value: string) => value === selectedLink);
      const clonedSocialLinks: string[] = cloneDeep(sellerProfile?.socialLinks) as string[];
      clonedSocialLinks.splice(itemIndex, 1, socialLink);
      const filtered = filter(clonedSocialLinks, (item: string) => item !== '');
      if (setSellerProfile && setShowSocialLinksEditForm) {
        setSellerProfile({ ...sellerProfile, socialLinks: filtered });
        setShowSocialLinksEditForm(false);
      }
    }
  };

  const onCancelUpdate = (): void => {
    if (type === 'add' && setShowSocialLinksAddForm) {
      setShowSocialLinksAddForm(false);
    } else if (type === 'edit' && setShowSocialLinksEditForm) {
      setShowSocialLinksEditForm(false);
    }
  };

  return (
    <div className="flex w-full flex-col bg-surface rounded-lg shadow-sm border border-default p-6 md:p-8">
      <div className="mb-8 space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-primary font-themeFont leading-6">Social Media Link</label>
          <TextInput
            className="w-full rounded-lg border border-default bg-surface px-4 py-3 text-sm font-normal text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
            placeholder="Enter your social media profile URL (e.g., https://twitter.com/username)"
            type="url"
            name="socialLink"
            value={socialLink}
            onChange={(event: ChangeEvent) => {
              setSocialLink((event.target as HTMLInputElement).value);
            }}
          />
          <div className="text-xs text-muted leading-4 font-themeFont">Include the full URL starting with https://</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center pt-6 border-t border-default">
        <Button
          disabled={!socialLink && type === 'add'}
          className={`w-full sm:w-auto rounded-lg px-8 py-3 text-sm font-bold font-themeFont text-on-primary focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300
        ${
          !socialLink && type === 'add'
            ? 'bg-primary cursor-not-allowed opacity-40'
            : 'bg-primary hover:bg-primary cursor-pointer focus:ring-primary shadow-md hover:shadow-lg'
        }
      `}
          onClick={onHandleUpdate}
          label={`${type === 'edit' ? 'Update Link' : 'Add Link'}`}
        />

        <Button
          onClick={onCancelUpdate}
          className="w-full sm:w-auto rounded-lg bg-surface border border-default px-8 py-3 text-sm font-bold font-themeFont text-primary hover:bg-background hover:border-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 shadow-sm hover:shadow-md"
          label="Cancel"
        />
      </div>
    </div>
  );
};

export default SocialLinksEditField;
