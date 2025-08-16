import { usePage } from '@inertiajs/react';
import { CheckCircle, CircleX  } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
export default function FlashMessage() {
    const { flash } = usePage().props;
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('');

    useEffect(() => {
        setMessage(null);
        if (flash?.success) {
            setMessageType('Success');
            setMessage(flash.success);
        }

        if (flash?.error) {
            setMessageType('Error');
            setMessage(flash.error);
        }
    }, [flash]);

    if (!message) return null;

    return toast( `${messageType}`, {
        icon: messageType === 'Success' ? <CheckCircle className="h-6 w-6 text-green-500" /> : <CircleX className="h-6 w-6 text-red-500" />,
        description: message,
        onAutoClose: () => setMessage(null),
        action: {
            label: 'Close',
            onClick: () => setMessage(null),
        },
    });
}
