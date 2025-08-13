import { FC, FormEvent, lazy, LazyExoticComponent, ReactElement, Suspense, useEffect, useState } from 'react';
import Breadcrumb from 'src/shared/breadcrumb/Breadcrumb';
import { useAppDispatch, useAppSelector } from 'src/store/store';
import PersonalInfo from 'src/features/sellers/components/add/components/PersonalInfo';
import {
  ICertificate,
  ICertificateProps,
  IEducation,
  IEducationProps,
  IExperience,
  IExperienceProps,
  ILanguage,
  ILanguageProps,
  IPersonalInfoData,
  ISellerDocument,
  ISkillProps,
  ISocialLinksProps
} from 'src/features/sellers/interfaces/seller.interface';
import { useCreateSellerMutation } from 'src/features/sellers/services/seller.service';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { useSellerSchema } from 'src/features/sellers/hooks/useSellerSchema';
import { filter, lowerCase } from 'lodash';
import { IBuyerDocument } from 'src/features/buyer/interfaces/buyer.interface';
import { IResponse } from 'src/shared/shared.interface';
import { addSeller } from 'src/features/sellers/reducers/seller.reducer';
import { addBuyer } from 'src/features/buyer/reducers/buyer.reducer';
import { deleteFromLocalStorage, showErrorToast } from 'src/shared/utils/utils.service';
import CircularPageLoader from 'src/shared/page-loader/CircularPageLoader';
import Button from 'src/shared/button/Button';
import SellerLoading from '../shared/SellerLoading';

const SellerExperienceFields: LazyExoticComponent<FC<IExperienceProps>> = lazy(
  () => import('src/features/sellers/components/add/components/SellerExperienceFields')
);
const SellerEducationFields: LazyExoticComponent<FC<IEducationProps>> = lazy(
  () => import('src/features/sellers/components/add/components/SellerEducationFields')
);
const SellerCertificateFields: LazyExoticComponent<FC<ICertificateProps>> = lazy(
  () => import('src/features/sellers/components/add/components/SellerCertificateFileds')
);
const SellerSocialLinksFields: LazyExoticComponent<FC<ISocialLinksProps>> = lazy(
  () => import('src/features/sellers/components/add/components/SellerSocialLinksFields')
);
const SellerSkillField: LazyExoticComponent<FC<ISkillProps>> = lazy(
  () => import('src/features/sellers/components/add/components/SellerSkillField')
);
const SellerLanguageFields: LazyExoticComponent<FC<ILanguageProps>> = lazy(
  () => import('src/features/sellers/components/add/components/SellerLanguageFields')
);

const AddSeller: FC = (): ReactElement => {
  const authUser = useAppSelector((state) => state.authUser);
  const buyer = useAppSelector((state) => state.buyer);

  const [personalInfo, setPersonalInfo] = useState<IPersonalInfoData>({
    fullName: '',
    profilePicture: `${authUser.profilePicture}`,
    description: '',
    responseTime: '',
    oneliner: ''
  });
  const [experienceFields, setExperienceFields] = useState<IExperience[]>([
    {
      title: '',
      company: '',
      startDate: 'Start Year',
      endDate: 'End Year',
      currentlyWorkingHere: false,
      description: ''
    }
  ]);
  const [educationFields, setEducationFields] = useState<IEducation[]>([
    {
      country: 'Country',
      university: '',
      title: 'Title',
      major: '',
      year: 'Year'
    }
  ]);

  const [skillsFields, setSkillsFields] = useState<string[]>(['']);
  const [languageFields, setLanguageFields] = useState<ILanguage[]>([
    {
      language: '',
      level: 'Level'
    }
  ]);
  const [certificateFields, setCertificateFields] = useState<ICertificate[]>([
    {
      name: '',
      from: '',
      year: 'Year'
    }
  ]);
  const [socialFields, setSocialFields] = useState<string[]>(['']);
  const [schemaValidation, personalInfoErrors, experienceErrors, educationErrors, skillsErrors, languagesErrors] = useSellerSchema({
    personalInfo,
    experienceFields,
    educationFields,
    skillsFields,
    languageFields
  });
  const dispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const [createSeller, { isLoading }] = useCreateSellerMutation();

  const errors = [...personalInfoErrors, ...experienceErrors, ...educationErrors, ...skillsErrors, ...languagesErrors];

  const onCreateSeller = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    try {
      const isValid: boolean = await schemaValidation();
      if (isValid) {
        const skills: string[] = filter(skillsFields, (skill: string) => skill !== '') as string[];
        const socialLinks: string[] = filter(socialFields, (item: string) => item !== '') as string[];
        const certificates: ICertificate[] = filter(
          certificateFields,
          (item: ICertificate) => item.name !== '' && item.from !== '' && item.year !== ''
        ) as ICertificate[];
        const sellerData: ISellerDocument = {
          email: `${authUser.email}`,
          username: `${authUser.username}`,
          profilePublicId: `${authUser.profilePublicId}`,
          profilePicture: `${authUser.profilePicture}`,
          fullName: personalInfo.fullName,
          description: personalInfo.description,
          country: `${authUser.country}`,
          skills,
          oneliner: personalInfo.oneliner,
          languages: languageFields,
          responseTime: parseInt(personalInfo.responseTime, 10),
          experience: experienceFields,
          education: educationFields,
          socialLinks,
          certificates
        };
        const updateBuyer: IBuyerDocument = { ...buyer, isSeller: true };
        const response: IResponse = await createSeller(sellerData).unwrap();
        if (response.seller) {
          dispatch(addSeller(response.seller));
          dispatch(addBuyer(updateBuyer));
          navigate(`/seller_profile/${lowerCase(`${authUser.username}`)}/${response.seller._id}/edit`);
        } else {
          showErrorToast('Error creating seller profile. Please try again later.');
        }
      }
    } catch (error) {
      showErrorToast('Error creating seller profile.');
    }
  };

  useEffect(() => {
    return () => {
      deleteFromLocalStorage('becomeASeller');
    };
  }, []);

  return (
    <div className="relative w-full bg-background min-h-screen">
      <Breadcrumb breadCrumbItems={['Seller', 'Create Profile']} />
      <div className="container mx-auto my-5 overflow-hidden px-2 pb-12 md:px-0">
        {isLoading && <CircularPageLoader />}
        {authUser && !authUser.emailVerified && (
          <div className="absolute left-0 top-0 z-50 flex h-full w-full justify-center bg-surface/95 backdrop-blur-sm text-sm font-bold md:text-base lg:text-xl shadow-lg">
            <div className="mt-20 bg-surface px-6 py-4 rounded-lg border border-default shadow-sm">
              <span className="text-primary font-themeFont">Please verify your email.</span>
            </div>
          </div>
        )}

        <div className="left-0 top-0 z-10 mt-4 block h-full bg-surface rounded-lg shadow-sm"></div>

        {errors.length > 0 ? (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-red-600 font-medium font-themeFont">
              You have {errors.length} error{errors.length > 1 ? 's' : ''}
            </div>
          </div>
        ) : null}

        <div className="space-y-8">
          <PersonalInfo personalInfo={personalInfo} setPersonalInfo={setPersonalInfo} personalInfoErrors={personalInfoErrors} />

          <Suspense fallback={<SellerLoading type="skeleton" />}>
            <SellerExperienceFields
              experienceFields={experienceFields}
              setExperienceFields={setExperienceFields}
              experienceErrors={experienceErrors}
            />
          </Suspense>

          <Suspense fallback={<SellerLoading type="skeleton" />}>
            <SellerEducationFields
              educationFields={educationFields}
              setEducationFields={setEducationFields}
              educationErrors={educationErrors}
            />
          </Suspense>

          <Suspense fallback={<SellerLoading type="skeleton" />}>
            <SellerSkillField skillsFields={skillsFields} setSkillsFields={setSkillsFields} skillsErrors={skillsErrors} />
          </Suspense>

          <Suspense fallback={<SellerLoading type="skeleton" />}>
            <SellerLanguageFields languageFields={languageFields} setLanguageFields={setLanguageFields} languagesErrors={languagesErrors} />
          </Suspense>

          <Suspense fallback={<SellerLoading type="skeleton" />}>
            <SellerCertificateFields certificatesFields={certificateFields} setCertificatesFields={setCertificateFields} />
          </Suspense>

          <Suspense fallback={<SellerLoading type="skeleton" />}>
            <SellerSocialLinksFields socialFields={socialFields} setSocialFields={setSocialFields} />
          </Suspense>
        </div>

        <div className="flex justify-end p-6 mt-8 bg-surface rounded-lg border-t border-default shadow-sm">
          <Button
            onClick={onCreateSeller}
            className="rounded-lg bg-primary px-8 py-3 text-center text-sm font-bold text-on-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-300 shadow-sm md:text-base font-themeFont"
            label="Create Profile"
          />
        </div>
      </div>
    </div>
  );
};

export default AddSeller;
