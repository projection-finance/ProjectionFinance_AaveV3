const CheckButton = (props) => {
  const { checked, onChange, label } = props;

  return (
    <p className="comment-form-cookies-consent">
      <input id="checkbox" name="checkbox" type="checkbox" checked={checked} onChange={onChange} />
      <label htmlFor="checkbox">{label}</label>
    </p>
  );
};

export default CheckButton;
