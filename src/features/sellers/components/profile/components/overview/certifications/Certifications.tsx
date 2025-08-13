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
    <div className="mt-8 rounded-lg border border-default bg-surface shadow-sm">
      <div className="flex items-center justify-between border-b border-default px-6 py-4 bg-background rounded-t-lg">
        <h4 className="text-lg font-bold font-themeFont text-primary leading-6 md:text-xl">CERTIFICATIONS</h4>
        {showEditIcons && (
          <button
            onClick={() => {
              setShowCertificateAddForm(!showCertificateAddForm);
              setShowCertificateEditForm(false);
            }}
            className="inline-flex items-center px-4 py-2 text-sm font-semibold font-themeFont text-primary bg-accent hover:bg-accent rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 shadow-sm hover:shadow-md md:text-base"
          >
            <span className="text-on-primary">+ Add New</span>
          </button>
        )}
      </div>

      <ul className="list-none divide-y divide-default">
        {showCertificateAddForm && (
          <li className="px-6 py-6 bg-background">
            <CertificateEditFields type="add" setShowCertificateAddForm={setShowCertificateAddForm} />
          </li>
        )}

        {!showCertificateAddForm &&
          sellerProfile?.certificates.map((certificate: ICertificate) => (
            <li key={uuidv4()} className="group flex items-start justify-between px-6 py-5 hover:bg-background transition-all duration-300">
              {!showCertificateEditForm && (
                <div className="flex flex-col space-y-2 flex-1 min-w-0">
                  <div className="text-base font-bold font-themeFont text-primary leading-6 md:text-lg">{certificate.name}</div>
                  <div className="text-sm text-muted leading-5 md:text-base">
                    <span className="font-medium">{certificate.from}</span>
                    <span className="mx-2 text-border-default">•</span>
                    <span className="bg-accent text-on-primary px-2 py-1 rounded-full text-xs font-medium">{certificate.year}</span>
                  </div>
                </div>
              )}

              {showCertificateEditForm && selectedCertificate?.name === certificate.name && (
                <div className="w-full">
                  <Suspense>
                    <CertificateEditFields
                      type="edit"
                      selectedCertificate={selectedCertificate}
                      setShowCertificateEditForm={setShowCertificateEditForm}
                    />
                  </Suspense>
                </div>
              )}

              {!showCertificateEditForm && showEditIcons && (
                <div className="flex items-center ml-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={() => {
                      setShowCertificateAddForm(false);
                      setShowCertificateEditForm(!showCertificateEditForm);
                      setSelectedCertificate(certificate);
                    }}
                    className="p-2 text-primary hover:text-on-primary bg-transparent hover:bg-primary rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label="Edit certificate"
                  >
                    <FaPencilAlt size="14" />
                  </button>
                </div>
              )}
            </li>
          ))}

        {sellerProfile.certificates.length === 0 && !showCertificateAddForm && !showCertificateEditForm && (
          <li className="px-6 py-12 text-center">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center">
                <span className="text-2xl text-muted">📜</span>
              </div>
              <div className="text-base text-muted font-medium leading-6">No certifications added yet</div>
              <div className="text-sm text-muted leading-5">Add your professional certifications to showcase your expertise</div>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Certifications;
