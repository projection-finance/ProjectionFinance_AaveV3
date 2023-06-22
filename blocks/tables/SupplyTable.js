import StatusText from '../../components/paragraph/StatusText';
import CryptoIcon from '../../components/CryptoIcon';

import { ArrowDownIcon, ArrowRightIcon } from '@heroicons/react/24/outline';


const SupplyTable = (props) => {
  const { onSort, order_by, sort } = props;

  const colkeys = [
    {
      label: 'Token name',
      key: 'token',
    },
    {
      label: 'Token price',
      key: 'price',
    },
    {
      label: 'Quantity',
      key: 'quantity',
    },
    {
      label: 'PNL',
      key: 'pnl',
    },
    {
      label: 'Value',
      key: 'value',
    }
  ]

  const data = [
    {
      token: {
        label: "Wrapped ETH",
        key: 'weth'
      },
      price: {
        before: 28947.19,
        after: 29306.83
      },
      quantity: {
        before: 2.8005,
        after: 3.1205
      },
      pnl: 1.79,
      value: {
        before: 40315.86,
        after: 44687.05
      },
    },
    {
      token: {
        label: "DAI",
        key: 'dai'
      },
      price: {
        before: 1.05,
        after: 1.03
      },
      quantity: {
        before: 10345.43,
        after: 9164.38
      },
      pnl: 2.35,
      value: {
        before: 40315.86,
        after: 44687.05
      },
    },
    {
      token: {
        label: "DAI",
        key: 'dai'
      },
      price: {
        before: 1.05,
        after: 1.03
      },
      quantity: {
        before: 10345.43,
        after: 9164.38
      },
      pnl: 2.35,
      value: {
        before: 40315.86,
        after: 44687.05
      },
    },
    {
      token: {
        label: "DAI",
        key: 'dai'
      },
      price: {
        before: 1.05,
        after: 1.03
      },
      quantity: {
        before: 10345.43,
        after: 9164.38
      },
      pnl: 2.35,
      value: {
        before: 40315.86,
        after: 44687.05
      },
    },
    {
      token: {
        label: "DAI",
        key: 'dai'
      },
      price: {
        before: 1.05,
        after: 1.03
      },
      quantity: {
        before: 10345.43,
        after: 9164.38
      },
      pnl: 2.35,
      value: {
        before: 40315.86,
        after: 44687.05
      },
    }
  ]

  const handleSort = (sortKey) => {
    onSort(sortKey)
  };

  const getStyle = (index, length) => {
    if (index === 0) {
      return "pl-4 rounded-l"
    } else if (index === length) {
      return "pr-4 rounded-r"
    } else {
      return "px-2"
    }
  }

  return (
    <table className='w-full my-4'>
      <thead className='bg-gray-middle'>
        <tr className=''>
          {colkeys.map((item, index) => (
            <th key={index} className={`${getStyle(index, colkeys.length - 1)} py-2 text-start text-blue-crayola font-normal text-xs select-none cursor-default`} onClick={() => handleSort(item.key)}>
              <div className='relative w-fit'>
                {item.label}
                <ArrowDownIcon className={`top-0 bottom-0 m-auto -right-5 w-3 transition-rotate absolute ${order_by === item.key && (sort === 'asc' ? 'rotate-180' : 'rotate-0')}`} />
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className='before:content-["@"] before:block before:leading-4 before:text-transparent'>
        {data.map((item, index) => (
          <tr key={index}>
            <td className='text-white text-xs text-start pl-4 py-2'>
              <div className='flex items-center gap-3'>
                <CryptoIcon label={item.token.key} className="w-6" />
                <div>
                  <div className='text-white text-xs'>{item.token.label}</div>
                  <div className='text-gray-light text-[8px]'>{item.token.key.toUpperCase()}</div>
                </div>
              </div>
            </td>
            <td className='text-white text-xs text-start py-2 px-2'>
              <div className='flex items-center gap-1'>
                <div className='text-white'>${item.price.before}</div>
                <ArrowRightIcon className='text-gray-light w-2' />
                <StatusText up={item.price.after - item.price.before > 0}>${item.price.after}</StatusText>
              </div>
            </td>
            <td className='text-white text-xs text-start py-2 px-2'>
              <div className='flex items-center gap-1'>
                <div className='text-white'>{item.quantity.before}</div>
                <ArrowRightIcon className='text-gray-light w-2' />
                <StatusText up={!!(item.quantity.after - item.quantity.before > 0)}>${item.quantity.after}</StatusText>
              </div>
            </td>
            <td className='text-white text-xs text-start py-2 px-2'>{item.pnl}</td>
            <td className='text-white text-xs text-start py-2 r-4'>
              <div className='flex items-center gap-1'>
                <div className='text-white'>${item.value.before}</div>
                <ArrowRightIcon className='text-gray-light w-2' />
                <StatusText up={!!(item.value.after - item.value.before > 0)}>${item.value.after}</StatusText>
              </div>
            </td>
            {/* <td>{item.token.label}</td>
            <td>{item.price.before}</td>
            <td>{item.quantity.before}</td>
            <td>{item.pnl}</td>
            <td>{item.value.before}</td> */}
          </tr>
        ))}
      </tbody>
    </table>
  )
};

export default SupplyTable;