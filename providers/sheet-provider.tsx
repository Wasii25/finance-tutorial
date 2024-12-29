"use client";

import { useMountedState } from "react-use";
import { NewAccountSheet } from "@/features/accounts/components/new-account-sheet";

export const SheetProvider = ({ children }: { children: React.ReactNode }) => {
  const isMounted = useMountedState(); // This ensures the component only runs on the client

  if (!isMounted) return null;

  return (
    <>
      <NewAccountSheet />
      {children} {/* Ensuring the children are rendered as well */}
    </>
  );
};
