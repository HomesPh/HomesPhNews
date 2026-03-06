import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'FAQs | Homes.ph News',
    description: 'Frequently Asked Questions about Homes.ph News.',
};

export default function FAQsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
