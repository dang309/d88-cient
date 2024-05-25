import { useContext } from 'react';

import { AuthContext } from 'src/contexts/jwt';

// ----------------------------------------------------------------------

const useAuth = () => useContext(AuthContext);

export default useAuth;
