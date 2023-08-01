import { useContext } from 'react';
import {
  AuthContext,
  type IAuthContext,
} from '~/components/global/AuthProvider';

const useAuth = () => {
  const context = useContext(AuthContext);
  return context as IAuthContext;
};

export default useAuth;
