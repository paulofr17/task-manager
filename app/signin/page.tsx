'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { AiFillGithub } from 'react-icons/ai'
import { FcGoogle } from 'react-icons/fc'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { toast } from 'sonner'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { UserLoginSchema, UserLoginType } from '@/actions/LoginUser/schema'

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
    <div className="flex h-screen w-screen flex-col items-center overflow-auto bg-muted dark:bg-zinc-900">
      <div className="flex w-full flex-1 flex-col justify-center gap-4 px-4 py-2 sm:gap-8 sm:px-8">
        <div className="mx-auto flex w-full max-w-md flex-col items-center gap-3 sm:gap-6">
          <p className="text-4xl font-bold tracking-tight">Task Manager</p>
          <p className="text-lg font-bold text-primary/90">Sign in to your account </p>
        </div>
        <div className="mx-auto w-full max-w-md rounded-lg border bg-card p-6 shadow-sm sm:p-10">
          <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-1">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="text"
                placeholder="abc@gmail.com"
                {...register('email', { required: true })}
              />
              {errors?.email && <p className="text-sm text-red-600">{errors?.email?.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                {...register('password', { required: true })}
              />
              {errors?.password && (
                <p className="text-sm text-red-600">{errors?.password?.message}</p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label
                  htmlFor="remember"
                  className="text-xs font-medium leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
              <a href="#" className="text-xs font-medium leading-none">
                Forgot password?
              </a>
            </div>
            <Button
              className="h-8 text-xs font-semibold"
              type="submit"
              disabled={!isDirty || !isValid || isSubmitting}
            >
              Sign In
            </Button>
          </form>
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-400"></div>
            </div>
            <div className="relative flex justify-center text-sm font-normal">
              <span className="bg-card px-4">Or continue with</span>
            </div>
          </div>
          <div className="mt-6 flex w-full space-x-2">
            <button
              className="flex w-full items-center justify-center gap-2 rounded-md border border-zinc-400 bg-white p-1 text-black hover:bg-zinc-300"
              onClick={() =>
                signIn('google', {
                  email: '',
                  password: '',
                  callbackUrl: '/',
                })
              }
            >
              <FcGoogle size={24}></FcGoogle>
              <span className="text-sm font-semibold">Google</span>
            </button>
            <button
              className="flex w-full items-center justify-center gap-2 rounded-md bg-zinc-800 p-1 text-white 
              decoration-inherit hover:bg-zinc-800/80 dark:bg-zinc-900 dark:hover:bg-zinc-800/80"
              onClick={() => {
                signIn('github', { email: '', password: '', callbackUrl: '/' })
              }}
            >
              <AiFillGithub size={24}></AiFillGithub>
              <span className="text-sm font-semibold">Github</span>
            </button>
          </div>
        </div>
        <div className="mx-auto text-sm">
          Not a member?{' '}
          <Link className="font-semibold text-zinc-800 dark:text-zinc-500" href="/signup">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  )
}
