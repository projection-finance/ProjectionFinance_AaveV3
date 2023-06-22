import Modal from "../../../components/Modal";
import Item from "../../../components/Item";
import ButtonFilled from "../../../components/buttons/ButtonFilled";
import ButtonOutlined from "../../../components/buttons/ButtonOutlined";
import DateSelect from '../../../components/forms/dateInput/DateSelect';
import TimeInput from '../../../components/forms/TimeInput';

const ClaimRewards = (props) => {
  const { open, onClose } = props;

  return (
    <Modal open={open} onClose={onClose}>
      <div className='text-sm text-white'>
        Claim rewards
      </div>
      <div className="mt-4 flex justify-between gap-10">
          <DateSelect date={new Date()} className="w-1/2" />
          <TimeInput className="w-1/2" />
        </div>
      <Item className="mt-4">
        <div className="">
          <div className="flex justify-between gap-4">
            <div className="text-white text-sm">Claim rewards</div>
            <div className="text-gray-light text-sm">3.23 AVAX</div>
          </div>
          <div className="flex justify-between gap-4 mt-4">
            <div className="text-white text-sm">Health Factor</div>
            <div className="text-gray-light text-sm text-end">8.72 &#62; 8.73</div>
          </div>
        </div>
      </Item>
      <div className="w-full mt-4 flex justify-center gap-3">
        <ButtonOutlined className={'w-[120px] py-2 px-5 text-xs'} label="Cancel" onClick={onClose}/>
        <ButtonFilled label="Claim" />
      </div>
    </Modal>
  )
};

export default ClaimRewards;