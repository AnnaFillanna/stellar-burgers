import { Navigate, Outlet } from 'react-router-dom';

import { useSelector } from '../../services/store';

export const ProtectedRoute = (): React.JSX.Element => {
  const user = useSelector((state) => state.auth.user);
  const isAuthChecked = useSelector((state) => state.auth.isAuthChecked);

  if (!isAuthChecked) {
    return <div>Проверяем авторизацию...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
