import { useRouter } from 'next/router';

const useQuery = () => {
  const router = useRouter();
  const { query } = router;
  return new URLSearchParams(query);
};

export default useQuery;
