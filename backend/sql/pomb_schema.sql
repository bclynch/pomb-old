begin;

create schema pomb;
create schema pomb_private;

alter default privileges revoke execute on functions from public;

create table pomb.user (
  id                  serial primary key,
  username            text unique not null check (char_length(first_name) < 80),
  first_name          text check (char_length(first_name) < 80),
  last_name           text check (char_length(last_name) < 100),
  created_at          bigint default (extract(epoch from now()) * 1000),
  updated_at          timestamp default now()
);

insert into pomb.user (username, first_name, last_name) values
  ('rambler', 'John', 'Doe');

comment on table pomb.user is 'Table with POMB users';
comment on column pomb.user.id is 'Primary id for user';
comment on column pomb.user.username is 'Username of user';
comment on column pomb.user.first_name is 'First name of user';
comment on column pomb.user.last_name is 'Last name of user';
comment on column pomb.user.created_at is 'When user created account';
comment on column pomb.user.updated_at is 'When user account last updated';

alter table pomb.user enable row level security;

create table pomb.post (
  id                  serial primary key,
  author              integer not null references pomb.user(id),
  title               text not null check (char_length(title) < 200),
  subtitle            text not null check (char_length(title) < 300),
  content             text not null,
  leadPhoto           text not null,
  created_at          bigint default (extract(epoch from now()) * 1000),
  updated_at          timestamp default now()
);

insert into pomb.post (author, title, subtitle, content, leadPhoto) values
  (1, 'Explore The World', 'Neat Info', 'World Info', 'https://static.pexels.com/photos/39811/pexels-photo-39811.jpeg'),
  (1, 'Lose Your Way? Find a Beer', 'No Bud Light though', 'Beer Info', 'https://s-media-cache-ak0.pinimg.com/originals/1a/f9/ed/1af9ed39dbf3f34b716df6d6e2bcf690.jpg'),
  (1, 'Sports through the lense of global culture', 'Its not all football out there', 'Sports Info', 'https://iso.500px.com/wp-content/uploads/2016/03/stock-photo-142984111-1500x1000.jpg'),
  (1, 'Riding the Silk Road', 'Bets way to see central asia', 'Road Info', 'http://cdn.playbuzz.com/cdn/d071f701-c20d-4ac2-8fa5-7d32c6c5ed79/87665b9b-0731-42e2-8ced-aa2b14f38ee1.jpg'),
  (1, 'Why You Should Go', 'Because youre a wimp', 'Lame Info', 'https://static.pexels.com/photos/60013/desert-drought-dehydrated-clay-soil-60013.jpeg'),
  (1, 'Getting Over Some BS', 'Get under some broad', 'Get over it Info', 'https://static.pexels.com/photos/34107/milky-way-stars-night-sky.jpg'),
  (1, 'Food Finds From Your Moms House', 'Tastes good man', 'Yum Info', 'http://dreamatico.com/data_images/mountain/mountain-1.jpg'),
  (1, 'Finding Peace', 'Dont even have to India', 'Peace Info', 'https://shorelineobx.com/wp-content/uploads/2017/01/hero-image-lg-1500x609.jpg'),
  (1, 'Scaling the Sky', 'Beat boredom with these journeys', 'Scale Info', 'http://visitsedona.com/wp-content/uploads/2015/05/peach-sky-web.jpg'),
  (1, 'Cars, Trains, and Gangs', 'Staying safe on the road is harder than you thought', 'Transport Info', 'http://danversfishandgameclub.com/dfgc/wp-content/uploads/2014/10/the-great-outdoors.jpg'),
  (1, 'Love Your Life', 'Schmarmy garbage', 'Heart Info', 'https://www.travelalaskaoutdoors.com/img/masthead/mountains.jpg'),
  (1, 'Another Blog Post', 'You better check this shit out', 'Dumb Info', 'https://greatist.com/sites/default/files/Running_Mountain.jpg'),
  (1, 'Through the Looking Glass', 'Bring your spectacles', 'Spec Info', 'http://www.recreatingwithkids.com/app/uploads/2012/01/Great-Outdoors-1024x768.jpg');

comment on table pomb.post is 'Table with POMB posts';
comment on column pomb.post.id is 'Primary id for post';
comment on column pomb.post.title is 'Title of the post';
comment on column pomb.post.subtitle is 'Subtitle of post';
comment on column pomb.post.content is 'Content of post';
comment on column pomb.post.leadPhoto is 'Main image of post';
comment on column pomb.post.created_at is 'When post created';
comment on column pomb.post.updated_at is 'Last updated date';

create table pomb.post_tag (
  id                  serial primary key,
  name                text not null
);

insert into pomb.post_tag (name) values
  ('Colombia'),
  ('Biking'),
  ('Trekking'),
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
  (5, 2),
  (5, 7),
  (6, 4),
  (7, 2),
  (8, 1),
  (9, 1),
  (10, 7),
  (11, 8),
  (11, 5),
  (12, 8),
  (12, 3),
  (13, 4),
  (13, 5),
  (13, 8);

comment on table pomb.post_to_tag is 'Join table for tags on a post';
comment on column pomb.post_to_tag.post_id is 'Id of the post';
comment on column pomb.post_to_tag.post_tag_id is 'Id of the post tag';

create table pomb.post_comment (
  id                  serial primary key,
  author              integer not null references pomb.user(id),
  content             text not null,
  created_at          bigint default (extract(epoch from now()) * 1000),
  updated_at          timestamp default now()
);

insert into pomb.post_comment (author, content) values
  (1, 'Colombia commentary'),
  (1, 'Biking Bizness'),
  (1, 'Hiking is neat'),
  (1, 'Camping is fun'),
  (1, 'Food is dope'),
  (1, 'Travel is lame'),
  (1, 'Culture is exotic'),
  (1, 'Gear snob');

comment on table pomb.post_comment is 'Table withcomments from users';
comment on column pomb.post_comment.id is 'Primary id for the comment';
comment on column pomb.post_comment.author is 'Primary id of author';
comment on column pomb.post_comment.content is 'Body of the comment';
comment on column pomb.post_comment.created_at is 'Time comment created at';
comment on column pomb.post_comment.updated_at is 'Time comment updaed at';

create table pomb.post_to_comment ( --one to many
  post_id            integer not null references pomb.post(id),
  comment_id         integer not null references pomb.post_comment(id)
);

insert into pomb.post_to_comment (post_id, comment_id) values
  (1, 1),
  (1, 4),
  (2, 7),
  (3, 1),
  (3, 3),
  (3, 5),
  (4, 7),
  (4, 3),
  (5, 2);

comment on table pomb.post_to_comment is 'Join table for comments on a post';
comment on column pomb.post_to_comment.post_id is 'Id of the post';
comment on column pomb.post_to_comment.comment_id is 'Id of the comment';

-- *******************************************************************
-- *********************** Function Queries **************************
-- *******************************************************************
CREATE FUNCTION pomb.posts_by_tag(tag_id INTEGER) returns setof pomb.post AS $$
  SELECT pomb.post.* 
  FROM pomb.post 
  INNER JOIN pomb.post_to_tag ON pomb.post.id = pomb.post_to_tag.post_id 
  WHERE pomb.post_to_tag.post_tag_id = tag_id;
$$ language sql stable;

COMMENT ON FUNCTION pomb.posts_by_tag(INTEGER) is 'Returns posts that include a given tag';

CREATE FUNCTION pomb.post_tag_by_name(tag_name TEXT) returns setof pomb.post_tag AS $$
  SELECT pomb.post_tag.*
  FROM pomb.post_tag 
  WHERE pomb.post_tag.name = tag_name;
$$ language sql stable;

COMMENT ON FUNCTION pomb.post_tag_by_name(TEXT) is 'Returns posts that include a given tag';

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

create trigger comment_updated_at before update
  on pomb.post_comment
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
--   username            text,
--   first_name          text,
--   last_name           text,
--   email               text,
--   password            text
-- ) returns pomb.user as $$
-- declare
--   user pomb.user;
-- begin
--   insert into pomb.user (username, first_name, last_name) values
--     (username, first_name, last_name)
--     returning * into user;

--   insert into pomb_private.user_account (user_id, email, password_hash) values
--     (user.id, email, crypt(password, gen_salt('bf')));

--   return user;
-- end;
-- $$ language plpgsql strict security definer;

-- comment on function pomb.register_user(text, text, text, text, text) is 'Registers a single user and creates an account for POMB.';

-- *******************************************************************
-- ************************* Roles ************************************
-- *******************************************************************

create role pomb_admin login password 'abc123';
GRANT ALL privileges ON ALL TABLES IN SCHEMA pomb to pomb_admin;
GRANT ALL privileges ON ALL TABLES IN SCHEMA pomb_private to pomb_admin;

create role pomb_anonymous login password 'abc123' NOINHERIT;
grant pomb_anonymous to pomb_admin; --Now, the pomb_admin role can control and become the pomb_anonymous role. If we did not use that grant, we could not change into the pomb_anonymous role in PostGraphQL.

create role pomb_user;
grant pomb_user to pomb_admin; --The pomb_admin role will have all of the permissions of the roles granted to it. So it can do everything pomb_anonymous can do and everything pomb_usercan do.
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
grant select on table pomb.post_comment to PUBLIC;
grant select on table pomb.post_to_comment to PUBLIC;
grant select on table pomb.user to PUBLIC;
grant ALL on table pomb.user to pomb_user;

-- grant execute on function pomb.register_user(text, text, text, text, text) to pomb_anonymous;
grant execute on function pomb.authenticate_user(text, text) to pomb_anonymous;
grant execute on function pomb.current_user() to pomb_user;
grant execute on function pomb.posts_by_tag(integer) to pomb_anonymous; 
grant execute on function pomb.post_tag_by_name(TEXT) to pomb_anonymous;

-- ///////////////// RLS Policies ////////////////////////////////

create policy user_self on pomb.user for ALL to pomb_user
  using (id = current_setting('jwt.claims.user_id')::integer);

commit;