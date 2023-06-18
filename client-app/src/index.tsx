import 'semantic-ui-css/semantic.min.css';
import './index.css';
import App from './layout/App';
import { store, StoreContext } from './layout/Stores/Store';
import ReactDOM from 'react-dom';

import reportWebVitals from './reportWebVitals';

ReactDOM.render(
    <StoreContext.Provider value={store}>
        <App />
    </StoreContext.Provider>,
    document.getElementById('root')
);

reportWebVitals();
