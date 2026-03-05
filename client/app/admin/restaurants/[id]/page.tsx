import { redirect } from 'next/navigation';

export default function RestaurantByIdRedirect({ params }: { params: { id: string } }) {
    redirect(`/admin/restaurant/${params.id}`);
}
