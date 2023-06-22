const Item = (props) => {
  const { children, className } = props;

  return (
    <div className={`bg-gray-dark rounded px-4 py-3.5 ${className}`}>
      {children}
    </div>
  )
};

export default Item;