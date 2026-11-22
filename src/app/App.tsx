import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import '../features/admin/admin.css';

export default function App() {
  return <RouterProvider router={router} />;
}
