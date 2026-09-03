import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import './AdminLayout.css';

/**
 * Shared admin layout wrapper — sidebar + header + content area.
 * Used by all admin pages for consistent layout.
 */
export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="admin-layout" id="admin-layout">
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="admin-main">
        <AdminHeader
          onMenuToggle={() => setIsSidebarOpen((prev) => !prev)}
        />
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}
