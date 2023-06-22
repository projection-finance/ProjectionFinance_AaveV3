import { useRef, useEffect, useCallback } from "react";
import { MONTHS } from "../utils/constants";
import { milliToDateMilli, millisecondsToDate } from "../utils/functions";

const ScrollToSelected = (props) => {
  const { data, selectedDate, rangeValue } = props;
  const containerRef = useRef(null);

  const scrollToSelected = useCallback(() => {
    const container = containerRef.current;
    const selected = container.querySelectorAll(".selected")[0];

    if (selected) {
      // calculate target scroll position
      const containerTop = container.getBoundingClientRect().top;
      const selectedTop = selected.getBoundingClientRect().top;
      const offset = selectedTop - containerTop;

      // animate scroll
      const duration = 500; // in milliseconds
      const startTime = performance.now();
      const targetScroll = container.scrollTop + offset;

      function step() {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easing = easeInOutQuad(progress);
        container.scrollTop = container.scrollTop + easing * (targetScroll - container.scrollTop);

        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      }

      window.requestAnimationFrame(step);
    }
  }, []);

  // scroll to selected item on mount and update
  useEffect(() => {
    scrollToSelected();
  }, [scrollToSelected, selectedDate, rangeValue]);

  // easing function for smooth animation
  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  return (
    <div ref={containerRef} className="scroll-to-select h-[500px] overflow-auto p-4">
      {data.map((item, index) => (
        <div className={`m-[2px] flex items-start my-2 mx-0 gap-4 ${index === rangeValue ? 'selected' : ''}`} key={index}>
          <div className="text-white w-11 flex items-center justify-between">
            <span>{MONTHS[millisecondsToDate(item.date).month]}</span>
            <span>{millisecondsToDate(item.date).day}</span>
          </div>
          {item?.actions.length ? (
            <div className="grow">
              {item?.actions.map((action, idx) => (
                <div key={idx} className="mt-3 p-2 bg-[#282a38] rounded-[5px]">
                  <div className="text-white text-[14px]">{action.actionName}
                    <span className="text-[14px] text-gray-light">
                      &nbsp;({action.actionDetails})
                    </span>
                  </div>
                  <div className="text-xs text-gray-light">{action.actionTimeStamp}</div>
                </div>
              ))}
            </div>
          ) :
            <div className="border border-b border-gray-light grow mt-3" />
          }
        </div>
      ))}
    </div>
  );
};

export default ScrollToSelected;




