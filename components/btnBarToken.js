import { useState, useEffect } from "react";
import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function BtnBarToken(props) {
  const [selectedToken, setSelectedToken] = useState(props.tokenLists[0]);

  useEffect(() => {
    props.handleSelection(selectedToken);
  }, [props, selectedToken]);

  return (
    <RadioGroup value={selectedToken} onChange={setSelectedToken} name="barToken">
      <div className="my-2 grid grid-cols-1 gap-y-6 sm:grid-cols-8 sm:gap-x-4">
        {props.tokenLists.map((token) => (
          <RadioGroup.Option key={token.id} value={token} className={({ checked, active }) => classNames(checked ? "border-transparent" : "border-gray-300", active ? "border-blue-primary ring-1 ring-blue-primary" : "", "relative flex cursor-pointer rounded-md border bg-transparent py-1 px-2 shadow-sm focus:outline-none")}>
            {({ checked, active }) => (
              <>
                <CheckCircleIcon className={classNames(!checked ? "text-gray-600" : "text-blue-primary", "h-5 w-5")} aria-hidden="true" />
                <span className={classNames(active ? "border" : "border-2", checked ? "border-blue-primary" : "border-transparent", "pointer-events-none absolute -inset-px rounded-lg")} aria-hidden="true" />
                <span className="flex flex-1 ml-3">
                  <span className="flex flex-col">
                    <RadioGroup.Label as="span" className="block text-sm font-medium text-gray-dark dark:text-white">
                      {token.reserve.symbol}
                    </RadioGroup.Label>
                  </span>
                </span>
              </>
            )}
          </RadioGroup.Option>
        ))}
        {props.isTokensPage && <RadioGroup.Option value="All" className={({ checked, active }) => classNames(checked ? "border-transparent" : "border-gray-300", active ? "border-blue-primary ring-1 ring-blue-primary" : "", "relative flex cursor-pointer rounded-md border bg-transparent py-1 px-2 shadow-sm focus:outline-none")}>
          {({ checked, active }) => (
            <>
              <span className={classNames(active ? "border" : "border-2", checked ? "border-blue-primary" : "border-transparent", "pointer-events-none absolute -inset-px rounded-lg")} aria-hidden="true" />
              <span className="flex flex-1 justify-center">
                <span className="flex flex-col">
                  <RadioGroup.Label as="span" className="block text-sm font-medium text-gray-dark dark:text-white">
                    All Tokens
                  </RadioGroup.Label>
                </span>
              </span>
            </>
          )}
        </RadioGroup.Option>}
      </div>
    </RadioGroup>
  );
}
