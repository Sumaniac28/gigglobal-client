import { PDFDownloadLink } from '@react-pdf/renderer';
import { ChangeEvent, FC, ReactElement, useRef, useState } from 'react';
import { NavigateFunction, useNavigate, useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { ISellerGig } from 'src/features/gigs/interfaces/gig.interface';
import { useGetGigByIdQuery } from 'src/features/gigs/services/gigs.service';
import Button from 'src/shared/button/Button';
import TextAreaInput from 'src/shared/inputs/TextAreaInput';
import { IResponse } from 'src/shared/shared.interface';
import { TimeAgo } from 'src/shared/utils/timeago.utils';
import { deleteFromLocalStorage, generateRandomNumber, getDataFromLocalStorage, showErrorToast } from 'src/shared/utils/utils.service';
import { useAppSelector } from 'src/store/store';
import { IReduxState } from 'src/store/store.interface';

import { OrderContext } from '../context/OrderContext';
import { IOffer, IOrderDocument, IOrderInvoice } from '../interfaces/order.interface';
import { useCreateOrderMutation } from '../services/order.service';
import Invoice from './Invoice/Invoice';

const Requirement: FC = (): ReactElement => {
  const buyer = useAppSelector((state: IReduxState) => state.buyer);
  const [requirement, setRequirement] = useState<string>('');
  const { gigId } = useParams<string>();
  const [searchParams] = useSearchParams({});
  const gigRef = useRef<ISellerGig>();
  const placeholder = 'https://placehold.co/330x220?text=Placeholder';
  const offer: IOffer = JSON.parse(`${searchParams.get('offer')}`);
  const order_date = `${searchParams.get('order_date')}`;
  const serviceFee: number = offer.price < 50 ? (5.5 / 100) * offer.price + 2 : (5.5 / 100) * offer.price;
  const navigate: NavigateFunction = useNavigate();
  const orderId = `JO${generateRandomNumber(11)}`;
  const invoiceId = `JI${generateRandomNumber(11)}`;
  const { data, isSuccess } = useGetGigByIdQuery(`${gigId}`);
  const [createOrder] = useCreateOrderMutation();

  if (isSuccess) {
    gigRef.current = data.gig;
  }
  const orderInvoice: IOrderInvoice = {
    invoiceId,
    orderId,
    date: `${new Date()}`,
    buyerUsername: `${buyer.username}`,
    orderService: [
      {
        service: `${gigRef?.current?.title}`,
        quantity: 1,
        price: offer.price
      },
      {
        service: 'Service Fee',
        quantity: 1,
        price: serviceFee
      }
    ]
  };

  const startOrder = async (): Promise<void> => {
    try {
      const paymentIntentId = getDataFromLocalStorage('paymentIntentId');
      const order: IOrderDocument = {
        offer: {
          gigTitle: offer.gigTitle,
          price: offer.price,
          description: offer.description,
          deliveryInDays: offer.deliveryInDays,
          oldDeliveryDate: offer.oldDeliveryDate,
          newDeliveryDate: offer.newDeliveryDate,
          accepted: true,
          cancelled: offer.cancelled
        },
        gigId: `${gigId}`,
        sellerId: `${gigRef?.current?.sellerId}`,
        sellerImage: `${gigRef?.current?.profilePicture}`,
        sellerUsername: `${gigRef?.current?.username}`,
        sellerEmail: `${gigRef?.current?.email}`,
        gigCoverImage: `${gigRef?.current?.coverImage}`,
        gigMainTitle: `${gigRef?.current?.title}`,
        gigBasicTitle: `${gigRef?.current?.basicTitle}`,
        gigBasicDescription: `${gigRef?.current?.basicDescription}`,
        buyerId: `${buyer._id}`,
        buyerUsername: `${buyer.username}`,
        buyerImage: `${buyer.profilePicture}`,
        buyerEmail: `${buyer.email}`,
        status: 'in progress',
        orderId,
        invoiceId,
        quantity: 1,
        dateOrdered: `${new Date()}`,
        price: offer.price,
        requirements: requirement,
        paymentIntent: `${paymentIntentId}`,
        events: {
          placeOrder: order_date, // this should be the date after successful payment
          requirements: `${new Date()}`,
          orderStarted: `${new Date()}`
        }
      };
      const response: IResponse = await createOrder(order).unwrap();
      navigate(`/orders/${orderId}/activities`, { state: response?.order });
      deleteFromLocalStorage('paymentIntent');
    } catch (error) {
      showErrorToast('Error starting your order.');
    }
  };

  return (
    <div className="bg-background min-h-screen w-full font-themeFont">
      <div className="container mx-auto flex flex-col-reverse gap-8 px-4 py-8 lg:flex-row">
        {/* Main Content */}
        <div className="w-full lg:w-2/3">
          <div className="flex flex-col gap-6">
            <div className="rounded-lg border border-default bg-accent/10 p-6">
              <h2 className="font-themeFont text-2xl font-bold text-primary">Thank you for your purchase!</h2>
              <div className="mt-2 flex items-center gap-1 text-muted">
                <span>You can</span>
                <PDFDownloadLink
                  document={
                    <OrderContext.Provider value={{ orderInvoice }}>
                      <Invoice />
                    </OrderContext.Provider>
                  }
                  fileName={`${orderInvoice.invoiceId}.pdf`}
                  className="cursor-pointer text-primary underline transition-colors hover:text-primary-dark"
                >
                  download your invoice
                </PDFDownloadLink>
              </div>
            </div>

            <div className="rounded-lg border border-default bg-surface p-6 shadow-md">
              <div className="mb-4">
                <h3 className="font-themeFont text-xl font-semibold text-primary">
                  Tell the seller what you need for this project
                </h3>
                <p className="mt-1 text-muted">Provide as much detail as possible to get the best results.</p>
              </div>
              <div className="flex flex-col gap-4">
                <TextAreaInput
                  rows={5}
                  name="requirement"
                  value={requirement}
                  placeholder="For example: I need a logo for my new coffee shop. The name is 'Brew & Co.' I'd like a modern, minimalist design..."
                  className="w-full rounded-md border border-default bg-background p-3 text-sm text-primary placeholder-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  onChange={(event: ChangeEvent) => setRequirement((event.target as HTMLTextAreaElement).value)}
                />
                <Button
                  className="w-full rounded-md bg-primary px-6 py-3 text-base font-semibold text-on-primary transition-all duration-300 hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/50"
                  label="Start Order"
                  onClick={startOrder}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="rounded-lg border border-default bg-surface p-6 shadow-md">
            <img
              className="mb-4 w-full rounded-md object-cover"
              src={gigRef.current?.coverImage ?? placeholder}
              alt="Gig Cover Image"
            />
            <h3 className="mb-4 border-b border-default pb-4 font-themeFont text-lg font-semibold text-primary">
              {offer.gigTitle}
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-muted">Status</span>
                <span className="rounded-full bg-orange-300 px-3 py-1 text-xs font-bold uppercase text-on-primary">
                  Incomplete
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted">Order</span>
                <span className="font-semibold text-primary">#{orderId}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted">Order Date</span>
                <span className="font-semibold text-primary">{TimeAgo.dayMonthYear(`${new Date()}`)}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted">Quantity</span>
                <span className="font-semibold text-primary">1</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted">Price</span>
                <span className="font-semibold text-primary">${offer.price.toFixed(2)}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Requirement;
