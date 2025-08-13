import { cloneDeep, filter, findIndex } from 'lodash';
import { ChangeEvent, FC, ReactElement, useContext, useState } from 'react';
import { SellerContext } from 'src/features/sellers/context/SellerContext';
import { ICertificate, ICertificateEditProps } from 'src/features/sellers/interfaces/seller.interface';
import Button from 'src/shared/button/Button';
import Dropdown from 'src/shared/dropdown/Dropdown';
import TextInput from 'src/shared/inputs/TextInput';
import { yearsList } from 'src/shared/utils/utils.service';

const CertificateEditFields: FC<ICertificateEditProps> = ({
  type,
  selectedCertificate,
  setShowCertificateAddForm,
  setShowCertificateEditForm
}): ReactElement => {
  const { sellerProfile, setSellerProfile } = useContext(SellerContext);
  const [certificateItem, setCertificateItem] = useState<ICertificate>({
    name: selectedCertificate && selectedCertificate.name ? selectedCertificate.name : '',
    from: selectedCertificate && selectedCertificate.from ? selectedCertificate.from : '',
    year: selectedCertificate && selectedCertificate.year ? selectedCertificate.year : 'Year'
  });
  const [year, setYear] = useState<string>(selectedCertificate && selectedCertificate.year ? `${selectedCertificate.year}` : 'Year');

  const onHandleUpdate = (): void => {
    setCertificateItem({ ...certificateItem, year });
    if (type === 'add') {
      const newItem: ICertificate = {
        name: certificateItem.name,
        from: certificateItem.from,
        year
      };
      const clonedCertificates: ICertificate[] = cloneDeep(sellerProfile.certificates) as ICertificate[];
      clonedCertificates.push(newItem);
      if (setSellerProfile && setShowCertificateAddForm) {
        setSellerProfile({ ...sellerProfile, certificates: clonedCertificates });
        setShowCertificateAddForm(false);
      }
    } else {
      const itemIndex: number = findIndex(sellerProfile?.certificates, (value: ICertificate) => value.name === selectedCertificate?.name);
      const clonedCertificates: ICertificate[] = cloneDeep(sellerProfile?.certificates) as ICertificate[];
      const clonedItem: ICertificate = { name: certificateItem.name, from: certificateItem.from, year, _id: selectedCertificate?._id };
      clonedCertificates.splice(itemIndex, 1, clonedItem);
      const filtered = filter(clonedCertificates, (item: ICertificate) => item.name !== '');
      if (setSellerProfile && setShowCertificateEditForm) {
        setSellerProfile({ ...sellerProfile, certificates: filtered });
        setShowCertificateEditForm(false);
      }
    }
  };

  return (
    <div className="flex w-full flex-col bg-surface rounded-lg shadow-sm border border-default p-6 md:p-8">
      <div className="mb-8 space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-primary font-themeFont leading-6">Certificate or Award</label>
          <TextInput
            className="w-full rounded-lg border border-default bg-surface px-4 py-3 text-sm font-normal text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
            placeholder="Enter certificate or award name"
            type="text"
            name="name"
            value={certificateItem.name}
            onChange={(event: ChangeEvent) => {
              setCertificateItem({ ...certificateItem, name: (event.target as HTMLInputElement).value });
            }}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-primary font-themeFont leading-6">Issuing Organization</label>
          <TextInput
            className="w-full rounded-lg border border-default bg-surface px-4 py-3 text-sm font-normal text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
            placeholder="e.g: Google, Microsoft, AWS"
            type="text"
            name="from"
            value={certificateItem.from}
            onChange={(event: ChangeEvent) => {
              setCertificateItem({ ...certificateItem, from: (event.target as HTMLInputElement).value });
            }}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-primary font-themeFont leading-6">Year Obtained</label>
          <div className="relative">
            <Dropdown
              text={year}
              maxHeight="300"
              mainClassNames="absolute z-50 bg-surface shadow-lg rounded-lg border border-default"
              values={yearsList(100)}
              setValue={setYear}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center pt-6 border-t border-default">
        <Button
          disabled={(year === 'Year' || !certificateItem.name || !certificateItem.from) && type === 'add'}
          className={`w-full sm:w-auto rounded-lg px-8 py-3 text-sm font-bold font-themeFont text-on-primary focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300
        ${
          (year === 'Year' || !certificateItem.name || !certificateItem.from) && type === 'add'
            ? 'bg-primary cursor-not-allowed opacity-40'
            : 'bg-primary hover:bg-primary cursor-pointer focus:ring-primary shadow-md hover:shadow-lg'
        }
      `}
          label={`${type === 'add' ? 'Add Certificate' : 'Update Certificate'}`}
          onClick={onHandleUpdate}
        />

        <Button
          className="w-full sm:w-auto rounded-lg bg-surface border border-default px-8 py-3 text-sm font-bold font-themeFont text-primary hover:bg-background hover:border-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 shadow-sm hover:shadow-md"
          label="Cancel"
          onClick={() => {
            if (type === 'add' && setShowCertificateAddForm) {
              setShowCertificateAddForm(false);
            } else if (type === 'edit' && setShowCertificateEditForm) {
              setShowCertificateEditForm(false);
            }
          }}
        />
      </div>
    </div>
  );
};

export default CertificateEditFields;
