'use client'

import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import * as z from 'zod'

import tm from '@/assets/tm.png'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { loginSchema } from '@/lib/loginSchema'
import { AiFillGithub } from 'react-icons/ai'
import { FcGoogle } from 'react-icons/fc'
import toast, { Toaster } from 'react-hot-toast'

type FormData = z.infer<typeof loginSchema>

export default function Signin() {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: FormData) {
    signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    }).then((response) => {
      console.log(response)
      if (response?.error) {
        toast.error(response.error)
      } else {
        toast.success('Successfully signed in')
        router.push('/')
      }
    })
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center bg-gray-50">
      <div className="flex min-h-full w-full flex-1 flex-col justify-center px-8">
        <div className="mx-auto flex w-full max-w-md flex-col items-center space-y-6">
          <Image src={tm.src} width={64} height={64} alt="Task Manager icon" />
          <p className="text-xl font-semibold">Sign in to your account </p>
        </div>
        <div className="mx-auto mt-8 w-full max-w-md rounded-lg border border-gray-200 bg-white p-10 shadow-sm">
          <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-1">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="text"
                placeholder="abc@gmail.com"
                className="focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-purple-650 focus-visible:ring-offset-0"
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
                className="focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-purple-650 focus-visible:ring-offset-0"
                {...register('password', { required: true })}
              />
              {errors?.password && (
                <p className="text-sm text-red-600">{errors?.password?.message}</p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  className="border-gray-400 data-[state=checked]:border-purple-650 data-[state=checked]:bg-purple-650 data-[state=checked]:text-white"
                />
                <label
                  htmlFor="remember"
                  className="text-xs font-medium leading-none text-gray-500 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
              <a href="#" className="text-xs font-medium leading-none text-purple-650">
                Forgot password?
              </a>
            </div>
            <Button
              className="h-8 bg-purple-650 text-xs font-semibold text-white hover:bg-purple-650/90"
              type="submit"
              disabled={!isDirty || !isValid || isSubmitting}
            >
              Sign In
            </Button>
          </form>
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm font-normal">
              <span className="bg-white px-4">Or continue with</span>
            </div>
          </div>
          <div className="mt-6 flex w-full space-x-2">
            <button
              className="flex w-full items-center justify-center gap-2 rounded-md border border-zinc-400 bg-white p-1 text-black hover:bg-zinc-100"
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
              className="flex w-full items-center justify-center gap-2 rounded-md bg-zinc-800 p-1 text-white decoration-inherit hover:bg-zinc-800/80"
              onClick={() => {
                signIn('github', { email: '', password: '', callbackUrl: '/' })
              }}
            >
              <AiFillGithub size={24}></AiFillGithub>
              <span className="text-sm font-semibold">Github</span>
            </button>
          </div>
        </div>
        <div className="mx-auto mt-8 text-sm">
          Not a member?{' '}
          <Link className="text-purple-650" href="/signup">
            Create an account
          </Link>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
