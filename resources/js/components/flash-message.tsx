import { usePage } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
export default function FlashMessage() {
    const { flash } = usePage().props;
    const [message, setMessage] = useState(null);

    useEffect(() => {
        setMessage(null);
        if (flash?.success) {
            setMessage(flash.success);
        }
    }, [flash]);

    if (!message) return null;

    return toast('Success', {
        icon: <CheckCircle className="h-6 w-6 text-green-500" />,
        description: flash?.success,
        onAutoClose: () => setMessage(null),
        action: {
            label: 'Close',
            onClick: () => setMessage(null),
        },
    });
}
