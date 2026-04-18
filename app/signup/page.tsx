'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { AiFillGithub } from 'react-icons/ai'
import { FcGoogle } from 'react-icons/fc'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { toast } from 'sonner'
import { CheckSquare, Sparkles, Layers, Users2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  CreateUserSchema,
  CreateUserType,
} from '@/actions/User/CreateUser/schema'
import { createUser } from '@/actions/User/CreateUser/action'

export default function Signup() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<CreateUserType>({
    resolver: zodResolver(CreateUserSchema),
  })

  async function onSubmit(formData: CreateUserType) {
    const user = await createUser(formData)
    if (user.data) {
      toast.success(`User ${user.data.name} registered successfully`)
      await signIn('credentials', {
        email: user.data.email,
        password: formData.password,
        callbackUrl: '/',
      })
    } else {
      toast.error(user.error || 'Error creating user')
    }
  }

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-brand-gradient lg:flex lg:flex-col lg:justify-between lg:p-12 lg:text-white">
        <div className="absolute inset-0 bg-brand-radial opacity-80" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white/15 flex h-10 w-10 items-center justify-center rounded-lg backdrop-blur">
            <CheckSquare className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Task Manager
          </span>
        </div>
        <div className="relative z-10 flex flex-col gap-8">
          <h1 className="max-w-md text-4xl font-semibold leading-tight tracking-tight">
            Start shipping with your team in minutes.
          </h1>
          <div className="text-white/85 flex flex-col gap-5">
            <div className="flex items-start gap-3">
              <Layers className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-medium text-white">
                  Projects, sections & tasks
                </p>
                <p className="text-sm">
                  Organize work your way and keep momentum visible.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users2 className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-medium text-white">Invite your team</p>
                <p className="text-sm">
                  Share workspaces and collaborate in real time.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-medium text-white">Free to get started</p>
                <p className="text-sm">
                  No credit card. No setup. Just create and go.
                </p>
              </div>
            </div>
          </div>
        </div>
        <p className="relative z-10 text-xs text-white/60">
          © {new Date().getFullYear()} Task Manager
        </p>
      </div>

      <div className="flex items-center justify-center bg-background px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-8 flex flex-col items-center gap-2 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-gradient text-white shadow-soft">
              <CheckSquare className="h-5 w-5" />
            </div>
            <p className="text-xl font-semibold tracking-tight">Task Manager</p>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-elevated sm:p-8">
            <div className="mb-6 flex flex-col gap-1">
              <h2 className="text-2xl font-semibold tracking-tight">
                Create your account
              </h2>
              <p className="text-sm text-muted-foreground">
                Free forever for small teams.
              </p>
            </div>
            <form
              className="flex flex-col gap-5"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Jane Doe"
                  {...register('name', { required: true })}
                />
                {errors?.name && (
                  <p className="text-xs text-destructive">
                    {errors?.name?.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="you@company.com"
                  {...register('email', { required: true })}
                />
                {errors?.email && (
                  <p className="text-xs text-destructive">
                    {errors?.email?.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 8 characters"
                  {...register('password', { required: true })}
                />
                {errors?.password && (
                  <p className="text-xs text-destructive">
                    {errors?.password?.message}
                  </p>
                )}
              </div>
              <Button
                variant="brand"
                className="w-full"
                type="submit"
                disabled={!isDirty || !isValid || isSubmitting}
              >
                Sign Up
              </Button>
            </form>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider">
                <span className="bg-card px-3 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                type="button"
                className="gap-2"
                onClick={() =>
                  signIn('google', {
                    email: '',
                    password: '',
                    callbackUrl: '/',
                  })
                }
              >
                <FcGoogle className="!h-5 !w-5" />
                Google
              </Button>
              <Button
                variant="outline"
                type="button"
                className="gap-2"
                onClick={() =>
                  signIn('github', {
                    email: '',
                    password: '',
                    callbackUrl: '/',
                  })
                }
              >
                <AiFillGithub className="!h-5 !w-5" />
                GitHub
              </Button>
            </div>
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              className="font-medium text-primary hover:underline"
              href="/signin"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
