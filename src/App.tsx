import { FC, ReactElement, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AppRouter from 'src/AppRoutes';
import { socketService } from 'src/sockets/socket.service';
import useBeforeWindowUnload from 'src/shared/hooks/useBeforeWindowUnload';

const App: FC = (): ReactElement => {
  useBeforeWindowUnload();

  useEffect(() => {
    socketService.setupSocketConnection();
  }, []);
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
