-- 認証ユーザーが people-images バケットのファイルを読み取れるようにする
create policy "select people-images"
on storage.objects
for select
to authenticated
using (bucket_id = 'people-images');