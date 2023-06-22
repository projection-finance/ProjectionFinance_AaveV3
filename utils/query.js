export const getPagingQueryParams = (query, queryState) => {
  const active_tab = query.get('active_tab') ?? queryState.active_tab;
  const sort = query.get('sort') === 'desc' ? 'desc' : 'asc';
  const order_by = query.get('order_by') ?? queryState.order_by;

  return {
    active_tab,
    order_by,
    sort
  };
};

export const queryStringify = (params) => {
  const output = [];

  Object.keys(params).forEach(key => {
    const value = params[key];

    if (value !== '' && value !== undefined) {
      if (Array.isArray(value)) {
        output.push(`${key}[]=${value.join(`&${key}[]=`)}`);
      } else {
        output.push(`${key}=${encodeURIComponent(value)}`);
      }
    }
  });

  return output.length > 0 ? `?${output.join('&')}` : '';
};
