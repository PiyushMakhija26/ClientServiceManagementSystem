'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Label } from '@/components/ui/label';

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get('role') as 'user' | 'admin') || 'user';

  const [role, setRole] = useState<'user' | 'admin'>(initialRole);
  const [step, setStep] = useState<'role' | 'auth' | 'profile'>(initialRole ? 'auth' : 'role');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const departments = ['Electricity', 'Water', 'Agriculture', 'Law', 'Medical', 'Services'];

  const handleRoleSelect = (selectedRole: 'user' | 'admin') => {
    setRole(selectedRole);
    setStep('auth');
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== repeatPassword) {
      setError('Passwords do not match');
      return;
    }

    setStep('profile');
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();

      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('User creation failed');

      // Wait for session to be established
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Create profile anyway - it will be accessible once email is confirmed
        await supabase.from('profiles').insert({
          id: authData.user.id,
          email,
          full_name: fullName,
          address: role === 'user' ? address : null,
          city: role === 'user' ? city : null,
          state: role === 'user' ? state : null,
          department: role === 'admin' ? department : null,
          user_type: role,
        });
      } else {
        // If session exists, insert with proper permissions
        const { error: profileError } = await supabase.from('profiles').insert({
          id: authData.user.id,
          email,
          full_name: fullName,
          address: role === 'user' ? address : null,
          city: role === 'user' ? city : null,
          state: role === 'user' ? state : null,
          department: role === 'admin' ? department : null,
          user_type: role,
        });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          throw new Error('Profile creation failed');
        }
      }

      // Redirect to verification page
      router.push('/auth/verify-email');
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        {step === 'role' && (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Join CivicServe</CardTitle>
              <CardDescription>Select your account type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => handleRoleSelect('user')}
                variant="outline"
                className="w-full h-20 flex flex-col items-center justify-center gap-2 text-lg"
              >
                <span className="text-2xl">👤</span>
                Citizen
              </Button>
              <Button
                onClick={() => handleRoleSelect('admin')}
                variant="outline"
                className="w-full h-20 flex flex-col items-center justify-center gap-2 text-lg"
              >
                <span className="text-2xl">⚙️</span>
                Authority
              </Button>
            </CardContent>
          </>
        )}

        {step === 'auth' && (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Create Account</CardTitle>
              <CardDescription>
                {role === 'user' ? 'Sign up as a citizen' : 'Sign up as an authority member'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="repeat-password">Repeat Password</Label>
                  <Input
                    id="repeat-password"
                    type="password"
                    required
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep('role')}
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1">Next</Button>
                </div>
              </form>
            </CardContent>
          </>
        )}

        {step === 'profile' && (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Complete Profile</CardTitle>
              <CardDescription>
                {role === 'user' ? 'Tell us about yourself' : 'Select your department'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                {role === 'user' ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        placeholder="123 Main St"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="New York"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          placeholder="NY"
                          required
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <select
                      id="department"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                      required
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    >
                      <option value="">Select a department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                )}

                {error && <p className="text-sm text-destructive">{error}</p>}
                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep('auth')}
                  >
                    Back
                  </Button>
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? 'Creating Account...' : 'Sign Up'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </>
        )}

        {step !== 'role' && (
          <div className="px-6 py-4 border-t text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}
