import { revalidateLogs } from '@/app/actions/log';
import { revalidatePlaces } from '@/app/actions/place';

export async function GET() {
  revalidateLogs();
  revalidatePlaces();
  return Response.json({ revalidated: true });
}
