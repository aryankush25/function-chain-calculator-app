import React from "react";

interface FinalOutputProps {
  value: number;
}

export const FinalOutput: React.FC<FinalOutputProps> = ({ value }) => {
  return (
    <div className="flex flex-col items-center gap-2 mb-[174px] final-output">
      <span className="bg-[#4CAF79] px-4 py-2 rounded-3xl font-semibold text-white text-xs whitespace-nowrap">
        Final Output y
      </span>
      <div className="relative flex items-center gap-4 border-[#4CAF79] border-2 bg-white shadow-md rounded-2xl">
        <div className="border-[#4CAF79] border-r w-10 h-12">
          <div className="top-1/2 left-3 absolute flex bg-blue-500 rounded-full w-2 h-2 -translate-y-1/2 input-point outline outline-[#DBDBDB] outline-2 outline-offset-2" />
        </div>
        <span className="pr-4 min-w-[60px] font-bold text-2xl text-gray-800">
          {value}
        </span>
      </div>
    </div>
  );
};
