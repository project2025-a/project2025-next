import { revalidateUsers } from '@/app/actions/user';

export async function GET() {
  revalidateUsers();
  return Response.json({ revalidated: true });
}
