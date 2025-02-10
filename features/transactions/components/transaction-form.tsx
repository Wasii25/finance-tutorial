import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/date-picker"
import { AmountInput } from "@/components/amount-input";

import { insertAccountSchema, insertTransactionSchema } from "@/db/schema";
import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Select } from "@/components/select";
import { Textarea } from "@/components/ui/textarea";

// defining our form schema
const formSchema = z.object({
    date: z.coerce.date(),
    accountId: z.string(),
    categoryId: z.string().nullable().optional(),
    payee: z.string(),
    amount: z.string(),
    notes: z.string().nullable().optional(),
});
//The above form only is for creating the name of the accounts. 
// That will now be converted to form values

const apiSchema = insertTransactionSchema.omit({
    id: true
})

type FormValues = z.input<typeof formSchema>;
type ApiFormValues = z.input<typeof  apiSchema>;

type props = {
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (values: ApiFormValues) => void;
    onDelete?: () => void;
    disable?: boolean;
    accountOptions: { label: string; value: string; }[];
    categoryOptions: { label: string; value: string; }[];
    onCreateAccount: (name:string) => void;
    onCreateCategory: (nam:string) => void;
    //key? = optional value
    //key without question mark is mandatory
};

export const TransactionForm = ({
    id,
    defaultValues,
    onSubmit,
    onDelete,
    disable: disabled,
    accountOptions,
    categoryOptions,
    onCreateAccount,
    onCreateCategory,
}: props) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    });

    const handleSubmit = (values: FormValues) => {
        console.log(values);
    }
    
    const handleDelete = () => {
        onDelete?.()
    }
    return ( 
        //below tsx renders the form that shows up when you click add new on the transactions page
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
                <FormField 
                    name="accountId"
                    control={form.control}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Account
                            </FormLabel>
                            <FormControl>
                                <Select 
                                placeholder="Select an account"
                                options={accountOptions}
                                onCreate={onCreateAccount}
                                value={field.value}
                                onChangeAction={field.onChange}
                                disable={disabled}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField 
                    name="categoryId"
                    control={form.control}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Category
                            </FormLabel>
                            <FormControl>
                                <Select 
                                placeholder="Select an category"
                                options={categoryOptions}
                                onCreate={onCreateCategory}
                                value={field.value}
                                onChangeAction={field.onChange}
                                disable={disabled}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField 
                    name="date"
                    control={form.control}
                    render={({field}) => (
                        <FormItem>

                            <FormControl>
                                <DatePicker
                                value={field.value}
                                onChangeAction={field.onChange}
                                disabled={disabled}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField 
                    name="payee"
                    control={form.control}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Payee
                            </FormLabel>
                            <FormControl>
                                <Input 
                                    disabled={disabled}
                                    placeholder="Add a Payee"
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField 
                    name="amount"
                    control={form.control}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Amount
                            </FormLabel>
                            <FormControl>
                                <AmountInput 
                                    {...field}
                                    disabled={disabled}
                                    onChangeAction={() => {}}
                                    placeholder="0.00"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField 
                    name="notes"
                    control={form.control}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Notes
                            </FormLabel>
                            <FormControl>
                                <Textarea 
                                    {...field}
                                    value={field.value || ""}
                                    disabled={disabled}
                                    placeholder="Add a Payee"
                                    
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button className="w-full disabled:{disabled}">
                    {id ?  "Save Changes" : "Create Account"}
                </Button>
                {!!id && <Button
                //!!id converts id to boolean
                    type="button"
                    disabled={disabled}
                    onClick={handleDelete}
                    className="w-full"
                    variant="outline"
                >
                    <Trash className="size-4 mr-2"/>
                    Delete Account
                </Button>}
            </form>
        </Form>
    );
}