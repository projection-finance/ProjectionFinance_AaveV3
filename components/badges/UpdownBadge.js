import filledUp from '../../assets/icons/filled-up.svg';
import filledDown from '../../assets/icons/filled-down.svg';
import Image from "next/image";

const UpdownBadge = (props) => {
  const { children, up } = props;

  return (
    <div className={`px-1 py-0.5 shrink-0 flex items-center gap-1 rounded w-fit ${up ? "text-success bg-success bg-opacity-10" : "text-error bg-error bg-opacity-10"}`}>
      <Image src={up ? filledUp : filledDown} alt="filledup" />
      <div className='text-xxs'>{children}</div>
    </div>
  )
};

export default UpdownBadge;