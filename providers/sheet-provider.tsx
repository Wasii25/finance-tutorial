"use client";

import { useMountedState } from "react-use";
import { NewAccountSheet } from "@/features/accounts/components/new-account-sheet";
import { EditAccountSheet } from "@/features/accounts/components/edit-account-sheet";


import { NewCategorySheet } from "@/features/categories/components/new-category-sheet";
import { EditCategorySheet } from "@/features/categories/components/edit-category-sheet";

import { NewTransactionsheet } from "@/features/transactions/components/new-transaction-sheet";

export const SheetProvider = () => {
  const isMounted = useMountedState(); // This ensures the component only runs on the client

  if (!isMounted) return null;

  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet />

      <NewCategorySheet />
      <EditCategorySheet />

      <NewTransactionsheet />
    </>
  );
};
