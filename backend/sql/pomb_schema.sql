begin;

create schema pomb;
create schema pomb_private;

alter default privileges revoke execute on functions from public;

create table pomb.account (
  id                  serial primary key,
  username            text unique not null check (char_length(username) < 80),
  first_name          text check (char_length(first_name) < 80),
  last_name           text check (char_length(last_name) < 100),
  profile_photo       text,
  hero_photo          text,
  created_at          bigint default (extract(epoch from now()) * 1000),
  updated_at          timestamp default now()
);

insert into pomb.account (username, first_name, last_name) values
  ('rambler', 'John', 'Doe');

comment on table pomb.account is 'Table with POMB users';
comment on column pomb.account.id is 'Primary id for account';
comment on column pomb.account.username is 'username of account';
comment on column pomb.account.first_name is 'First name of account';
comment on column pomb.account.last_name is 'Last name of account';
comment on column pomb.account.profile_photo is 'Profile photo of account';
comment on column pomb.account.hero_photo is 'Hero photo of account';
comment on column pomb.account.created_at is 'When account created';
comment on column pomb.account.updated_at is 'When account last updated';

-- alter table pomb.account enable row level security;

-- Limiting choices for category field on post
create type pomb.post_category as enum (
  'Trekking',
  'Biking',
  'Travel',
  'Culture',
  'Gear'
);

create table pomb.post (
  id                  serial primary key,
  author              integer not null references pomb.account(id),
  title               text not null check (char_length(title) < 200),
  subtitle            text not null check (char_length(title) < 300),
  content             text not null,
  category            pomb.post_category,
  is_draft            boolean not null,
  is_scheduled        boolean not null,
  scheduled_date      bigint,
  is_published        boolean not null,
  published_date      bigint,
  created_at          bigint default (extract(epoch from now()) * 1000),
  updated_at          timestamp default now()
);

insert into pomb.post (author, title, subtitle, content, category, is_draft, is_scheduled, scheduled_date, is_published, published_date) values
  (1, 'Explore The World', 'Neat Info', '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris libero felis, maximus ut tincidunt a, consectetur in dolor. Pellentesque laoreet volutpat elit eget placerat. Pellentesque pretium molestie erat, vitae mollis urna dapibus a. Quisque eu aliquet metus. Aenean eget magna pharetra, mattis orci euismod, lobortis augue. Maecenas bibendum eros lorem, vitae pretium justo volutpat sit amet. Aenean varius odio magna, et pulvinar nulla sagittis a. Aliquam eleifend ac quam in pharetra. Praesent eu sem posuere, ultricies quam ullamcorper, eleifend est. In malesuada commodo eros non fringilla. Nulla aliquam diam et nisi pellentesque aliquet. Proin eu est commodo, molestie neque eu, faucibus leo.</p><p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Quisque hendrerit risus nulla, at congue dolor bibendum ac. Maecenas condimentum, orci non fringilla venenatis, justo dolor pellentesque enim, sit amet laoreet lectus risus et enim. Quisque a fringilla ex. Nunc at felis mauris. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Cras suscipit purus porttitor porta vestibulum. Vestibulum sed ipsum sit amet arcu mattis congue vitae ac risus. Phasellus ac ultrices est. Maecenas ultrices eros ligula. Quisque placerat nisi tellus, vel auctor ligula pretium et. Nullam turpis odio, tincidunt non eleifend eu, cursus id lorem. Nam nibh sapien, eleifend quis massa eu, vulputate ullamcorper odio.</p><p><img src="https://localtvkdvr.files.wordpress.com/2017/05/may-snow-toby-the-bernese-mountain-dog-at-loveland.jpg?quality=85&strip=all&w=2000" style="width: 300px;" class="fr-fic fr-fil fr-dii">Aenean viverra turpis urna, et pellentesque orci posuere non. Pellentesque quis condimentum risus, non mattis nulla. Integer posuere egestas elit, vitae semper libero blandit at. Aenean vehicula tortor nec leo accumsan lobortis. Pellentesque vitae eros non felis fermentum vehicula eu in libero. Etiam sed tortor id odio consequat tincidunt. Maecenas eu nibh maximus odio pulvinar tempus. Mauris ipsum neque, congue in laoreet eu, gravida ac dui. Nunc aliquet elit nec urna sagittis fermentum. Sed vehicula in leo a luctus. Sed commodo magna justo, sit amet aliquet odio mattis quis. Praesent eget vehicula erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vel ipsum enim. Nulla facilisi.</p><p>Phasellus interdum felis sit amet finibus consectetur. Vivamus eget odio vel augue maximus finibus. Vestibulum fringilla lorem id lobortis convallis. Phasellus pharetra metus nec vulputate dapibus. Nunc id est mi. Vivamus placerat, diam sit amet sodales commodo, massa dolor euismod tortor, ut condimentum orci lectus ac ex. Ut mollis ex ut est euismod rhoncus. Quisque ut lobortis risus, a sodales diam. Maecenas vitae bibendum est, eget tincidunt lacus. Donec laoreet felis sed orci maximus, id consequat augue faucibus. In libero erat, porttitor vitae nunc id, dapibus sollicitudin nisl. Ut a pharetra neque, at molestie eros. Aliquam malesuada est rutrum nunc commodo, in eleifend nisl vestibulum.</p><p>Vestibulum id lacus rutrum, tristique lectus a, vestibulum odio. Nam dictum dui at urna pretium sodales. Nullam tristique nisi eget faucibus consequat. Etiam pretium arcu sed dapibus tincidunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus dictum vitae sapien suscipit dictum. In hac habitasse platea dictumst. Suspendisse risus dui, mattis ac malesuada efficitur, scelerisque vitae diam. Nam eu neque vel ex pharetra consequat vitae in justo. Phasellus convallis enim non est vulputate scelerisque. Duis id sagittis leo. Cras molestie tincidunt nisi, ac scelerisque est egestas vitae. Fusce mollis tempus dui in aliquet. Duis ipsum sem, ultricies nec risus nec, aliquet hendrerit neque. Integer accumsan varius iaculis.</p><p>Aliquam pharetra fringilla lectus sed placerat. Donec iaculis libero non sem maximus, id scelerisque arcu laoreet. Sed tempus eros sit amet justo posuere mollis. Etiam commodo semper felis maximus porttitor. Fusce ut molestie massa. Phasellus sem enim, tristique quis lorem id, maximus accumsan sapien. Aenean feugiat luctus ligula, vel tristique nunc convallis eget.</p><p>Ut facilisis tortor turpis, ac feugiat nunc egestas eget. Ut tincidunt ex nisi, eu egestas purus interdum in. Pellentesque ornare commodo turpis vitae aliquam. Etiam ornare cursus elit, in feugiat mauris ornare vitae. Morbi mollis molestie lacus, non pulvinar quam. Quisque eleifend sed erat id congue. Vivamus vulputate tempus tortor, a gravida justo dictum id. Proin tristique, neque id viverra accumsan, leo erat mattis sem, at porttitor nisi enim non risus. Nunc pharetra velit ut condimentum porta. Fusce consectetur id lectus quis vulputate. Nunc congue rutrum diam, at sodales magna malesuada iaculis. Aenean nec facilisis nulla, vestibulum eleifend purus.<img src="https://i.froala.com/assets/photo2.jpg" data-id="2" data-type="image" data-name="Image 2017-08-07 at 16:08:48.jpg" style="width: 300px;" class="fr-fic fr-dii hoverZoomLink fr-fir"></p><p>Morbi eget dolor sed velit pharetra placerat. Duis justo dui, feugiat eu diam ut, rutrum pellentesque urna. Praesent mattis tellus nec congue auctor. Fusce condimentum in sem at rhoncus. Mauris nec erat lacinia ligula viverra congue eget sit amet tellus. Aenean aliquet fermentum velit. Vivamus ut odio vel dolor mattis interdum. Nunc ullamcorper ex quis arcu tincidunt, sed accumsan massa rutrum. In at urna laoreet enim auctor consectetur ac eu justo. Curabitur porta turpis eget purus interdum scelerisque. Nunc dignissim aliquam sagittis. Suspendisse feugiat velit semper, condimentum magna vel, mollis neque. Maecenas sed lectus vel mi fringilla vehicula sit amet sed risus. Morbi posuere tincidunt magna nec interdum.</p><p>Mauris non cursus nisi, id semper quam. Aliquam auctor, est nec fringilla egestas, nisi orci varius sem, molestie faucibus est nulla ut tellus. Pellentesque in massa facilisis, sollicitudin elit nec, interdum ipsum. Maecenas pellentesque, orci sit amet auctor volutpat, mi lectus hendrerit arcu, nec pharetra justo justo et justo. Etiam feugiat dolor nisi, bibendum egestas leo auctor ut. Suspendisse dapibus quis purus nec pretium. Proin gravida orci et porta vestibulum. Cras ut sem in ante dignissim elementum vehicula id augue. Donec purus augue, dapibus in justo ut, posuere mollis felis. Nunc iaculis urna dolor, sollicitudin aliquam eros mattis placerat. Ut eget turpis ut dui ullamcorper ultricies a eget ex. Integer vitae lorem vel metus dignissim volutpat. Mauris tincidunt faucibus tellus, quis mollis libero. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p>Duis viverra efficitur libero eget luctus. Aenean dapibus sodales diam, posuere dictum erat rhoncus et. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam ligula ex, tincidunt sed enim eget, accumsan luctus nulla. Mauris ac consequat nunc, et ultrices ipsum. Integer nec venenatis est. Vestibulum dapibus, velit nec efficitur posuere, urna enim pretium quam, sit amet malesuada orci nibh sed metus. Nulla nec eros felis. Sed imperdiet mauris id egestas suscipit. Nunc interdum laoreet maximus. Nunc congue sapien ultricies, pretium est nec, laoreet sem. Fusce ornare tortor massa, ac vestibulum enim gravida nec.</p>', 'Trekking', false, false, null, true, 1495726380000),
  (1, 'Lose Your Way? Find a Beer', 'No Bud Light though', '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris libero felis, maximus ut tincidunt a, consectetur in dolor. Pellentesque laoreet volutpat elit eget placerat. Pellentesque pretium molestie erat, vitae mollis urna dapibus a. Quisque eu aliquet metus. Aenean eget magna pharetra, mattis orci euismod, lobortis augue. Maecenas bibendum eros lorem, vitae pretium justo volutpat sit amet. Aenean varius odio magna, et pulvinar nulla sagittis a. Aliquam eleifend ac quam in pharetra. Praesent eu sem posuere, ultricies quam ullamcorper, eleifend est. In malesuada commodo eros non fringilla. Nulla aliquam diam et nisi pellentesque aliquet. Proin eu est commodo, molestie neque eu, faucibus leo.</p><p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Quisque hendrerit risus nulla, at congue dolor bibendum ac. Maecenas condimentum, orci non fringilla venenatis, justo dolor pellentesque enim, sit amet laoreet lectus risus et enim. Quisque a fringilla ex. Nunc at felis mauris. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Cras suscipit purus porttitor porta vestibulum. Vestibulum sed ipsum sit amet arcu mattis congue vitae ac risus. Phasellus ac ultrices est. Maecenas ultrices eros ligula. Quisque placerat nisi tellus, vel auctor ligula pretium et. Nullam turpis odio, tincidunt non eleifend eu, cursus id lorem. Nam nibh sapien, eleifend quis massa eu, vulputate ullamcorper odio.</p><p><img src="https://localtvkdvr.files.wordpress.com/2017/05/may-snow-toby-the-bernese-mountain-dog-at-loveland.jpg?quality=85&strip=all&w=2000" style="width: 300px;" class="fr-fic fr-fil fr-dii">Aenean viverra turpis urna, et pellentesque orci posuere non. Pellentesque quis condimentum risus, non mattis nulla. Integer posuere egestas elit, vitae semper libero blandit at. Aenean vehicula tortor nec leo accumsan lobortis. Pellentesque vitae eros non felis fermentum vehicula eu in libero. Etiam sed tortor id odio consequat tincidunt. Maecenas eu nibh maximus odio pulvinar tempus. Mauris ipsum neque, congue in laoreet eu, gravida ac dui. Nunc aliquet elit nec urna sagittis fermentum. Sed vehicula in leo a luctus. Sed commodo magna justo, sit amet aliquet odio mattis quis. Praesent eget vehicula erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vel ipsum enim. Nulla facilisi.</p><p>Phasellus interdum felis sit amet finibus consectetur. Vivamus eget odio vel augue maximus finibus. Vestibulum fringilla lorem id lobortis convallis. Phasellus pharetra metus nec vulputate dapibus. Nunc id est mi. Vivamus placerat, diam sit amet sodales commodo, massa dolor euismod tortor, ut condimentum orci lectus ac ex. Ut mollis ex ut est euismod rhoncus. Quisque ut lobortis risus, a sodales diam. Maecenas vitae bibendum est, eget tincidunt lacus. Donec laoreet felis sed orci maximus, id consequat augue faucibus. In libero erat, porttitor vitae nunc id, dapibus sollicitudin nisl. Ut a pharetra neque, at molestie eros. Aliquam malesuada est rutrum nunc commodo, in eleifend nisl vestibulum.</p><p>Vestibulum id lacus rutrum, tristique lectus a, vestibulum odio. Nam dictum dui at urna pretium sodales. Nullam tristique nisi eget faucibus consequat. Etiam pretium arcu sed dapibus tincidunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus dictum vitae sapien suscipit dictum. In hac habitasse platea dictumst. Suspendisse risus dui, mattis ac malesuada efficitur, scelerisque vitae diam. Nam eu neque vel ex pharetra consequat vitae in justo. Phasellus convallis enim non est vulputate scelerisque. Duis id sagittis leo. Cras molestie tincidunt nisi, ac scelerisque est egestas vitae. Fusce mollis tempus dui in aliquet. Duis ipsum sem, ultricies nec risus nec, aliquet hendrerit neque. Integer accumsan varius iaculis.</p><p>Aliquam pharetra fringilla lectus sed placerat. Donec iaculis libero non sem maximus, id scelerisque arcu laoreet. Sed tempus eros sit amet justo posuere mollis. Etiam commodo semper felis maximus porttitor. Fusce ut molestie massa. Phasellus sem enim, tristique quis lorem id, maximus accumsan sapien. Aenean feugiat luctus ligula, vel tristique nunc convallis eget.</p><p>Ut facilisis tortor turpis, ac feugiat nunc egestas eget. Ut tincidunt ex nisi, eu egestas purus interdum in. Pellentesque ornare commodo turpis vitae aliquam. Etiam ornare cursus elit, in feugiat mauris ornare vitae. Morbi mollis molestie lacus, non pulvinar quam. Quisque eleifend sed erat id congue. Vivamus vulputate tempus tortor, a gravida justo dictum id. Proin tristique, neque id viverra accumsan, leo erat mattis sem, at porttitor nisi enim non risus. Nunc pharetra velit ut condimentum porta. Fusce consectetur id lectus quis vulputate. Nunc congue rutrum diam, at sodales magna malesuada iaculis. Aenean nec facilisis nulla, vestibulum eleifend purus.<img src="https://i.froala.com/assets/photo2.jpg" data-id="2" data-type="image" data-name="Image 2017-08-07 at 16:08:48.jpg" style="width: 300px;" class="fr-fic fr-dii hoverZoomLink fr-fir"></p><p>Morbi eget dolor sed velit pharetra placerat. Duis justo dui, feugiat eu diam ut, rutrum pellentesque urna. Praesent mattis tellus nec congue auctor. Fusce condimentum in sem at rhoncus. Mauris nec erat lacinia ligula viverra congue eget sit amet tellus. Aenean aliquet fermentum velit. Vivamus ut odio vel dolor mattis interdum. Nunc ullamcorper ex quis arcu tincidunt, sed accumsan massa rutrum. In at urna laoreet enim auctor consectetur ac eu justo. Curabitur porta turpis eget purus interdum scelerisque. Nunc dignissim aliquam sagittis. Suspendisse feugiat velit semper, condimentum magna vel, mollis neque. Maecenas sed lectus vel mi fringilla vehicula sit amet sed risus. Morbi posuere tincidunt magna nec interdum.</p><p>Mauris non cursus nisi, id semper quam. Aliquam auctor, est nec fringilla egestas, nisi orci varius sem, molestie faucibus est nulla ut tellus. Pellentesque in massa facilisis, sollicitudin elit nec, interdum ipsum. Maecenas pellentesque, orci sit amet auctor volutpat, mi lectus hendrerit arcu, nec pharetra justo justo et justo. Etiam feugiat dolor nisi, bibendum egestas leo auctor ut. Suspendisse dapibus quis purus nec pretium. Proin gravida orci et porta vestibulum. Cras ut sem in ante dignissim elementum vehicula id augue. Donec purus augue, dapibus in justo ut, posuere mollis felis. Nunc iaculis urna dolor, sollicitudin aliquam eros mattis placerat. Ut eget turpis ut dui ullamcorper ultricies a eget ex. Integer vitae lorem vel metus dignissim volutpat. Mauris tincidunt faucibus tellus, quis mollis libero. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p>Duis viverra efficitur libero eget luctus. Aenean dapibus sodales diam, posuere dictum erat rhoncus et. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam ligula ex, tincidunt sed enim eget, accumsan luctus nulla. Mauris ac consequat nunc, et ultrices ipsum. Integer nec venenatis est. Vestibulum dapibus, velit nec efficitur posuere, urna enim pretium quam, sit amet malesuada orci nibh sed metus. Nulla nec eros felis. Sed imperdiet mauris id egestas suscipit. Nunc interdum laoreet maximus. Nunc congue sapien ultricies, pretium est nec, laoreet sem. Fusce ornare tortor massa, ac vestibulum enim gravida nec.</p>', 'Biking', false, false, null, true, 1295726380000),
  (1, 'Sports through the lense of global culture', 'Its not all football out there', '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris libero felis, maximus ut tincidunt a, consectetur in dolor. Pellentesque laoreet volutpat elit eget placerat. Pellentesque pretium molestie erat, vitae mollis urna dapibus a. Quisque eu aliquet metus. Aenean eget magna pharetra, mattis orci euismod, lobortis augue. Maecenas bibendum eros lorem, vitae pretium justo volutpat sit amet. Aenean varius odio magna, et pulvinar nulla sagittis a. Aliquam eleifend ac quam in pharetra. Praesent eu sem posuere, ultricies quam ullamcorper, eleifend est. In malesuada commodo eros non fringilla. Nulla aliquam diam et nisi pellentesque aliquet. Proin eu est commodo, molestie neque eu, faucibus leo.</p><p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Quisque hendrerit risus nulla, at congue dolor bibendum ac. Maecenas condimentum, orci non fringilla venenatis, justo dolor pellentesque enim, sit amet laoreet lectus risus et enim. Quisque a fringilla ex. Nunc at felis mauris. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Cras suscipit purus porttitor porta vestibulum. Vestibulum sed ipsum sit amet arcu mattis congue vitae ac risus. Phasellus ac ultrices est. Maecenas ultrices eros ligula. Quisque placerat nisi tellus, vel auctor ligula pretium et. Nullam turpis odio, tincidunt non eleifend eu, cursus id lorem. Nam nibh sapien, eleifend quis massa eu, vulputate ullamcorper odio.</p><p><img src="https://localtvkdvr.files.wordpress.com/2017/05/may-snow-toby-the-bernese-mountain-dog-at-loveland.jpg?quality=85&strip=all&w=2000" style="width: 300px;" class="fr-fic fr-fil fr-dii">Aenean viverra turpis urna, et pellentesque orci posuere non. Pellentesque quis condimentum risus, non mattis nulla. Integer posuere egestas elit, vitae semper libero blandit at. Aenean vehicula tortor nec leo accumsan lobortis. Pellentesque vitae eros non felis fermentum vehicula eu in libero. Etiam sed tortor id odio consequat tincidunt. Maecenas eu nibh maximus odio pulvinar tempus. Mauris ipsum neque, congue in laoreet eu, gravida ac dui. Nunc aliquet elit nec urna sagittis fermentum. Sed vehicula in leo a luctus. Sed commodo magna justo, sit amet aliquet odio mattis quis. Praesent eget vehicula erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vel ipsum enim. Nulla facilisi.</p><p>Phasellus interdum felis sit amet finibus consectetur. Vivamus eget odio vel augue maximus finibus. Vestibulum fringilla lorem id lobortis convallis. Phasellus pharetra metus nec vulputate dapibus. Nunc id est mi. Vivamus placerat, diam sit amet sodales commodo, massa dolor euismod tortor, ut condimentum orci lectus ac ex. Ut mollis ex ut est euismod rhoncus. Quisque ut lobortis risus, a sodales diam. Maecenas vitae bibendum est, eget tincidunt lacus. Donec laoreet felis sed orci maximus, id consequat augue faucibus. In libero erat, porttitor vitae nunc id, dapibus sollicitudin nisl. Ut a pharetra neque, at molestie eros. Aliquam malesuada est rutrum nunc commodo, in eleifend nisl vestibulum.</p><p>Vestibulum id lacus rutrum, tristique lectus a, vestibulum odio. Nam dictum dui at urna pretium sodales. Nullam tristique nisi eget faucibus consequat. Etiam pretium arcu sed dapibus tincidunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus dictum vitae sapien suscipit dictum. In hac habitasse platea dictumst. Suspendisse risus dui, mattis ac malesuada efficitur, scelerisque vitae diam. Nam eu neque vel ex pharetra consequat vitae in justo. Phasellus convallis enim non est vulputate scelerisque. Duis id sagittis leo. Cras molestie tincidunt nisi, ac scelerisque est egestas vitae. Fusce mollis tempus dui in aliquet. Duis ipsum sem, ultricies nec risus nec, aliquet hendrerit neque. Integer accumsan varius iaculis.</p><p>Aliquam pharetra fringilla lectus sed placerat. Donec iaculis libero non sem maximus, id scelerisque arcu laoreet. Sed tempus eros sit amet justo posuere mollis. Etiam commodo semper felis maximus porttitor. Fusce ut molestie massa. Phasellus sem enim, tristique quis lorem id, maximus accumsan sapien. Aenean feugiat luctus ligula, vel tristique nunc convallis eget.</p><p>Ut facilisis tortor turpis, ac feugiat nunc egestas eget. Ut tincidunt ex nisi, eu egestas purus interdum in. Pellentesque ornare commodo turpis vitae aliquam. Etiam ornare cursus elit, in feugiat mauris ornare vitae. Morbi mollis molestie lacus, non pulvinar quam. Quisque eleifend sed erat id congue. Vivamus vulputate tempus tortor, a gravida justo dictum id. Proin tristique, neque id viverra accumsan, leo erat mattis sem, at porttitor nisi enim non risus. Nunc pharetra velit ut condimentum porta. Fusce consectetur id lectus quis vulputate. Nunc congue rutrum diam, at sodales magna malesuada iaculis. Aenean nec facilisis nulla, vestibulum eleifend purus.<img src="https://i.froala.com/assets/photo2.jpg" data-id="2" data-type="image" data-name="Image 2017-08-07 at 16:08:48.jpg" style="width: 300px;" class="fr-fic fr-dii hoverZoomLink fr-fir"></p><p>Morbi eget dolor sed velit pharetra placerat. Duis justo dui, feugiat eu diam ut, rutrum pellentesque urna. Praesent mattis tellus nec congue auctor. Fusce condimentum in sem at rhoncus. Mauris nec erat lacinia ligula viverra congue eget sit amet tellus. Aenean aliquet fermentum velit. Vivamus ut odio vel dolor mattis interdum. Nunc ullamcorper ex quis arcu tincidunt, sed accumsan massa rutrum. In at urna laoreet enim auctor consectetur ac eu justo. Curabitur porta turpis eget purus interdum scelerisque. Nunc dignissim aliquam sagittis. Suspendisse feugiat velit semper, condimentum magna vel, mollis neque. Maecenas sed lectus vel mi fringilla vehicula sit amet sed risus. Morbi posuere tincidunt magna nec interdum.</p><p>Mauris non cursus nisi, id semper quam. Aliquam auctor, est nec fringilla egestas, nisi orci varius sem, molestie faucibus est nulla ut tellus. Pellentesque in massa facilisis, sollicitudin elit nec, interdum ipsum. Maecenas pellentesque, orci sit amet auctor volutpat, mi lectus hendrerit arcu, nec pharetra justo justo et justo. Etiam feugiat dolor nisi, bibendum egestas leo auctor ut. Suspendisse dapibus quis purus nec pretium. Proin gravida orci et porta vestibulum. Cras ut sem in ante dignissim elementum vehicula id augue. Donec purus augue, dapibus in justo ut, posuere mollis felis. Nunc iaculis urna dolor, sollicitudin aliquam eros mattis placerat. Ut eget turpis ut dui ullamcorper ultricies a eget ex. Integer vitae lorem vel metus dignissim volutpat. Mauris tincidunt faucibus tellus, quis mollis libero. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p>Duis viverra efficitur libero eget luctus. Aenean dapibus sodales diam, posuere dictum erat rhoncus et. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam ligula ex, tincidunt sed enim eget, accumsan luctus nulla. Mauris ac consequat nunc, et ultrices ipsum. Integer nec venenatis est. Vestibulum dapibus, velit nec efficitur posuere, urna enim pretium quam, sit amet malesuada orci nibh sed metus. Nulla nec eros felis. Sed imperdiet mauris id egestas suscipit. Nunc interdum laoreet maximus. Nunc congue sapien ultricies, pretium est nec, laoreet sem. Fusce ornare tortor massa, ac vestibulum enim gravida nec.</p>', 'Culture', true, false, null, false, null),
  (1, 'Riding the Silk Road', 'Bets way to see central asia', '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris libero felis, maximus ut tincidunt a, consectetur in dolor. Pellentesque laoreet volutpat elit eget placerat. Pellentesque pretium molestie erat, vitae mollis urna dapibus a. Quisque eu aliquet metus. Aenean eget magna pharetra, mattis orci euismod, lobortis augue. Maecenas bibendum eros lorem, vitae pretium justo volutpat sit amet. Aenean varius odio magna, et pulvinar nulla sagittis a. Aliquam eleifend ac quam in pharetra. Praesent eu sem posuere, ultricies quam ullamcorper, eleifend est. In malesuada commodo eros non fringilla. Nulla aliquam diam et nisi pellentesque aliquet. Proin eu est commodo, molestie neque eu, faucibus leo.</p><p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Quisque hendrerit risus nulla, at congue dolor bibendum ac. Maecenas condimentum, orci non fringilla venenatis, justo dolor pellentesque enim, sit amet laoreet lectus risus et enim. Quisque a fringilla ex. Nunc at felis mauris. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Cras suscipit purus porttitor porta vestibulum. Vestibulum sed ipsum sit amet arcu mattis congue vitae ac risus. Phasellus ac ultrices est. Maecenas ultrices eros ligula. Quisque placerat nisi tellus, vel auctor ligula pretium et. Nullam turpis odio, tincidunt non eleifend eu, cursus id lorem. Nam nibh sapien, eleifend quis massa eu, vulputate ullamcorper odio.</p><p><img src="https://localtvkdvr.files.wordpress.com/2017/05/may-snow-toby-the-bernese-mountain-dog-at-loveland.jpg?quality=85&strip=all&w=2000" style="width: 300px;" class="fr-fic fr-fil fr-dii">Aenean viverra turpis urna, et pellentesque orci posuere non. Pellentesque quis condimentum risus, non mattis nulla. Integer posuere egestas elit, vitae semper libero blandit at. Aenean vehicula tortor nec leo accumsan lobortis. Pellentesque vitae eros non felis fermentum vehicula eu in libero. Etiam sed tortor id odio consequat tincidunt. Maecenas eu nibh maximus odio pulvinar tempus. Mauris ipsum neque, congue in laoreet eu, gravida ac dui. Nunc aliquet elit nec urna sagittis fermentum. Sed vehicula in leo a luctus. Sed commodo magna justo, sit amet aliquet odio mattis quis. Praesent eget vehicula erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vel ipsum enim. Nulla facilisi.</p><p>Phasellus interdum felis sit amet finibus consectetur. Vivamus eget odio vel augue maximus finibus. Vestibulum fringilla lorem id lobortis convallis. Phasellus pharetra metus nec vulputate dapibus. Nunc id est mi. Vivamus placerat, diam sit amet sodales commodo, massa dolor euismod tortor, ut condimentum orci lectus ac ex. Ut mollis ex ut est euismod rhoncus. Quisque ut lobortis risus, a sodales diam. Maecenas vitae bibendum est, eget tincidunt lacus. Donec laoreet felis sed orci maximus, id consequat augue faucibus. In libero erat, porttitor vitae nunc id, dapibus sollicitudin nisl. Ut a pharetra neque, at molestie eros. Aliquam malesuada est rutrum nunc commodo, in eleifend nisl vestibulum.</p><p>Vestibulum id lacus rutrum, tristique lectus a, vestibulum odio. Nam dictum dui at urna pretium sodales. Nullam tristique nisi eget faucibus consequat. Etiam pretium arcu sed dapibus tincidunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus dictum vitae sapien suscipit dictum. In hac habitasse platea dictumst. Suspendisse risus dui, mattis ac malesuada efficitur, scelerisque vitae diam. Nam eu neque vel ex pharetra consequat vitae in justo. Phasellus convallis enim non est vulputate scelerisque. Duis id sagittis leo. Cras molestie tincidunt nisi, ac scelerisque est egestas vitae. Fusce mollis tempus dui in aliquet. Duis ipsum sem, ultricies nec risus nec, aliquet hendrerit neque. Integer accumsan varius iaculis.</p><p>Aliquam pharetra fringilla lectus sed placerat. Donec iaculis libero non sem maximus, id scelerisque arcu laoreet. Sed tempus eros sit amet justo posuere mollis. Etiam commodo semper felis maximus porttitor. Fusce ut molestie massa. Phasellus sem enim, tristique quis lorem id, maximus accumsan sapien. Aenean feugiat luctus ligula, vel tristique nunc convallis eget.</p><p>Ut facilisis tortor turpis, ac feugiat nunc egestas eget. Ut tincidunt ex nisi, eu egestas purus interdum in. Pellentesque ornare commodo turpis vitae aliquam. Etiam ornare cursus elit, in feugiat mauris ornare vitae. Morbi mollis molestie lacus, non pulvinar quam. Quisque eleifend sed erat id congue. Vivamus vulputate tempus tortor, a gravida justo dictum id. Proin tristique, neque id viverra accumsan, leo erat mattis sem, at porttitor nisi enim non risus. Nunc pharetra velit ut condimentum porta. Fusce consectetur id lectus quis vulputate. Nunc congue rutrum diam, at sodales magna malesuada iaculis. Aenean nec facilisis nulla, vestibulum eleifend purus.<img src="https://i.froala.com/assets/photo2.jpg" data-id="2" data-type="image" data-name="Image 2017-08-07 at 16:08:48.jpg" style="width: 300px;" class="fr-fic fr-dii hoverZoomLink fr-fir"></p><p>Morbi eget dolor sed velit pharetra placerat. Duis justo dui, feugiat eu diam ut, rutrum pellentesque urna. Praesent mattis tellus nec congue auctor. Fusce condimentum in sem at rhoncus. Mauris nec erat lacinia ligula viverra congue eget sit amet tellus. Aenean aliquet fermentum velit. Vivamus ut odio vel dolor mattis interdum. Nunc ullamcorper ex quis arcu tincidunt, sed accumsan massa rutrum. In at urna laoreet enim auctor consectetur ac eu justo. Curabitur porta turpis eget purus interdum scelerisque. Nunc dignissim aliquam sagittis. Suspendisse feugiat velit semper, condimentum magna vel, mollis neque. Maecenas sed lectus vel mi fringilla vehicula sit amet sed risus. Morbi posuere tincidunt magna nec interdum.</p><p>Mauris non cursus nisi, id semper quam. Aliquam auctor, est nec fringilla egestas, nisi orci varius sem, molestie faucibus est nulla ut tellus. Pellentesque in massa facilisis, sollicitudin elit nec, interdum ipsum. Maecenas pellentesque, orci sit amet auctor volutpat, mi lectus hendrerit arcu, nec pharetra justo justo et justo. Etiam feugiat dolor nisi, bibendum egestas leo auctor ut. Suspendisse dapibus quis purus nec pretium. Proin gravida orci et porta vestibulum. Cras ut sem in ante dignissim elementum vehicula id augue. Donec purus augue, dapibus in justo ut, posuere mollis felis. Nunc iaculis urna dolor, sollicitudin aliquam eros mattis placerat. Ut eget turpis ut dui ullamcorper ultricies a eget ex. Integer vitae lorem vel metus dignissim volutpat. Mauris tincidunt faucibus tellus, quis mollis libero. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p>Duis viverra efficitur libero eget luctus. Aenean dapibus sodales diam, posuere dictum erat rhoncus et. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam ligula ex, tincidunt sed enim eget, accumsan luctus nulla. Mauris ac consequat nunc, et ultrices ipsum. Integer nec venenatis est. Vestibulum dapibus, velit nec efficitur posuere, urna enim pretium quam, sit amet malesuada orci nibh sed metus. Nulla nec eros felis. Sed imperdiet mauris id egestas suscipit. Nunc interdum laoreet maximus. Nunc congue sapien ultricies, pretium est nec, laoreet sem. Fusce ornare tortor massa, ac vestibulum enim gravida nec.</p>', 'Gear', false, false, null, true, 1095726380000),
  (1, 'Why You Should Go', 'Because youre a wimp', '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris libero felis, maximus ut tincidunt a, consectetur in dolor. Pellentesque laoreet volutpat elit eget placerat. Pellentesque pretium molestie erat, vitae mollis urna dapibus a. Quisque eu aliquet metus. Aenean eget magna pharetra, mattis orci euismod, lobortis augue. Maecenas bibendum eros lorem, vitae pretium justo volutpat sit amet. Aenean varius odio magna, et pulvinar nulla sagittis a. Aliquam eleifend ac quam in pharetra. Praesent eu sem posuere, ultricies quam ullamcorper, eleifend est. In malesuada commodo eros non fringilla. Nulla aliquam diam et nisi pellentesque aliquet. Proin eu est commodo, molestie neque eu, faucibus leo.</p><p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Quisque hendrerit risus nulla, at congue dolor bibendum ac. Maecenas condimentum, orci non fringilla venenatis, justo dolor pellentesque enim, sit amet laoreet lectus risus et enim. Quisque a fringilla ex. Nunc at felis mauris. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Cras suscipit purus porttitor porta vestibulum. Vestibulum sed ipsum sit amet arcu mattis congue vitae ac risus. Phasellus ac ultrices est. Maecenas ultrices eros ligula. Quisque placerat nisi tellus, vel auctor ligula pretium et. Nullam turpis odio, tincidunt non eleifend eu, cursus id lorem. Nam nibh sapien, eleifend quis massa eu, vulputate ullamcorper odio.</p><p><img src="https://localtvkdvr.files.wordpress.com/2017/05/may-snow-toby-the-bernese-mountain-dog-at-loveland.jpg?quality=85&strip=all&w=2000" style="width: 300px;" class="fr-fic fr-fil fr-dii">Aenean viverra turpis urna, et pellentesque orci posuere non. Pellentesque quis condimentum risus, non mattis nulla. Integer posuere egestas elit, vitae semper libero blandit at. Aenean vehicula tortor nec leo accumsan lobortis. Pellentesque vitae eros non felis fermentum vehicula eu in libero. Etiam sed tortor id odio consequat tincidunt. Maecenas eu nibh maximus odio pulvinar tempus. Mauris ipsum neque, congue in laoreet eu, gravida ac dui. Nunc aliquet elit nec urna sagittis fermentum. Sed vehicula in leo a luctus. Sed commodo magna justo, sit amet aliquet odio mattis quis. Praesent eget vehicula erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vel ipsum enim. Nulla facilisi.</p><p>Phasellus interdum felis sit amet finibus consectetur. Vivamus eget odio vel augue maximus finibus. Vestibulum fringilla lorem id lobortis convallis. Phasellus pharetra metus nec vulputate dapibus. Nunc id est mi. Vivamus placerat, diam sit amet sodales commodo, massa dolor euismod tortor, ut condimentum orci lectus ac ex. Ut mollis ex ut est euismod rhoncus. Quisque ut lobortis risus, a sodales diam. Maecenas vitae bibendum est, eget tincidunt lacus. Donec laoreet felis sed orci maximus, id consequat augue faucibus. In libero erat, porttitor vitae nunc id, dapibus sollicitudin nisl. Ut a pharetra neque, at molestie eros. Aliquam malesuada est rutrum nunc commodo, in eleifend nisl vestibulum.</p><p>Vestibulum id lacus rutrum, tristique lectus a, vestibulum odio. Nam dictum dui at urna pretium sodales. Nullam tristique nisi eget faucibus consequat. Etiam pretium arcu sed dapibus tincidunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus dictum vitae sapien suscipit dictum. In hac habitasse platea dictumst. Suspendisse risus dui, mattis ac malesuada efficitur, scelerisque vitae diam. Nam eu neque vel ex pharetra consequat vitae in justo. Phasellus convallis enim non est vulputate scelerisque. Duis id sagittis leo. Cras molestie tincidunt nisi, ac scelerisque est egestas vitae. Fusce mollis tempus dui in aliquet. Duis ipsum sem, ultricies nec risus nec, aliquet hendrerit neque. Integer accumsan varius iaculis.</p><p>Aliquam pharetra fringilla lectus sed placerat. Donec iaculis libero non sem maximus, id scelerisque arcu laoreet. Sed tempus eros sit amet justo posuere mollis. Etiam commodo semper felis maximus porttitor. Fusce ut molestie massa. Phasellus sem enim, tristique quis lorem id, maximus accumsan sapien. Aenean feugiat luctus ligula, vel tristique nunc convallis eget.</p><p>Ut facilisis tortor turpis, ac feugiat nunc egestas eget. Ut tincidunt ex nisi, eu egestas purus interdum in. Pellentesque ornare commodo turpis vitae aliquam. Etiam ornare cursus elit, in feugiat mauris ornare vitae. Morbi mollis molestie lacus, non pulvinar quam. Quisque eleifend sed erat id congue. Vivamus vulputate tempus tortor, a gravida justo dictum id. Proin tristique, neque id viverra accumsan, leo erat mattis sem, at porttitor nisi enim non risus. Nunc pharetra velit ut condimentum porta. Fusce consectetur id lectus quis vulputate. Nunc congue rutrum diam, at sodales magna malesuada iaculis. Aenean nec facilisis nulla, vestibulum eleifend purus.<img src="https://i.froala.com/assets/photo2.jpg" data-id="2" data-type="image" data-name="Image 2017-08-07 at 16:08:48.jpg" style="width: 300px;" class="fr-fic fr-dii hoverZoomLink fr-fir"></p><p>Morbi eget dolor sed velit pharetra placerat. Duis justo dui, feugiat eu diam ut, rutrum pellentesque urna. Praesent mattis tellus nec congue auctor. Fusce condimentum in sem at rhoncus. Mauris nec erat lacinia ligula viverra congue eget sit amet tellus. Aenean aliquet fermentum velit. Vivamus ut odio vel dolor mattis interdum. Nunc ullamcorper ex quis arcu tincidunt, sed accumsan massa rutrum. In at urna laoreet enim auctor consectetur ac eu justo. Curabitur porta turpis eget purus interdum scelerisque. Nunc dignissim aliquam sagittis. Suspendisse feugiat velit semper, condimentum magna vel, mollis neque. Maecenas sed lectus vel mi fringilla vehicula sit amet sed risus. Morbi posuere tincidunt magna nec interdum.</p><p>Mauris non cursus nisi, id semper quam. Aliquam auctor, est nec fringilla egestas, nisi orci varius sem, molestie faucibus est nulla ut tellus. Pellentesque in massa facilisis, sollicitudin elit nec, interdum ipsum. Maecenas pellentesque, orci sit amet auctor volutpat, mi lectus hendrerit arcu, nec pharetra justo justo et justo. Etiam feugiat dolor nisi, bibendum egestas leo auctor ut. Suspendisse dapibus quis purus nec pretium. Proin gravida orci et porta vestibulum. Cras ut sem in ante dignissim elementum vehicula id augue. Donec purus augue, dapibus in justo ut, posuere mollis felis. Nunc iaculis urna dolor, sollicitudin aliquam eros mattis placerat. Ut eget turpis ut dui ullamcorper ultricies a eget ex. Integer vitae lorem vel metus dignissim volutpat. Mauris tincidunt faucibus tellus, quis mollis libero. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p>Duis viverra efficitur libero eget luctus. Aenean dapibus sodales diam, posuere dictum erat rhoncus et. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam ligula ex, tincidunt sed enim eget, accumsan luctus nulla. Mauris ac consequat nunc, et ultrices ipsum. Integer nec venenatis est. Vestibulum dapibus, velit nec efficitur posuere, urna enim pretium quam, sit amet malesuada orci nibh sed metus. Nulla nec eros felis. Sed imperdiet mauris id egestas suscipit. Nunc interdum laoreet maximus. Nunc congue sapien ultricies, pretium est nec, laoreet sem. Fusce ornare tortor massa, ac vestibulum enim gravida nec.</p>', 'Travel', false, true, 1895726380000, false, null),
  (1, 'Getting Over Some BS', 'Get under some broad', '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris libero felis, maximus ut tincidunt a, consectetur in dolor. Pellentesque laoreet volutpat elit eget placerat. Pellentesque pretium molestie erat, vitae mollis urna dapibus a. Quisque eu aliquet metus. Aenean eget magna pharetra, mattis orci euismod, lobortis augue. Maecenas bibendum eros lorem, vitae pretium justo volutpat sit amet. Aenean varius odio magna, et pulvinar nulla sagittis a. Aliquam eleifend ac quam in pharetra. Praesent eu sem posuere, ultricies quam ullamcorper, eleifend est. In malesuada commodo eros non fringilla. Nulla aliquam diam et nisi pellentesque aliquet. Proin eu est commodo, molestie neque eu, faucibus leo.</p><p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Quisque hendrerit risus nulla, at congue dolor bibendum ac. Maecenas condimentum, orci non fringilla venenatis, justo dolor pellentesque enim, sit amet laoreet lectus risus et enim. Quisque a fringilla ex. Nunc at felis mauris. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Cras suscipit purus porttitor porta vestibulum. Vestibulum sed ipsum sit amet arcu mattis congue vitae ac risus. Phasellus ac ultrices est. Maecenas ultrices eros ligula. Quisque placerat nisi tellus, vel auctor ligula pretium et. Nullam turpis odio, tincidunt non eleifend eu, cursus id lorem. Nam nibh sapien, eleifend quis massa eu, vulputate ullamcorper odio.</p><p><img src="https://localtvkdvr.files.wordpress.com/2017/05/may-snow-toby-the-bernese-mountain-dog-at-loveland.jpg?quality=85&strip=all&w=2000" style="width: 300px;" class="fr-fic fr-fil fr-dii">Aenean viverra turpis urna, et pellentesque orci posuere non. Pellentesque quis condimentum risus, non mattis nulla. Integer posuere egestas elit, vitae semper libero blandit at. Aenean vehicula tortor nec leo accumsan lobortis. Pellentesque vitae eros non felis fermentum vehicula eu in libero. Etiam sed tortor id odio consequat tincidunt. Maecenas eu nibh maximus odio pulvinar tempus. Mauris ipsum neque, congue in laoreet eu, gravida ac dui. Nunc aliquet elit nec urna sagittis fermentum. Sed vehicula in leo a luctus. Sed commodo magna justo, sit amet aliquet odio mattis quis. Praesent eget vehicula erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vel ipsum enim. Nulla facilisi.</p><p>Phasellus interdum felis sit amet finibus consectetur. Vivamus eget odio vel augue maximus finibus. Vestibulum fringilla lorem id lobortis convallis. Phasellus pharetra metus nec vulputate dapibus. Nunc id est mi. Vivamus placerat, diam sit amet sodales commodo, massa dolor euismod tortor, ut condimentum orci lectus ac ex. Ut mollis ex ut est euismod rhoncus. Quisque ut lobortis risus, a sodales diam. Maecenas vitae bibendum est, eget tincidunt lacus. Donec laoreet felis sed orci maximus, id consequat augue faucibus. In libero erat, porttitor vitae nunc id, dapibus sollicitudin nisl. Ut a pharetra neque, at molestie eros. Aliquam malesuada est rutrum nunc commodo, in eleifend nisl vestibulum.</p><p>Vestibulum id lacus rutrum, tristique lectus a, vestibulum odio. Nam dictum dui at urna pretium sodales. Nullam tristique nisi eget faucibus consequat. Etiam pretium arcu sed dapibus tincidunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus dictum vitae sapien suscipit dictum. In hac habitasse platea dictumst. Suspendisse risus dui, mattis ac malesuada efficitur, scelerisque vitae diam. Nam eu neque vel ex pharetra consequat vitae in justo. Phasellus convallis enim non est vulputate scelerisque. Duis id sagittis leo. Cras molestie tincidunt nisi, ac scelerisque est egestas vitae. Fusce mollis tempus dui in aliquet. Duis ipsum sem, ultricies nec risus nec, aliquet hendrerit neque. Integer accumsan varius iaculis.</p><p>Aliquam pharetra fringilla lectus sed placerat. Donec iaculis libero non sem maximus, id scelerisque arcu laoreet. Sed tempus eros sit amet justo posuere mollis. Etiam commodo semper felis maximus porttitor. Fusce ut molestie massa. Phasellus sem enim, tristique quis lorem id, maximus accumsan sapien. Aenean feugiat luctus ligula, vel tristique nunc convallis eget.</p><p>Ut facilisis tortor turpis, ac feugiat nunc egestas eget. Ut tincidunt ex nisi, eu egestas purus interdum in. Pellentesque ornare commodo turpis vitae aliquam. Etiam ornare cursus elit, in feugiat mauris ornare vitae. Morbi mollis molestie lacus, non pulvinar quam. Quisque eleifend sed erat id congue. Vivamus vulputate tempus tortor, a gravida justo dictum id. Proin tristique, neque id viverra accumsan, leo erat mattis sem, at porttitor nisi enim non risus. Nunc pharetra velit ut condimentum porta. Fusce consectetur id lectus quis vulputate. Nunc congue rutrum diam, at sodales magna malesuada iaculis. Aenean nec facilisis nulla, vestibulum eleifend purus.<img src="https://i.froala.com/assets/photo2.jpg" data-id="2" data-type="image" data-name="Image 2017-08-07 at 16:08:48.jpg" style="width: 300px;" class="fr-fic fr-dii hoverZoomLink fr-fir"></p><p>Morbi eget dolor sed velit pharetra placerat. Duis justo dui, feugiat eu diam ut, rutrum pellentesque urna. Praesent mattis tellus nec congue auctor. Fusce condimentum in sem at rhoncus. Mauris nec erat lacinia ligula viverra congue eget sit amet tellus. Aenean aliquet fermentum velit. Vivamus ut odio vel dolor mattis interdum. Nunc ullamcorper ex quis arcu tincidunt, sed accumsan massa rutrum. In at urna laoreet enim auctor consectetur ac eu justo. Curabitur porta turpis eget purus interdum scelerisque. Nunc dignissim aliquam sagittis. Suspendisse feugiat velit semper, condimentum magna vel, mollis neque. Maecenas sed lectus vel mi fringilla vehicula sit amet sed risus. Morbi posuere tincidunt magna nec interdum.</p><p>Mauris non cursus nisi, id semper quam. Aliquam auctor, est nec fringilla egestas, nisi orci varius sem, molestie faucibus est nulla ut tellus. Pellentesque in massa facilisis, sollicitudin elit nec, interdum ipsum. Maecenas pellentesque, orci sit amet auctor volutpat, mi lectus hendrerit arcu, nec pharetra justo justo et justo. Etiam feugiat dolor nisi, bibendum egestas leo auctor ut. Suspendisse dapibus quis purus nec pretium. Proin gravida orci et porta vestibulum. Cras ut sem in ante dignissim elementum vehicula id augue. Donec purus augue, dapibus in justo ut, posuere mollis felis. Nunc iaculis urna dolor, sollicitudin aliquam eros mattis placerat. Ut eget turpis ut dui ullamcorper ultricies a eget ex. Integer vitae lorem vel metus dignissim volutpat. Mauris tincidunt faucibus tellus, quis mollis libero. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p>Duis viverra efficitur libero eget luctus. Aenean dapibus sodales diam, posuere dictum erat rhoncus et. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam ligula ex, tincidunt sed enim eget, accumsan luctus nulla. Mauris ac consequat nunc, et ultrices ipsum. Integer nec venenatis est. Vestibulum dapibus, velit nec efficitur posuere, urna enim pretium quam, sit amet malesuada orci nibh sed metus. Nulla nec eros felis. Sed imperdiet mauris id egestas suscipit. Nunc interdum laoreet maximus. Nunc congue sapien ultricies, pretium est nec, laoreet sem. Fusce ornare tortor massa, ac vestibulum enim gravida nec.</p>', 'Travel', false, false, null, true, 1195726380000),
  (1, 'Food Finds From Your Moms House', 'Tastes good man', '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris libero felis, maximus ut tincidunt a, consectetur in dolor. Pellentesque laoreet volutpat elit eget placerat. Pellentesque pretium molestie erat, vitae mollis urna dapibus a. Quisque eu aliquet metus. Aenean eget magna pharetra, mattis orci euismod, lobortis augue. Maecenas bibendum eros lorem, vitae pretium justo volutpat sit amet. Aenean varius odio magna, et pulvinar nulla sagittis a. Aliquam eleifend ac quam in pharetra. Praesent eu sem posuere, ultricies quam ullamcorper, eleifend est. In malesuada commodo eros non fringilla. Nulla aliquam diam et nisi pellentesque aliquet. Proin eu est commodo, molestie neque eu, faucibus leo.</p><p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Quisque hendrerit risus nulla, at congue dolor bibendum ac. Maecenas condimentum, orci non fringilla venenatis, justo dolor pellentesque enim, sit amet laoreet lectus risus et enim. Quisque a fringilla ex. Nunc at felis mauris. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Cras suscipit purus porttitor porta vestibulum. Vestibulum sed ipsum sit amet arcu mattis congue vitae ac risus. Phasellus ac ultrices est. Maecenas ultrices eros ligula. Quisque placerat nisi tellus, vel auctor ligula pretium et. Nullam turpis odio, tincidunt non eleifend eu, cursus id lorem. Nam nibh sapien, eleifend quis massa eu, vulputate ullamcorper odio.</p><p><img src="https://localtvkdvr.files.wordpress.com/2017/05/may-snow-toby-the-bernese-mountain-dog-at-loveland.jpg?quality=85&strip=all&w=2000" style="width: 300px;" class="fr-fic fr-fil fr-dii">Aenean viverra turpis urna, et pellentesque orci posuere non. Pellentesque quis condimentum risus, non mattis nulla. Integer posuere egestas elit, vitae semper libero blandit at. Aenean vehicula tortor nec leo accumsan lobortis. Pellentesque vitae eros non felis fermentum vehicula eu in libero. Etiam sed tortor id odio consequat tincidunt. Maecenas eu nibh maximus odio pulvinar tempus. Mauris ipsum neque, congue in laoreet eu, gravida ac dui. Nunc aliquet elit nec urna sagittis fermentum. Sed vehicula in leo a luctus. Sed commodo magna justo, sit amet aliquet odio mattis quis. Praesent eget vehicula erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vel ipsum enim. Nulla facilisi.</p><p>Phasellus interdum felis sit amet finibus consectetur. Vivamus eget odio vel augue maximus finibus. Vestibulum fringilla lorem id lobortis convallis. Phasellus pharetra metus nec vulputate dapibus. Nunc id est mi. Vivamus placerat, diam sit amet sodales commodo, massa dolor euismod tortor, ut condimentum orci lectus ac ex. Ut mollis ex ut est euismod rhoncus. Quisque ut lobortis risus, a sodales diam. Maecenas vitae bibendum est, eget tincidunt lacus. Donec laoreet felis sed orci maximus, id consequat augue faucibus. In libero erat, porttitor vitae nunc id, dapibus sollicitudin nisl. Ut a pharetra neque, at molestie eros. Aliquam malesuada est rutrum nunc commodo, in eleifend nisl vestibulum.</p><p>Vestibulum id lacus rutrum, tristique lectus a, vestibulum odio. Nam dictum dui at urna pretium sodales. Nullam tristique nisi eget faucibus consequat. Etiam pretium arcu sed dapibus tincidunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus dictum vitae sapien suscipit dictum. In hac habitasse platea dictumst. Suspendisse risus dui, mattis ac malesuada efficitur, scelerisque vitae diam. Nam eu neque vel ex pharetra consequat vitae in justo. Phasellus convallis enim non est vulputate scelerisque. Duis id sagittis leo. Cras molestie tincidunt nisi, ac scelerisque est egestas vitae. Fusce mollis tempus dui in aliquet. Duis ipsum sem, ultricies nec risus nec, aliquet hendrerit neque. Integer accumsan varius iaculis.</p><p>Aliquam pharetra fringilla lectus sed placerat. Donec iaculis libero non sem maximus, id scelerisque arcu laoreet. Sed tempus eros sit amet justo posuere mollis. Etiam commodo semper felis maximus porttitor. Fusce ut molestie massa. Phasellus sem enim, tristique quis lorem id, maximus accumsan sapien. Aenean feugiat luctus ligula, vel tristique nunc convallis eget.</p><p>Ut facilisis tortor turpis, ac feugiat nunc egestas eget. Ut tincidunt ex nisi, eu egestas purus interdum in. Pellentesque ornare commodo turpis vitae aliquam. Etiam ornare cursus elit, in feugiat mauris ornare vitae. Morbi mollis molestie lacus, non pulvinar quam. Quisque eleifend sed erat id congue. Vivamus vulputate tempus tortor, a gravida justo dictum id. Proin tristique, neque id viverra accumsan, leo erat mattis sem, at porttitor nisi enim non risus. Nunc pharetra velit ut condimentum porta. Fusce consectetur id lectus quis vulputate. Nunc congue rutrum diam, at sodales magna malesuada iaculis. Aenean nec facilisis nulla, vestibulum eleifend purus.<img src="https://i.froala.com/assets/photo2.jpg" data-id="2" data-type="image" data-name="Image 2017-08-07 at 16:08:48.jpg" style="width: 300px;" class="fr-fic fr-dii hoverZoomLink fr-fir"></p><p>Morbi eget dolor sed velit pharetra placerat. Duis justo dui, feugiat eu diam ut, rutrum pellentesque urna. Praesent mattis tellus nec congue auctor. Fusce condimentum in sem at rhoncus. Mauris nec erat lacinia ligula viverra congue eget sit amet tellus. Aenean aliquet fermentum velit. Vivamus ut odio vel dolor mattis interdum. Nunc ullamcorper ex quis arcu tincidunt, sed accumsan massa rutrum. In at urna laoreet enim auctor consectetur ac eu justo. Curabitur porta turpis eget purus interdum scelerisque. Nunc dignissim aliquam sagittis. Suspendisse feugiat velit semper, condimentum magna vel, mollis neque. Maecenas sed lectus vel mi fringilla vehicula sit amet sed risus. Morbi posuere tincidunt magna nec interdum.</p><p>Mauris non cursus nisi, id semper quam. Aliquam auctor, est nec fringilla egestas, nisi orci varius sem, molestie faucibus est nulla ut tellus. Pellentesque in massa facilisis, sollicitudin elit nec, interdum ipsum. Maecenas pellentesque, orci sit amet auctor volutpat, mi lectus hendrerit arcu, nec pharetra justo justo et justo. Etiam feugiat dolor nisi, bibendum egestas leo auctor ut. Suspendisse dapibus quis purus nec pretium. Proin gravida orci et porta vestibulum. Cras ut sem in ante dignissim elementum vehicula id augue. Donec purus augue, dapibus in justo ut, posuere mollis felis. Nunc iaculis urna dolor, sollicitudin aliquam eros mattis placerat. Ut eget turpis ut dui ullamcorper ultricies a eget ex. Integer vitae lorem vel metus dignissim volutpat. Mauris tincidunt faucibus tellus, quis mollis libero. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p>Duis viverra efficitur libero eget luctus. Aenean dapibus sodales diam, posuere dictum erat rhoncus et. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam ligula ex, tincidunt sed enim eget, accumsan luctus nulla. Mauris ac consequat nunc, et ultrices ipsum. Integer nec venenatis est. Vestibulum dapibus, velit nec efficitur posuere, urna enim pretium quam, sit amet malesuada orci nibh sed metus. Nulla nec eros felis. Sed imperdiet mauris id egestas suscipit. Nunc interdum laoreet maximus. Nunc congue sapien ultricies, pretium est nec, laoreet sem. Fusce ornare tortor massa, ac vestibulum enim gravida nec.</p>', 'Gear', true, false, null, false, null),
  (1, 'Finding Peace', 'Dont even have to India', '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris libero felis, maximus ut tincidunt a, consectetur in dolor. Pellentesque laoreet volutpat elit eget placerat. Pellentesque pretium molestie erat, vitae mollis urna dapibus a. Quisque eu aliquet metus. Aenean eget magna pharetra, mattis orci euismod, lobortis augue. Maecenas bibendum eros lorem, vitae pretium justo volutpat sit amet. Aenean varius odio magna, et pulvinar nulla sagittis a. Aliquam eleifend ac quam in pharetra. Praesent eu sem posuere, ultricies quam ullamcorper, eleifend est. In malesuada commodo eros non fringilla. Nulla aliquam diam et nisi pellentesque aliquet. Proin eu est commodo, molestie neque eu, faucibus leo.</p><p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Quisque hendrerit risus nulla, at congue dolor bibendum ac. Maecenas condimentum, orci non fringilla venenatis, justo dolor pellentesque enim, sit amet laoreet lectus risus et enim. Quisque a fringilla ex. Nunc at felis mauris. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Cras suscipit purus porttitor porta vestibulum. Vestibulum sed ipsum sit amet arcu mattis congue vitae ac risus. Phasellus ac ultrices est. Maecenas ultrices eros ligula. Quisque placerat nisi tellus, vel auctor ligula pretium et. Nullam turpis odio, tincidunt non eleifend eu, cursus id lorem. Nam nibh sapien, eleifend quis massa eu, vulputate ullamcorper odio.</p><p><img src="https://localtvkdvr.files.wordpress.com/2017/05/may-snow-toby-the-bernese-mountain-dog-at-loveland.jpg?quality=85&strip=all&w=2000" style="width: 300px;" class="fr-fic fr-fil fr-dii">Aenean viverra turpis urna, et pellentesque orci posuere non. Pellentesque quis condimentum risus, non mattis nulla. Integer posuere egestas elit, vitae semper libero blandit at. Aenean vehicula tortor nec leo accumsan lobortis. Pellentesque vitae eros non felis fermentum vehicula eu in libero. Etiam sed tortor id odio consequat tincidunt. Maecenas eu nibh maximus odio pulvinar tempus. Mauris ipsum neque, congue in laoreet eu, gravida ac dui. Nunc aliquet elit nec urna sagittis fermentum. Sed vehicula in leo a luctus. Sed commodo magna justo, sit amet aliquet odio mattis quis. Praesent eget vehicula erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vel ipsum enim. Nulla facilisi.</p><p>Phasellus interdum felis sit amet finibus consectetur. Vivamus eget odio vel augue maximus finibus. Vestibulum fringilla lorem id lobortis convallis. Phasellus pharetra metus nec vulputate dapibus. Nunc id est mi. Vivamus placerat, diam sit amet sodales commodo, massa dolor euismod tortor, ut condimentum orci lectus ac ex. Ut mollis ex ut est euismod rhoncus. Quisque ut lobortis risus, a sodales diam. Maecenas vitae bibendum est, eget tincidunt lacus. Donec laoreet felis sed orci maximus, id consequat augue faucibus. In libero erat, porttitor vitae nunc id, dapibus sollicitudin nisl. Ut a pharetra neque, at molestie eros. Aliquam malesuada est rutrum nunc commodo, in eleifend nisl vestibulum.</p><p>Vestibulum id lacus rutrum, tristique lectus a, vestibulum odio. Nam dictum dui at urna pretium sodales. Nullam tristique nisi eget faucibus consequat. Etiam pretium arcu sed dapibus tincidunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus dictum vitae sapien suscipit dictum. In hac habitasse platea dictumst. Suspendisse risus dui, mattis ac malesuada efficitur, scelerisque vitae diam. Nam eu neque vel ex pharetra consequat vitae in justo. Phasellus convallis enim non est vulputate scelerisque. Duis id sagittis leo. Cras molestie tincidunt nisi, ac scelerisque est egestas vitae. Fusce mollis tempus dui in aliquet. Duis ipsum sem, ultricies nec risus nec, aliquet hendrerit neque. Integer accumsan varius iaculis.</p><p>Aliquam pharetra fringilla lectus sed placerat. Donec iaculis libero non sem maximus, id scelerisque arcu laoreet. Sed tempus eros sit amet justo posuere mollis. Etiam commodo semper felis maximus porttitor. Fusce ut molestie massa. Phasellus sem enim, tristique quis lorem id, maximus accumsan sapien. Aenean feugiat luctus ligula, vel tristique nunc convallis eget.</p><p>Ut facilisis tortor turpis, ac feugiat nunc egestas eget. Ut tincidunt ex nisi, eu egestas purus interdum in. Pellentesque ornare commodo turpis vitae aliquam. Etiam ornare cursus elit, in feugiat mauris ornare vitae. Morbi mollis molestie lacus, non pulvinar quam. Quisque eleifend sed erat id congue. Vivamus vulputate tempus tortor, a gravida justo dictum id. Proin tristique, neque id viverra accumsan, leo erat mattis sem, at porttitor nisi enim non risus. Nunc pharetra velit ut condimentum porta. Fusce consectetur id lectus quis vulputate. Nunc congue rutrum diam, at sodales magna malesuada iaculis. Aenean nec facilisis nulla, vestibulum eleifend purus.<img src="https://i.froala.com/assets/photo2.jpg" data-id="2" data-type="image" data-name="Image 2017-08-07 at 16:08:48.jpg" style="width: 300px;" class="fr-fic fr-dii hoverZoomLink fr-fir"></p><p>Morbi eget dolor sed velit pharetra placerat. Duis justo dui, feugiat eu diam ut, rutrum pellentesque urna. Praesent mattis tellus nec congue auctor. Fusce condimentum in sem at rhoncus. Mauris nec erat lacinia ligula viverra congue eget sit amet tellus. Aenean aliquet fermentum velit. Vivamus ut odio vel dolor mattis interdum. Nunc ullamcorper ex quis arcu tincidunt, sed accumsan massa rutrum. In at urna laoreet enim auctor consectetur ac eu justo. Curabitur porta turpis eget purus interdum scelerisque. Nunc dignissim aliquam sagittis. Suspendisse feugiat velit semper, condimentum magna vel, mollis neque. Maecenas sed lectus vel mi fringilla vehicula sit amet sed risus. Morbi posuere tincidunt magna nec interdum.</p><p>Mauris non cursus nisi, id semper quam. Aliquam auctor, est nec fringilla egestas, nisi orci varius sem, molestie faucibus est nulla ut tellus. Pellentesque in massa facilisis, sollicitudin elit nec, interdum ipsum. Maecenas pellentesque, orci sit amet auctor volutpat, mi lectus hendrerit arcu, nec pharetra justo justo et justo. Etiam feugiat dolor nisi, bibendum egestas leo auctor ut. Suspendisse dapibus quis purus nec pretium. Proin gravida orci et porta vestibulum. Cras ut sem in ante dignissim elementum vehicula id augue. Donec purus augue, dapibus in justo ut, posuere mollis felis. Nunc iaculis urna dolor, sollicitudin aliquam eros mattis placerat. Ut eget turpis ut dui ullamcorper ultricies a eget ex. Integer vitae lorem vel metus dignissim volutpat. Mauris tincidunt faucibus tellus, quis mollis libero. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p>Duis viverra efficitur libero eget luctus. Aenean dapibus sodales diam, posuere dictum erat rhoncus et. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam ligula ex, tincidunt sed enim eget, accumsan luctus nulla. Mauris ac consequat nunc, et ultrices ipsum. Integer nec venenatis est. Vestibulum dapibus, velit nec efficitur posuere, urna enim pretium quam, sit amet malesuada orci nibh sed metus. Nulla nec eros felis. Sed imperdiet mauris id egestas suscipit. Nunc interdum laoreet maximus. Nunc congue sapien ultricies, pretium est nec, laoreet sem. Fusce ornare tortor massa, ac vestibulum enim gravida nec.</p>', 'Trekking', false, false, null, true, 1395726380000),
  (1, 'Scaling the Sky', 'Beat boredom with these journeys', '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris libero felis, maximus ut tincidunt a, consectetur in dolor. Pellentesque laoreet volutpat elit eget placerat. Pellentesque pretium molestie erat, vitae mollis urna dapibus a. Quisque eu aliquet metus. Aenean eget magna pharetra, mattis orci euismod, lobortis augue. Maecenas bibendum eros lorem, vitae pretium justo volutpat sit amet. Aenean varius odio magna, et pulvinar nulla sagittis a. Aliquam eleifend ac quam in pharetra. Praesent eu sem posuere, ultricies quam ullamcorper, eleifend est. In malesuada commodo eros non fringilla. Nulla aliquam diam et nisi pellentesque aliquet. Proin eu est commodo, molestie neque eu, faucibus leo.</p><p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Quisque hendrerit risus nulla, at congue dolor bibendum ac. Maecenas condimentum, orci non fringilla venenatis, justo dolor pellentesque enim, sit amet laoreet lectus risus et enim. Quisque a fringilla ex. Nunc at felis mauris. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Cras suscipit purus porttitor porta vestibulum. Vestibulum sed ipsum sit amet arcu mattis congue vitae ac risus. Phasellus ac ultrices est. Maecenas ultrices eros ligula. Quisque placerat nisi tellus, vel auctor ligula pretium et. Nullam turpis odio, tincidunt non eleifend eu, cursus id lorem. Nam nibh sapien, eleifend quis massa eu, vulputate ullamcorper odio.</p><p><img src="https://localtvkdvr.files.wordpress.com/2017/05/may-snow-toby-the-bernese-mountain-dog-at-loveland.jpg?quality=85&strip=all&w=2000" style="width: 300px;" class="fr-fic fr-fil fr-dii">Aenean viverra turpis urna, et pellentesque orci posuere non. Pellentesque quis condimentum risus, non mattis nulla. Integer posuere egestas elit, vitae semper libero blandit at. Aenean vehicula tortor nec leo accumsan lobortis. Pellentesque vitae eros non felis fermentum vehicula eu in libero. Etiam sed tortor id odio consequat tincidunt. Maecenas eu nibh maximus odio pulvinar tempus. Mauris ipsum neque, congue in laoreet eu, gravida ac dui. Nunc aliquet elit nec urna sagittis fermentum. Sed vehicula in leo a luctus. Sed commodo magna justo, sit amet aliquet odio mattis quis. Praesent eget vehicula erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vel ipsum enim. Nulla facilisi.</p><p>Phasellus interdum felis sit amet finibus consectetur. Vivamus eget odio vel augue maximus finibus. Vestibulum fringilla lorem id lobortis convallis. Phasellus pharetra metus nec vulputate dapibus. Nunc id est mi. Vivamus placerat, diam sit amet sodales commodo, massa dolor euismod tortor, ut condimentum orci lectus ac ex. Ut mollis ex ut est euismod rhoncus. Quisque ut lobortis risus, a sodales diam. Maecenas vitae bibendum est, eget tincidunt lacus. Donec laoreet felis sed orci maximus, id consequat augue faucibus. In libero erat, porttitor vitae nunc id, dapibus sollicitudin nisl. Ut a pharetra neque, at molestie eros. Aliquam malesuada est rutrum nunc commodo, in eleifend nisl vestibulum.</p><p>Vestibulum id lacus rutrum, tristique lectus a, vestibulum odio. Nam dictum dui at urna pretium sodales. Nullam tristique nisi eget faucibus consequat. Etiam pretium arcu sed dapibus tincidunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus dictum vitae sapien suscipit dictum. In hac habitasse platea dictumst. Suspendisse risus dui, mattis ac malesuada efficitur, scelerisque vitae diam. Nam eu neque vel ex pharetra consequat vitae in justo. Phasellus convallis enim non est vulputate scelerisque. Duis id sagittis leo. Cras molestie tincidunt nisi, ac scelerisque est egestas vitae. Fusce mollis tempus dui in aliquet. Duis ipsum sem, ultricies nec risus nec, aliquet hendrerit neque. Integer accumsan varius iaculis.</p><p>Aliquam pharetra fringilla lectus sed placerat. Donec iaculis libero non sem maximus, id scelerisque arcu laoreet. Sed tempus eros sit amet justo posuere mollis. Etiam commodo semper felis maximus porttitor. Fusce ut molestie massa. Phasellus sem enim, tristique quis lorem id, maximus accumsan sapien. Aenean feugiat luctus ligula, vel tristique nunc convallis eget.</p><p>Ut facilisis tortor turpis, ac feugiat nunc egestas eget. Ut tincidunt ex nisi, eu egestas purus interdum in. Pellentesque ornare commodo turpis vitae aliquam. Etiam ornare cursus elit, in feugiat mauris ornare vitae. Morbi mollis molestie lacus, non pulvinar quam. Quisque eleifend sed erat id congue. Vivamus vulputate tempus tortor, a gravida justo dictum id. Proin tristique, neque id viverra accumsan, leo erat mattis sem, at porttitor nisi enim non risus. Nunc pharetra velit ut condimentum porta. Fusce consectetur id lectus quis vulputate. Nunc congue rutrum diam, at sodales magna malesuada iaculis. Aenean nec facilisis nulla, vestibulum eleifend purus.<img src="https://i.froala.com/assets/photo2.jpg" data-id="2" data-type="image" data-name="Image 2017-08-07 at 16:08:48.jpg" style="width: 300px;" class="fr-fic fr-dii hoverZoomLink fr-fir"></p><p>Morbi eget dolor sed velit pharetra placerat. Duis justo dui, feugiat eu diam ut, rutrum pellentesque urna. Praesent mattis tellus nec congue auctor. Fusce condimentum in sem at rhoncus. Mauris nec erat lacinia ligula viverra congue eget sit amet tellus. Aenean aliquet fermentum velit. Vivamus ut odio vel dolor mattis interdum. Nunc ullamcorper ex quis arcu tincidunt, sed accumsan massa rutrum. In at urna laoreet enim auctor consectetur ac eu justo. Curabitur porta turpis eget purus interdum scelerisque. Nunc dignissim aliquam sagittis. Suspendisse feugiat velit semper, condimentum magna vel, mollis neque. Maecenas sed lectus vel mi fringilla vehicula sit amet sed risus. Morbi posuere tincidunt magna nec interdum.</p><p>Mauris non cursus nisi, id semper quam. Aliquam auctor, est nec fringilla egestas, nisi orci varius sem, molestie faucibus est nulla ut tellus. Pellentesque in massa facilisis, sollicitudin elit nec, interdum ipsum. Maecenas pellentesque, orci sit amet auctor volutpat, mi lectus hendrerit arcu, nec pharetra justo justo et justo. Etiam feugiat dolor nisi, bibendum egestas leo auctor ut. Suspendisse dapibus quis purus nec pretium. Proin gravida orci et porta vestibulum. Cras ut sem in ante dignissim elementum vehicula id augue. Donec purus augue, dapibus in justo ut, posuere mollis felis. Nunc iaculis urna dolor, sollicitudin aliquam eros mattis placerat. Ut eget turpis ut dui ullamcorper ultricies a eget ex. Integer vitae lorem vel metus dignissim volutpat. Mauris tincidunt faucibus tellus, quis mollis libero. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p>Duis viverra efficitur libero eget luctus. Aenean dapibus sodales diam, posuere dictum erat rhoncus et. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam ligula ex, tincidunt sed enim eget, accumsan luctus nulla. Mauris ac consequat nunc, et ultrices ipsum. Integer nec venenatis est. Vestibulum dapibus, velit nec efficitur posuere, urna enim pretium quam, sit amet malesuada orci nibh sed metus. Nulla nec eros felis. Sed imperdiet mauris id egestas suscipit. Nunc interdum laoreet maximus. Nunc congue sapien ultricies, pretium est nec, laoreet sem. Fusce ornare tortor massa, ac vestibulum enim gravida nec.</p>', 'Biking', false, true, 1995726380000, false, null),
  (1, 'Cars, Trains, and Gangs', 'Staying safe on the road is harder than you thought', '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris libero felis, maximus ut tincidunt a, consectetur in dolor. Pellentesque laoreet volutpat elit eget placerat. Pellentesque pretium molestie erat, vitae mollis urna dapibus a. Quisque eu aliquet metus. Aenean eget magna pharetra, mattis orci euismod, lobortis augue. Maecenas bibendum eros lorem, vitae pretium justo volutpat sit amet. Aenean varius odio magna, et pulvinar nulla sagittis a. Aliquam eleifend ac quam in pharetra. Praesent eu sem posuere, ultricies quam ullamcorper, eleifend est. In malesuada commodo eros non fringilla. Nulla aliquam diam et nisi pellentesque aliquet. Proin eu est commodo, molestie neque eu, faucibus leo.</p><p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Quisque hendrerit risus nulla, at congue dolor bibendum ac. Maecenas condimentum, orci non fringilla venenatis, justo dolor pellentesque enim, sit amet laoreet lectus risus et enim. Quisque a fringilla ex. Nunc at felis mauris. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Cras suscipit purus porttitor porta vestibulum. Vestibulum sed ipsum sit amet arcu mattis congue vitae ac risus. Phasellus ac ultrices est. Maecenas ultrices eros ligula. Quisque placerat nisi tellus, vel auctor ligula pretium et. Nullam turpis odio, tincidunt non eleifend eu, cursus id lorem. Nam nibh sapien, eleifend quis massa eu, vulputate ullamcorper odio.</p><p><img src="https://localtvkdvr.files.wordpress.com/2017/05/may-snow-toby-the-bernese-mountain-dog-at-loveland.jpg?quality=85&strip=all&w=2000" style="width: 300px;" class="fr-fic fr-fil fr-dii">Aenean viverra turpis urna, et pellentesque orci posuere non. Pellentesque quis condimentum risus, non mattis nulla. Integer posuere egestas elit, vitae semper libero blandit at. Aenean vehicula tortor nec leo accumsan lobortis. Pellentesque vitae eros non felis fermentum vehicula eu in libero. Etiam sed tortor id odio consequat tincidunt. Maecenas eu nibh maximus odio pulvinar tempus. Mauris ipsum neque, congue in laoreet eu, gravida ac dui. Nunc aliquet elit nec urna sagittis fermentum. Sed vehicula in leo a luctus. Sed commodo magna justo, sit amet aliquet odio mattis quis. Praesent eget vehicula erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vel ipsum enim. Nulla facilisi.</p><p>Phasellus interdum felis sit amet finibus consectetur. Vivamus eget odio vel augue maximus finibus. Vestibulum fringilla lorem id lobortis convallis. Phasellus pharetra metus nec vulputate dapibus. Nunc id est mi. Vivamus placerat, diam sit amet sodales commodo, massa dolor euismod tortor, ut condimentum orci lectus ac ex. Ut mollis ex ut est euismod rhoncus. Quisque ut lobortis risus, a sodales diam. Maecenas vitae bibendum est, eget tincidunt lacus. Donec laoreet felis sed orci maximus, id consequat augue faucibus. In libero erat, porttitor vitae nunc id, dapibus sollicitudin nisl. Ut a pharetra neque, at molestie eros. Aliquam malesuada est rutrum nunc commodo, in eleifend nisl vestibulum.</p><p>Vestibulum id lacus rutrum, tristique lectus a, vestibulum odio. Nam dictum dui at urna pretium sodales. Nullam tristique nisi eget faucibus consequat. Etiam pretium arcu sed dapibus tincidunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus dictum vitae sapien suscipit dictum. In hac habitasse platea dictumst. Suspendisse risus dui, mattis ac malesuada efficitur, scelerisque vitae diam. Nam eu neque vel ex pharetra consequat vitae in justo. Phasellus convallis enim non est vulputate scelerisque. Duis id sagittis leo. Cras molestie tincidunt nisi, ac scelerisque est egestas vitae. Fusce mollis tempus dui in aliquet. Duis ipsum sem, ultricies nec risus nec, aliquet hendrerit neque. Integer accumsan varius iaculis.</p><p>Aliquam pharetra fringilla lectus sed placerat. Donec iaculis libero non sem maximus, id scelerisque arcu laoreet. Sed tempus eros sit amet justo posuere mollis. Etiam commodo semper felis maximus porttitor. Fusce ut molestie massa. Phasellus sem enim, tristique quis lorem id, maximus accumsan sapien. Aenean feugiat luctus ligula, vel tristique nunc convallis eget.</p><p>Ut facilisis tortor turpis, ac feugiat nunc egestas eget. Ut tincidunt ex nisi, eu egestas purus interdum in. Pellentesque ornare commodo turpis vitae aliquam. Etiam ornare cursus elit, in feugiat mauris ornare vitae. Morbi mollis molestie lacus, non pulvinar quam. Quisque eleifend sed erat id congue. Vivamus vulputate tempus tortor, a gravida justo dictum id. Proin tristique, neque id viverra accumsan, leo erat mattis sem, at porttitor nisi enim non risus. Nunc pharetra velit ut condimentum porta. Fusce consectetur id lectus quis vulputate. Nunc congue rutrum diam, at sodales magna malesuada iaculis. Aenean nec facilisis nulla, vestibulum eleifend purus.<img src="https://i.froala.com/assets/photo2.jpg" data-id="2" data-type="image" data-name="Image 2017-08-07 at 16:08:48.jpg" style="width: 300px;" class="fr-fic fr-dii hoverZoomLink fr-fir"></p><p>Morbi eget dolor sed velit pharetra placerat. Duis justo dui, feugiat eu diam ut, rutrum pellentesque urna. Praesent mattis tellus nec congue auctor. Fusce condimentum in sem at rhoncus. Mauris nec erat lacinia ligula viverra congue eget sit amet tellus. Aenean aliquet fermentum velit. Vivamus ut odio vel dolor mattis interdum. Nunc ullamcorper ex quis arcu tincidunt, sed accumsan massa rutrum. In at urna laoreet enim auctor consectetur ac eu justo. Curabitur porta turpis eget purus interdum scelerisque. Nunc dignissim aliquam sagittis. Suspendisse feugiat velit semper, condimentum magna vel, mollis neque. Maecenas sed lectus vel mi fringilla vehicula sit amet sed risus. Morbi posuere tincidunt magna nec interdum.</p><p>Mauris non cursus nisi, id semper quam. Aliquam auctor, est nec fringilla egestas, nisi orci varius sem, molestie faucibus est nulla ut tellus. Pellentesque in massa facilisis, sollicitudin elit nec, interdum ipsum. Maecenas pellentesque, orci sit amet auctor volutpat, mi lectus hendrerit arcu, nec pharetra justo justo et justo. Etiam feugiat dolor nisi, bibendum egestas leo auctor ut. Suspendisse dapibus quis purus nec pretium. Proin gravida orci et porta vestibulum. Cras ut sem in ante dignissim elementum vehicula id augue. Donec purus augue, dapibus in justo ut, posuere mollis felis. Nunc iaculis urna dolor, sollicitudin aliquam eros mattis placerat. Ut eget turpis ut dui ullamcorper ultricies a eget ex. Integer vitae lorem vel metus dignissim volutpat. Mauris tincidunt faucibus tellus, quis mollis libero. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p>Duis viverra efficitur libero eget luctus. Aenean dapibus sodales diam, posuere dictum erat rhoncus et. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam ligula ex, tincidunt sed enim eget, accumsan luctus nulla. Mauris ac consequat nunc, et ultrices ipsum. Integer nec venenatis est. Vestibulum dapibus, velit nec efficitur posuere, urna enim pretium quam, sit amet malesuada orci nibh sed metus. Nulla nec eros felis. Sed imperdiet mauris id egestas suscipit. Nunc interdum laoreet maximus. Nunc congue sapien ultricies, pretium est nec, laoreet sem. Fusce ornare tortor massa, ac vestibulum enim gravida nec.</p>', 'Travel', false, false, null, true, 1495727380000),
  (1, 'Love Your Life', 'Schmarmy garbage', '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris libero felis, maximus ut tincidunt a, consectetur in dolor. Pellentesque laoreet volutpat elit eget placerat. Pellentesque pretium molestie erat, vitae mollis urna dapibus a. Quisque eu aliquet metus. Aenean eget magna pharetra, mattis orci euismod, lobortis augue. Maecenas bibendum eros lorem, vitae pretium justo volutpat sit amet. Aenean varius odio magna, et pulvinar nulla sagittis a. Aliquam eleifend ac quam in pharetra. Praesent eu sem posuere, ultricies quam ullamcorper, eleifend est. In malesuada commodo eros non fringilla. Nulla aliquam diam et nisi pellentesque aliquet. Proin eu est commodo, molestie neque eu, faucibus leo.</p><p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Quisque hendrerit risus nulla, at congue dolor bibendum ac. Maecenas condimentum, orci non fringilla venenatis, justo dolor pellentesque enim, sit amet laoreet lectus risus et enim. Quisque a fringilla ex. Nunc at felis mauris. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Cras suscipit purus porttitor porta vestibulum. Vestibulum sed ipsum sit amet arcu mattis congue vitae ac risus. Phasellus ac ultrices est. Maecenas ultrices eros ligula. Quisque placerat nisi tellus, vel auctor ligula pretium et. Nullam turpis odio, tincidunt non eleifend eu, cursus id lorem. Nam nibh sapien, eleifend quis massa eu, vulputate ullamcorper odio.</p><p><img src="https://localtvkdvr.files.wordpress.com/2017/05/may-snow-toby-the-bernese-mountain-dog-at-loveland.jpg?quality=85&strip=all&w=2000" style="width: 300px;" class="fr-fic fr-fil fr-dii">Aenean viverra turpis urna, et pellentesque orci posuere non. Pellentesque quis condimentum risus, non mattis nulla. Integer posuere egestas elit, vitae semper libero blandit at. Aenean vehicula tortor nec leo accumsan lobortis. Pellentesque vitae eros non felis fermentum vehicula eu in libero. Etiam sed tortor id odio consequat tincidunt. Maecenas eu nibh maximus odio pulvinar tempus. Mauris ipsum neque, congue in laoreet eu, gravida ac dui. Nunc aliquet elit nec urna sagittis fermentum. Sed vehicula in leo a luctus. Sed commodo magna justo, sit amet aliquet odio mattis quis. Praesent eget vehicula erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vel ipsum enim. Nulla facilisi.</p><p>Phasellus interdum felis sit amet finibus consectetur. Vivamus eget odio vel augue maximus finibus. Vestibulum fringilla lorem id lobortis convallis. Phasellus pharetra metus nec vulputate dapibus. Nunc id est mi. Vivamus placerat, diam sit amet sodales commodo, massa dolor euismod tortor, ut condimentum orci lectus ac ex. Ut mollis ex ut est euismod rhoncus. Quisque ut lobortis risus, a sodales diam. Maecenas vitae bibendum est, eget tincidunt lacus. Donec laoreet felis sed orci maximus, id consequat augue faucibus. In libero erat, porttitor vitae nunc id, dapibus sollicitudin nisl. Ut a pharetra neque, at molestie eros. Aliquam malesuada est rutrum nunc commodo, in eleifend nisl vestibulum.</p><p>Vestibulum id lacus rutrum, tristique lectus a, vestibulum odio. Nam dictum dui at urna pretium sodales. Nullam tristique nisi eget faucibus consequat. Etiam pretium arcu sed dapibus tincidunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus dictum vitae sapien suscipit dictum. In hac habitasse platea dictumst. Suspendisse risus dui, mattis ac malesuada efficitur, scelerisque vitae diam. Nam eu neque vel ex pharetra consequat vitae in justo. Phasellus convallis enim non est vulputate scelerisque. Duis id sagittis leo. Cras molestie tincidunt nisi, ac scelerisque est egestas vitae. Fusce mollis tempus dui in aliquet. Duis ipsum sem, ultricies nec risus nec, aliquet hendrerit neque. Integer accumsan varius iaculis.</p><p>Aliquam pharetra fringilla lectus sed placerat. Donec iaculis libero non sem maximus, id scelerisque arcu laoreet. Sed tempus eros sit amet justo posuere mollis. Etiam commodo semper felis maximus porttitor. Fusce ut molestie massa. Phasellus sem enim, tristique quis lorem id, maximus accumsan sapien. Aenean feugiat luctus ligula, vel tristique nunc convallis eget.</p><p>Ut facilisis tortor turpis, ac feugiat nunc egestas eget. Ut tincidunt ex nisi, eu egestas purus interdum in. Pellentesque ornare commodo turpis vitae aliquam. Etiam ornare cursus elit, in feugiat mauris ornare vitae. Morbi mollis molestie lacus, non pulvinar quam. Quisque eleifend sed erat id congue. Vivamus vulputate tempus tortor, a gravida justo dictum id. Proin tristique, neque id viverra accumsan, leo erat mattis sem, at porttitor nisi enim non risus. Nunc pharetra velit ut condimentum porta. Fusce consectetur id lectus quis vulputate. Nunc congue rutrum diam, at sodales magna malesuada iaculis. Aenean nec facilisis nulla, vestibulum eleifend purus.<img src="https://i.froala.com/assets/photo2.jpg" data-id="2" data-type="image" data-name="Image 2017-08-07 at 16:08:48.jpg" style="width: 300px;" class="fr-fic fr-dii hoverZoomLink fr-fir"></p><p>Morbi eget dolor sed velit pharetra placerat. Duis justo dui, feugiat eu diam ut, rutrum pellentesque urna. Praesent mattis tellus nec congue auctor. Fusce condimentum in sem at rhoncus. Mauris nec erat lacinia ligula viverra congue eget sit amet tellus. Aenean aliquet fermentum velit. Vivamus ut odio vel dolor mattis interdum. Nunc ullamcorper ex quis arcu tincidunt, sed accumsan massa rutrum. In at urna laoreet enim auctor consectetur ac eu justo. Curabitur porta turpis eget purus interdum scelerisque. Nunc dignissim aliquam sagittis. Suspendisse feugiat velit semper, condimentum magna vel, mollis neque. Maecenas sed lectus vel mi fringilla vehicula sit amet sed risus. Morbi posuere tincidunt magna nec interdum.</p><p>Mauris non cursus nisi, id semper quam. Aliquam auctor, est nec fringilla egestas, nisi orci varius sem, molestie faucibus est nulla ut tellus. Pellentesque in massa facilisis, sollicitudin elit nec, interdum ipsum. Maecenas pellentesque, orci sit amet auctor volutpat, mi lectus hendrerit arcu, nec pharetra justo justo et justo. Etiam feugiat dolor nisi, bibendum egestas leo auctor ut. Suspendisse dapibus quis purus nec pretium. Proin gravida orci et porta vestibulum. Cras ut sem in ante dignissim elementum vehicula id augue. Donec purus augue, dapibus in justo ut, posuere mollis felis. Nunc iaculis urna dolor, sollicitudin aliquam eros mattis placerat. Ut eget turpis ut dui ullamcorper ultricies a eget ex. Integer vitae lorem vel metus dignissim volutpat. Mauris tincidunt faucibus tellus, quis mollis libero. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p>Duis viverra efficitur libero eget luctus. Aenean dapibus sodales diam, posuere dictum erat rhoncus et. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam ligula ex, tincidunt sed enim eget, accumsan luctus nulla. Mauris ac consequat nunc, et ultrices ipsum. Integer nec venenatis est. Vestibulum dapibus, velit nec efficitur posuere, urna enim pretium quam, sit amet malesuada orci nibh sed metus. Nulla nec eros felis. Sed imperdiet mauris id egestas suscipit. Nunc interdum laoreet maximus. Nunc congue sapien ultricies, pretium est nec, laoreet sem. Fusce ornare tortor massa, ac vestibulum enim gravida nec.</p>', 'Trekking', false, false, null, true, 1490726380000),
  (1, 'Another Blog Post', 'You better check this shit out', '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris libero felis, maximus ut tincidunt a, consectetur in dolor. Pellentesque laoreet volutpat elit eget placerat. Pellentesque pretium molestie erat, vitae mollis urna dapibus a. Quisque eu aliquet metus. Aenean eget magna pharetra, mattis orci euismod, lobortis augue. Maecenas bibendum eros lorem, vitae pretium justo volutpat sit amet. Aenean varius odio magna, et pulvinar nulla sagittis a. Aliquam eleifend ac quam in pharetra. Praesent eu sem posuere, ultricies quam ullamcorper, eleifend est. In malesuada commodo eros non fringilla. Nulla aliquam diam et nisi pellentesque aliquet. Proin eu est commodo, molestie neque eu, faucibus leo.</p><p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Quisque hendrerit risus nulla, at congue dolor bibendum ac. Maecenas condimentum, orci non fringilla venenatis, justo dolor pellentesque enim, sit amet laoreet lectus risus et enim. Quisque a fringilla ex. Nunc at felis mauris. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Cras suscipit purus porttitor porta vestibulum. Vestibulum sed ipsum sit amet arcu mattis congue vitae ac risus. Phasellus ac ultrices est. Maecenas ultrices eros ligula. Quisque placerat nisi tellus, vel auctor ligula pretium et. Nullam turpis odio, tincidunt non eleifend eu, cursus id lorem. Nam nibh sapien, eleifend quis massa eu, vulputate ullamcorper odio.</p><p><img src="https://localtvkdvr.files.wordpress.com/2017/05/may-snow-toby-the-bernese-mountain-dog-at-loveland.jpg?quality=85&strip=all&w=2000" style="width: 300px;" class="fr-fic fr-fil fr-dii">Aenean viverra turpis urna, et pellentesque orci posuere non. Pellentesque quis condimentum risus, non mattis nulla. Integer posuere egestas elit, vitae semper libero blandit at. Aenean vehicula tortor nec leo accumsan lobortis. Pellentesque vitae eros non felis fermentum vehicula eu in libero. Etiam sed tortor id odio consequat tincidunt. Maecenas eu nibh maximus odio pulvinar tempus. Mauris ipsum neque, congue in laoreet eu, gravida ac dui. Nunc aliquet elit nec urna sagittis fermentum. Sed vehicula in leo a luctus. Sed commodo magna justo, sit amet aliquet odio mattis quis. Praesent eget vehicula erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vel ipsum enim. Nulla facilisi.</p><p>Phasellus interdum felis sit amet finibus consectetur. Vivamus eget odio vel augue maximus finibus. Vestibulum fringilla lorem id lobortis convallis. Phasellus pharetra metus nec vulputate dapibus. Nunc id est mi. Vivamus placerat, diam sit amet sodales commodo, massa dolor euismod tortor, ut condimentum orci lectus ac ex. Ut mollis ex ut est euismod rhoncus. Quisque ut lobortis risus, a sodales diam. Maecenas vitae bibendum est, eget tincidunt lacus. Donec laoreet felis sed orci maximus, id consequat augue faucibus. In libero erat, porttitor vitae nunc id, dapibus sollicitudin nisl. Ut a pharetra neque, at molestie eros. Aliquam malesuada est rutrum nunc commodo, in eleifend nisl vestibulum.</p><p>Vestibulum id lacus rutrum, tristique lectus a, vestibulum odio. Nam dictum dui at urna pretium sodales. Nullam tristique nisi eget faucibus consequat. Etiam pretium arcu sed dapibus tincidunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus dictum vitae sapien suscipit dictum. In hac habitasse platea dictumst. Suspendisse risus dui, mattis ac malesuada efficitur, scelerisque vitae diam. Nam eu neque vel ex pharetra consequat vitae in justo. Phasellus convallis enim non est vulputate scelerisque. Duis id sagittis leo. Cras molestie tincidunt nisi, ac scelerisque est egestas vitae. Fusce mollis tempus dui in aliquet. Duis ipsum sem, ultricies nec risus nec, aliquet hendrerit neque. Integer accumsan varius iaculis.</p><p>Aliquam pharetra fringilla lectus sed placerat. Donec iaculis libero non sem maximus, id scelerisque arcu laoreet. Sed tempus eros sit amet justo posuere mollis. Etiam commodo semper felis maximus porttitor. Fusce ut molestie massa. Phasellus sem enim, tristique quis lorem id, maximus accumsan sapien. Aenean feugiat luctus ligula, vel tristique nunc convallis eget.</p><p>Ut facilisis tortor turpis, ac feugiat nunc egestas eget. Ut tincidunt ex nisi, eu egestas purus interdum in. Pellentesque ornare commodo turpis vitae aliquam. Etiam ornare cursus elit, in feugiat mauris ornare vitae. Morbi mollis molestie lacus, non pulvinar quam. Quisque eleifend sed erat id congue. Vivamus vulputate tempus tortor, a gravida justo dictum id. Proin tristique, neque id viverra accumsan, leo erat mattis sem, at porttitor nisi enim non risus. Nunc pharetra velit ut condimentum porta. Fusce consectetur id lectus quis vulputate. Nunc congue rutrum diam, at sodales magna malesuada iaculis. Aenean nec facilisis nulla, vestibulum eleifend purus.<img src="https://i.froala.com/assets/photo2.jpg" data-id="2" data-type="image" data-name="Image 2017-08-07 at 16:08:48.jpg" style="width: 300px;" class="fr-fic fr-dii hoverZoomLink fr-fir"></p><p>Morbi eget dolor sed velit pharetra placerat. Duis justo dui, feugiat eu diam ut, rutrum pellentesque urna. Praesent mattis tellus nec congue auctor. Fusce condimentum in sem at rhoncus. Mauris nec erat lacinia ligula viverra congue eget sit amet tellus. Aenean aliquet fermentum velit. Vivamus ut odio vel dolor mattis interdum. Nunc ullamcorper ex quis arcu tincidunt, sed accumsan massa rutrum. In at urna laoreet enim auctor consectetur ac eu justo. Curabitur porta turpis eget purus interdum scelerisque. Nunc dignissim aliquam sagittis. Suspendisse feugiat velit semper, condimentum magna vel, mollis neque. Maecenas sed lectus vel mi fringilla vehicula sit amet sed risus. Morbi posuere tincidunt magna nec interdum.</p><p>Mauris non cursus nisi, id semper quam. Aliquam auctor, est nec fringilla egestas, nisi orci varius sem, molestie faucibus est nulla ut tellus. Pellentesque in massa facilisis, sollicitudin elit nec, interdum ipsum. Maecenas pellentesque, orci sit amet auctor volutpat, mi lectus hendrerit arcu, nec pharetra justo justo et justo. Etiam feugiat dolor nisi, bibendum egestas leo auctor ut. Suspendisse dapibus quis purus nec pretium. Proin gravida orci et porta vestibulum. Cras ut sem in ante dignissim elementum vehicula id augue. Donec purus augue, dapibus in justo ut, posuere mollis felis. Nunc iaculis urna dolor, sollicitudin aliquam eros mattis placerat. Ut eget turpis ut dui ullamcorper ultricies a eget ex. Integer vitae lorem vel metus dignissim volutpat. Mauris tincidunt faucibus tellus, quis mollis libero. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p>Duis viverra efficitur libero eget luctus. Aenean dapibus sodales diam, posuere dictum erat rhoncus et. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam ligula ex, tincidunt sed enim eget, accumsan luctus nulla. Mauris ac consequat nunc, et ultrices ipsum. Integer nec venenatis est. Vestibulum dapibus, velit nec efficitur posuere, urna enim pretium quam, sit amet malesuada orci nibh sed metus. Nulla nec eros felis. Sed imperdiet mauris id egestas suscipit. Nunc interdum laoreet maximus. Nunc congue sapien ultricies, pretium est nec, laoreet sem. Fusce ornare tortor massa, ac vestibulum enim gravida nec.</p>', 'Gear', false, true, 1995726380000, false, null),
  (1, 'Through the Looking Glass', 'Bring your spectacles', '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris libero felis, maximus ut tincidunt a, consectetur in dolor. Pellentesque laoreet volutpat elit eget placerat. Pellentesque pretium molestie erat, vitae mollis urna dapibus a. Quisque eu aliquet metus. Aenean eget magna pharetra, mattis orci euismod, lobortis augue. Maecenas bibendum eros lorem, vitae pretium justo volutpat sit amet. Aenean varius odio magna, et pulvinar nulla sagittis a. Aliquam eleifend ac quam in pharetra. Praesent eu sem posuere, ultricies quam ullamcorper, eleifend est. In malesuada commodo eros non fringilla. Nulla aliquam diam et nisi pellentesque aliquet. Proin eu est commodo, molestie neque eu, faucibus leo.</p><p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Quisque hendrerit risus nulla, at congue dolor bibendum ac. Maecenas condimentum, orci non fringilla venenatis, justo dolor pellentesque enim, sit amet laoreet lectus risus et enim. Quisque a fringilla ex. Nunc at felis mauris. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Cras suscipit purus porttitor porta vestibulum. Vestibulum sed ipsum sit amet arcu mattis congue vitae ac risus. Phasellus ac ultrices est. Maecenas ultrices eros ligula. Quisque placerat nisi tellus, vel auctor ligula pretium et. Nullam turpis odio, tincidunt non eleifend eu, cursus id lorem. Nam nibh sapien, eleifend quis massa eu, vulputate ullamcorper odio.</p><p><img src="https://localtvkdvr.files.wordpress.com/2017/05/may-snow-toby-the-bernese-mountain-dog-at-loveland.jpg?quality=85&strip=all&w=2000" style="width: 300px;" class="fr-fic fr-fil fr-dii">Aenean viverra turpis urna, et pellentesque orci posuere non. Pellentesque quis condimentum risus, non mattis nulla. Integer posuere egestas elit, vitae semper libero blandit at. Aenean vehicula tortor nec leo accumsan lobortis. Pellentesque vitae eros non felis fermentum vehicula eu in libero. Etiam sed tortor id odio consequat tincidunt. Maecenas eu nibh maximus odio pulvinar tempus. Mauris ipsum neque, congue in laoreet eu, gravida ac dui. Nunc aliquet elit nec urna sagittis fermentum. Sed vehicula in leo a luctus. Sed commodo magna justo, sit amet aliquet odio mattis quis. Praesent eget vehicula erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vel ipsum enim. Nulla facilisi.</p><p>Phasellus interdum felis sit amet finibus consectetur. Vivamus eget odio vel augue maximus finibus. Vestibulum fringilla lorem id lobortis convallis. Phasellus pharetra metus nec vulputate dapibus. Nunc id est mi. Vivamus placerat, diam sit amet sodales commodo, massa dolor euismod tortor, ut condimentum orci lectus ac ex. Ut mollis ex ut est euismod rhoncus. Quisque ut lobortis risus, a sodales diam. Maecenas vitae bibendum est, eget tincidunt lacus. Donec laoreet felis sed orci maximus, id consequat augue faucibus. In libero erat, porttitor vitae nunc id, dapibus sollicitudin nisl. Ut a pharetra neque, at molestie eros. Aliquam malesuada est rutrum nunc commodo, in eleifend nisl vestibulum.</p><p>Vestibulum id lacus rutrum, tristique lectus a, vestibulum odio. Nam dictum dui at urna pretium sodales. Nullam tristique nisi eget faucibus consequat. Etiam pretium arcu sed dapibus tincidunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus dictum vitae sapien suscipit dictum. In hac habitasse platea dictumst. Suspendisse risus dui, mattis ac malesuada efficitur, scelerisque vitae diam. Nam eu neque vel ex pharetra consequat vitae in justo. Phasellus convallis enim non est vulputate scelerisque. Duis id sagittis leo. Cras molestie tincidunt nisi, ac scelerisque est egestas vitae. Fusce mollis tempus dui in aliquet. Duis ipsum sem, ultricies nec risus nec, aliquet hendrerit neque. Integer accumsan varius iaculis.</p><p>Aliquam pharetra fringilla lectus sed placerat. Donec iaculis libero non sem maximus, id scelerisque arcu laoreet. Sed tempus eros sit amet justo posuere mollis. Etiam commodo semper felis maximus porttitor. Fusce ut molestie massa. Phasellus sem enim, tristique quis lorem id, maximus accumsan sapien. Aenean feugiat luctus ligula, vel tristique nunc convallis eget.</p><p>Ut facilisis tortor turpis, ac feugiat nunc egestas eget. Ut tincidunt ex nisi, eu egestas purus interdum in. Pellentesque ornare commodo turpis vitae aliquam. Etiam ornare cursus elit, in feugiat mauris ornare vitae. Morbi mollis molestie lacus, non pulvinar quam. Quisque eleifend sed erat id congue. Vivamus vulputate tempus tortor, a gravida justo dictum id. Proin tristique, neque id viverra accumsan, leo erat mattis sem, at porttitor nisi enim non risus. Nunc pharetra velit ut condimentum porta. Fusce consectetur id lectus quis vulputate. Nunc congue rutrum diam, at sodales magna malesuada iaculis. Aenean nec facilisis nulla, vestibulum eleifend purus.<img src="https://i.froala.com/assets/photo2.jpg" data-id="2" data-type="image" data-name="Image 2017-08-07 at 16:08:48.jpg" style="width: 300px;" class="fr-fic fr-dii hoverZoomLink fr-fir"></p><p>Morbi eget dolor sed velit pharetra placerat. Duis justo dui, feugiat eu diam ut, rutrum pellentesque urna. Praesent mattis tellus nec congue auctor. Fusce condimentum in sem at rhoncus. Mauris nec erat lacinia ligula viverra congue eget sit amet tellus. Aenean aliquet fermentum velit. Vivamus ut odio vel dolor mattis interdum. Nunc ullamcorper ex quis arcu tincidunt, sed accumsan massa rutrum. In at urna laoreet enim auctor consectetur ac eu justo. Curabitur porta turpis eget purus interdum scelerisque. Nunc dignissim aliquam sagittis. Suspendisse feugiat velit semper, condimentum magna vel, mollis neque. Maecenas sed lectus vel mi fringilla vehicula sit amet sed risus. Morbi posuere tincidunt magna nec interdum.</p><p>Mauris non cursus nisi, id semper quam. Aliquam auctor, est nec fringilla egestas, nisi orci varius sem, molestie faucibus est nulla ut tellus. Pellentesque in massa facilisis, sollicitudin elit nec, interdum ipsum. Maecenas pellentesque, orci sit amet auctor volutpat, mi lectus hendrerit arcu, nec pharetra justo justo et justo. Etiam feugiat dolor nisi, bibendum egestas leo auctor ut. Suspendisse dapibus quis purus nec pretium. Proin gravida orci et porta vestibulum. Cras ut sem in ante dignissim elementum vehicula id augue. Donec purus augue, dapibus in justo ut, posuere mollis felis. Nunc iaculis urna dolor, sollicitudin aliquam eros mattis placerat. Ut eget turpis ut dui ullamcorper ultricies a eget ex. Integer vitae lorem vel metus dignissim volutpat. Mauris tincidunt faucibus tellus, quis mollis libero. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p>Duis viverra efficitur libero eget luctus. Aenean dapibus sodales diam, posuere dictum erat rhoncus et. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam ligula ex, tincidunt sed enim eget, accumsan luctus nulla. Mauris ac consequat nunc, et ultrices ipsum. Integer nec venenatis est. Vestibulum dapibus, velit nec efficitur posuere, urna enim pretium quam, sit amet malesuada orci nibh sed metus. Nulla nec eros felis. Sed imperdiet mauris id egestas suscipit. Nunc interdum laoreet maximus. Nunc congue sapien ultricies, pretium est nec, laoreet sem. Fusce ornare tortor massa, ac vestibulum enim gravida nec.</p>', 'Trekking', false, false, null, true, 1298726380000);

comment on table pomb.post is 'Table with POMB posts';
comment on column pomb.post.id is 'Primary id for post';
comment on column pomb.post.title is 'Title of the post';
comment on column pomb.post.subtitle is 'Subtitle of post';
comment on column pomb.post.content is 'Content of post';
comment on column pomb.post.category is 'Category of post';
comment on column pomb.post.is_draft is 'Post is a draft';
comment on column pomb.post.is_scheduled is 'Post is scheduled';
comment on column pomb.post.scheduled_date is 'Date post is scheduled';
comment on column pomb.post.is_published is 'Post is published';
comment on column pomb.post.published_date is 'Date post is published';
comment on column pomb.post.created_at is 'When post created';
comment on column pomb.post.updated_at is 'Last updated date';

create table pomb.post_tag (
  id                  serial primary key,
  name                text not null,
  tag_description     text
);

insert into pomb.post_tag (name, tag_description) values
  ('colombia', 'What was once a haven for drugs and violence, Colombia has become a premiere destination for those who seek adventure, beauty, and intrepid charm.'),
  ('buses', 'No easier way to see a place than with your fellow man then round and round'),
  ('diving', 'Underneath the surf is a whole world to explore, find it.'),
  ('camping', 'Have no fear, the camping hub is here. Learn tips for around the site, checkout cool spots, and find how to make the most of your time in the outdoors.'),
  ('food', 'There are few things better than exploring the food on offer throughout the world and in your backyard. The food hub has you covered to find your next craving.'),
  ('sports', 'Theres more than just NFL football out there, lets see what is in store.'),
  ('drinks', 'From fire water, to fine wine, to whiskey from the barrel. Spirits a-plenty to sate any thirst.'),
  ('nightlife', 'Thumping beats, starry sights, and friendly people make a night on the town an integral part of any journey.');

comment on table pomb.post_tag is 'Table with the type of post tags available';
comment on column pomb.post_tag.id is 'Primary id for the tag';
comment on column pomb.post_tag.name is 'Name of the post tag';
comment on column pomb.post_tag.tag_description is 'Description of the post tag';

create table pomb.post_to_tag ( --one to many
  id                 serial primary key,
  post_id            integer not null references pomb.post(id) on delete cascade,
  post_tag_id        integer not null references pomb.post_tag(id) on delete cascade
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
comment on column pomb.post_to_tag.id is 'Id of the row';
comment on column pomb.post_to_tag.post_id is 'Id of the post';
comment on column pomb.post_to_tag.post_tag_id is 'Id of the post tag';

create table pomb.post_comment (
  id                  serial primary key,
  author              integer not null references pomb.account(id),
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

comment on table pomb.post_comment is 'Table with comments from users';
comment on column pomb.post_comment.id is 'Primary id for the comment';
comment on column pomb.post_comment.author is 'Primary id of author';
comment on column pomb.post_comment.content is 'Body of the comment';
comment on column pomb.post_comment.created_at is 'Time comment created at';
comment on column pomb.post_comment.updated_at is 'Time comment updated at';

create table pomb.post_to_comment ( --one to many
  post_id            integer not null references pomb.post(id) on delete cascade,
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

create table pomb.post_lead_photo (
  id                  serial primary key,
  post_id             integer not null references pomb.post(id) on delete cascade,
  title               text not null check (char_length(title) < 80),
  description         text,
  created_at          bigint default (extract(epoch from now()) * 1000),
  updated_at          timestamp default now()
);

insert into pomb.post_lead_photo (post_id, title, description) values
  (1, 'Dat photo title', 'Colombia commentary'),
  (2, 'Dat photo title', 'Biking Bizness'),
  (3, 'Dat photo title', 'Hiking is neat'),
  (4, 'Dat photo title', 'Camping is fun'),
  (5, 'Dat photo title', 'Food is dope'),
  (6, 'Dat photo title', 'Travel is lame'),
  (7, 'Dat photo title', 'Culture is exotic'),
  (8, 'Dat photo title', 'Culture is exotic'),
  (9, 'Dat photo title', 'Culture is exotic'),
  (10, 'Dat photo title', 'Culture is exotic'),
  (11, 'Dat photo title', 'Culture is exotic'),
  (12, 'Dat photo title', 'Culture is exotic'),
  (13, 'Dat photo title', 'Gear snob');

comment on table pomb.post_lead_photo is 'Table with comments from users';
comment on column pomb.post_lead_photo.id is 'Primary id for the photo';
comment on column pomb.post_lead_photo.post_id is 'Primary id of post';
comment on column pomb.post_lead_photo.title is 'Title of photo';
comment on column pomb.post_lead_photo.description is 'Description of photo';
comment on column pomb.post_lead_photo.created_at is 'Time comment created at';
comment on column pomb.post_lead_photo.updated_at is 'Time comment updated at';

create table pomb.lead_photo_link (
  id                  serial primary key,
  lead_photo_id       integer not null references pomb.post_lead_photo(id) on delete cascade,
  size                integer not null,
  url                 text not null
);

insert into pomb.lead_photo_link (lead_photo_id, size, url) values
  (1, 1220, 'http://images.singletracks.com/blog/wp-content/uploads/2016/06/Scale-Action-Image-2017-BIKE-SCOTT-Sports_9-1200x800.jpg'),
  (1, 320, 'https://www.calliaweb.co.uk/wp-content/uploads/2015/10/300x200.jpg'),
  (2, 1220, 'http://images.singletracks.com/blog/wp-content/uploads/2016/06/Scale-Action-Image-2017-BIKE-SCOTT-Sports_9-1200x800.jpg'),
  (3, 1220, 'http://images.singletracks.com/blog/wp-content/uploads/2016/06/Scale-Action-Image-2017-BIKE-SCOTT-Sports_9-1200x800.jpg'),
  (4, 1220, 'http://images.singletracks.com/blog/wp-content/uploads/2016/06/Scale-Action-Image-2017-BIKE-SCOTT-Sports_9-1200x800.jpg'),
  (5, 1220, 'http://images.singletracks.com/blog/wp-content/uploads/2016/06/Scale-Action-Image-2017-BIKE-SCOTT-Sports_9-1200x800.jpg'),
  (6, 1220, 'http://images.singletracks.com/blog/wp-content/uploads/2016/06/Scale-Action-Image-2017-BIKE-SCOTT-Sports_9-1200x800.jpg'),
  (7, 1220, 'http://images.singletracks.com/blog/wp-content/uploads/2016/06/Scale-Action-Image-2017-BIKE-SCOTT-Sports_9-1200x800.jpg'),
  (8, 1220, 'http://images.singletracks.com/blog/wp-content/uploads/2016/06/Scale-Action-Image-2017-BIKE-SCOTT-Sports_9-1200x800.jpg'),
  (9, 1220, 'http://images.singletracks.com/blog/wp-content/uploads/2016/06/Scale-Action-Image-2017-BIKE-SCOTT-Sports_9-1200x800.jpg'),
  (10, 1220, 'http://images.singletracks.com/blog/wp-content/uploads/2016/06/Scale-Action-Image-2017-BIKE-SCOTT-Sports_9-1200x800.jpg'),
  (11, 1220, 'http://images.singletracks.com/blog/wp-content/uploads/2016/06/Scale-Action-Image-2017-BIKE-SCOTT-Sports_9-1200x800.jpg'),
  (12, 1220, 'http://images.singletracks.com/blog/wp-content/uploads/2016/06/Scale-Action-Image-2017-BIKE-SCOTT-Sports_9-1200x800.jpg'),
  (13, 1220, 'http://images.singletracks.com/blog/wp-content/uploads/2016/06/Scale-Action-Image-2017-BIKE-SCOTT-Sports_9-1200x800.jpg');

comment on table pomb.lead_photo_link is 'Table with lead photo links';
comment on column pomb.lead_photo_link.id is 'Id of link';
comment on column pomb.lead_photo_link.lead_photo_id is 'Id of the referenced photo';
comment on column pomb.lead_photo_link.size is 'Size of photo';
comment on column pomb.lead_photo_link.url is 'Url of link';

create table pomb.post_to_gallery_photo ( --one to many
  id                 serial primary key,
  post_id            integer not null references pomb.post(id) on delete cascade,
  gallery_photo_url  text not null,
  description        text
);

insert into pomb.post_to_gallery_photo (post_id, gallery_photo_url, description) values
  (1, 'https://d15shllkswkct0.cloudfront.net/wp-content/blogs.dir/1/files/2015/03/1200px-Hommik_Viru_rabas.jpg', 'A beautiful vista accented by your mom'),
  (1, 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Lower_Yellowstone_Fall-1200px.jpg', 'A beautiful vista accented by your mom'),
  (1, 'http://www.ningalooreefdive.com/wp-content/uploads/2014/01/coralbay-3579-1200px-wm-1.png', 'A beautiful vista accented by your mom'),
  (1, 'http://richard-western.co.uk/wp-content/uploads/2015/06/4.-PG9015-30-1200px.jpg', 'A beautiful vista accented by your mom'),
  (1, 'http://www.ningalooreefdive.com/wp-content/uploads/2014/10/coralbay-4077-1200px-wm.png', 'A beautiful vista accented by your mom'),
  (1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Sign_of_Brno_University_of_Technology_at_building_in_Brno%2C_Kr%C3%A1lovo_Pole.jpg/1200px-Sign_of_Brno_University_of_Technology_at_building_in_Brno%2C_Kr%C3%A1lovo_Pole.jpg', 'A beautiful vista accented by your mom'),
  (3, 'https://d15shllkswkct0.cloudfront.net/wp-content/blogs.dir/1/files/2015/03/1200px-Hommik_Viru_rabas.jpg', 'A beautiful vista accented by your mom'),
  (3, 'https://d15shllkswkct0.cloudfront.net/wp-content/blogs.dir/1/files/2015/03/1200px-Hommik_Viru_rabas.jpg', 'A beautiful vista accented by your mom'),
  (3, 'https://d15shllkswkct0.cloudfront.net/wp-content/blogs.dir/1/files/2015/03/1200px-Hommik_Viru_rabas.jpg', 'A beautiful vista accented by your mom'),
  (5, 'https://d15shllkswkct0.cloudfront.net/wp-content/blogs.dir/1/files/2015/03/1200px-Hommik_Viru_rabas.jpg', 'A beautiful vista accented by your mom'),
  (5, 'https://d15shllkswkct0.cloudfront.net/wp-content/blogs.dir/1/files/2015/03/1200px-Hommik_Viru_rabas.jpg', 'A beautiful vista accented by your mom'),
  (5, 'https://d15shllkswkct0.cloudfront.net/wp-content/blogs.dir/1/files/2015/03/1200px-Hommik_Viru_rabas.jpg', 'A beautiful vista accented by your mom'),
  (5, 'https://d15shllkswkct0.cloudfront.net/wp-content/blogs.dir/1/files/2015/03/1200px-Hommik_Viru_rabas.jpg', 'A beautiful vista accented by your mom'),
  (5, 'https://d15shllkswkct0.cloudfront.net/wp-content/blogs.dir/1/files/2015/03/1200px-Hommik_Viru_rabas.jpg', 'A beautiful vista accented by your mom'),
  (5, 'https://d15shllkswkct0.cloudfront.net/wp-content/blogs.dir/1/files/2015/03/1200px-Hommik_Viru_rabas.jpg', 'A beautiful vista accented by your mom'),
  (5, 'https://d15shllkswkct0.cloudfront.net/wp-content/blogs.dir/1/files/2015/03/1200px-Hommik_Viru_rabas.jpg', 'A beautiful vista accented by your mom'),
  (8, 'https://d15shllkswkct0.cloudfront.net/wp-content/blogs.dir/1/files/2015/03/1200px-Hommik_Viru_rabas.jpg', 'A beautiful vista accented by your mom'),
  (8, 'https://d15shllkswkct0.cloudfront.net/wp-content/blogs.dir/1/files/2015/03/1200px-Hommik_Viru_rabas.jpg', 'A beautiful vista accented by your mom'),
  (8, 'https://d15shllkswkct0.cloudfront.net/wp-content/blogs.dir/1/files/2015/03/1200px-Hommik_Viru_rabas.jpg', 'A beautiful vista accented by your mom'),
  (8, 'https://d15shllkswkct0.cloudfront.net/wp-content/blogs.dir/1/files/2015/03/1200px-Hommik_Viru_rabas.jpg', 'A beautiful vista accented by your mom'),
  (10, 'https://d15shllkswkct0.cloudfront.net/wp-content/blogs.dir/1/files/2015/03/1200px-Hommik_Viru_rabas.jpg', 'A beautiful vista accented by your mom');

comment on table pomb.post_to_gallery_photo is 'Join table for gallery photos on a post';
comment on column pomb.post_to_gallery_photo.id is 'Id of the row';
comment on column pomb.post_to_gallery_photo.post_id is 'Id of the post';
comment on column pomb.post_to_gallery_photo.gallery_photo_url is 'Url of photo';
comment on column pomb.post_to_gallery_photo.description is 'Description of photo';

create table pomb.config (
  id                  serial primary key,
  primary_color       text not null check (char_length(primary_color) < 20),
  secondary_color     text not null check (char_length(secondary_color) < 20),
  tagline             text not null check (char_length(tagline) < 80),
  hero_banner         text not null,
  updated_at          timestamp default now()
);

insert into pomb.config (primary_color, secondary_color, tagline, hero_banner) values
  ('#e1ff00', '#04c960', 'For wherever the road takes you', 'http://www.pinnaclepellet.com/images/1200x300-deep-forest.jpg');

comment on table pomb.config is 'Table with POMB config';
comment on column pomb.config.id is 'Id for config';
comment on column pomb.config.primary_color is 'Primary color for site';
comment on column pomb.config.secondary_color is 'Secondary color for site';
comment on column pomb.config.tagline is 'Tagline of site';
comment on column pomb.config.hero_banner is 'Hero banner url';
comment on column pomb.config.updated_at is 'Last updated';

create table pomb.trip (
  id                  serial primary key,
  name                text not null check (char_length(name) < 256),
  start_date          bigint,
  end_date            bigint,
  banner_photo        text,
  created_at          bigint default (extract(epoch from now()) * 1000),
  updated_at          timestamp default now()
);

insert into pomb.trip (name, start_date, end_date, banner_photo) values
  ('Cool Trip', 1508274574542, 1508284574542, 'https://www.yosemitehikes.com/images/wallpaper/yosemitehikes.com-bridalveil-winter-1200x800.jpg'),
  ('Neat Trip', 1408274574542, 1448274574542, null);

comment on table pomb.trip is 'Table with POMB trips';
comment on column pomb.trip.id is 'Primary id for trip';
comment on column pomb.trip.name is 'Name of trip';
comment on column pomb.trip.start_date is 'Start date of trip';
comment on column pomb.trip.end_date is 'End date of trip';
comment on column pomb.trip.banner_photo is 'Banner photo of trip';
comment on column pomb.trip.created_at is 'When trip created';
comment on column pomb.trip.updated_at is 'When trip last updated';

create table pomb.juncture (
  id                  serial primary key,
  name                text check (char_length(name) < 256),
  arrival_date        bigint,
  description         text check (char_length(name) < 1200),
  lat                 decimal,
  lon                 decimal,
  created_at          bigint default (extract(epoch from now()) * 1000),
  updated_at          timestamp default now()
);

insert into pomb.juncture (name, arrival_date, description, lat, lon) values
  ('Day 1', 1508274574542, 'Did some sweet stuff', 36.9741, -122.0308),
  ('Day 2', 1508274674542, 'You da man my brother', 37.7749, -122.4194),
  ('Day 3', 1508274774542, 'Thats freaking awesome!', 37.9735, -122.5311),
  ('Day 4', 1508274574542, 'Did some sweet stuff', 38.4741, -119.0308),
  ('Day 5', 1508274674542, 'You da man my brother', 38.7749, -118.4194),
  ('Day 6', 1508274774542, 'Thats freaking awesome!', 39.9735, -110.5311),
  ('Day 7', 1508274574542, 'Did some sweet stuff', 40.9741, -108.0308),
  ('Day 8', 1508274674542, 'You da man my brother', 41.7749, -108.4194),
  ('Day 9', 1508274774542, 'Thats freaking awesome!', 39.9735, -114.5311),
  ('So it begins', 1408274584542, 'And we are who we are this is the trip of a lifetime because your life ends here', 4.7110, -74.0721);

comment on table pomb.juncture is 'Table with POMB junctures';
comment on column pomb.juncture.id is 'Primary id for juncture';
comment on column pomb.juncture.name is 'Name of juncture';
comment on column pomb.juncture.arrival_date is 'Date of juncture';
comment on column pomb.juncture.description is 'Description of the juncture';
comment on column pomb.juncture.lat is 'Latitude of the juncture';
comment on column pomb.juncture.lon is 'Longitude of the juncture';
comment on column pomb.juncture.created_at is 'When juncture created';
comment on column pomb.juncture.updated_at is 'When juncture last updated';

create table pomb.juncture_to_photo ( --one to many
  id                 serial primary key,
  juncture_id        integer not null references pomb.juncture(id) on delete cascade,
  photo_url          text not null,
  description        text
);

insert into pomb.juncture_to_photo (juncture_id, photo_url, description) values
  (1, 'https://d15shllkswkct0.cloudfront.net/wp-content/blogs.dir/1/files/2015/03/1200px-Hommik_Viru_rabas.jpg', 'A beautiful vista accented by your mom'),
  (1, 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Lower_Yellowstone_Fall-1200px.jpg', 'A beautiful vista accented by your mom'),
  (1, 'http://www.ningalooreefdive.com/wp-content/uploads/2014/01/coralbay-3579-1200px-wm-1.png', 'A beautiful vista accented by your mom'),
  (2, 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Sign_of_Brno_University_of_Technology_at_building_in_Brno%2C_Kr%C3%A1lovo_Pole.jpg/1200px-Sign_of_Brno_University_of_Technology_at_building_in_Brno%2C_Kr%C3%A1lovo_Pole.jpg', 'A beautiful vista accented by your mom'),
  (3, 'https://d15shllkswkct0.cloudfront.net/wp-content/blogs.dir/1/files/2015/03/1200px-Hommik_Viru_rabas.jpg', 'A beautiful vista accented by your mom'),
  (3, 'http://www.ningalooreefdive.com/wp-content/uploads/2014/01/coralbay-3579-1200px-wm-1.png', 'A beautiful vista accented by your mom'),
  (4, 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Lower_Yellowstone_Fall-1200px.jpg', 'A beautiful vista accented by your mom');

comment on table pomb.juncture_to_photo is 'Join table for photos on a juncture';
comment on column pomb.juncture_to_photo.id is 'Id of the row';
comment on column pomb.juncture_to_photo.juncture_id is 'Id of the juncture';
comment on column pomb.juncture_to_photo.photo_url is 'Url of photo';
comment on column pomb.juncture_to_photo.description is 'Description of photo';

create table pomb.juncture_to_post (
  id                 serial primary key,
  juncture_id        integer not null references pomb.juncture(id) on delete cascade,
  post_id            integer not null references pomb.post(id) on delete cascade
);

insert into pomb.juncture_to_post (juncture_id, post_id) values
  (1, 1),
  (1, 4),
  (2, 2);

comment on table pomb.juncture_to_post is 'Join table for posts related to a juncture';
comment on column pomb.juncture_to_post.id is 'Id of the row';
comment on column pomb.juncture_to_post.juncture_id is 'Id of the juncture';
comment on column pomb.juncture_to_post.post_id is 'Id of the post';

create table pomb.trip_to_juncture (
  id                 serial primary key,
  trip_id            integer not null references pomb.trip(id) on delete cascade,
  juncture_id        integer not null references pomb.juncture(id) on delete cascade
);

insert into pomb.trip_to_juncture (trip_id, juncture_id) values
  (1, 1),
  (1, 2),
  (1, 3),
  (1, 4),
  (1, 5),
  (1, 6),
  (1, 7),
  (1, 8),
  (1, 9),
  (2, 10);

comment on table pomb.trip_to_juncture is 'Join table for juncture related to a trip';
comment on column pomb.trip_to_juncture.id is 'Id of the row';
comment on column pomb.trip_to_juncture.trip_id is 'Id of the trip';
comment on column pomb.trip_to_juncture.juncture_id is 'Id of the juncture';

create table pomb.user_to_trip (
  id                 serial primary key,
  user_id            integer not null references pomb.account(id) on delete cascade,
  trip_id            integer not null references pomb.trip(id) on delete cascade
);

insert into pomb.user_to_trip (user_id, trip_id) values
  (1, 1),
  (1, 2);

comment on table pomb.user_to_trip is 'Join table for trip related to a user';
comment on column pomb.user_to_trip.id is 'Id of the row';
comment on column pomb.user_to_trip.user_id is 'Id of the user';
comment on column pomb.user_to_trip.trip_id is 'Id of the trip';

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

create function pomb.search_tags(query text) returns setof pomb.post_tag as $$
  select post_tag.*
  from pomb.post_tag as post_tag
  where post_tag.name ilike ('%' || query || '%')
$$ language sql stable;

comment on function pomb.search_tags(text) is 'Returns tags containing a given query term.';

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

create trigger account_updated_at before update
  on pomb.account
  for each row
  execute procedure pomb_private.set_updated_at();

create trigger comment_updated_at before update
  on pomb.post_comment
  for each row
  execute procedure pomb_private.set_updated_at();

create trigger lead_photo_updated_at before update
  on pomb.post_lead_photo
  for each row
  execute procedure pomb_private.set_updated_at();

create trigger config_updated_at before update
  on pomb.config
  for each row
  execute procedure pomb_private.set_updated_at();

create trigger trip_updated_at before update
  on pomb.trip
  for each row
  execute procedure pomb_private.set_updated_at();

create trigger juncture_updated_at before update
  on pomb.juncture
  for each row
  execute procedure pomb_private.set_updated_at();

-- *******************************************************************
-- *********************** FTS ***************************************
-- *******************************************************************

-- Once an index is created, no further intervention is required: the system will update the index when the table is modified, and it will use the index in queries when it 
-- thinks doing so would be more efficient than a sequential table scan. But you might have to run the ANALYZE command regularly to update statistics to allow the query planner 
-- to make educated decisions. See Chapter 14 for information about how to find out whether an index is used and when and why the planner might choose not to use an index.

-- Below creates a materialized view to allow for indexing across tables

CREATE MATERIALIZED VIEW pomb.search_index AS
SELECT pomb.post.*,
  setweight(to_tsvector('english', pomb.post.title), 'A') || 
  setweight(to_tsvector('english', pomb.post.subtitle), 'B') ||
  setweight(to_tsvector('english', pomb.post.content), 'C') ||
  setweight(to_tsvector('english', pomb.post.category::text), 'D') ||
  setweight(to_tsvector('english', pomb.post_tag.name), 'D') as document
FROM pomb.post
JOIN pomb.post_to_tag ON pomb.post_to_tag.post_id = pomb.post.id
JOIN pomb.post_tag ON pomb.post_tag.id = pomb.post_to_tag.post_tag_id
-- JOIN pomb.post_to_category ON pomb.post_to_category.post_id = pomb.post.id
-- JOIN pomb.post_category ON pomb.post_category.id = pomb.post_to_category.post_category_id
GROUP BY pomb.post.id, pomb.post_tag.id; 

CREATE INDEX idx_post_search ON pomb.search_index USING gin(document);

-- Then reindexing the search engine will be as simple as periodically running REFRESH MATERIALIZED VIEW search_index;

-- Simple (instead of english) is one of the built in search text configs that Postgres provides. simple doesn't ignore stopwords and doesn't try to find the stem of the word. 
-- With simple every group of characters separated by a space is a lexeme; the simple text search config is pratical for data like a person's name for which we may not want to find the stem of the word.

create function pomb.search_posts(query text) returns setof pomb.search_index as $$

  SELECT post FROM (
    SELECT DISTINCT ON(post.id) post, max(ts_rank(document, to_tsquery('english', query)))
      FROM pomb.search_index as post
      WHERE document @@ to_tsquery('english', query)
    GROUP BY post.id, post.*
    order by post.id, max DESC
  ) search_results
  order by search_results.max DESC;

$$ language sql stable;

comment on function pomb.search_posts(text) is 'Returns posts given a search term.';

-- *******************************************************************
-- ************************* Auth ************************************
-- *******************************************************************

create table pomb_private.user_account (
  account_id          integer primary key references pomb.account(id) on delete cascade,
  email               text not null unique check (email ~* '^.+@.+\..+$'),
  password_hash       text not null
);

comment on table pomb_private.user_account is 'Private information about a user’s account.';
comment on column pomb_private.user_account.account_id is 'The id of the user associated with this account.';
comment on column pomb_private.user_account.email is 'The email address of the account.';
comment on column pomb_private.user_account.password_hash is 'An opaque hash of the account’s password.';

create extension if not exists "pgcrypto";

create function pomb.register_account (
  username            text,
  first_name          text,
  last_name           text,
  email               text,
  password            text
) returns pomb.account as $$
declare
  account pomb.account;
begin
  insert into pomb.account (username, first_name, last_name) values
    (username, first_name, last_name)
    returning * into account;

  insert into pomb_private.user_account (account_id, email, password_hash) values
    (account.id, email, crypt(password, gen_salt('bf')));

  return account;
end;
$$ language plpgsql strict security definer;

comment on function pomb.register_account(text, text, text, text, text) is 'Registers and creates an account for POMB.';

-- *******************************************************************
-- ************************* Roles ************************************
-- *******************************************************************

create role pomb_admin login password 'abc123';
GRANT ALL privileges ON ALL TABLES IN SCHEMA pomb to pomb_admin;
GRANT ALL privileges ON ALL TABLES IN SCHEMA pomb_private to pomb_admin;

create role pomb_anonymous login password 'abc123' NOINHERIT;
GRANT pomb_anonymous to pomb_admin; --Now, the pomb_admin role can control and become the pomb_anonymous role. If we did not use that GRANT, we could not change into the pomb_anonymous role in PostGraphQL.

create role pomb_account;
GRANT pomb_account to pomb_admin; --The pomb_admin role will have all of the permissions of the roles GRANTed to it. So it can do everything pomb_anonymous can do and everything pomb_usercan do.
GRANT pomb_account to pomb_anonymous; 

create type pomb.jwt_token as (
  role text,
  account_id integer
);

alter database bclynch set "jwt.claims.account_id" to '0';

create function pomb.authenticate_account(
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
    return ('pomb_account', account.account_id)::pomb.jwt_token;
  else
    return null;
  end if;
end;
$$ language plpgsql strict security definer;

comment on function pomb.authenticate_account(text, text) is 'Creates a JWT token that will securely identify an account and give them certain permissions.';

create function pomb.current_account() returns pomb.account as $$
  select *
  from pomb.account
  where pomb.account.id = current_setting('jwt.claims.account_id', true)::integer
$$ language sql stable;

comment on function pomb.current_account() is 'Gets the account that was identified by our JWT.';

-- *******************************************************************
-- ************************* Security *********************************
-- *******************************************************************

GRANT usage on schema pomb to pomb_anonymous, pomb_account;
GRANT usage on all sequences in schema pomb to pomb_account;

GRANT ALL on table pomb.post to pomb_account; --ultimately needs to be policy in which only own user!
GRANT ALL on table pomb.post_lead_photo to pomb_account; --ultimately needs to be policy in which only own user!
GRANT ALL on table pomb.lead_photo_link to pomb_account; --ultimately needs to be policy in which only own user!
GRANT ALL on table pomb.post_tag to pomb_account;
GRANT ALL on table pomb.post_to_tag to pomb_account; --ultimately needs to be policy in which only own user!
GRANT ALL on table pomb.post_to_gallery_photo to pomb_account; --ultimately needs to be policy in which only own user!
GRANT ALL ON TABLE pomb.trip TO pomb_account; --ultimately needs to be policy in which only own user!
GRANT ALL ON TABLE pomb.juncture TO pomb_account; --ultimately needs to be policy in which only own user!
GRANT ALL ON TABLE pomb.juncture_to_photo TO pomb_account; --ultimately needs to be policy in which only own user!
GRANT ALL ON TABLE pomb.juncture_to_post TO pomb_account; --ultimately needs to be policy in which only own user!
GRANT ALL ON TABLE pomb.trip_to_juncture TO pomb_account; --ultimately needs to be policy in which only own user!
GRANT ALL ON TABLE pomb.user_to_trip TO pomb_account; --ultimately needs to be policy in which only own user!

GRANT select on table pomb.post to PUBLIC;
GRANT select on table pomb.post_tag to PUBLIC;
GRANT select on table pomb.post_to_tag to PUBLIC;
GRANT select on table pomb.post_to_gallery_photo to PUBLIC;
GRANT select on table pomb.post_comment to PUBLIC;
GRANT select on table pomb.post_to_comment to PUBLIC;
GRANT select on table pomb.account to PUBLIC;
GRANT select on table pomb.post_lead_photo to PUBLIC;
GRANT select on table pomb.lead_photo_link to PUBLIC;
GRANT SELECT ON TABLE pomb.trip TO PUBLIC;
GRANT SELECT ON TABLE pomb.juncture TO PUBLIC;
GRANT SELECT ON TABLE pomb.juncture_to_photo TO PUBLIC;
GRANT SELECT ON TABLE pomb.juncture_to_post TO PUBLIC;
GRANT SELECT ON TABLE pomb.trip_to_juncture TO PUBLIC;
GRANT SELECT ON TABLE pomb.user_to_trip TO PUBLIC;

GRANT ALL on table pomb.config to PUBLIC; -- ultimately needs to only be admin account that can mod
GRANT ALL on table pomb.account to pomb_account;
GRANT select on pomb.search_index to PUBLIC;

GRANT execute on function pomb.register_account(text, text, text, text, text) to pomb_anonymous;
GRANT execute on function pomb.authenticate_account(text, text) to pomb_anonymous;
GRANT execute on function pomb.current_account() to PUBLIC;
GRANT execute on function pomb.posts_by_tag(integer) to PUBLIC;
GRANT execute on function pomb.search_tags(text) to PUBLIC;
GRANT execute on function pomb.search_posts(text) to PUBLIC; 

-- ///////////////// RLS Policies ////////////////////////////////

-- create policy account_self on pomb.account for ALL to pomb_account
--   using (id = current_setting('jwt.claims.account_id')::integer);

commit;