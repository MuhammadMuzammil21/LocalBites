import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { toast } from 'sonner';
import { Address } from '../../api/authApi';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  addresses?: Address[];
}

interface SavedAddressesProps {
  addresses: Address[];
  onUpdate: (updatedData: Partial<UserProfile>) => void;
}

const SavedAddresses = ({ addresses, onUpdate }: SavedAddressesProps) => {
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<Omit<Address, '_id'>>({
    label: 'Home',
    street: '',
    city: 'Karachi',
    state: 'Sindh',
    zip: '',
    country: 'Pakistan',
    isDefault: false
  });
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setFormData({
      label: 'Home',
      street: '',
      city: 'Karachi',
      state: 'Sindh',
      zip: '',
      country: 'Pakistan',
      isDefault: false
    });
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newAddresses = [...addresses, { ...formData, _id: Date.now().toString() }];
      
      // If this is set as default, make sure no other address is default
      if (formData.isDefault) {
        newAddresses.forEach((addr, index) => {
          if (index !== newAddresses.length - 1) {
            addr.isDefault = false;
          }
        });
      }

      await onUpdate({ addresses: newAddresses });
      setIsAddingAddress(false);
      resetForm();
      toast.success('Address added successfully!');
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  const handleEditAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAddress) return;

    setLoading(true);

    try {
      const updatedAddresses = addresses.map(addr => 
        addr._id === editingAddress._id ? { ...formData, _id: editingAddress._id } : addr
      );

      // If this is set as default, make sure no other address is default
      if (formData.isDefault) {
        updatedAddresses.forEach(addr => {
          if (addr._id !== editingAddress._id) {
            addr.isDefault = false;
          }
        });
      }

      await onUpdate({ addresses: updatedAddresses });
      setEditingAddress(null);
      resetForm();
      toast.success('Address updated successfully!');
    } catch (error) {
      console.error('Error updating address:', error);
      toast.error('Failed to update address');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const updatedAddresses = addresses.filter(addr => addr._id !== addressId);
      await onUpdate({ addresses: updatedAddresses });
      toast.success('Address deleted successfully!');
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      const updatedAddresses = addresses.map(addr => ({
        ...addr,
        isDefault: addr._id === addressId
      }));
      await onUpdate({ addresses: updatedAddresses });
      toast.success('Default address updated!');
    } catch (error) {
      console.error('Error setting default address:', error);
      toast.error('Failed to update default address');
    }
  };

  const startEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      label: address.label,
      street: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip || '',
      country: address.country,
      isDefault: address.isDefault
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            Saved Addresses
            <Button
              onClick={() => setIsAddingAddress(true)}
              className="bg-white text-black hover:bg-gray-200"
            >
              Add Address
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {addresses.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📍</div>
              <p className="text-gray-400">No saved addresses yet</p>
              <p className="text-gray-500 text-sm mt-2">Add an address to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <div key={address._id} className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-white">{address.label}</span>
                        {address.isDefault && (
                          <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm">
                        {address.street}
                      </p>
                      <p className="text-gray-300 text-sm">
                        {address.city}, {address.state} {address.zip}
                      </p>
                      <p className="text-gray-300 text-sm">
                        {address.country}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!address.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(address._id!)}
                          className="border-gray-600 text-gray-300 hover:bg-gray-600"
                        >
                          Set Default
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(address)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-600"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAddress(address._id!)}
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Address Dialog */}
      <Dialog open={isAddingAddress} onOpenChange={setIsAddingAddress}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddAddress} className="space-y-4">
            <div>
              <Label htmlFor="label" className="text-gray-300">Address Label</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="e.g., Home, Office"
                required
              />
            </div>
            <div>
              <Label htmlFor="street" className="text-gray-300">Street Address</Label>
              <Input
                id="street"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter your street address"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city" className="text-gray-300">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-gray-300">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zip" className="text-gray-300">ZIP Code</Label>
                <Input
                  id="zip"
                  value={formData.zip}
                  onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Optional"
                />
              </div>
              <div>
                <Label htmlFor="country" className="text-gray-300">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="isDefault" className="text-gray-300">Set as default address</Label>
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="bg-white text-black hover:bg-gray-200"
              >
                {loading ? 'Adding...' : 'Add Address'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddingAddress(false);
                  resetForm();
                }}
                className="border-gray-600 text-gray-300 hover:bg-gray-600"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Address Dialog */}
      <Dialog open={!!editingAddress} onOpenChange={() => setEditingAddress(null)}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditAddress} className="space-y-4">
            <div>
              <Label htmlFor="edit-label" className="text-gray-300">Address Label</Label>
              <Input
                id="edit-label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="e.g., Home, Office"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-street" className="text-gray-300">Street Address</Label>
              <Input
                id="edit-street"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter your street address"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-city" className="text-gray-300">City</Label>
                <Input
                  id="edit-city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-state" className="text-gray-300">State</Label>
                <Input
                  id="edit-state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-zip" className="text-gray-300">ZIP Code</Label>
                <Input
                  id="edit-zip"
                  value={formData.zip}
                  onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Optional"
                />
              </div>
              <div>
                <Label htmlFor="edit-country" className="text-gray-300">Country</Label>
                <Input
                  id="edit-country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-isDefault"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="edit-isDefault" className="text-gray-300">Set as default address</Label>
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="bg-white text-black hover:bg-gray-200"
              >
                {loading ? 'Updating...' : 'Update Address'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingAddress(null);
                  resetForm();
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

export default SavedAddresses;
