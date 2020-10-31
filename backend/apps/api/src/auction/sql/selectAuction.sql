select A.auction -> 'item' as item, A.users
from (
         select *, auction.auction -> 'users' as users
         from auction
     ) A
where A.users::jsonb @> '[1]';
