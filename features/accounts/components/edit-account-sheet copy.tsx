import { z } from "zod";

import { insertAccountSchema } from "@/db/schema";

import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { AccountForm } from "@/features/accounts/components/account-form";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account"
import { useAccount } from "@/features/accounts/hooks/use-account"


import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
  } from "@/components/ui/sheet"

const formSchema = insertAccountSchema.pick({ name: true });
type FormValues = z.infer<typeof formSchema>;

export const EditAccountSheet = () => {
    const { isOpen, onClose, id } = useOpenAccount()
    const { data: account } = useAccount(id)
    const mutation = useCreateAccount();

    const onSubmit = (values: FormValues) => {
        const validated = formSchema.parse(values);
        mutation.mutate(validated, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    const defaultValues = account ? {
        name: account.name
    } : {
        name: ""
    }


    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        New Account
                    </SheetTitle>
                    <SheetDescription>
                        Create a new account to track your transactions
                    </SheetDescription>
                </SheetHeader>
                <AccountForm
                    onSubmit={onSubmit}
                    disable={mutation.isPending}
                    defaultValues={defaultValues}

                />
            </SheetContent>
        </Sheet>

    )
}