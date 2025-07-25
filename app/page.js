'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/Button';
import { Users, Package, TrendingUp, CheckCircle } from 'lucide-react';

export default function Home() {
  const { data: session } = useSession();

  // If user is logged in, redirect to their dashboard
  if (session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome back, {session.user.name}!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Ready to continue with your {session.user.role} activities?
            </p>
            <Link href={`/dashboard/${session.user.role}`}>
              <Button className="text-lg px-8 py-3">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Welcome to</span>
            <span className="block text-blue-600">VendorCollect</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            The platform that connects vendors and buyers for efficient group purchasing.
            Save money through bulk orders and streamline your supply chain.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link href="/auth/register">
                <Button className="w-full text-lg px-8 py-3">
                  Get Started
                </Button>
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link href="/auth/login">
                <Button variant="outline" className="w-full text-lg px-8 py-3">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Better way to manage group orders
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Join thousands of vendors and buyers who trust VendorCollect for their group purchasing needs.
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <Users className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Group Purchasing</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Join with other vendors to place bulk orders and get better prices from suppliers.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <Package className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Material Listings</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Buyers can list their materials with prices, quantities, and delivery areas.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Better Prices</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Leverage group buying power to negotiate better prices and reduce costs.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Order Tracking</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Track your orders from placement to fulfillment with real-time status updates.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">How it Works</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Simple 3-step process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Vendors */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">For Vendors</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-gray-900">Browse Group Orders</h4>
                      <p className="text-gray-600">Find nearby group orders for materials you need</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-gray-900">Join Orders</h4>
                      <p className="text-gray-600">Join group orders to leverage bulk pricing</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-gray-900">Track & Receive</h4>
                      <p className="text-gray-600">Track order status and receive your materials</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Buyers */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">For Buyers</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-gray-900">List Materials</h4>
                      <p className="text-gray-600">Add your materials with prices and quantities</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-gray-900">Receive Orders</h4>
                      <p className="text-gray-600">Get group orders from vendor communities</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-gray-900">Fulfill & Deliver</h4>
                      <p className="text-gray-600">Accept orders and manage delivery schedules</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-blue-200">Join VendorCollect today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link href="/auth/register">
                <Button variant="outline" className="bg-white text-blue-600 hover:bg-gray-50 text-lg px-8 py-3">
                  Sign Up Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
