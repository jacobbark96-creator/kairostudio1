import ClientDashboard from '../../src/page-components/ClientDashboard';
import ProtectedRoute from '../../src/components/ProtectedRoute';

export default function Page() {
  return (
    <ProtectedRoute>
      <ClientDashboard />
    </ProtectedRoute>
  );
}
