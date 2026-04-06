import './admin.css';
import Sidebar from '@/components/admin/Sidebar';
import { ToastProvider } from '@/components/admin/Toast';

export const metadata = {
  title: 'House of H. — Admin',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="admin-layout">
        <Sidebar />
        <main className="admin-main">
          {children}
        </main>
      </div>
    </ToastProvider>
  );
}
