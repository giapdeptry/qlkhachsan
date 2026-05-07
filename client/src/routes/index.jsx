import App from '../App';
import Abount from '../pages/Abount';
import Admin from '../pages/admin';
import Cart from '../pages/Cart';
import Contact from '../pages/Contact';
import DetailRoom from '../pages/DetailRoom';
import Facilities from '../pages/Facilities';
import ForgotPassword from '../pages/ForgotPassword';
import InfoUser from '../pages/infoUser';
import Login from '../pages/Login';
import Payment from '../pages/Payment';
import PaymentSuccess from '../pages/PaymentSuccess';
import RegisterUser from '../pages/Register';
import SearchRoom from '../pages/SearchRoom';
import Blog from '../pages/Blog';
import DetailBlogPage from '../pages/DetailBlogPage';
import Booking from '../pages/Booking';

export const router = [
    {
        path: '/',
        component: <App />,
    },
    {
        path: '/login',
        component: <Login />,
    },
    {
        path: '/register',
        component: <RegisterUser />,
    },
    {
        path: '/admin',
        component: <Admin />,
    },
    {
        path: '/detail-room/:id',
        component: <DetailRoom />,
    },
    {
        path: '/search-room',
        component: <SearchRoom />,
    },
    {
        path: '/payment',
        component: <Payment />,
    },
    {
        path: '/payment-success/:id',
        component: <PaymentSuccess />,
    },
    {
        path: '/booking/:id',
        component: <Booking />,
    },
    {
        path: '/booking-info',
        component: <Cart />,
    },
    {
        path: '/profile',
        component: <InfoUser />,
    },
    {
        path: '/order',
        component: <InfoUser />,
    },
    {
        path: '/facilities',
        component: <Facilities />,
    },
    {
        path: '/about',
        component: <Abount />,
    },
    {
        path: '/contact',
        component: <Contact />,
    },
    {
        path: '/watch',
        component: <InfoUser />,
    },
    {
        path: '/forgot-password',
        component: <ForgotPassword />,
    },
    {
        path: '/blog',
        component: <Blog />,
    },
    {
        path: '/blog/:id',
        component: <DetailBlogPage />,
    },
];
