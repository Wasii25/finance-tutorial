import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertCategorySchema } from "@/db/schema";
import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";

// defining our form schema
const formSchema = insertCategorySchema.pick({
    name: true,
});
//The above form only is for creating the name of the categories. 
// That will now be converted to form values

type FormValues = z.input<typeof formSchema>;

type props = {
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (values: FormValues) => void;
    onDelete?: () => void;
    disable?: boolean;
    //key? = optional value
    //key without question mark is mandatory
};

export const CategoryForm = ({
    id,
    defaultValues,
    onSubmit,
    onDelete,
    disable: disabled,
}: props) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    });

    const handleSubmit = (values: FormValues) => {
        onSubmit(values);
    }
    
    const handleDelete = () => {
        onDelete?.()
    }
    return ( 
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
                <FormField 
                    name="name"
                    control={form.control}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Name
                            </FormLabel>
                            <FormControl>
                                <Input
                                    disabled={disabled}
                                    placeholder="e.g.Food, Travel, etc."
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button className="w-full disabled:{disabled}">
                    {id ?  "Save Changes" : "Create Category"}
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
                    Delete Category
                </Button>}
            </form>
        </Form>
    );
}