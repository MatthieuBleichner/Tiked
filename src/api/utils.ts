export const formatResponse = (item: unknown): unknown => {
  if (Array.isArray(item)) {
    return item.map((el: unknown) => formatResponse(el));
  } else if (typeof item === 'function' || item !== Object(item)) {
    return item;
  }
  return Object.fromEntries(
    Object.entries(item as Record<string, unknown>).map(([key, value]: [string, unknown]) => [
      key.replace(/([-_][a-z])/gi, c => c.toUpperCase().replace(/[-_]/g, '')),
      formatResponse(value)
    ])
  );
};

export const formatQueryData = (item: unknown): unknown => {
  if (Array.isArray(item)) {
    return item.map((el: unknown) => formatQueryData(el));
  } else if (typeof item === 'function' || item !== Object(item)) {
    return item;
  }
  return Object.fromEntries(
    Object.entries(item as Record<string, unknown>).map(([key, value]: [string, unknown]) => [
      key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`),
      formatQueryData(value)
    ])
  );
};
