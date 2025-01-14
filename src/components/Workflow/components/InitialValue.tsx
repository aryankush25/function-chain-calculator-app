import React from "react";

interface InitialValueProps {
  value: number;
  onChange: (value: number) => void;
}

export const InitialValue: React.FC<InitialValueProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-col items-center gap-2 mb-[174px] initial-value">
      <span className="bg-[#F5A524] px-4 py-2 rounded-3xl font-semibold text-white text-xs whitespace-nowrap">
        Initial value of x
      </span>
      <div className="relative flex items-center gap-4 border-[#F5A524] border-2 bg-white shadow-md rounded-2xl">
        <input
          aria-label="num"
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="pl-4 max-w-[60px] font-bold text-2xl text-gray-800 outline-none"
        />
        <div className="border-[#F5A524] border-l w-10 h-12">
          <div className="top-1/2 right-4 absolute flex bg-blue-500 rounded-full w-2 h-2 -translate-y-1/2 outline outline-[#DBDBDB] outline-2 outline-offset-2 output-point" />
        </div>
      </div>
    </div>
  );
};
