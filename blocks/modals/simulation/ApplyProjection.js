import { useState } from "react";
import ButtonFilled from "../../../components/buttons/ButtonFilled";
import ButtonOutlined from "../../../components/buttons/ButtonOutlined";
import SearchInput from "../../../components/forms/inputs/SearchInput";
import Modal from "../../../components/Modal";

const ApplyProjection = (props) => {
  const { open, onClose } = props;
  const [selectedProjection, setSelectedProjection] = useState('');

  const projections = ['a', 'b', 'c'];

  const onSelectProjection = (item) => {
    setSelectedProjection(item);
  }
  return (
    <Modal open={open} onClose={onClose}>
      <div className='text-sm text-white mb-4'>
        Apply projection
      </div>
      <SearchInput placeholder="Search by name..." />
      <div className="mt-4">
        <div className="flex justify-start items-center gap-2">
          <div className="text-xs text-gray-light">Existing projections</div>
          <p className="text-[10px] rounded w-3 h-3 bg-gray-dark text-blue-crayola flex items-center justify-center">
            {projections ? projections.length : 0}
          </p>
        </div>
        {projections?.length ?
          projections?.map((item, index) => (
            <div className="mt-3 flex justify-between items-center" key={index} onClick={() => onSelectProjection(item)}>
              {selectedProjection !== item ? <>
                <div className="text-sm font-semibold text-gray-light">{item}</div>
                <div className="rounded-full w-3 h-3 border border-solid border-gray-dark"></div>
              </> :
                <>
                  <div className="text-sm font-semibold text-white">{item}</div>
                  <div className="rounded-full w-3 h-3 bg-blue-crayola flex justify-center items-center">
                    <div className="rounded-full w-1.5 h-1.5 bg-white"></div>
                  </div>
                </>
              }
            </div>
          ))
          : <>
            <div className="mt-3 text-sm font-semibold text-gray-light">
              You have no available projections...
            </div>
          </>}
      </div>
      <div className="w-full mt-4 flex justify-center gap-3">
        <ButtonOutlined className={'w-[120px] py-2 px-5 text-xs'} label="Create new" />
        {projections?.length ? <ButtonFilled label="Supply" /> : ''}
      </div>
    </Modal>
  )
}

export default ApplyProjection;