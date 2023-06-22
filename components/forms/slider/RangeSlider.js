
import { useEffect, useState } from 'react';
import { formatMonthDate } from '../../../utils/functions';

const RangeSlider = (props) => {
  const { min, max, value, step = 1, onChange, popup} = props;

  const [distance, setDistance] = useState(0);

  useEffect(() => {
    setDistance((max - min) / 100)
  }, [value, min, max]);

  const handleChange = (e) => {
    onChange(e);
  }

  return (
    <div className='relative -mt-6'>
      <div className="relative w-full h-0">
        <input
          className='my-slider absolute w-[calc(100%_-_115px)] right-[50px] z-50'
          type="range"
          onChange={handleChange}
          value={value}
          min={min}
          max={max}
          step={step}
        />
        <div className='absolute w-[calc(100%_-_115px)] right-[50px] top-[-66px] h-0'>
          <div className='absolute text-xs text-white left-0 px-2 py-0.5 bg-blue-crayola rounded min-w-[100px] text-center -translate-x-1/2' style={{ left: `calc(${(value - min) / distance}% + ${-(value - min) / (distance * 10) + 5}px )` }}>
            {popup}
            <span className='absolute h-10 w-px bg-blue-crayola top-5 left-0 right-0 m-auto' />
          </div>
        </div>
      </div>
    </div>
  )
};

export default RangeSlider;