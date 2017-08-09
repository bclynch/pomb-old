begin;

create schema pomb;
create schema pomb_private;

alter default privileges revoke execute on functions from public;

create table pomb.user (
    id                  serial primary key,
    first_name          text check (char_length(first_name) < 80),
    last_name           text check (char_length(last_name) < 100),
    created_at          bigint default (extract(epoch from now()) * 1000),
    updated_at          timestamp default now()
);

comment on table pomb.user is 'Table with POMB users';
comment on column pomb.user.id is 'Primary id for user';
comment on column pomb.user.first_name is 'First name of user';
comment on column pomb.user.last_name is 'Last name of user';
comment on column pomb.user.created_at is 'When user created account';
comment on column pomb.user.updated_at is 'When user account last updated';

alter table pomb.user enable row level security;

create table pomb.post (
  id                  serial primary key,
  title               text not null check (char_length(title) < 200),
  created_at          bigint default (extract(epoch from now()) * 1000),
  updated_at          timestamp default now()
);

insert into pomb.post (title) values
  ('High Timez'),
  ('Cannabis Alley'),
  ('Buddys Bud'),
  ('420 Dreamscape'),
  ('Dank Mart');

comment on table pomb.post is 'Table with POMB posts';
comment on column pomb.post.id is 'Primary id for post';
comment on column pomb.post.title is 'Title of the post';
comment on column pomb.post.created_at is 'When post created';
comment on column pomb.post.updated_at is 'Last updated date';

create table pomb.post_tag (
  id                  serial primary key,
  name                text not null
);

insert into pomb.post_tag (name) values
  ('Colombia'),
  ('Biking'),
  ('Hiking'),
  ('Camping'),
  ('Food'),
  ('Travel'),
  ('Culture'),
  ('Gear');

comment on table pomb.post_tag is 'Table with the type of post tags available';
comment on column pomb.post_tag.id is 'Primary id for the tag';
comment on column pomb.post_tag.name is 'Name of the post tag';

create table pomb.post_to_tag ( --one to many
  post_id            integer not null references pomb.post(id),
  post_tag_id        integer not null references pomb.post_tag(id)
);

insert into pomb.post_to_tag (post_id, post_tag_id) values
  (1, 1),
  (1, 4),
  (2, 7),
  (3, 1),
  (3, 3),
  (3, 5),
  (4, 7),
  (4, 3),
  (5, 2);

comment on table pomb.post_to_tag is 'Join table for tags on a post';
comment on column pomb.post_to_tag.post_id is 'Id of the post';
comment on column pomb.post_to_tag.post_tag_id is 'Id of the post tag';

-- *******************************************************************
-- ************************* Triggers ********************************
-- *******************************************************************
create function pomb_private.set_updated_at() returns trigger as $$
begin
  new.updated_at := current_timestamp;
  return new;
end;
$$ language plpgsql;

create trigger post_updated_at before update
  on pomb.post
  for each row
  execute procedure pomb_private.set_updated_at();

create trigger user_updated_at before update
  on pomb.user
  for each row
  execute procedure pomb_private.set_updated_at();

-- *******************************************************************
-- ************************* Auth ************************************
-- *******************************************************************

create table pomb_private.user_account (
  user_id             integer primary key references pomb.user(id) on delete cascade,
  email               text not null unique check (email ~* '^.+@.+\..+$'),
  password_hash       text not null
);

comment on table pomb_private.user_account is 'Private information about a user’s account.';
comment on column pomb_private.user_account.user_id is 'The id of the user associated with this account.';
comment on column pomb_private.user_account.email is 'The email address of the user.';
comment on column pomb_private.user_account.password_hash is 'An opaque hash of the user’s password.';

create extension if not exists "pgcrypto";

-- create function pomb.register_user (
--     first_name          text,
--     last_name           text,
--     email               text,
--     password            text
-- ) returns pomb.user as $$
-- declare
--   user pomb.user;
-- begin
--   insert into pomb.user (first_name, last_name) values
--     (first_name, last_name)
--     returning * into user;

--   insert into pomb_private.user_account (user_id, email, password_hash) values
--     (user.id, email, crypt(password, gen_salt('bf')));

--   return user;
-- end;
-- $$ language plpgsql strict security definer;

-- comment on function pomb.register_user(text, text, text, text) is 'Registers a single user and creates an account for POMB.';

-- *******************************************************************
-- ************************* Roles ************************************
-- *******************************************************************

create role pomb_admin login password 'abc123';
GRANT ALL privileges ON ALL TABLES IN SCHEMA pomb to pomb_admin;
GRANT ALL privileges ON ALL TABLES IN SCHEMA pomb_private to pomb_admin;

create role pomb_anonymous login password 'abc123' NOINHERIT;
grant pomb_anonymous to pomb_admin; --Now, the pomb_admin role can control and become the pomb_anonymous role. If we did not use that grant, we could not change into the pomb_anonymous role in PostGraphQL.

create role pomb_user;
grant pomb_user to pomb_admin; --The pomb_admin role will have all of the permissions of the roles granted to it. So it can do everything pomb_anonymous can do and everything pomb_customer can do.
grant pomb_user to pomb_anonymous; 

create type pomb.jwt_token as (
  role text,
  user_id integer
);

alter database blynch set "jwt.claims.user_id" to '0';

create function pomb.authenticate_user(
  email text,
  password text
) returns pomb.jwt_token as $$
declare
  account pomb_private.user_account;
begin
  select a.* into account
  from pomb_private.user_account as a
  where a.email = $1;

  if account.password_hash = crypt(password, account.password_hash) then
    return ('pomb_user', account.user_id, null, null)::pomb.jwt_token;
  else
    return null;
  end if;
end;
$$ language plpgsql strict security definer;

comment on function pomb.authenticate_user(text, text) is 'Creates a JWT token that will securely identify a user and give them certain permissions.';

create function pomb.current_user() returns pomb.user as $$
  select *
  from pomb.user
  where pomb.user.id = current_setting('jwt.claims.user_id', true)::integer
$$ language sql stable;

comment on function pomb.current_user() is 'Gets the user who was identified by our JWT.';

-- *******************************************************************
-- ************************* Security *********************************
-- *******************************************************************

grant usage on schema pomb to pomb_anonymous, pomb_user;
grant usage on all sequences in schema pomb to pomb_user;

grant select on table pomb.post to PUBLIC;
grant select on table pomb.post_tag to PUBLIC;
grant select on table pomb.post_to_tag to PUBLIC;
grant ALL on table pomb.user to pomb_user;

-- grant execute on function pomb.register_user(text, text, text, text) to pomb_anonymous;
grant execute on function pomb.authenticate_user(text, text) to pomb_anonymous;
grant execute on function pomb.current_user() to pomb_user;

-- ///////////////// RLS Policies ////////////////////////////////

create policy user_self on pomb.user for ALL to pomb_user
  using (id = current_setting('jwt.claims.user_id')::integer);

commit;