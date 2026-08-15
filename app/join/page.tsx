import { readContent } from '@/lib/content';
import { JoinForm } from '@/components/JoinForm';

// Content lives in Vercel KV and can change any time from the admin panel,
// so render this on every request instead of baking it in at build time.
export const dynamic = 'force-dynamic';

export default async function JoinPage() {
  const c = await readContent();
  return <JoinForm nav={c.nav} form={c.formPage} />;
}
