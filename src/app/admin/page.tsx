"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Loader2, Lock, Mail, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import gsap from 'gsap'
import { motion } from 'framer-motion'

export default function AdminLoginPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, error: authError, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [cookiesEnabled, setCookiesEnabled] = useState<boolean | null>(null)
  const [cookieCheckMessage, setCookieCheckMessage] = useState('')
  
  // Interactive UI states
  const [showPassword, setShowPassword] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [buttonHovered, setButtonHovered] = useState(false)
  
  // Refs for GSAP animations
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const mobileLogo = useRef<HTMLDivElement>(null)
  const rightSideLogo = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)
  
  // Check for error in URL parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const errorParam = searchParams.get('error')
    
    if (errorParam) {
      let errorMessage = 'Authentication failed'
      
      // Map error codes to user-friendly messages
      switch (errorParam) {
        case 'CredentialsSignin':
          errorMessage = 'Invalid email or password'
          break
        case 'SessionRequired':
          errorMessage = 'Please sign in to access this page'
          break
        case 'AccessDenied':
          errorMessage = 'You do not have permission to access this page'
          break
        // Add more error cases as needed
      }
      
      setError(errorMessage)
      
      // Clear the error from the URL to prevent showing it again on refresh
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])
  
  // Check if cookies are enabled
  const checkCookies = useCallback(() => {
    try {
      // Try to set a test cookie
      document.cookie = 'cookietest=1; SameSite=Lax; path=/';
      const cookieEnabled = document.cookie.indexOf('cookietest=') !== -1;
      
      // Clean up the test cookie
      document.cookie = 'cookietest=1; SameSite=Lax; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      
      setCookiesEnabled(cookieEnabled);
      
      if (!cookieEnabled) {
        setCookieCheckMessage('Cookies are disabled in your browser. Please enable cookies to log in.');
      } else {
        // Check for third-party cookie blocking
        const cookies = document.cookie.split(';').map(c => c.trim());
        setCookieCheckMessage(`Available cookies: ${cookies.length > 0 ? cookies.join(', ') : 'None'}`);  
      }
      
      return cookieEnabled;
    } catch (e) {
      setCookiesEnabled(false);
      setCookieCheckMessage('Error checking cookie settings: ' + (e instanceof Error ? e.message : String(e)));
      return false;
    }
  }, []);
  
  // Run cookie check on mount
  useEffect(() => {
    checkCookies();
  }, [checkCookies]);
  
  // GSAP animations
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create a timeline
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    // Initial state - everything invisible
    gsap.set([cardRef.current], { autoAlpha: 0, y: 20 });
    
    // Set initial state for logos if they exist
    if (mobileLogo.current) {
      gsap.set(mobileLogo.current, { autoAlpha: 0, y: 20 });
    }
    
    if (rightSideLogo.current) {
      gsap.set(rightSideLogo.current, { autoAlpha: 0, y: 20 });
    }
    
    // Create floating particles in the background
    const createParticles = () => {
      const container = containerRef.current;
      if (!container) return;
      
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle-element absolute rounded-full bg-blue-400/10 dark:bg-blue-400/5';
        
        // Random size between 10px and 40px
        const size = Math.random() * 30 + 10;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Add to container
        container.appendChild(particle);
        
        // Animate with GSAP
        gsap.to(particle, {
          x: `${(Math.random() - 0.5) * 100}`,
          y: `${(Math.random() - 0.5) * 100}`,
          opacity: Math.random() * 0.5,
          duration: Math.random() * 10 + 10,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: Math.random() * 5
        });
      }
    };
    
    // Create particles
    createParticles();
    
    // Animate background
    tl.fromTo(containerRef.current, 
      { backgroundColor: 'rgba(241, 245, 249, 0)' }, 
      { backgroundColor: 'rgba(241, 245, 249, 1)', duration: 1 }
    );
    
    // Animate logos with a slight rotation if they exist
    if (mobileLogo.current) {
      tl.to(mobileLogo.current, { 
        autoAlpha: 1, 
        y: 0, 
        rotationY: 10, 
        rotationX: 5,
        duration: 1.2,
        ease: 'elastic.out(1, 0.5)'
      }, '-=0.5');
    }
    
    if (rightSideLogo.current) {
      tl.to(rightSideLogo.current, { 
        autoAlpha: 1, 
        y: 0, 
        rotationY: 10, 
        rotationX: 5,
        duration: 1.2,
        ease: 'elastic.out(1, 0.5)'
      }, '-=0.5');
    }
    
    // Animate card with a 3D effect
    tl.to(cardRef.current, { 
      autoAlpha: 1, 
      y: 0, 
      rotationY: -5,
      rotationX: 2,
      duration: 1,
      ease: 'back.out(1.4)'
    }, '-=0.8');
    
    // Reset rotation after animation
    const elementsToReset = [cardRef.current];
    
    if (mobileLogo.current) elementsToReset.push(mobileLogo.current);
    if (rightSideLogo.current) elementsToReset.push(rightSideLogo.current);
    
    tl.to(elementsToReset, {
      rotationY: 0,
      rotationX: 0,
      duration: 1.5,
      ease: 'elastic.out(1, 0.5)'
    });
    
    // Animate form elements
    if (formRef.current) {
      const formElements = formRef.current.querySelectorAll('div.grid.gap-2, button');
      tl.fromTo(formElements, 
        { autoAlpha: 0, y: 15, scale: 0.95 }, 
        { autoAlpha: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.6, ease: 'back.out(1.7)' }, 
        '-=1.5'
      );
    }
    
    // Add hover effect to card
    let cleanupCardListeners: (() => void) | undefined;
    
    if (cardRef.current) {
      const card = cardRef.current;
      
      // Create a function for the mousemove handler
      const handleMouseMove = (e: MouseEvent) => {
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element
        const y = e.clientY - rect.top;  // y position within the element
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          duration: 0.5,
          ease: 'power2.out'
        });
      };
      
      // Create a function for the mouseleave handler
      const handleMouseLeave = () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.7,
          ease: 'elastic.out(1, 0.5)'
        });
      };
      
      // Add event listeners
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
      
      // Store event listeners for cleanup
      cleanupCardListeners = () => {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
    
    // Main cleanup function
    return () => {
      // Clean up animation
      tl.kill();
      
      // Clean up card event listeners if they exist
      if (cleanupCardListeners) {
        cleanupCardListeners();
      }
      
      // Remove particles
      if (containerRef.current) {
        const particles = containerRef.current.querySelectorAll('.particle-element');
        particles.forEach(particle => particle.remove());
      }
    };
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      setIsRedirecting(true)
      router.push('/admin/dashboard')
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Check if cookies are enabled before attempting login
    if (!checkCookies()) {
      setError('Cookies must be enabled to log in')
      toast.error('Cookies must be enabled to log in')
      setIsLoading(false)
      return
    }

    const loadingToast = toast.loading('Signing you in…')

    try {
      const success = await login(email, password, rememberMe)
      
      if (success) {
        toast.success('Welcome back! Redirecting to your dashboard…', { id: loadingToast })
        // The redirect will happen automatically via the useEffect hook
        // that watches for the user state
        return
      } else {
        // If login returns false, there was an error (handled by the auth context)
        const message = authError || 'Invalid email or password'
        setError(message)
        toast.error(message, { id: loadingToast })
        setIsLoading(false)
      }
    } catch (err: any) {
      const message = 'Login failed. Please try again.'
      setError(message)
      toast.error(message, { id: loadingToast })
      setIsLoading(false)
    } finally {
      toast.dismiss(loadingToast)
    }
  }


  return (
  <div ref={containerRef} className="min-h-screen flex items-stretch bg-slate-100 overflow-hidden" style={{ perspective: '1000px' }}>
    {/* Animated background elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        {/* Grid pattern */}
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        {/* Animated gradient blobs */}
        <motion.div 
          className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-gradient-to-r from-blue-300/20 to-indigo-300/20 blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div 
          className="absolute top-1/2 -right-20 w-80 h-80 rounded-full bg-gradient-to-r from-indigo-300/20 to-purple-300/20 blur-3xl"
          animate={{
            x: [0, -20, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        
        <motion.div 
          className="absolute -bottom-40 left-1/3 w-72 h-72 rounded-full bg-gradient-to-r from-blue-400/10 to-cyan-300/10 blur-3xl"
          animate={{
            x: [0, 40, 0],
            y: [0, -20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>
    </div>
    
    {/* Left side - Login form */}
    <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-6 relative z-10">
      <div className="w-full max-w-md">
        {/* Logo for mobile only */}
        <motion.div 
          ref={mobileLogo}
          className="md:hidden text-center mb-10"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Logo width={180} height={72} />
        </motion.div>
        
        {/* Desktop logo */}
        <div className="hidden md:flex justify-center mb-10">
          <img
            src="/images/logo.jpg"
            alt="Ajwa Admin"
            className="h-16 w-auto rounded-2xl object-contain shadow-sm bg-white/10"
            loading="lazy"
            translate="no"
          />
        </div>

        {/* Card with animation */}
        <motion.div 
          ref={cardRef} 
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <Card className="border border-gray-100 shadow-xl shadow-blue-900/10 backdrop-blur-sm bg-white/95 dark:bg-slate-900/95 overflow-hidden">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Admin Portal</CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400 mt-1">
                Secure access to your dashboard
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pb-8">
              {error && (
                <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/30">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
                <motion.div
                  className="grid gap-3"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-200 tracking-wide">
                        Email address
                      </Label>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Use the email associated with your admin account
                      </p>
                    </div>
                    <motion.span
                      className="text-xs font-medium text-blue-600 dark:text-blue-300"
                      animate={{ opacity: emailFocused ? 1 : 0.7 }}
                    >
                      Required
                    </motion.span>
                  </div>
                  <div className="relative group">
                    <motion.div
                      className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400 transition-colors group-hover:text-blue-500"
                      animate={{ opacity: emailFocused ? 0.8 : 1, scale: emailFocused ? 0.95 : 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Mail className="h-4 w-4" />
                    </motion.div>
                    <Input
                      ref={emailInputRef}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      required
                      autoComplete="email"
                      className={`h-12 rounded-xl border transition-all duration-300 pl-12 pr-4 text-sm focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:border-blue-500 ${emailFocused ? 'shadow-lg shadow-blue-500/10 border-blue-500/60 dark:border-blue-400/40 bg-white dark:bg-slate-900' : 'border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90'}`}
                    />
                  </div>
                </motion.div>

                <motion.div
                  className="grid gap-3"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-200 tracking-wide">
                        Password
                      </Label>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Must contain at least 8 characters
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-xs font-medium text-blue-600 dark:text-blue-300 hover:underline"
                      onClick={() => toast('Need help?', { description: 'Contact support to reset your password.' })}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative group">
                    <motion.div
                      className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400 transition-colors group-hover:text-blue-500"
                      animate={{ opacity: passwordFocused ? 0.8 : 1, scale: passwordFocused ? 0.95 : 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Lock className="h-4 w-4" />
                    </motion.div>
                    <Input
                      ref={passwordInputRef}
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      required
                      autoComplete="current-password"
                      className={`h-12 rounded-xl border transition-all duration-300 pl-12 pr-12 text-sm focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:border-blue-500 ${passwordFocused ? 'shadow-lg shadow-blue-500/10 border-blue-500/60 dark:border-blue-400/40 bg-white dark:bg-slate-900' : 'border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </motion.div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border border-slate-300 text-blue-600 focus:ring-blue-500"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    Remember this device for 24 hours
                  </label>
                  <span className="inline-flex items-center gap-1">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Secure connection
                  </span>
                </div>

                <input type="hidden" name="callbackUrl" value="/admin/dashboard" />

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-blue-900/20 transition-all duration-300 h-12 rounded-xl font-medium tracking-wide"
                  disabled={isLoading || isRedirecting}
                  onMouseEnter={() => setButtonHovered(true)}
                  onMouseLeave={() => setButtonHovered(false)}
                >
                  {isLoading || isRedirecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isRedirecting ? 'Redirecting…' : 'Signing in…'}
                    </>
                  ) : (
                    <>
                      <span>Sign in to dashboard</span>
                      <motion.div
                        animate={{ x: buttonHovered ? 6 : 0, opacity: buttonHovered ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-2"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.div>
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="flex flex-col items-center justify-center text-sm text-slate-500 pt-0">
              <p className="text-xs">Protected area. Unauthorized access is prohibited.</p>
            </CardFooter>
          </Card>
          
          {/* Decorative elements */}
          <motion.div 
            className="absolute -z-10 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 -top-20 -right-20"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute -z-10 w-40 h-40 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 -bottom-20 -left-20"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.18, 0.1]
            }}
            transition={{ 
              duration: 5,
              delay: 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>
    </div>
    
    {/* Right side - Branding and information */}
    <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-gradient-to-br from-blue-600 to-indigo-800 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-12 text-white">
        <motion.div
          ref={rightSideLogo}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-8"
        >
          {/* <Logo width={220} height={88} /> */}
        </motion.div>
        
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Welcome to Ajwa Admin
        </motion.h1>
        
        <motion.p
          className="text-lg text-blue-100 max-w-lg text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          Manage your website content, products, and customer inquiries all in one place.
        </motion.p>
        
        <motion.div
          className="grid grid-cols-2 gap-6 w-full max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          {[
            { icon: <Mail className="h-6 w-6" />, title: "Content Management", description: "Update website content easily" },
            { icon: <ArrowRight className="h-6 w-6" />, title: "User Management", description: "Manage user accounts and roles" },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white/10 backdrop-blur-sm p-6 rounded-xl"
              whileHover={{ y: -5, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-white/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
              <p className="text-sm text-blue-100/80">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  </div>
  );
}