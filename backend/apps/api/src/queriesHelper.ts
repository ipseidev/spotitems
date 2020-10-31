import { SelectQueryBuilder } from 'typeorm';

export async function getRawAndCountFromQueryBuilder(
  query: SelectQueryBuilder<unknown>,
) {
  return {
    data: await query.getRawMany(),
    ...(await query.select('COUNT(*)').getRawOne()),
  };
}
