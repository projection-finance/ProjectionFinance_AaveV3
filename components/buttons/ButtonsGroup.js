const ButtonsGroup = (props) => {
  const { active_tab, onChange, tabs } = props;

  return (
    <div className='w-full flex rounded bg-gray-dark select-none'>
      {tabs.map((item, index) => (
        <div key={index} onClick={() => onChange(item.key)} className={`w-1/2 text-xs cursor-pointer text-center py-2 transition-all ${active_tab === item.key ? "bg-blue-crayola rounded text-white" : "bg-transparent text-gray-light rounded hover:bg-blue-crayola/30 hover:text-white"}`}>{item.label}</div>
      ))}
    </div>
  )
};

export default ButtonsGroup;