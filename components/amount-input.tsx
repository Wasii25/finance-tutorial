import CurrencyInput from "react-currency-input-field";
import { Info, MinusCircle, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/components/ui/tooltip";

type Props = {
    value: string;
    onChangeAction: (value: string | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
};

export const AmountInput = ({
    value,
    onChangeAction,
    placeholder,
    disabled,
}: Props) => {

    const parsedValue = parseFloat(value);
    const isIncome = parsedValue > 0;
    const isExpense = parsedValue < 0;

    const onReverseValue = () => {
        if(!value) return;
        onChangeAction((parseFloat(value) * -1).toString());
    };

    return (
        <div className="relative">
            <TooltipProvider>
                <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                        {/* as child is used above cuz the below html is a native button element */}
                            <button type="button" onClick={onReverseValue}
                                className={cn(
                                    "bg-slate-400 hover:bg-slate-500 absolute top-1/2 transform -translate-y-1/2 right-1.5 rounded-md p-2 flex items-center justify-center transition z-10",
                                    isIncome && "bg-emerald-500 hover:bg-emerald-600",
                                    isExpense && "bg-rose-500 hover:bg-rose-600",

                                )}
                                >
                                    {!parsedValue && <Info className="size- text-white" />}
                                    {isIncome && <PlusCircle className="size- text-white" />}
                                    {isExpense && <MinusCircle className="size- text-white" />}
                                </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Use [+] for income and [-] for expenses
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <CurrencyInput
                prefix="¤"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                placeholder={placeholder}       
                value={value}
                decimalsLimit={2}
                decimalScale={2}
                onValueChange={onChangeAction}
                disabled={disabled}
            />
            <p className="text-xs mt-2 text-muted-foreground">
                {isIncome && "This will count as income"}
                {isExpense && "This will count as expense"}
            </p>
        </div>
    );
}

