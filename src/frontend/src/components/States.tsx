import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex min-h-[400px] flex-col items-center justify-center py-12 text-center">
        <Icon className="mb-4 h-16 w-16 text-muted-foreground/30" />
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="mb-6 text-sm text-muted-foreground">{description}</p>
        {action}
      </CardContent>
    </Card>
  );
}

export function ProductSkeleton() {
  return (
    <Card>
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </Card>
  );
}
