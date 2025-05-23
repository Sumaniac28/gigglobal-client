import { FC, lazy, LazyExoticComponent, ReactElement, Suspense, useContext, useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { SellerContext } from 'src/features/sellers/context/SellerContext';
import { ICertificate, ICertificateEditProps } from 'src/features/sellers/interfaces/seller.interface';
import { v4 as uuidv4 } from 'uuid';

const CertificateEditFields: LazyExoticComponent<FC<ICertificateEditProps>> = lazy(
  () => import('src/features/sellers/components/profile/components/overview/certifications/CertificateEditFields')
);

const Certifications: FC = (): ReactElement => {
  const [showCertificateAddForm, setShowCertificateAddForm] = useState<boolean>(false);
  const [showCertificateEditForm, setShowCertificateEditForm] = useState<boolean>(false);
  const [selectedCertificate, setSelectedCertificate] = useState<ICertificate>();
  const { sellerProfile, showEditIcons } = useContext(SellerContext);

  return (
    <div className="mt-6 rounded-md border border-[#D1D5DB] bg-white">
      <div className="flex items-center justify-between border-b border-[#D1D5DB] px-4 py-3">
        <h4 className="text-sm font-bold text-[#111111] md:text-base">CERTIFICATIONS</h4>
        {showEditIcons && (
          <span
            onClick={() => {
              setShowCertificateAddForm(!showCertificateAddForm);
              setShowCertificateEditForm(false);
            }}
            className="cursor-pointer text-sm text-[#14B8A6] hover:text-[#0F766E] md:text-base"
          >
            Add New
          </span>
        )}
      </div>

      <ul className="list-none divide-y divide-[#D1D5DB]">
        {showCertificateAddForm && (
          <li className="px-4 py-3">
            <CertificateEditFields type="add" setShowCertificateAddForm={setShowCertificateAddForm} />
          </li>
        )}

        {!showCertificateAddForm &&
          sellerProfile?.certificates.map((certificate: ICertificate) => (
            <li key={uuidv4()} className="flex items-start justify-between px-4 py-3 text-sm text-[#4B5563] md:text-base">
              {!showCertificateEditForm && (
                <div className="flex flex-col">
                  <div className="font-bold text-[#111111]">{certificate.name}</div>
                  <div className="">
                    {certificate.from} – {certificate.year}
                  </div>
                </div>
              )}

              {showCertificateEditForm && selectedCertificate?.name === certificate.name && (
                <Suspense>
                  <CertificateEditFields
                    type="edit"
                    selectedCertificate={selectedCertificate}
                    setShowCertificateEditForm={setShowCertificateEditForm}
                  />
                </Suspense>
              )}

              {!showCertificateEditForm && showEditIcons && (
                <div className="text-[#14B8A6] hover:text-[#0F766E]">
                  <FaPencilAlt
                    onClick={() => {
                      setShowCertificateAddForm(false);
                      setShowCertificateEditForm(!showCertificateEditForm);
                      setSelectedCertificate(certificate);
                    }}
                    size="14"
                    className="cursor-pointer"
                  />
                </div>
              )}
            </li>
          ))}

        {sellerProfile.certificates.length === 0 && !showCertificateAddForm && !showCertificateEditForm && (
          <li className="px-4 py-3 text-sm text-[#4B5563]">No information</li>
        )}
      </ul>
    </div>
  );
};

export default Certifications;
