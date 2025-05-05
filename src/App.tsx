import { FC, ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from 'src/AppRoutes';

const App: FC = (): ReactElement => {
  return (
    <>
      <BrowserRouter>
        <div className="w-full min-h-screen">
          <AppRouter />
        </div>
      </BrowserRouter>
    </>
  );
};

export default App;
