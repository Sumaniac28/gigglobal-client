import { FC, ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AppRouter from 'src/AppRoutes';

const App: FC = (): ReactElement => {
  return (
    <>
      <BrowserRouter>
        <div className="w-full min-h-screen">
          <AppRouter />
          <ToastContainer />
        </div>
      </BrowserRouter>
    </>
  );
};

export default App;
