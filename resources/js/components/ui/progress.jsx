import * as React from "react";
import { cn } from "@/lib/utils";

function Progress({ className, value = 0, ...props }) {
    return (
        <div
            data-slot="progress"
            className={cn(
                "relative h-2 w-full overflow-hidden rounded-full bg-slate-100",
                className
            )}
            {...props}
        >
            <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all"
                style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
            />
        </div>
    );
}

export { Progress };
