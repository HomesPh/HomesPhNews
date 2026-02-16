import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'FAQs | HomesTV',
    description: 'Frequently Asked Questions about HomesTV.',
};

export default function FAQsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
