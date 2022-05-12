import React from "react";
import styles from "../styles/Form.module.css";

export type IconProps = {
  size: number;
  styles: string;
  tooltipwithtext?: string;
};

const ImageIcon = ({ size, styles, tooltipwithtext }: IconProps) => {
  return (
    <div className="relative flex flex-col items-center group">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={`${size}`}
        height={`${size}`}
        viewBox={`0 0 ${size} ${size}`}
        className={`${styles}`}
      >
        <path d="M.002 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2V3zm1 9v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12zm5-6.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0z" />
      </svg>
      {tooltipwithtext && (
        <div className="absolute bottom-0 hidden flex-col items-center mb-3 group-hover:flex">
          <span className="relative z-10 p-2 text-[10px] min-w-[80px] rounded-lg leading-none text-white whitespace-normal bg-black shadow-lg">
            {tooltipwithtext}
          </span>
          <div className="w-3 h-3 -mt-2 rotate-45 bg-black"></div>
        </div>
      )}
    </div>
  );
};

const ExclamationCircleIcons = ({
  size,
  styles,
  tooltipwithtext,
}: IconProps) => {
  return (
    <div className="relative flex flex-col items-center group">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={`${size}`}
        height={`${size}`}
        viewBox={`0 0 ${size} ${size}`}
        className={`${styles}`}
      >
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
        <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
      </svg>
      {tooltipwithtext && (
        <div className="absolute bottom-0 hidden flex-col items-center mb-3 group-hover:flex">
          <span className="relative z-10 p-2 text-[10px] min-w-[80px] rounded-lg leading-none text-white whitespace-normal bg-black shadow-lg">
            {tooltipwithtext}
          </span>
          <div className="w-3 h-3 -mt-2 rotate-45 bg-black"></div>
        </div>
      )}
    </div>
  );
};

const LoadingIcon = () => {
  return (
    <div
      className={[
        styles["loader"],
        "ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4",
      ].join(" ")}
    ></div>
  );
};

export { ExclamationCircleIcons, LoadingIcon, ImageIcon };
