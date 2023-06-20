import 'semantic-ui-css/semantic.min.css';
import './index.css';
import { store, StoreContext } from './layout/Stores/Store';
import ReactDOM from 'react-dom';

import reportWebVitals from './reportWebVitals';
import { RouterProvider } from 'react-router';
import { router } from './routing/router';

ReactDOM.render(
    <StoreContext.Provider value={store}>
        <RouterProvider router={router} />
    </StoreContext.Provider>,
    document.getElementById('root')
);

reportWebVitals();
