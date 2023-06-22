function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function BtnBar(props) {
  const tabs = props.tabs ? props.tabs : [];
  const handleClick = props.handleClick ? props.handleClick : null;
  // function handleClick(event) {
  //   event.preventDefault();
  //   tabs.map((tab) => (tab.current = false));
  //   tabs[event.target.value].current = true;
  //   tabs[event.target.value].handleClick(event.target.name);
  // }
  return (
    <div className={props.className}>
      <nav className="isolate flex rounded-lg shadow bg-gray-lighter dark:bg-gray-800" aria-label="Tabs">
        {tabs.map((tab, tabIdx) => {
          return (
            <button name={tab.name} value={tabIdx} key={tabIdx} onClick={(event) => handleClick(event)} className={classNames(tab.current ? "bg-blue-crayola text-white" : "text-gray-500 hover:bg-blue-crayola/50 dark:hover:bg-blue-crayola hover:text-white", tabIdx === 0 ? "rounded-l-md" : "", tabIdx === tabs.length - 1 ? "rounded-r-md" : "", "group relative min-w-0 flex-1 overflow-hidden py-2 px-4 text-xxs font-medium text-center focus:z-10")} aria-current={tab.current ? "page" : undefined}>
              {tab.name}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
