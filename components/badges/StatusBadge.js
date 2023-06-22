const StatusBadge = (props) => {
  const { status } = props;

  const getStyle = (value) => {
    if (value === 'completed') {
      return "text-success border-success/25"
    } else if (value === "processing") {
      return "text-warning border-warning/25"
    } else if (value === "failed") {
      return "text-error border-error/25"
    }
  }

  const getText = (value) => {
    if (value === 'completed') {
      return "Completed"
    } else if (value === 'processing') {
      return "Processing"
    } else if (value === 'failed') {
      return "Failed"
    }
  }

  return (
    <div className={`border rounded px-3 py-1 w-fit text-xxs ${getStyle(status)}`}>{getText(status)}</div>
  )
};

export default StatusBadge;