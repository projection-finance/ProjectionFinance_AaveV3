const Card = (props) => {
  const { children, className } = props;

  return (
    <div className={`${className} bg-white text-gray-dark backdrop-blur-sm dark:bg-black/10 border border-light-hover dark:border-gray-dark/30 dark:text-white rounded-lg`}>{children}</div>
  )
};

export default Card;