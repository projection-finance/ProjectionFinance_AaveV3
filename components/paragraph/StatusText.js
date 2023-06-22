const StatusText = (props) => {
  const { up, children, className } = props;

  return (
    <div className={`${up ? "text-success" : "text-error"} ${className}`}>{children}</div>
  )
};

export default StatusText;