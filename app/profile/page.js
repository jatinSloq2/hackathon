'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { RoleSelect } from '../../components/RoleSelect';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { User, Building, MapPin, Mail, Calendar, Edit3 } from 'lucide-react';

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    businessName: '',
    businessType: '',
    location: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/login');
      return;
    }

    // Initialize form data with session data
    setFormData({
      name: session.user.name || '',
      email: session.user.email || '',
      role: session.user.role || '',
      businessName: session.user.businessName || '',
      businessType: session.user.businessType || '',
      location: session.user.location || '',
    });
  }, [session, status, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRoleChange = (value) => {
    setFormData(prev => ({ ...prev, role: value }));
    if (errors.role) {
      setErrors(prev => ({ ...prev, role: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
    if (!formData.businessType.trim()) newErrors.businessType = 'Business type is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      // In a real application, you would make an API call to update the user profile
      // For this demo, we'll simulate the update and update the session
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update the session with new data
      await update({
        ...session,
        user: {
          ...session.user,
          ...formData
        }
      });

      setIsEditing(false);
    } catch (error) {
      setErrors({ submit: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to session data
    setFormData({
      name: session.user.name || '',
      email: session.user.email || '',
      role: session.user.role || '',
      businessName: session.user.businessName || '',
      businessType: session.user.businessType || '',
      location: session.user.location || '',
    });
    setIsEditing(false);
    setErrors({});
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="mt-2 text-gray-600">Manage your account information and business details</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage src={session.user.image} alt={session.user.name} />
                    <AvatarFallback className="text-lg">
                      {session.user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold text-gray-900">{session.user.name}</h3>
                  <p className="text-sm text-gray-600">{session.user.email}</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                    session.user.role === 'vendor' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {session.user.role?.charAt(0).toUpperCase() + session.user.role?.slice(1)}
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="h-4 w-4 mr-3" />
                    <div>
                      <p className="font-medium">{session.user.businessName}</p>
                      <p className="text-xs">{session.user.businessType}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-3" />
                    <span>{session.user.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-3" />
                    <span>{session.user.email}</span>
                  </div>
                </div>

                {!isEditing && (
                  <Button 
                    onClick={() => setIsEditing(true)} 
                    variant="outline" 
                    className="w-full mt-6"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Profile Information</span>
                  {!isEditing && (
                    <Button 
                      onClick={() => setIsEditing(true)} 
                      variant="outline" 
                      size="sm"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                      />
                      <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>

                    <RoleSelect
                      label="Role"
                      value={formData.role}
                      onValueChange={handleRoleChange}
                      error={errors.role}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Business Name"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        error={errors.businessName}
                      />
                      <Input
                        label="Business Type"
                        name="businessType"
                        placeholder="e.g., Restaurant, Grocery Store"
                        value={formData.businessType}
                        onChange={handleChange}
                        error={errors.businessType}
                      />
                    </div>

                    <Input
                      label="Location"
                      name="location"
                      placeholder="City or Pincode"
                      value={formData.location}
                      onChange={handleChange}
                      error={errors.location}
                    />

                    {errors.submit && (
                      <p className="text-sm text-red-600">{errors.submit}</p>
                    )}

                    <div className="flex space-x-4">
                      <Button type="submit" loading={loading} className="flex-1">
                        Save Changes
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleCancel}
                        className="flex-1"
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <p className="mt-1 text-gray-900">{session.user.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-gray-900">{session.user.email}</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Role</label>
                      <p className="mt-1 text-gray-900 capitalize">{session.user.role}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Business Name</label>
                        <p className="mt-1 text-gray-900">{session.user.businessName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Business Type</label>
                        <p className="mt-1 text-gray-900">{session.user.businessType}</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Location</label>
                      <p className="mt-1 text-gray-900">{session.user.location}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
