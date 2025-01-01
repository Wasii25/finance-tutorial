import { SignIn, ClerkLoaded, ClerkLoading } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';

export default function ClerkComponents() {
  return (
    <>
      {/* Show SignIn form when Clerk is fully loaded */}
      <ClerkLoaded>
        <SignIn path="/sign-in" />
      </ClerkLoaded>
      
      {/* Show a spinning loader while Clerk is loading */}
      <ClerkLoading>
        <Loader2 className='animate-spin text-muted-foreground' />
      </ClerkLoading>
    </>
  );
}
