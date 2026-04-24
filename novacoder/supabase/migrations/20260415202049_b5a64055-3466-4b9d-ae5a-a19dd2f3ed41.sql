
-- Drop the overly broad public SELECT policy
DROP POLICY IF EXISTS "Attachments are publicly viewable" ON storage.objects;

-- Replace with authenticated-only viewing
CREATE POLICY "Authenticated users can view attachments"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'chat-attachments');
