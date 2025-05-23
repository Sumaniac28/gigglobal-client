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
    <div className="flex w-full flex-col">
      <div className="mb-16 px-3">
        <TextInput
          className="mb-4 w-full rounded border border-[#E5E7EB] p-2.5 text-sm font-normal text-[#4B5563] focus:outline-none"
          placeholder="Certificate or Award"
          type="text"
          name="name"
          value={certificateItem.name}
          onChange={(event: ChangeEvent) => {
            setCertificateItem({ ...certificateItem, name: (event.target as HTMLInputElement).value });
          }}
        />
        <TextInput
          className="mb-4 w-full rounded border border-[#E5E7EB] p-2.5 text-sm font-normal text-[#4B5563] focus:outline-none"
          placeholder="Certificate From (e.g: Google)"
          type="text"
          name="from"
          value={certificateItem.from}
          onChange={(event: ChangeEvent) => {
            setCertificateItem({ ...certificateItem, from: (event.target as HTMLInputElement).value });
          }}
        />
        <div className="relative">
          <Dropdown text={year} maxHeight="300" mainClassNames="absolute z-50 bg-white" values={yearsList(100)} setValue={setYear} />
        </div>
      </div>
      <div className="z-20 my-4 mt-10 flex cursor-pointer justify-center md:z-0 md:mt-0">
        <Button
          disabled={(year === 'Year' || !certificateItem.name || !certificateItem.from) && type === 'add'}
          className={`md:text-md rounded px-6 py-1 text-center text-sm font-bold text-white focus:outline-none md:py-2
        ${
          (year === 'Year' || !certificateItem.name || !certificateItem.from) && type === 'add'
            ? 'bg-[#14B8A6] cursor-not-allowed opacity-40'
            : 'bg-[#14B8A6] hover:bg-[#0F766E] cursor-pointer'
        }
      `}
          label={`${type === 'add' ? 'Add' : 'Update'}`}
          onClick={onHandleUpdate}
        />
        &nbsp;&nbsp;
        <Button
          className="md:text-md rounded bg-[#E5E7EB] px-6 py-1 text-center text-sm font-bold text-[#111111] hover:bg-[#D1D5DB] focus:outline-none md:py-2"
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
