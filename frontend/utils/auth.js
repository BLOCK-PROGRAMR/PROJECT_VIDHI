export const checkAuth = () => {
    const token = localStorage.getItem('token');
    const expiryTime = localStorage.getItem('expiryTime');
    
    if (!token || !expiryTime) {
      return false;
    }
  
    // Check if token has expired
    if (new Date().getTime() > parseInt(expiryTime)) {
      localStorage.removeItem('token');
      localStorage.removeItem('expiryTime');
      localStorage.removeItem('userData');
      return false;
    }
  
    return true;
  };
  
  export const getUserRole = () => {
    const userData = localStorage.getItem('userData');
    if (!userData) return null;
    
    try {
      const { role } = JSON.parse(userData);
      return role;
    } catch (error) {
      return null;
    }
  };
  
  export const isTeacher = () => getUserRole() === 'Teacher';