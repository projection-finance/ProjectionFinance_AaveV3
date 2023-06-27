import { ArrowLeftIcon, ArrowRightIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/20/solid';

const Pagination = (props) => {
  const { data, page = 1, total, onPageChange } = props;

  const incrementPage = () => onPageChange(page + 1);

  const decrementPage = () => page > 1 && onPageChange(page - 1);

  const showLeftDots = () => {
    return page === 1 || page === 2;
  };

  const showRightDots = () => {
    return page === total || page === total - 1;
  };

  const goToFirstPage = () => onPageChange(1);

  const goToLastPage = () => onPageChange(getLastPage());

  const goToThisPage = (page) => onPageChange(page);

  const atFirstPage = () => page === 1;

  const atLastPage = () => page === getLastPage();

  const getLastPage = () => total;

  return (
    <ul className='flex'>
      <li className='ml-0 rounded-l border border-r-0 border-gray-700/50 bg-transparent text-sm hover:bg-disabled-bg '>
        <button
          className='flex h-full items-center p-1 disabled:cursor-not-allowed disabled:bg-disabled-bg'
          onClick={() => goToFirstPage()}
          disabled={atFirstPage()}
        >
          <ChevronDoubleLeftIcon className='w-[20px] text-gray-white' />
        </button>
      </li>
      <li className='border border-r-0 border-gray-700/50 bg-transparent text-sm hover:bg-disabled-bg'>
        <button
          className='flex h-full items-center p-1 disabled:cursor-not-allowed disabled:bg-disabled-bg'
          onClick={() => decrementPage()}
          disabled={atFirstPage()}
        >
          <ArrowLeftIcon className='w-[20px] text-gray-white' />
        </button>
      </li>
      <ul className='flex'>
        {page > 1 && <li className='border border-r-0 border-gray-700/50 bg-transparent text-sm hover:bg-disabled-bg'>
          <button className='min-w-[30px] p-2 text-gray-white' onClick={() => goToThisPage(1)}>1</button>
        </li>}
        {!showLeftDots() && <li className="border border-r-0 border-gray-700/50 bg-transparent text-sm hover:bg-disabled-bg">
          <button className="p-2 text-gray-white">
            ...
          </button>
        </li>}
        <li className="border border-r-0 border-gray-700/50 bg-transparent text-sm">
          <button className="min-w-[30px] bg-cyan-600 p-2 text-white">
            {page}
          </button>
        </li>
        {!showRightDots() && <li className="border border-r-0 border-gray-700/50 bg-transparent text-sm hover:bg-disabled-bg">
          <button className="p-2 text-gray-white">
            ...
          </button>
        </li>}
        {page < total && <li className='border border-r-0 border-gray-700/50 bg-transparent text-sm hover:bg-disabled-bg'>
          <button className='p-2 text-gray-white' onClick={() => goToThisPage(getLastPage())}>{getLastPage()}</button>
        </li>}
      </ul>
      <li className='border border-r-0 border-gray-700/50 bg-transparent text-sm hover:bg-disabled-bg'>
        <button className='flex h-full items-center p-1 disabled:cursor-not-allowed disabled:bg-disabled-bg' onClick={incrementPage} disabled={atLastPage() || !data}>
          <ArrowRightIcon className='w-[20px] text-gray-white' />
        </button>
      </li>
      <li className='rounded-r border border-r border-gray-700/50 bg-transparent text-sm hover:bg-disabled-bg'>
        <button className='flex h-full items-center p-1 disabled:cursor-not-allowed disabled:bg-disabled-bg' onClick={goToLastPage} disabled={atLastPage() || !data}>
          <ChevronDoubleRightIcon className='w-[20px] text-gray-white' />
        </button>
      </li>
    </ul>
  );
};

export default Pagination;