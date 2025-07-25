'use client';

import { useState } from 'react';
import { Button } from '../../components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Database, Users, Package, ShoppingCart, CheckCircle } from 'lucide-react';

export default function DemoDataPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const seedDemoData = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/seed-demo-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
      } else {
        setResult({ error: data.error });
      }
    } catch (error) {
      setResult({ error: 'Failed to seed demo data' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Demo Data Setup
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Populate the database with sample users, materials, and group orders for testing
          </p>
        </div>

        {/* Warning Card */}
        <Card className="mb-8 border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <Database className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-yellow-800">Important Note</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>This will clear all existing data and populate the database with demo data.</p>
                  <p className="mt-2">
                    <strong>Only use this in development environment!</strong>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Data Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Users</h3>
              <p className="text-gray-600">3 Buyers + 3 Vendors</p>
              <p className="text-sm text-gray-500 mt-2">
                Complete user profiles with business information
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Package className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Materials</h3>
              <p className="text-gray-600">5 Material Listings</p>
              <p className="text-sm text-gray-500 mt-2">
                Food items with prices and availability
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <ShoppingCart className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Group Orders</h3>
              <p className="text-gray-600">2 Active Orders</p>
              <p className="text-sm text-gray-500 mt-2">
                Sample group purchasing scenarios
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Seed Button */}
        <div className="text-center mb-8">
          <Button
            onClick={seedDemoData}
            disabled={loading}
            className="text-lg px-8 py-3"
          >
            {loading ? (
              <>
                <Database className="animate-spin h-5 w-5 mr-2" />
                Seeding Data...
              </>
            ) : (
              <>
                <Database className="h-5 w-5 mr-2" />
                Seed Demo Data
              </>
            )}
          </Button>
        </div>

        {/* Result Display */}
        {result && (
          <Card className={result.error ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
            <CardHeader>
              <CardTitle className={`flex items-center ${result.error ? 'text-red-800' : 'text-green-800'}`}>
                {result.error ? (
                  <>
                    <Database className="h-6 w-6 mr-2" />
                    Error
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-6 w-6 mr-2" />
                    Demo Data Seeded Successfully!
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.error ? (
                <p className="text-red-700">{result.error}</p>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <p className="font-semibold text-green-800">{result.data.buyers}</p>
                      <p className="text-green-700">Buyers</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-green-800">{result.data.vendors}</p>
                      <p className="text-green-700">Vendors</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-green-800">{result.data.materials}</p>
                      <p className="text-green-700">Materials</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-green-800">{result.data.groupOrders}</p>
                      <p className="text-green-700">Group Orders</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-green-200 pt-4">
                    <h4 className="font-semibold text-green-800 mb-2">Test Login Credentials:</h4>
                    <p className="text-green-700 mb-2">
                      <strong>Password for all accounts:</strong> password123
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <h5 className="font-medium text-green-800 mb-2">Buyer Accounts:</h5>
                        <ul className="text-sm text-green-700 space-y-1">
                          {result.loginInfo.buyerEmails.map((email, index) => (
                            <li key={index} className="font-mono">{email}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-green-800 mb-2">Vendor Accounts:</h5>
                        <ul className="text-sm text-green-700 space-y-1">
                          {result.loginInfo.vendorEmails.map((email, index) => (
                            <li key={index} className="font-mono">{email}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-4 mt-6">
                    <Button 
                      onClick={() => window.location.href = '/auth/login'}
                      variant="outline"
                    >
                      Go to Login
                    </Button>
                    <Button 
                      onClick={() => window.location.href = '/'}
                    >
                      Back to Home
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
