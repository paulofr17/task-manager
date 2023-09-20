'use client'

import { signIn } from 'next-auth/react'
import Image from 'next/image'

import tm from '@/assets/tm.png'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { AiFillGithub } from 'react-icons/ai'
import { FcGoogle } from 'react-icons/fc'
import email from 'next-auth/providers/email'

export default function Signin() {
  return (
    <div className="flex h-screen w-screen flex-col items-center bg-gray-50">
      <div className="flex min-h-full w-full flex-1 flex-col justify-center px-8">
        <div className="mx-auto flex w-full max-w-md flex-col items-center space-y-6">
          <Image src={tm.src} width={64} height={64} alt="Task Manager icon" />
          <p className="text-xl font-semibold">Sign in to your account </p>
        </div>
        <div className="mx-auto mt-8 w-full max-w-md rounded-lg border border-gray-200 bg-white p-10 shadow-sm">
          <form
            className="flex flex-col gap-6"
            action={() =>
              signIn('credentials', {
                email: '',
                password: '',
                callbackUrl: '/',
              })
            }
          >
            <div className="space-y-1">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="text"
                className="focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-purple-650 focus-visible:ring-offset-0"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="text"
                className="focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-purple-650 focus-visible:ring-offset-0"
              />
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
              <a
                href="#"
                className="text-xs font-medium leading-none text-purple-650"
              >
                Forgot password?
              </a>
            </div>
            <Button
              className="h-8 bg-purple-650 text-xs font-semibold text-white hover:bg-purple-650/80"
              type="submit"
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
                console.log('clicked')
                signIn('github', {
                  email: '',
                  password: '',
                  callbackUrl: '/',
                })
              }}
            >
              <AiFillGithub size={24}></AiFillGithub>
              <span className="text-sm font-semibold">Github</span>
            </button>
          </div>
        </div>
        <div className="mx-auto mt-8 text-sm">
          Not a member?{' '}
          <a className="text-purple-650" href="#">
            Create an account
          </a>
        </div>
      </div>
    </div>
  )
}
