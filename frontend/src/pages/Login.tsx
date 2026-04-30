import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { handleApiError } from '../lib/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Spinner } from '../components/ui/spinner';
import AppLogoIcon from '../components/AppLogoIcon';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/20">
      {/* Animated floating shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large floating circles - more visible */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-primary/25 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-float-slow"></div>
        
        {/* Additional accent circles */}
        <div className="absolute top-1/2 right-10 w-64 h-64 bg-secondary/30 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-40 right-1/3 w-72 h-72 bg-primary/15 rounded-full blur-3xl animate-float-delayed"></div>
        
        {/* Medical cross shapes floating - more visible */}
        <div className="absolute top-1/4 right-1/3 opacity-15 animate-float-slow">
          <svg width="150" height="150" viewBox="0 0 24 24" className="fill-primary">
            <path d="M12 2C13.1046 2 14 2.89543 14 4V6H16C17.1046 6 18 6.89543 18 8V10H20C21.1046 10 22 10.8954 22 12C22 13.1046 21.1046 14 20 14H18V16C18 17.1046 17.1046 18 16 18H14V20C14 21.1046 13.1046 22 12 22C10.8954 22 10 21.1046 10 20V18H8C6.89543 18 6 17.1046 6 16V14H4C2.89543 14 2 13.1046 2 12C2 10.8954 2.89543 10 4 10H6V8C6 6.89543 6.89543 6 8 6H10V4C10 2.89543 10.8954 2 12 2Z"/>
          </svg>
        </div>
        <div className="absolute bottom-1/3 left-1/4 opacity-12 animate-float-delayed">
          <svg width="100" height="100" viewBox="0 0 24 24" className="fill-primary">
            <path d="M12 2C13.1046 2 14 2.89543 14 4V6H16C17.1046 6 18 6.89543 18 8V10H20C21.1046 10 22 10.8954 22 12C22 13.1046 21.1046 14 20 14H18V16C18 17.1046 17.1046 18 16 18H14V20C14 21.1046 13.1046 22 12 22C10.8954 22 10 21.1046 10 20V18H8C6.89543 18 6 17.1046 6 16V14H4C2.89543 14 2 13.1046 2 12C2 10.8954 2.89543 10 4 10H6V8C6 6.89543 6.89543 6 8 6H10V4C10 2.89543 10.8954 2 12 2Z"/>
          </svg>
        </div>
        <div className="absolute top-2/3 right-1/4 opacity-10 animate-float">
          <svg width="120" height="120" viewBox="0 0 24 24" className="fill-primary">
            <path d="M12 2C13.1046 2 14 2.89543 14 4V6H16C17.1046 6 18 6.89543 18 8V10H20C21.1046 10 22 10.8954 22 12C22 13.1046 21.1046 14 20 14H18V16C18 17.1046 17.1046 18 16 18H14V20C14 21.1046 13.1046 22 12 22C10.8954 22 10 21.1046 10 20V18H8C6.89543 18 6 17.1046 6 16V14H4C2.89543 14 2 13.1046 2 12C2 10.8954 2.89543 10 4 10H6V8C6 6.89543 6.89543 6 8 6H10V4C10 2.89543 10.8954 2 12 2Z"/>
          </svg>
        </div>
        
        {/* Pill/capsule shapes - more visible */}
        <div className="absolute top-1/3 left-1/2 w-20 h-40 bg-primary/20 rounded-full blur-xl animate-float rotate-45"></div>
        <div className="absolute bottom-1/4 right-1/3 w-24 h-48 bg-primary/15 rounded-full blur-xl animate-float-slow -rotate-45"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-32 bg-secondary/20 rounded-full blur-lg animate-float-delayed rotate-12"></div>
        
        {/* Dots pattern - more visible */}
        <div className="absolute top-10 right-10 grid grid-cols-4 gap-3 opacity-30">
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.8s' }}></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1.2s' }}></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1.4s' }}></div>
        </div>
        
        {/* Bottom left dots */}
        <div className="absolute bottom-10 left-10 grid grid-cols-3 gap-4 opacity-25">
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.7s' }}></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.9s' }}></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1.1s' }}></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1.3s' }}></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>
        
        {/* Wave effect at bottom - more visible */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-primary/20 to-transparent"></div>
        
        {/* Decorative lines */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
      </div>
      
      {/* Subtle grid overlay - more visible */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]"></div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-sm">
        <div className="flex flex-col gap-8">
          {/* Logo and Title */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col items-center gap-2 font-medium">
              <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30 animate-float-slow">
                <AppLogoIcon className="size-8 fill-current text-primary-foreground" />
              </div>
            </div>

            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-semibold">
                Log in to your account
              </h1>
              <p className="text-center text-sm text-muted-foreground">
                Enter your email and password below to log in
              </p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 rounded-2xl border border-border/50 p-8 bg-card/95 backdrop-blur-xl shadow-2xl shadow-primary/10">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
                {error}
              </div>
            )}

            <div className="grid gap-6">
              {/* Email Field */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  autoComplete="email"
                  placeholder="email@example.com"
                  disabled={isLoading}
                  className="h-11"
                />
              </div>

              {/* Password Field */}
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="Password"
                    className="pr-10 h-11"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(checked) => setRemember(checked as boolean)}
                  disabled={isLoading}
                />
                <Label htmlFor="remember" className="cursor-pointer text-sm">
                  Remember me
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="mt-2 w-full h-11 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                disabled={isLoading}
              >
                {isLoading && <Spinner size="sm" />}
                Log in
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
