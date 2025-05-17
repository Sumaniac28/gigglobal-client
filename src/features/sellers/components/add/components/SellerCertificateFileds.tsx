import { ChangeEvent, FC, lazy, LazyExoticComponent, ReactElement, Suspense } from 'react';
import { ICertificate, ICertificateProps } from 'src/features/sellers/interfaces/seller.interface';
import Button from 'src/shared/button/Button';
import TextInput from 'src/shared/inputs/TextInput';
import { yearsList } from 'src/shared/utils/utils.service';
import { IDropdownProps } from 'src/shared/shared.interface';

const Dropdown: LazyExoticComponent<FC<IDropdownProps>> = lazy(() => import('src/shared/dropdown/Dropdown'));

const SellerCertificateFields: FC<ICertificateProps> = ({ certificatesFields, setCertificatesFields }): ReactElement => {
  const adCertificateFields = (): void => {
    const newfield: ICertificate = {
      name: '',
      from: '',
      year: 'Year'
    };
    if (certificatesFields && setCertificatesFields) {
      setCertificatesFields([...certificatesFields, newfield]);
    }
  };

  const removeCertificateFields = (index: number): void => {
    if (certificatesFields && setCertificatesFields && certificatesFields.length > 1) {
      const data: ICertificate[] = [...certificatesFields];
      data.splice(index, 1);
      setCertificatesFields([...data]);
    }
  };

  const handleCertificateFieldsChange = (event: ChangeEvent, index: number): void => {
    if (certificatesFields && setCertificatesFields) {
      const target: HTMLInputElement = event.target as HTMLInputElement;
      const data: ICertificate[] = [...certificatesFields];
      data[index][target.name] = target.value;
      setCertificatesFields([...data]);
    }
  };

  return (
    <>
      <div className="bg-[#F9FAFB] px-4 py-6 sm:px-6 md:px-10 lg:px-16 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="pb-4 text-xl font-bold text-[#111111]">Awards/Certificates</h2>
          <Button
            className="h-8 rounded-md bg-[#14B8A6] px-5 text-sm font-semibold text-white transition hover:bg-[#0F766E] focus:outline-none"
            onClick={adCertificateFields}
            label="Add More"
          />
        </div>

        {certificatesFields?.map((input: ICertificate, index: number) => (
          <div key={index}>
            <div className="flex flex-col">
              <TextInput
                className="w-full rounded-md border border-[#E5E7EB] p-3 mb-4 text-sm text-[#111111] placeholder-[#9CA3AF] focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6] transition"
                placeholder="Certificate or Award"
                type="text"
                name="name"
                value={input.name}
                onChange={(event: ChangeEvent) => handleCertificateFieldsChange(event, index)}
              />
              <TextInput
                className="w-full rounded-md border border-[#E5E7EB] p-3 mb-4 text-sm text-[#111111] placeholder-[#9CA3AF] focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6] transition"
                placeholder="Certificate From (e.g: Google)"
                type="text"
                name="from"
                value={input.from}
                onChange={(event: ChangeEvent) => handleCertificateFieldsChange(event, index)}
              />
            </div>
            <div className="relative flex flex-col">
              <Suspense>
                <Dropdown
                  text={`${input.year}`}
                  maxHeight="300"
                  mainClassNames="absolute bg-white z-10"
                  values={yearsList(100)}
                  onClick={(item: string) => {
                    const data: ICertificate[] = [...certificatesFields];
                    data[index]['year'] = `${item}`;
                    if (setCertificatesFields) {
                      setCertificatesFields([...data]);
                    }
                  }}
                />
              </Suspense>
              {certificatesFields.length > 1 && index > 0 && (
                <div className="mb-4 mt-16">
                  <Button
                    className="h-8 rounded-md bg-red-500 px-5 text-sm font-semibold text-white transition hover:bg-red-400 focus:outline-none"
                    onClick={() => removeCertificateFields(index)}
                    label="Delete"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SellerCertificateFields;
