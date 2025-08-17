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
import React, { ReactNode } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type AlertDialogDeleteProps = {
    onClose?: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    trigger: ReactNode;
};
const AlertDialogDelete = ({ onClose, onConfirm, title, description, trigger }: AlertDialogDeleteProps) => {
    return (
        <AlertDialog
            onOpenChange={(open) => {
                if (!open && onClose) {
                    onClose();
                }
            }}
        >

            {trigger?.type.name === 'Button' ?
                <Tooltip>
                    <TooltipTrigger asChild>
                        <AlertDialogTrigger asChild>
                            {trigger}
                        </AlertDialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Delete bookmarks</p>
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
