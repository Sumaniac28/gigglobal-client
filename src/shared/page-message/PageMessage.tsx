import { FC, ReactElement } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';

import Button from '../button/Button';
import { IPageMessageProps } from '../shared.interface';

const PageMessage: FC<IPageMessageProps> = ({ header, body }): ReactElement => {
  const navigate: NavigateFunction = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[220px] bg-surface border border-default rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300">
      <h1 className="font-themeFont font-bold text-primary text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-center leading-7 mb-2">{header}</h1>
      <p className="text-muted text-base sm:text-lg font-themeFont leading-6 text-center max-w-xl mb-4">{body}</p>
      <Button
        onClick={() => navigate('/')}
        disabled={false}
        className="mt-2 rounded bg-primary px-6 py-3 text-center text-sm font-bold text-on-primary hover:bg-primary focus:outline-none transition-all duration-300 md:px-4 md:py-2 md:text-base"
        label="Go Back"
      />
    </div>
  );
};

export default PageMessage;
