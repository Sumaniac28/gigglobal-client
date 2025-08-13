import Quill from 'quill';
import { ChangeEvent, FC, lazy, ReactElement, Suspense, useEffect, useRef, useState } from 'react';
import equal from 'react-fast-compare';
import { FaCamera } from 'react-icons/fa';
import ReactQuill, { UnprivilegedEditor } from 'react-quill';
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';
import { ISellerDocument } from 'src/features/sellers/interfaces/seller.interface';
import { addSeller } from 'src/features/sellers/reducers/seller.reducer';
import Breadcrumb from 'src/shared/breadcrumb/Breadcrumb';
import Button from 'src/shared/button/Button';
import Dropdown from 'src/shared/dropdown/Dropdown';
import { updateHeader } from 'src/shared/header/reducers/header.reducer';
import TextAreaInput from 'src/shared/inputs/TextAreaInput';
import TextInput from 'src/shared/inputs/TextInput';
import { IApprovalModalContent } from 'src/shared/modals/interfaces/modal.interface';
import { IResponse } from 'src/shared/shared.interface';
import { checkImage, readAsBase64 } from 'src/shared/utils/image-utils.service';
import {
  categories,
  expectedGigDelivery,
  lowerCase,
  reactQuillUtils,
  replaceSpacesWithDash,
  showErrorToast
} from 'src/shared/utils/utils.service';
import { useAppDispatch, useAppSelector } from 'src/store/store';

import { useGigSchema } from 'src/features/gigs/hooks/useGigSchema';
import { GIG_MAX_LENGTH, IAllowedGigItem, ICreateGig, IShowGigModal } from '../../interfaces/gig.interface';
import { gigInfoSchema } from 'src/features/gigs/schemes/gig.schema';
import { useCreateGigMutation } from 'src/features/gigs/services/gigs.service';
import TagsInput from 'src/features/gigs/components/gig/components/TagsInput';
import CircularPageLoader from 'src/shared/page-loader/CircularPageLoader';

const ApprovalModal = lazy(() => import('src/shared/modals/ApprovalModal'));

const defaultGigInfo: ICreateGig = {
  title: '',
  categories: '',
  description: '',
  subCategories: [],
  tags: [],
  price: 0,
  coverImage: 'https://placehold.co/330x220?text=Cover+Image',
  expectedDelivery: 'Expected delivery',
  basicTitle: '',
  basicDescription: ''
};

const AddGig: FC = (): ReactElement => {
  const authUser = useAppSelector((state) => state.authUser);
  const seller = useAppSelector((state) => state.seller);
  const [gigInfo, setGigInfo] = useState<ICreateGig>(defaultGigInfo);
  const [subCategory, setSubCategory] = useState<string[]>([]);
  const [subCategoryInput, setSubCategoryInput] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagsInput, setTagsInput] = useState<string>('');
  const [showGigModal, setShowGigModal] = useState<IShowGigModal>({
    image: false,
    cancel: false
  });
  const reactQuillRef = useRef<ReactQuill | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [allowedGigItemLength, setAllowedGigItemLength] = useState<IAllowedGigItem>({
    gigTitle: '80/80',
    basicTitle: '40/40',
    basicDescription: '100/100',
    descriptionCharacters: '1200/1200'
  });
  const gigInfoRef = useRef<ICreateGig>(defaultGigInfo);
  const [approvalModalContent, setApprovalModalContent] = useState<IApprovalModalContent>();
  const navigate: NavigateFunction = useNavigate();
  const dispatch = useAppDispatch();
  const { sellerId } = useParams();
  const [schemaValidation] = useGigSchema({ schema: gigInfoSchema, gigInfo });
  const [createGig, { isLoading }] = useCreateGigMutation();

  useEffect(() => {
    dispatch(updateHeader('home'));
  }, [dispatch]);

  const handleFileChange = async (event: ChangeEvent): Promise<void> => {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    if (target.files) {
      const file: File = target.files[0];
      const isValid = checkImage(file, 'image');
      if (isValid) {
        const dataImage: string | ArrayBuffer | null = await readAsBase64(file);
        setGigInfo({ ...gigInfo, coverImage: `${dataImage}` });
      }
      setShowGigModal({ ...showGigModal, image: false });
    }
  };

  const onCreateGig = async (): Promise<void> => {
    try {
      const editor: Quill | undefined = reactQuillRef?.current?.editor;
      // In React, it is not recommended to mutate objects directly. It is better to update with useState method.
      // The reason it is not recommended is because if the object is mutated directly,
      // 1) React is not able to keep track of the change
      // 2) There will be no re-renderng of the component.
      // In our case, we don't care about the above reasons because we update a property, validate and send to the backend.
      // The updated properly is not reflected in the component and we don't need to keep track of the object.
      // We are not using the useState method inside useEffect because it causes too many rerender errors.
      // Also, we are not updating the property inside the onChange method because editor?.getText() causes too many rerender errors.
      // The only option we have right now is to directly mutate the gigInfo useState object.
      gigInfo.description = editor?.getText().trim() as string;
      const isValid: boolean = await schemaValidation();
      if (isValid) {
        const gig: ICreateGig = {
          profilePicture: `${authUser.profilePicture}`,
          sellerId,
          title: gigInfo.title,
          categories: gigInfo.categories,
          description: gigInfo.description,
          subCategories: subCategory,
          tags,
          price: gigInfo.price,
          coverImage: gigInfo.coverImage,
          expectedDelivery: gigInfo.expectedDelivery,
          basicTitle: gigInfo.basicTitle,
          basicDescription: gigInfo.basicDescription
        };
        const response: IResponse = await createGig(gig).unwrap();
        const updatedSeller: ISellerDocument = { ...seller, totalGigs: (seller.totalGigs as number) + 1 };
        dispatch(addSeller(updatedSeller));
        const title: string = replaceSpacesWithDash(gig.title);
        navigate(`/gig/${lowerCase(`${authUser.username}`)}/${title}/${response?.gig?.sellerId}/${response?.gig?.id}/view`);
      }
    } catch (error) {
      showErrorToast('Error creating gig');
    }
  };

  const onCancelCreate = (): void => {
    navigate(`/seller_profile/${lowerCase(`${authUser.username}/${sellerId}/edit`)}`);
  };

  return (
    <>
      {showGigModal.cancel && (
        <Suspense fallback={<div>Loading..</div>}>
          <ApprovalModal
            approvalModalContent={approvalModalContent}
            onClose={() => setShowGigModal({ ...showGigModal, cancel: false })}
            onClick={onCancelCreate}
          />
        </Suspense>
      )}
      <div className="relative w-screen">
        <Breadcrumb breadCrumbItems={['Seller', 'Create new gig']} />
        <div className="container relative mx-auto my-5 px-2 pb-12 md:px-0">
          {isLoading && <CircularPageLoader />}
          {authUser && !authUser.emailVerified && (
            <div className="absolute left-0 top-0 z-[80] flex h-full w-full justify-center bg-white/[0.8] text-sm font-bold md:text-base lg:text-xl">
              <span className="mt-40">Please verify your email.</span>
            </div>
          )}
          <div className="block  p-6 md:p-8">
            <div className="mb-6 grid gap-2 md:grid-cols-5">
              <div className="text-[#111111] text-base font-semibold">
                Gig title<sup className="text-red-500">*</sup>
              </div>
              <div className="col-span-4 w-full md:w-11/12 lg:w-8/12">
                <TextInput
                  className="w-full rounded border border-[#E5E7EB] p-3 text-sm text-[#4B5563] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
                  type="text"
                  name="gigTitle"
                  value={gigInfo.title}
                  placeholder="I will build something I'm good at."
                  maxLength={80}
                  onChange={(event: ChangeEvent) => {
                    const gigTitleValue: string = (event.target as HTMLInputElement).value;
                    setGigInfo({ ...gigInfo, title: gigTitleValue });
                    const counter: number = GIG_MAX_LENGTH.gigTitle - gigTitleValue.length;
                    setAllowedGigItemLength({ ...allowedGigItemLength, gigTitle: `${counter}/80` });
                  }}
                />
                <span className="mt-1 block text-right text-xs text-[#4B5563]">{allowedGigItemLength.gigTitle} Characters</span>
              </div>
            </div>

            <div className="mb-6 grid gap-2 md:grid-cols-5">
              <div className="text-[#111111] text-base font-semibold">
                Basic title<sup className="text-red-500">*</sup>
              </div>
              <div className="col-span-4 w-full md:w-11/12 lg:w-8/12">
                <TextInput
                  className="w-full rounded border border-[#E5E7EB] p-3 text-sm text-[#4B5563] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
                  placeholder="Write what exactly you'll do in short."
                  type="text"
                  name="basicTitle"
                  value={gigInfo.basicTitle}
                  maxLength={40}
                  onChange={(event: ChangeEvent) => {
                    const basicTitleValue: string = (event.target as HTMLInputElement).value;
                    setGigInfo({ ...gigInfo, basicTitle: basicTitleValue });
                    const counter: number = GIG_MAX_LENGTH.basicTitle - basicTitleValue.length;
                    setAllowedGigItemLength({ ...allowedGigItemLength, basicTitle: `${counter}/40` });
                  }}
                />
                <span className="mt-1 block text-right text-xs text-[#4B5563]">{allowedGigItemLength.basicTitle} Characters</span>
              </div>
            </div>

            <div className="mb-6 grid gap-2 md:grid-cols-5">
              <div className="text-[#111111] text-base font-semibold">
                Brief description<sup className="text-red-500">*</sup>
              </div>
              <div className="col-span-4 w-full md:w-11/12 lg:w-8/12">
                <TextAreaInput
                  className="w-full rounded border border-[#E5E7EB] p-3 text-sm text-[#4B5563] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
                  placeholder="Write a brief description..."
                  name="basicDescription"
                  value={gigInfo.basicDescription}
                  rows={5}
                  maxLength={100}
                  onChange={(event: ChangeEvent) => {
                    const basicDescriptionValue: string = (event.target as HTMLInputElement).value;
                    setGigInfo({ ...gigInfo, basicDescription: basicDescriptionValue });
                    const counter: number = GIG_MAX_LENGTH.basicDescription - basicDescriptionValue.length;
                    setAllowedGigItemLength({ ...allowedGigItemLength, basicDescription: `${counter}/100` });
                  }}
                />
                <span className="mt-1 block text-right text-xs text-[#4B5563]">{allowedGigItemLength.basicDescription} Characters</span>
              </div>
            </div>

            <div className="mb-6 grid gap-2 md:grid-cols-5">
              <div className="text-[#111111] text-base font-semibold">
                Full description<sup className="text-red-500">*</sup>
              </div>
              <div className="col-span-4 w-full md:w-11/12 lg:w-8/12">
                <ReactQuill
                  theme="snow"
                  value={gigInfo.description}
                  className="rounded border border-[#E5E7EB]"
                  modules={reactQuillUtils().modules}
                  formats={reactQuillUtils().formats}
                  ref={(element: ReactQuill | null) => {
                    reactQuillRef.current = element;
                    const editor = reactQuillRef.current?.getEditor();
                    editor?.on('text-change', () => {
                      if (editor.getLength() > GIG_MAX_LENGTH.fullDescription) {
                        editor.deleteText(GIG_MAX_LENGTH.fullDescription, editor.getLength());
                      }
                    });
                  }}
                  onChange={(event: string, _, __, editor: UnprivilegedEditor) => {
                    setGigInfo({ ...gigInfo, description: event });
                    const counter: number = GIG_MAX_LENGTH.fullDescription - editor.getText().length;
                    setAllowedGigItemLength({ ...allowedGigItemLength, descriptionCharacters: `${counter}/1200` });
                  }}
                />
                <span className="mt-1 block text-right text-xs text-[#4B5563]">
                  {allowedGigItemLength.descriptionCharacters} Characters
                </span>
              </div>
            </div>

            <div className="mb-8 grid gap-2 md:grid-cols-5">
              <div className="text-[#111111] text-base font-semibold">
                Category<sup className="text-red-500">*</sup>
              </div>
              <div className="col-span-4 w-full md:w-11/12 lg:w-8/12 relative">
                <Dropdown
                  text={gigInfo.categories}
                  maxHeight="300"
                  mainClassNames="absolute bg-white border border-[#E5E7EB] z-10"
                  values={categories()}
                  onClick={(item: string) => {
                    setGigInfo({ ...gigInfo, categories: item });
                  }}
                />
              </div>
            </div>

            <TagsInput
              title="SubCategory"
              placeholder="E.g. Website development, Mobile apps"
              gigInfo={gigInfo}
              setGigInfo={setGigInfo}
              tags={subCategory}
              itemInput={subCategoryInput}
              itemName="subCategories"
              counterText="Subcategories"
              inputErrorMessage={false}
              setItem={setSubCategory}
              setItemInput={setSubCategoryInput}
            />

            <TagsInput
              title="Tags"
              placeholder="Enter search terms for your gig"
              gigInfo={gigInfo}
              setGigInfo={setGigInfo}
              tags={tags}
              itemInput={tagsInput}
              itemName="tags"
              counterText="Tags"
              inputErrorMessage={false}
              setItem={setTags}
              setItemInput={setTagsInput}
            />

            <div className="mb-6 grid gap-2 md:grid-cols-5">
              <div className="text-[#111111] text-base font-semibold">
                Price<sup className="text-red-500">*</sup>
              </div>
              <div className="col-span-4 w-full md:w-11/12 lg:w-8/12">
                <TextInput
                  type="number"
                  className="w-full rounded border border-[#E5E7EB] p-3 text-sm text-[#4B5563] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
                  placeholder="Enter minimum price"
                  name="price"
                  value={gigInfo.price}
                  onChange={(event: ChangeEvent) => {
                    const value: string = (event.target as HTMLInputElement).value;
                    setGigInfo({ ...gigInfo, price: parseInt(value) > 0 ? parseInt(value) : 0 });
                  }}
                />
              </div>
            </div>

            <div className="mb-12 grid gap-2 md:grid-cols-5">
              <div className="text-[#111111] text-base font-semibold">
                Expected delivery<sup className="text-red-500">*</sup>
              </div>
              <div className="col-span-4 w-full md:w-11/12 lg:w-8/12 relative">
                <Dropdown
                  text={gigInfo.expectedDelivery}
                  maxHeight="300"
                  mainClassNames="absolute bg-white z-40 border border-[#E5E7EB]"
                  values={expectedGigDelivery()}
                  onClick={(item: string) => {
                    setGigInfo({ ...gigInfo, expectedDelivery: item });
                  }}
                />
              </div>
            </div>

            <div className="mb-10 grid gap-2 md:grid-cols-5">
              <div className="text-[#111111] text-base font-semibold">
                Cover image<sup className="text-red-500">*</sup>
              </div>
              <div
                className="relative col-span-4 w-fit cursor-pointer"
                onMouseEnter={() => setShowGigModal((item) => ({ ...item, image: true }))}
                onMouseLeave={() => setShowGigModal((item) => ({ ...item, image: false }))}
              >
                {gigInfo.coverImage ? (
                  <img src={gigInfo.coverImage} alt="Cover" className="h-[220px] w-[320px] rounded border border-[#E5E7EB] object-cover" />
                ) : (
                  <div className="h-[220px] w-[320px] rounded bg-[#dee1e7]"></div>
                )}
                {showGigModal.image && (
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="absolute inset-0 flex items-center justify-center rounded bg-[#dee1e7]/70"
                  >
                    <FaCamera className="text-xl text-[#111111]" />
                  </div>
                )}
                <TextInput
                  name="image"
                  ref={fileRef}
                  type="file"
                  style={{ display: 'none' }}
                  onClick={() => fileRef.current && (fileRef.current.value = '')}
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="grid gap-y-4 md:grid-cols-5">
              <div></div>
              <div className="col-span-4 flex flex-wrap gap-4">
                <Button
                  disabled={isLoading}
                  className="rounded bg-[#14B8A6] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0F766E] focus:outline-none"
                  label="Create Gig"
                  onClick={onCreateGig}
                />
                <Button
                  disabled={isLoading}
                  className="rounded bg-red-500 px-6 py-3 text-sm font-semibold text-white hover:bg-red-400 focus:outline-none"
                  label="Cancel"
                  onClick={() => {
                    const isEqual = equal(gigInfo, gigInfoRef.current);
                    if (!isEqual) {
                      setApprovalModalContent({
                        header: 'Cancel Gig Creation',
                        body: 'Are you sure you want to cancel?',
                        btnText: 'Yes, Cancel',
                        btnColor: 'bg-red-500 hover:bg-red-400'
                      });
                      setShowGigModal({ ...showGigModal, cancel: true });
                    } else {
                      onCancelCreate();
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddGig;
