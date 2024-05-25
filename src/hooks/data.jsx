import useSWR from 'swr';

import request from 'src/utils/request';

const fetcher = async (url) =>
  request
    .get(url)
    .then((res) => ({
      items: res?.data?.data || [],
      pagination: res?.data?.meta?.pagination || {},
    }))
    .catch((error) => error);

const useData = (url) => {
  const {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR(url, fetcher);

  const result = {
    error,
    isLoading,
    isValidating,
    mutate,
  };

  result.items = data?.items
  result.pagination = data?.pagination

  return result;
};

export default useData;
