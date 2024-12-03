import { jwtDecode } from 'jwt-decode';

const getUserType = () => {
  const cookies = document.cookie;
  console.log(cookies);  
  const authToken = cookies
    .split(';')
    .find((cookie) => cookie.trim().startsWith('AuthToken='))
    ?.split('=')[1];

  if (!authToken) {
    console.error('No AuthToken found in cookies');
    return null;
  }

  try {
    const decoded = jwtDecode(authToken);
    console.log('Decoded Token:', decoded);
    return decoded.userType;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export default getUserType;