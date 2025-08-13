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
    <div className="bg-surface border border-default rounded-xl shadow-sm mt-8 px-4 py-6 sm:px-6 md:px-8 lg:px-10">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <h2 className="font-themeFont text-xl sm:text-2xl font-bold text-primary leading-tight">Social Links</h2>
        <Button
          onClick={adSocialLinkFields}
          className="w-full sm:w-auto h-10 rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-on-primary transition-all duration-300 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 shadow-sm hover:shadow-md"
          label="Add More"
        />
      </div>

      <div className="space-y-6">
        {socialFields?.map((input: string, index: number) => (
          <div key={index} className="bg-background rounded-lg p-4 sm:p-6 border border-default">
            <div className="space-y-4">
              {}
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary">Social Link {index + 1}</label>
                <div className="relative">
                  <TextInput
                    className="w-full rounded-lg border border-default bg-surface p-3 sm:p-4 pl-10 text-sm text-primary placeholder-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 hover:border-primary/50"
                    placeholder="https://linkedin.com/in/yourprofile"
                    type="url"
                    name="url"
                    value={input}
                    onChange={(event: ChangeEvent) => handleSocialLinksFieldsChange(event, index)}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                      />
                    </svg>
                  </div>
                </div>

                {}
                {input && input.trim() && !input.match(/^https?:\/\/.+/) && (
                  <div className="flex items-center gap-2 text-xs text-amber-600">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Consider adding https:// at the beginning of your URL</span>
                  </div>
                )}
              </div>

              {}
              {socialFields.length > 1 && index > 0 && (
                <div className="flex justify-end pt-2 border-t border-default">
                  <Button
                    className="h-9 rounded-lg bg-red-500 hover:bg-red-600 px-5 py-2 text-sm font-semibold text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:ring-offset-2 shadow-sm hover:shadow-md"
                    onClick={() => removeSocialLinkFields(index)}
                    label="Delete"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {}
      {socialFields && socialFields.length > 0 && socialFields.some((link) => link.trim()) && (
        <div className="mt-8 p-4 bg-accent/10 border border-accent/20 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span className="text-sm font-medium text-primary">Your Social Presence</span>
          </div>
          <div className="space-y-2">
            {socialFields
              .filter((link) => link.trim())
              .map((link, index) => {
                const getDomain = (url: string) => {
                  try {
                    const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
                    return domain.replace('www.', '');
                  } catch {
                    return url;
                  }
                };

                return (
                  <div key={index} className="flex items-center gap-3 p-2 bg-surface rounded-lg border border-default">
                    <div className="flex-shrink-0">
                      <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-primary truncate">{getDomain(link)}</p>
                      <p className="text-xs text-muted truncate">{link}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerSocialLinksFields;
