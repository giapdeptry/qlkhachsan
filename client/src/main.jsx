import { createRoot } from 'react-dom/client';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { router } from './routes';
import { Provider } from './store/Provider';

createRoot(document.getElementById('root')).render(
    <Provider>
        <Router>
            <Routes>
                {router.map((route, index) => (
                    <Route key={index} path={route.path} element={route.component} />
                ))}
            </Routes>
        </Router>
    </Provider>,
);
