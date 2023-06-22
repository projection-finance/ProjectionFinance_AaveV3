import Modal from "../../../components/Modal";
import Item from "../../../components/Item";
import ButtonFilled from "../../../components/buttons/ButtonFilled";
import ButtonOutlined from "../../../components/buttons/ButtonOutlined";

const SwitchApy = (props) => {
  const { open, onClose } = props;

  return (
    <Modal open={open} onClose={onClose}>
      <div className='text-sm text-white'>
        Switch APY type
      </div>
      <Item className="mt-4">
        <div className="flex justify-between gap-4">
          <div className="text-white text-sm">Change APY</div>
          <div className="text-gray-light text-sm">Balance 10,523.23</div>
        </div>
        <div className="flex justify-between gap-4 mt-4">
          <div className="text-white text-sm">Health Factor</div>
          <div className="text-gray-light text-sm text-end">$10, 529.48</div>
        </div>
      </Item>
      <div className="w-full mt-4 flex justify-center gap-3">
        <ButtonOutlined className={'w-[120px] py-2 px-5 text-xs'} label="Cancel" onClick={onClose}/>
        <ButtonFilled label="Switch" />
      </div>
    </Modal>
  )
};

export default SwitchApy;