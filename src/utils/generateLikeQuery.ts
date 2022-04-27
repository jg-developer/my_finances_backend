import { startOfDay, endOfDay } from 'date-fns';

interface Obj {
  [key: string]: string | number;
}

export function generateLikeQueryBuilder(obj: Obj): string | null {
  let where_query = ``;

  for (const [key, value] of Object.entries(obj)) {
    const keySplit = key.includes('.')
      ? `"${key.split('.')[0]}"."${key.split('.')[1]}"`
      : `"${key}"`;
    if (
      where_query === '' &&
      !keySplit.toLowerCase().includes('created') &&
      !keySplit.toLowerCase().includes('updated') &&
      !keySplit.toLowerCase().includes('date')
    ) {
      where_query +=
        keySplit.includes('id') || keySplit.includes('Id')
          ? `${keySplit}=${value}`
          : `${keySplit}::TEXT ILIKE '%${value}%'`;
    } else if (
      where_query === '' &&
      (keySplit.includes('>') || keySplit.includes('<'))
    ) {
      where_query += keySplit.includes('>')
        ? `${keySplit.replace('>', '')}>='${startOfDay(
            new Date(value),
          ).toISOString()}'`
        : `${keySplit.replace('<', '')}<='${endOfDay(
            new Date(value),
          ).toISOString()}'`;
    } else if (keySplit.includes('>') || keySplit.includes('<')) {
      where_query += keySplit.includes('>')
        ? ` AND ${keySplit.replace('>', '')}>='${startOfDay(
            new Date(value),
          ).toISOString()}'`
        : ` AND ${keySplit.replace('<', '')}<='${endOfDay(
            new Date(value),
          ).toISOString()}'`;
    } else {
      where_query += keySplit.includes('id')
        ? ` AND ${keySplit}=${value}`
        : ` AND ${keySplit}::TEXT ILIKE '%${value}%'`;
    }
  }

  where_query += ``;

  if (where_query === '') {
    return null;
  }

  return where_query;
}
