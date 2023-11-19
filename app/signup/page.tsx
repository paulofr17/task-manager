'use client'

import Image from 'next/image'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { AiFillGithub } from 'react-icons/ai'
import { FcGoogle } from 'react-icons/fc'
import toast, { Toaster } from 'react-hot-toast'
import * as z from 'zod'

import tm from '@/assets/tm.png'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { registerSchema } from '@/lib/registerSchema'
import { createUser } from '@/actions/user'

type FormData = z.infer<typeof registerSchema>

export default function Signup() {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data: FormData) {
    createUser(data.name, data.email, data.password).then((response) => {
      if (response.status === 'error') {
        toast.error(response.message)
      } else {
        toast.success(response.message)
        // Sign in user after successful registration
        signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        }).then((response) => {
          router.push('/')
        })
      }
    })
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center bg-gray-50">
      <div className="flex min-h-full w-full flex-1 flex-col justify-center px-8">
        <div className="mx-auto flex w-full max-w-md flex-col items-center space-y-6">
          <Image src={tm.src} width={64} height={64} alt="Task Manager icon" />
          <p className="text-xl font-semibold">Create your account</p>
        </div>
        <div className="mx-auto mt-8 w-full max-w-md rounded-lg border border-gray-200 bg-white p-10 shadow-sm">
          <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Paulo Ribeiro"
                className="focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-purple-650 focus-visible:ring-offset-0"
                {...register('name', { required: true })}
              />
              {errors?.name && <p className="text-sm text-red-600">{errors?.name?.message}</p>}
            </div>
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
            <Button
              className="h-8 bg-purple-650 text-xs font-semibold text-white hover:bg-purple-650/90"
              type="submit"
              disabled={!isDirty || !isValid || isSubmitting}
            >
              Sign Up
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
              onClick={() => signIn('google', { email: '', password: '', callbackUrl: '/' })}
            >
              <FcGoogle size={24}></FcGoogle>
              <span className="text-sm font-semibold">Google</span>
            </button>
            <button
              className="flex w-full items-center justify-center gap-2 rounded-md bg-zinc-800 p-1 text-white decoration-inherit hover:bg-zinc-800/80"
              onClick={() => signIn('github', { email: '', password: '', callbackUrl: '/' })}
            >
              <AiFillGithub size={24}></AiFillGithub>
              <span className="text-sm font-semibold">Github</span>
            </button>
          </div>
        </div>
        <div className="mx-auto mt-8 text-sm">
          Already have an account?{' '}
          <Link className="text-purple-650" href="/signin">
            Login here
          </Link>
        </div>
      </div>
      <Toaster toastOptions={{ className: 'text-center' }} />
    </div>
  )
}
