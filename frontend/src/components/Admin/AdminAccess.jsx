import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

const AdminAccess = ({ children }) => {
  const [tapCount, setTapCount] = useState(0);
  const [lastTap, setLastTap] = useState(0);
  const navigate = useNavigate();

  // Keyboard shortcut: Shift + Ctrl + A
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.shiftKey && e.ctrlKey && e.key === 'A') {
        e.preventDefault();
        // Check if user is admin (you can implement proper admin check)
        const token = localStorage.getItem('access_token');
        if (token) {
          // Verify admin status with backend
          fetch('https://spylink-backend.onrender.com/api/auth/profile/', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          .then(res => res.json())
          .then(user => {
            if (user.is_staff || user.is_superuser) {
              navigate('/admin');
            } else {
              alert('Admin access only. Contact system administrator.');
            }
          })
          .catch(() => {
            alert('Please login first');
            navigate('/login');
          });
        } else {
          alert('Please login first');
          navigate('/login');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Triple tap on logo for mobile
  const handleLogoTap = () => {
    const now = Date.now();
    const tapDelay = 300; // ms between taps
    
    if (now - lastTap < tapDelay) {
      setTapCount(prev => prev + 1);
    } else {
      setTapCount(1);
    }
    setLastTap(now);
    
    // Triple tap detected
    if (tapCount + 1 >= 3) {
      setTapCount(0);
      // Check admin status
      const token = localStorage.getItem('access_token');
      if (token) {
        fetch('https://spylink-networks.onrender.com/api/auth/profile/', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(user => {
          if (user.is_staff || user.is_superuser) {
            navigate('/admin');
          } else {
            alert('Admin access only');
          }
        })
        .catch(() => {
          alert('Please login first');
          navigate('/login');
        });
      } else {
        alert('Please login first');
        navigate('/login');
      }
    }
  };

  // Clone the first child and add the tap handler
  const enhancedChildren = React.Children.map(children, child => {
    if (child && child.type && (child.type.name === 'Navbar' || child.props?.className?.includes('logo'))) {
      return React.cloneElement(child, { onTap: handleLogoTap });
    }
    return child;
  });

  return <>{enhancedChildren}</>;
};

export default AdminAccess;