import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { FaCog, FaRegClock, FaRegMoneyBillAlt } from 'react-icons/fa';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { ISellerGig } from 'src/features/gigs/interfaces/gig.interface';
import { IResponse } from 'src/shared/shared.interface';
import { saveToLocalStorage, showErrorToast } from 'src/shared/utils/utils.service';

import { IOffer } from '../interfaces/order.interface';
import { useCreateOrderIntentMutation } from '../services/order.service';
import CheckoutForm from './checkout-form/CheckoutForm';

const Checkout: FC = (): ReactElement => {
  const stripePromise = useMemo(() => loadStripe(import.meta.env.VITE_STRIPE_KEY), []);
  const [clientSecret, setClientSecret] = useState<string>('');
  const { gigId } = useParams<string>();
  const [searchParams] = useSearchParams({});
  const { state }: { state: ISellerGig } = useLocation();
  const [offer] = useState<IOffer>(JSON.parse(`${searchParams.get('offer')}`));
  const serviceFee: number = offer.price < 50 ? (5.5 / 100) * offer.price + 2 : (5.5 / 100) * offer.price;
  const [createOrderIntent] = useCreateOrderIntentMutation();

  const createBuyerOrderIntent = async (): Promise<void> => {
    try {
      const response: IResponse = await createOrderIntent(offer.price).unwrap();
      setClientSecret(`${response.clientSecret}`);
      saveToLocalStorage('paymentIntentId', JSON.stringify(`${response.paymentIntentId}`));
    } catch (error) {
      showErrorToast('Error with checkout.');
    }
  };

  useEffect(() => {
    createBuyerOrderIntent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = { clientSecret } as StripeElementsOptions;

  return (
    <div className="bg-background min-h-screen w-full font-themeFont">
      <div className="container mx-auto flex flex-col-reverse gap-8 px-4 py-8 lg:flex-row">
        {/* Payment Details */}
        <div className="w-full lg:w-2/3">
          <div className="rounded-lg border border-default bg-surface p-6 shadow-md">
            <h2 className="mb-6 font-themeFont text-2xl font-bold text-primary">Payment</h2>
            {clientSecret && (
              <Elements options={options} key={clientSecret} stripe={stripePromise}>
                <CheckoutForm gigId={`${gigId}`} offer={offer} />
              </Elements>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="rounded-lg border border-default bg-surface p-6 shadow-md">
            <div className="mb-4 flex items-center gap-4 border-b border-default pb-4">
              <img className="h-16 w-24 rounded-md object-cover" src={state.coverImage} alt="Gig Cover Image" />
              <h3 className="font-themeFont text-lg font-semibold text-primary">{state.title}</h3>
            </div>
            <p className="mb-4 border-b border-default pb-4 text-sm text-muted">{state.description}</p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted">
                  <FaRegClock className="text-lg" />
                  <span>Expected Delivery</span>
                </div>
                <span className="font-semibold text-primary">
                  {offer.deliveryInDays} day{offer.deliveryInDays > 1 ? 's' : ''}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted">
                  <FaRegMoneyBillAlt className="text-lg" />
                  <span>Price</span>
                </div>
                <span className="font-semibold text-primary">${offer.price.toFixed(2)}</span>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted">
                  <FaCog className="text-lg" />
                  <span>Service Fee</span>
                </div>
                <span className="font-semibold text-primary">${serviceFee.toFixed(2)}</span>
              </li>
            </ul>
            <div className="my-4 border-t border-default" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-themeFont text-lg font-bold text-primary">
                <FaCog />
                <span>Total</span>
              </div>
              <span className="font-themeFont text-xl font-bold text-primary">${(offer.price + serviceFee).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
