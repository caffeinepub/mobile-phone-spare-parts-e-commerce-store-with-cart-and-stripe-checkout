import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSaveCallerUserProfile } from '../../hooks/useUserProfile';
import { toast } from 'sonner';

export default function ProfileSetupDialog() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        email: email.trim() || undefined,
      });
      toast.success('Profile created successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save profile');
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Welcome!</DialogTitle>
            <DialogDescription>Please set up your profile to continue</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                autoFocus
              />
            </div>
            <div>
              <Label htmlFor="email">Email (optional)</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={saveProfile.isPending} className="w-full">
              {saveProfile.isPending ? 'Saving...' : 'Continue'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
