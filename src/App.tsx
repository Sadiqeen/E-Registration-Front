import { MantineProvider } from '@mantine/core';
import { Provider } from 'react-redux';
import store from '@/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';
import { ModalsProvider } from '@mantine/modals';

import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';
import '@mantine/dates/styles.css';
import './App.css';

function App() {

  return (
    <Provider store={store}>
      <MantineProvider>
        <ModalsProvider>
          <RouterProvider router={router} />
          <ToastContainer />
        </ModalsProvider>
      </MantineProvider>
    </Provider>

  );
}

export default App;
