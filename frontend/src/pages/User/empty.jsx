import React from 'react';
import { Outlet } from 'react-router-dom';

const SimpleComponent = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default SimpleComponent;