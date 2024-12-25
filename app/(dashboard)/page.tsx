import { ClerkProvider, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <UserButton />
    </ClerkProvider>
  );
}
