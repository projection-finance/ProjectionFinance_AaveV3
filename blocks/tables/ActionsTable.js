
const ActionsTable = (props) => {
  const { onSort, order_by, sort, values} = props;
  
  console.log(values,'values abc 123');
  const colkeys = [
    {
      label: 'Actions',
      key: 'action',
    },
    {
      label: 'Date and time',
      key: 'datetime',
    },
    {
      label: 'Portfolio-before action',
      key: 'portbefore',
    },
    {
      label: 'Portfolio-after action',
      key: 'portafter',
    },
    {
      label: 'Evolution',
      key: 'evolution',
    },
    {
      label: 'Health factor',
      key: 'healthfactor',
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
               </div>
            </th>
          ))}
        </tr>
      </thead>
      {!values || values.length === 0 ? (
        <tbody>
          <tr>
            <td className='text-center py-4' colSpan={colkeys.length}>
              No actions to display at the moment
            </td>
          </tr>
        </tbody>
      ) : (
        <tbody className='before:content-["@"] before:block before:leading-4 before:text-transparent'>
          {values.map((item, index) => (
            <tr key={index}>
              <td className='text-gray-dark dark:text-white text-xs text-start pl-4 py-2'>{item.actionName} {item.actionDetails}</td>
              <td className='text-gray-dark dark:text-white text-xs text-start py-2 px-2'>{item.day} {item.hour}</td>
              <td className='text-gray-dark dark:text-white text-xs text-start py-2 px-2'>-</td>
              <td className='text-gray-dark dark:text-white text-xs text-start py-2 px-2'>-</td>
              <td className='text-gray-dark dark:text-white text-xs text-start py-2 px-2'>-</td>
              <td className='text-gray-dark dark:text-white text-xs text-start pr-4 py-2'>-</td>
            </tr>
          ))}
        </tbody>
      )}
    </table>
  );
  
  
};

export default ActionsTable;