-- This script will delete everything created in `pomb_schema.sql`. This script is
-- also idempotent, you can run it as many times as you would like. Nothing
-- will be dropped if the schemas do not exist.

begin;

drop schema if exists pomb, pomb_private cascade;
drop role if exists pomb_admin, pomb_anonymous, pomb_account;

commit;