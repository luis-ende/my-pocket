import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import React, { isValidElement, ReactNode } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type AlertDialogDeleteProps = {
    onClose?: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    trigger: ReactNode;
};
const AlertDialogDelete = ({ onClose, onConfirm, title, description, trigger }: AlertDialogDeleteProps) => {
    function getTypeName(node: ReactNode) {
        if (isValidElement(node)) {
            const elType = node.type;
            if (typeof elType === 'function' && 'name' in elType) {
                // Custom component (function/class) – has a `name`
                return elType.name;
            } else if (typeof elType === 'string') {
                // Built-in HTML element (like "div")
                return elType;
            }
        }
    }

    return (
        <AlertDialog
            onOpenChange={(open) => {
                if (!open && onClose) {
                    onClose();
                }
            }}
        >
            {getTypeName(trigger) === 'Button' ?
                <Tooltip>
                    <TooltipTrigger asChild>
                        <AlertDialogTrigger asChild>
                            {trigger}
                        </AlertDialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{title}</p>
                    </TooltipContent>
                </Tooltip>
                :
                <AlertDialogTrigger asChild>
                    {trigger}
                </AlertDialogTrigger>
            }

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700 focus:ring-red-600">
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AlertDialogDelete;
