import { Routes, Route, Navigate } from 'react-router-dom';
import { LayoutGrid, Users, User } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import AdminOverview from './AdminOverview';
import ManageUsers from './ManageUsers';
import Profile from '../Profile';

const links = [
  { to: '/admin', label: 'Analytics', icon: LayoutGrid, end: true },
  { to: '/admin/users', label: 'Manage Users', icon: Users },
  { to: '/admin/profile', label: 'Profile', icon: User },
];

export default function AdminDashboard() {
  return (
    <DashboardLayout title="Admin Dashboard" subtitle="Platform-wide overview and management" links={links}>
      <Routes>
        <Route index element={<AdminOverview />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
