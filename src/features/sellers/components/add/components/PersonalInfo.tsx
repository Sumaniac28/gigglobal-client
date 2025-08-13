import { ChangeEvent, FC, KeyboardEvent, ReactElement, useState } from 'react';
import { IPersonalInfoProps } from 'src/features/sellers/interfaces/seller.interface';
import TextAreaInput from 'src/shared/inputs/TextAreaInput';
import TextInput from 'src/shared/inputs/TextInput';

const PersonalInfo: FC<IPersonalInfoProps> = ({ personalInfo, setPersonalInfo }): ReactElement => {
  const [allowedInfoLength, setAllowedInfoLength] = useState({
    description: '600/600',
    oneliner: '70/70'
  });
  const maxDescriptionCharacters = 600;
  const maxOneLinerCharacters = 70;

  return (
    <div className="bg-surface px-4 py-6 sm:px-6 md:px-10 lg:px-16 rounded-lg shadow-sm border border-default">
      <div className="space-y-8">
        <div className="flex flex-col md:grid md:grid-cols-5 md:gap-6">
          <label className="text-primary font-semibold mb-2 md:mb-0 md:col-span-1 font-themeFont">
            Fullname<sup className="text-red-500">*</sup>
          </label>
          <div className="md:col-span-4">
            <TextInput
              className="w-full rounded-lg border border-default p-3 text-sm text-primary placeholder-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-300 bg-surface hover:border-primary/60"
              type="text"
              name="fullname"
              placeholder="Enter your full name"
              value={personalInfo.fullName}
              onChange={(event: ChangeEvent) => setPersonalInfo({ ...personalInfo, fullName: (event.target as HTMLInputElement).value })}
            />
          </div>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-5 md:gap-6">
          <label className="text-primary font-semibold mb-2 md:mb-0 md:col-span-1 font-themeFont">
            Oneliner<sup className="text-red-500">*</sup>
          </label>
          <div className="md:col-span-4">
            <TextInput
              className="w-full rounded-lg border border-default p-3 text-sm text-primary placeholder-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-300 bg-surface hover:border-primary/60"
              type="text"
              name="oneliner"
              placeholder="E.g. Expert Mobile and Web Developer"
              value={personalInfo.oneliner}
              onChange={(event: ChangeEvent) => {
                const onelinerValue: string = (event.target as HTMLInputElement).value;
                setPersonalInfo({ ...personalInfo, oneliner: onelinerValue });
                const counter: number = maxOneLinerCharacters - onelinerValue.length;
                setAllowedInfoLength({ ...allowedInfoLength, oneliner: `${counter}/70` });
              }}
              onKeyDown={(event: KeyboardEvent) => {
                const currentTextLength = (event.target as HTMLInputElement).value.length;
                if (currentTextLength === maxOneLinerCharacters && event.key !== 'Backspace') {
                  event.preventDefault();
                }
              }}
            />
            <p className="text-right text-xs text-muted mt-2 font-medium">
              <span className={`${allowedInfoLength.oneliner.split('/')[0] < '10' ? 'text-red-500' : ''}`}>
                {allowedInfoLength.oneliner}
              </span>{' '}
              Characters
            </p>
          </div>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-5 md:gap-6">
          <label className="text-primary font-semibold mb-2 md:mb-0 md:col-span-1 font-themeFont">
            Description<sup className="text-red-500">*</sup>
          </label>
          <div className="md:col-span-4">
            <TextAreaInput
              className="w-full rounded-lg border border-default p-3 text-sm text-primary placeholder-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-300 bg-surface hover:border-primary/60 resize-none"
              name="description"
              placeholder="Describe your expertise or services..."
              value={personalInfo.description}
              rows={5}
              onChange={(event: ChangeEvent) => {
                const descriptionValue: string = (event.target as HTMLInputElement).value;
                setPersonalInfo({ ...personalInfo, description: descriptionValue });
                const counter: number = maxDescriptionCharacters - descriptionValue.length;
                setAllowedInfoLength({ ...allowedInfoLength, description: `${counter}/600` });
              }}
              onKeyDown={(event: KeyboardEvent) => {
                const currentTextLength = (event.target as HTMLInputElement).value.length;
                if (currentTextLength === maxDescriptionCharacters && event.key !== 'Backspace') {
                  event.preventDefault();
                }
              }}
            />
            <p className="text-right text-xs text-muted mt-2 font-medium">
              <span className={`${allowedInfoLength.description.split('/')[0] < '50' ? 'text-red-500' : ''}`}>
                {allowedInfoLength.description}
              </span>{' '}
              Characters
            </p>
          </div>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-5 md:gap-6">
          <label className="text-primary font-semibold mb-2 md:mb-0 md:col-span-1 font-themeFont">
            Response Time<sup className="text-red-500">*</sup>
          </label>
          <div className="md:col-span-4">
            <div className="relative">
              <TextInput
                className="w-full rounded-lg border border-default p-3 text-sm text-primary placeholder-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-300 bg-surface hover:border-primary/60 pr-16"
                type="number"
                name="responseTime"
                placeholder="E.g. 1"
                value={personalInfo.responseTime}
                onChange={(event: ChangeEvent) => {
                  const value = (event.target as HTMLInputElement).value;
                  setPersonalInfo({ ...personalInfo, responseTime: parseInt(value) > 0 ? value : '' });
                }}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted font-medium">
                hour{personalInfo.responseTime && parseInt(personalInfo.responseTime) !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
