import { isAuthed } from '@/lib/auth';
import { AdminPanel } from '@/components/AdminPanel';

export default function AdminPage() {
  return <AdminPanel initialAuthed={isAuthed()} />;
}
