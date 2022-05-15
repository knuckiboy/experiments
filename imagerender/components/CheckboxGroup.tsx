import React from "react";

type CheckboxType = {
  title: string;
  onChange: () => void;
};
type CheckboxGroupType = {
  grpCheckbox: CheckboxType[];
};

const CheckboxGroup = ({ grpCheckbox }: CheckboxGroupType) => {
  return (
    <div className="inline-flex text-xs justify-evenly grow">
      {grpCheckbox &&
        grpCheckbox.map((item) => (
          <div className="inline-flex gap-1" key={item.title}>
            <input type="checkbox" checked disabled/>
            <span>{item.title}</span>
          </div>
        ))}
    </div>
  );
};

export default CheckboxGroup;
