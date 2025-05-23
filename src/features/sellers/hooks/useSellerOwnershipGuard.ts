import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVerifyOwnershipQuery } from '../services/seller.service';

export const useSellerOwnershipGuard = (sellerId: string) => {
  const navigate = useNavigate();
  const { data, isError } = useVerifyOwnershipQuery(sellerId, { skip: !sellerId });

  useEffect(() => {
    if (isError || (data && !data.authorized)) {
      navigate('/');
    }
  }, [data, isError, navigate]);
};
