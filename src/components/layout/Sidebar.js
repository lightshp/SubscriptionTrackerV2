// src/components/layout/Sidebar.js
import React from 'react';

const Sidebar = () => {
  return (
    <aside style={{ 
      width: '200px', 
      backgroundColor: '#e9ecef', 
      padding: '1rem',
      height: 'calc(100vh - 110px)' /* Approximate height minus header/footer */
    }}>
      <p>Sidebar</p>
      {/* Navigation links will go here later */}
    </aside>
  );
};

export default Sidebar;
