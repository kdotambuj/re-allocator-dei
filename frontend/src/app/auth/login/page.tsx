'use client';

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'


import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import Cookies from 'js-cookie';
import { Loader2 } from 'lucide-react';
import { Sidebar } from '@/components/auth/SideBar';
import { useAppDispatch } from '@/lib/store/hooks';
import { setUser } from '@/lib/store/features/user/userSlice';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const dispatch = useAppDispatch();



const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setErrorMessage(null);
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/signin`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to sign in');
      }
  
      const responseData = await response.json();
      console.log('Response Data:', responseData);
      console.log('User Data:', responseData.data.user);

  
      if (responseData.success) {
        const { user, token } = responseData.data;
  
        // Store token
        localStorage.setItem('token', token);


        // Store user data
        dispatch(
          setUser({
            id: user.id || null,
            name: user.name || null,
            email: user.email || null,
            role: user.role || null,
            isAuthenticated: true,
            departmentId: user.departmentId || 0
          })
        );



        const roleBasedRedirects: { [key: string]: string } = {
          'ADMIN': '/admin-dashboard',
          'STUDENT': '/student-dashboard',
          'HOD': '/hod-dashboard',
        };

        const redirectPath = roleBasedRedirects[user.role];
        if (redirectPath) {
          router.push(redirectPath);
        }
        
      } else {
        throw new Error(responseData.message || 'Failed to sign in');
      }
    } catch (error: any) {
      console.error('Login failed:', error.message);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
}

  return (
    <div className="h-[100vh] flex items-center justify-center ">
      <Sidebar/>
      
      <Card className="w-full p-4 mx h-[60vh] mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="font-bold text-lg">Sign In</CardTitle>
          <CardDescription className="text-medium">
            Access the{' '}
            <span className="text-red-500">
              Re-allocator <span className="text-black">and</span> Resource Management Portal
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {errorMessage && (
                <p className="text-red-500 text-sm">{errorMessage}</p>
              )}
              <Button type="submit" className="w-full bg-red-600" disabled={isLoading}>
                {isLoading ? 
                <>
                <Loader2 className='animate-spin'/>
                Signing In...
                </>
                 : 'Sign In'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have a Account?{' '}
            <a
              href="/auth/signup"
              className="text-blue-500 hover:underline cursor-pointer"
            >
              Request Access
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
