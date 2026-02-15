import { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsAdmin } from '../../hooks/useUserProfile';
import { ShieldAlert } from 'lucide-react';
import { LoadingState } from '../States';

interface AdminRouteGuardProps {
  children: ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { identity, login, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsAdmin();

  const isAuthenticated = !!identity;

  if (isInitializing || isCheckingAdmin) {
    return <LoadingState message="Checking permissions..." />;
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <ShieldAlert className="h-10 w-10 text-destructive" />
            </div>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>You must be logged in to access this page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={login} className="w-full">
              Sign In
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/">Back to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <ShieldAlert className="h-10 w-10 text-destructive" />
            </div>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to access this page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                This area is restricted to administrators only.
              </AlertDescription>
            </Alert>
            <Button asChild className="w-full">
              <Link to="/">Back to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
