import { Routes, Route, Navigate } from 'react-router-dom';
import { LayoutGrid, BookMarked, User } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import StudentOverview from './StudentOverview';
import MyCourses from './MyCourses';
import Profile from '../Profile';

const links = [
  { to: '/student', label: 'Overview', icon: LayoutGrid, end: true },
  { to: '/student/my-courses', label: 'My Courses', icon: BookMarked },
  { to: '/student/profile', label: 'Profile', icon: User },
];

export default function StudentDashboard() {
  return (
    <DashboardLayout title="Student Dashboard" subtitle="Track your learning progress" links={links}>
      <Routes>
        <Route index element={<StudentOverview />} />
        <Route path="my-courses" element={<MyCourses />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/student" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
