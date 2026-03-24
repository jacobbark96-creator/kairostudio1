import AdminCRM from '../../src/page-components/AdminCRM';
import ProtectedRoute from '../../src/components/ProtectedRoute';

export default function Page() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminCRM />
    </ProtectedRoute>
  );
}
