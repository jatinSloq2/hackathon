'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { RoleSelect } from '../../../components/RoleSelect';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Check if this is from Google OAuth
  const emailFromGoogle = searchParams.get('email');
  const nameFromGoogle = searchParams.get('name');
  const imageFromGoogle = searchParams.get('image');
  const isGoogleSignup = searchParams.get('provider') === 'google';

  const [formData, setFormData] = useState({
    name: nameFromGoogle || '',
    email: emailFromGoogle || '',
    password: '',
    confirmPassword: '',
    role: '',
    businessName: '',
    businessType: '',
    location: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!isGoogleSignup && !formData.password) newErrors.password = 'Password is required';
    if (!isGoogleSignup && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
    if (!formData.businessType.trim()) newErrors.businessType = 'Business type is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';

    if (!isGoogleSignup && formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const registrationData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        businessName: formData.businessName,
        businessType: formData.businessType,
        location: formData.location,
      };

      if (!isGoogleSignup) {
        registrationData.password = formData.password;
      }

      if (isGoogleSignup) {
        registrationData.image = imageFromGoogle;
        registrationData.provider = 'google';
      }

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ submit: data.error });
        return;
      }

      // After successful registration, sign in the user
      if (isGoogleSignup) {
        // For Google users, trigger OAuth again to complete the flow
        await signIn('google');
      } else {
        // For credentials users, sign them in directly
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          setErrors({ submit: 'Failed to sign in after registration' });
          return;
        }

        // Redirect based on role
        router.push(`/dashboard/${formData.role}`);
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-900">
            {isGoogleSignup ? 'Complete Your Profile' : 'Create your account'}
          </CardTitle>
          {isGoogleSignup && (
            <p className="text-center text-sm text-gray-600">
              Please complete your business information to continue
            </p>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              disabled={isGoogleSignup}
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              disabled={isGoogleSignup}
            />

            {!isGoogleSignup && (
              <>
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                />

                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                />
              </>
            )}

            <RoleSelect
              label="Role"
              value={formData.role}
              onValueChange={handleRoleChange}
              error={errors.role}
            />

            <Input
              label="Business Name"
              name="businessName"
              type="text"
              value={formData.businessName}
              onChange={handleChange}
              error={errors.businessName}
            />

            <Input
              label="Business Type"
              name="businessType"
              type="text"
              placeholder="e.g., Restaurant, Grocery Store, Catering"
              value={formData.businessType}
              onChange={handleChange}
              error={errors.businessType}
            />

            <Input
              label="Location"
              name="location"
              type="text"
              placeholder="City or Pincode"
              value={formData.location}
              onChange={handleChange}
              error={errors.location}
            />

            {errors.submit && (
              <p className="text-sm text-red-600 text-center">{errors.submit}</p>
            )}

            <Button type="submit" loading={loading}>
              {isGoogleSignup ? 'Complete Profile' : 'Create Account'}
            </Button>

            {!isGoogleSignup && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignIn}
                  className="w-full"
                >
                  Sign up with Google
                </Button>
              </>
            )}
          </form>

          {!isGoogleSignup && (
            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
