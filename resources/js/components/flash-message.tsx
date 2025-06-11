import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { usePage } from '@inertiajs/react';

export default function FlashMessage() {
    const { flash } = usePage().props;

    if (!flash?.success) return null;

    return (
        <Alert className="bg-green-100 border-green-400 text-green-800">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{flash?.success}</AlertDescription>
        </Alert>
    );
}
