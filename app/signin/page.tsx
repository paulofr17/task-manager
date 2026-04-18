'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { AiFillGithub } from 'react-icons/ai'
import { FcGoogle } from 'react-icons/fc'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { toast } from 'sonner'
import { CheckSquare, Sparkles, Layers, Users2 } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { UserLoginSchema, UserLoginType } from '@/actions/User/LoginUser/schema'

export default function Signin() {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<UserLoginType>({
    resolver: zodResolver(UserLoginSchema),
  })

  async function onSubmit(formData: UserLoginType) {
    signIn('credentials', {
      email: formData.email,
      password: formData.password,
      redirect: false,
    }).then((response) => {
      if (response?.error) {
        toast.error(response.error)
      } else {
        toast.success('Successfully signed in')
        router.push('/')
      }
    })
  }

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      {/* Left — brand panel */}
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
            Everything your team needs to ship work on time.
          </h1>
          <div className="text-white/85 flex flex-col gap-5">
            <div className="flex items-start gap-3">
              <Layers className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-medium text-white">Kanban built for focus</p>
                <p className="text-sm">
                  Drag, drop, and reorder tasks across projects in real time.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users2 className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-medium text-white">Shared workspaces</p>
                <p className="text-sm">
                  Invite your team and keep every project in sync.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-medium text-white">Clear priorities</p>
                <p className="text-sm">
                  Surface what matters with status and priority at a glance.
                </p>
              </div>
            </div>
          </div>
        </div>
        <p className="relative z-10 text-xs text-white/60">
          © {new Date().getFullYear()} Task Manager
        </p>
      </div>

      {/* Right — form */}
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
                Welcome back
              </h2>
              <p className="text-sm text-muted-foreground">
                Sign in to continue to your workspace.
              </p>
            </div>
            <form
              className="flex flex-col gap-5"
              onSubmit={handleSubmit(onSubmit)}
            >
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password', { required: true })}
                />
                {errors?.password && (
                  <p className="text-xs text-destructive">
                    {errors?.password?.message}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me for 30 days
                </label>
              </div>
              <Button
                variant="brand"
                className="w-full"
                type="submit"
                disabled={!isDirty || !isValid || isSubmitting}
              >
                Sign In
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
            Not a member?{' '}
            <Link
              className="font-medium text-primary hover:underline"
              href="/signup"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
