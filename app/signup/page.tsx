'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { AiFillGithub } from 'react-icons/ai'
import { FcGoogle } from 'react-icons/fc'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CreateUserSchema, CreateUserType } from '@/actions/CreateUser/schema'
import { createUser } from '@/actions/CreateUser/action'

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
    <div className="flex h-screen w-screen flex-col items-center bg-muted dark:bg-zinc-900">
      <div className="flex min-h-full w-full flex-1 flex-col justify-center px-8">
        <div className="mx-auto flex w-full max-w-md flex-col items-center space-y-6">
          <p className="text-4xl font-bold tracking-tight">Task Manager</p>
          <p className="text-lg font-bold text-primary/90">Create your account</p>
        </div>
        <div className="mx-auto mt-8 w-full max-w-md rounded-lg border bg-card p-10 shadow-sm">
          <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Paulo Ribeiro"
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
            <Button
              className="h-8 text-xs font-semibold"
              type="submit"
              disabled={!isDirty || !isValid || isSubmitting}
            >
              Sign Up
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
              onClick={() => signIn('google', { email: '', password: '', callbackUrl: '/' })}
            >
              <FcGoogle size={24}></FcGoogle>
              <span className="text-sm font-semibold">Google</span>
            </button>
            <button
              className="flex w-full items-center justify-center gap-2 rounded-md bg-zinc-800 p-1 text-white 
              decoration-inherit hover:bg-zinc-800/80 dark:bg-zinc-900 dark:hover:bg-zinc-800/80"
              onClick={() => signIn('github', { email: '', password: '', callbackUrl: '/' })}
            >
              <AiFillGithub size={24}></AiFillGithub>
              <span className="text-sm font-semibold">Github</span>
            </button>
          </div>
        </div>
        <div className="mx-auto mt-8 text-sm">
          Already have an account?{' '}
          <Link className="font-semibold text-zinc-800 dark:text-zinc-500" href="/signin">
            Login here
          </Link>
        </div>
      </div>
    </div>
  )
}
