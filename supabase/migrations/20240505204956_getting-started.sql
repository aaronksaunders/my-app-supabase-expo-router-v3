create sequence "public"."images_id_seq";

create table "public"."images" (
    "id" integer not null default nextval('images_id_seq'::regclass),
    "url" text not null,
    "owner_id" uuid not null,
    "is_public" boolean not null default false,
    "name" text
);


alter table "public"."images" enable row level security;

alter sequence "public"."images_id_seq" owned by "public"."images"."id";

CREATE UNIQUE INDEX images_pkey ON public.images USING btree (id);

alter table "public"."images" add constraint "images_pkey" PRIMARY KEY using index "images_pkey";

create policy "image_access_policy"
on "public"."images"
as permissive
for select
to public
using (((( SELECT auth.uid() AS uid) IS NOT NULL) AND ((owner_id = ( SELECT auth.uid() AS uid)) OR (is_public = true))));


create policy "insert_auth_users_policy"
on "public"."images"
as permissive
for insert
to authenticated
with check (true);



