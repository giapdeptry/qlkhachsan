import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore';

function AdminGuard({ children }) {
    const { dataUser } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!dataUser._id) {
            // Not logged in
            navigate('/login');
        } else if (!dataUser.isAdmin) {
            // Not admin
            navigate('/');
        }
    }, [dataUser, navigate]);

    if (!dataUser._id || !dataUser.isAdmin) {
        return null; // Or a loading spinner
    }

    return children;
}

export default AdminGuard;