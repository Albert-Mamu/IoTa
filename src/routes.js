import React from 'react';

const Dashboard = React.lazy(() => import('./views/Dashboard'));
const Users = React.lazy(() => import('./views/Users'));
const Project = React.lazy(() => import('./views/Project'));
const Device = React.lazy(() => import('./views/Device'));
const Tracking = React.lazy(() => import('./views/Tracking'));
const Settings = React.lazy(() => import('./views/Settings'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/users', name: 'Users', component: Users },
  { path: '/project', name: 'Project', component: Project },
  { path: '/device', name: 'Device', component: Device },
  { path: '/tracking', name: 'Tracking', component: Tracking },
  { path: '/settings', name: 'Settings', component: Settings },
];

export default routes;
