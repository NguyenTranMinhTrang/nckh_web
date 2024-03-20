import React, { useEffect } from 'react';
import './App.css';
import AppNavigation from './AppNavigation';
import { Provider } from 'react-redux';
import store from './redux/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setKey } from 'react-geocode';
import { KEY_API_GOOGLE_MAP } from './constants/AppConstant';

const App = () => {

  useEffect(() => {
    setKey(KEY_API_GOOGLE_MAP);
  }, []);

  return (
    <Provider store={store}>
      <AppNavigation />
      <ToastContainer
        position="top-right"
        autoClose={1000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Provider>
  )
}

export default App;
