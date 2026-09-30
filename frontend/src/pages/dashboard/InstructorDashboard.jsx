import { Routes, Route, Navigate } from 'react-router-dom';
import { LayoutGrid, BookOpen, User } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import InstructorOverview from './InstructorOverview';
import ManageCourses from './ManageCourses';
import CourseStudents from './CourseStudents';
import Profile from '../Profile';

const links = [
  { to: '/instructor', label: 'Overview', icon: LayoutGrid, end: true },
  { to: '/instructor/courses', label: 'My Courses', icon: BookOpen },
  { to: '/instructor/profile', label: 'Profile', icon: User },
];

export default function InstructorDashboard() {
  return (
    <DashboardLayout title="Instructor Dashboard" subtitle="Manage your courses and students" links={links}>
      <Routes>
        <Route index element={<InstructorOverview />} />
        <Route path="courses" element={<ManageCourses />} />
        <Route path="courses/:courseId/students" element={<CourseStudents />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/instructor" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
