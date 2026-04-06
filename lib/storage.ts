import { createClient } from '@/lib/supabase/client';

export async function uploadImage(file: File, folder: 'team' | 'ventures' | 'properties' | 're'): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split('.').pop() || 'jpg';
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from('images').upload(filename, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from('images').getPublicUrl(filename);
  return data.publicUrl;
}
