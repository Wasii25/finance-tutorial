import Image from 'next/image';
import { SignIn, ClerkLoaded, ClerkLoading } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react';

export default function Page() {
  return( 
    <div className='min-h-screen grid grid-cols-1 lg:grid-cols-2'> 
    {/* above class is to set the height of the website. It is taking a mobile first approach 
    hence the grid cols-1 first, lg: stands for large screens and it takes grid-cols-2 */}
    {/* The div below is for the first grid */}
      <div className='h-full lg:flex flex-col items-center justify-center px-4'> 
        <div className='text-center space-y-4 pt-16'>
          <h1 className='font-bold text-3xl text-[#2E2A47]'>
            Welcome Back!
          </h1>
          <p className='text-base text-[#7E8CA0]'>
            Log in or Create account to get back to your dashboard
          </p>
        </div>
        <div className='flex items-center justify-center mt-8'>
          <ClerkLoaded>
            <SignIn path="/sign-in" />
          </ClerkLoaded>
          <ClerkLoading>
            <Loader2 className='animate-spin text-muted-foreground'/>
          </ClerkLoading>
        </div>
      </div>
      {/* This div is for the second grid */}
      <div className='h-full bg-blue-600 hidden lg:flex items-center justify-center'>
      {/* hidden-> hidden on mobile
          lg:flex-> but gets activated when it senses a bigge screen */}
        <Image src="/logo.svg"  height={100} width={100} alt='Logo'/>
      </div>
    </div>
  );
}