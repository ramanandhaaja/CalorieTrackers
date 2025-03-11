import React from 'react';

const Logo: React.FC<Record<string, any>> = (props) => {
  return (
    <div style={{ 
      fontSize: '36px', 
      fontWeight: 'bold',
      color: '#FFFFFF',
      padding: '10px 0'
    }}>
      Welcome
    </div>
  );
};

export default Logo;
