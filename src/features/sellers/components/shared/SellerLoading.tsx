import { FC, ReactElement } from 'react';

interface ISellerLoadingProps {
  message?: string;
  type?: 'spinner' | 'skeleton' | 'card';
  className?: string;
}

const SellerLoading: FC<ISellerLoadingProps> = ({ 
  message = 'Loading...', 
  type = 'spinner',
  className = ''
}): ReactElement => {
  if (type === 'skeleton') {
    return (
      <div className={`bg-surface p-6 rounded-lg border border-default ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted/20 rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-muted/20 rounded w-full"></div>
            <div className="h-4 bg-muted/20 rounded w-4/5"></div>
            <div className="h-4 bg-muted/20 rounded w-3/5"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className={`flex justify-center items-center p-8 bg-surface rounded-lg border border-default ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
          <p className="text-muted font-themeFont text-sm">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex justify-center items-center p-8 ${className}`}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
        <span className="text-muted font-themeFont text-sm">{message}</span>
      </div>
    </div>
  );
};

export default SellerLoading;
