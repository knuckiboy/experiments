import React from "react";

type CheckboxType = {
  title: string;
  value?: boolean
  onChange: () => void;
};
type CheckboxGroupType = {
  grpCheckbox: CheckboxType[];
  disabled?:boolean,
};

const CheckboxGroup = ({ grpCheckbox, disabled=false }: CheckboxGroupType) => {
  return (
    <div className="inline-flex text-xs justify-evenly grow gap-2">
      {grpCheckbox &&
        grpCheckbox.map((item) => (
          <div className="inline-flex gap-1" key={item.title}>
            <input type="checkbox" checked={item.value} onChange={item.onChange} disabled={disabled} readOnly={disabled}/>
            <span>{item.title}</span>
          </div>
        ))}
    </div>
  );
};

export default CheckboxGroup;
