const TxText = (props) => {
  const { tx } = props;

  const truncateAddress = (text) => {
    const leading = text.substr(0, 4);
    const trailing = text.substr(-4);

    return leading + "..." + trailing;
  }

  return (
    <>{truncateAddress(tx)}</>
  )
};

export default TxText;