import AppLogoIcon from '@/components/app-logo-icon';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { Badge } from '@/components/ui/badge';

export default function CardBookmark({ title,
                                       description,
                                       url,
                                       tags,
                                     }: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
    url?: string;
    tags?: string;
}>) {
    return (
        /*<div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-md flex-col gap-6">
                {/!*<Link href={route('home')} className="flex items-center gap-2 self-center font-medium">
                    <div className="flex h-9 w-9 items-center justify-center">
                        <AppLogoIcon className="size-9 fill-current text-black dark:text-white" />
                    </div>
                </Link>*!/}

                <div className="flex flex-col gap-6">*/
                    <Card className="rounded-xl w-50 h-100">
                        <CardHeader className="px-10 pt-8 pb-0 text-center">
                            <a href={url} target="_blank" rel="noopener noreferrer"  title={title}>
                                <CardTitle className="text-xs h-20 bg-amber-50 text-left">
                                        {title}
                                </CardTitle>
                            </a>
                            <CardDescription className="text-xs text-left">{description}</CardDescription>
                        </CardHeader>
                        <CardContent className="px-10 py-8">
                            {tags?.split('|').map((tag) => (
                                <Badge>{tag}</Badge>
                            ))}
                        </CardContent>
                        <CardFooter className="bg-blue-200">Footer</CardFooter>
                    </Card>
                /*</div>
            </div>
        </div>*/
    );
}
