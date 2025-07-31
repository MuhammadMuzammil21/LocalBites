import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { toast } from 'sonner';
import { authApi, Address } from '../../api/authApi';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  addresses?: Address[];
}

interface ProfileDetailsProps {
  profile: UserProfile | null;
  onUpdate: (updatedData: Partial<UserProfile>) => void;
}

const ProfileDetails = ({ profile, onUpdate }: ProfileDetailsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: profile?.email || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onUpdate(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    
    try {
      await authApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      toast.success('Password changed successfully!');
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="text-center text-gray-400">
            <p>Unable to load profile information</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            Profile Information
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="border-gray-600 text-gray-300 hover:bg-gray-600"
            >
              Edit Profile
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-400">Full Name</Label>
              <p className="text-white text-lg">{profile.name}</p>
            </div>
            <div>
              <Label className="text-gray-400">Email Address</Label>
              <p className="text-white text-lg">{profile.email}</p>
            </div>
            <div>
              <Label className="text-gray-400">Account Type</Label>
              <p className="text-white text-lg capitalize">{profile.role.toLowerCase()}</p>
            </div>
            <div>
              <Label className="text-gray-400">Member Since</Label>
              <p className="text-white text-lg">
                {new Date(profile.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="pt-4">
            <Button
              variant="outline"
              onClick={() => setIsChangingPassword(true)}
              className="border-gray-600 text-gray-300 hover:bg-gray-600"
            >
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-300">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-300">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="bg-white text-black hover:bg-gray-200"
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-600"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isChangingPassword} onOpenChange={setIsChangingPassword}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword" className="text-gray-300">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="newPassword" className="text-gray-300">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                minLength={6}
                required
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-gray-300">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                minLength={6}
                required
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="bg-white text-black hover:bg-gray-200"
              >
                {loading ? 'Changing...' : 'Change Password'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsChangingPassword(false);
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                }}
                className="border-gray-600 text-gray-300 hover:bg-gray-600"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileDetails;
