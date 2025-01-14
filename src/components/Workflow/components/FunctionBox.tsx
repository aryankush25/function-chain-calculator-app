import React from "react";
import SixDots from "@/assets/icons/SixDots";
import { Function } from "../types";
import { CustomDropdown } from "./CustomDropdown";

interface FunctionBoxProps {
  func: Function;
  onEquationChange: (functionId: number, newEquation: string) => void;
  openDropdownId: number | null;
  setOpenDropdownId: (id: number | null) => void;
  functions: Function[];
}

export const FunctionBox: React.FC<FunctionBoxProps> = ({
  func,
  onEquationChange,
  openDropdownId,
  setOpenDropdownId,
  functions,
}) => {
  return (
    <div
      data-id={func.id}
      className="relative border-[#D3D3D3] bg-white px-5 py-4 border rounded-[15px] w-[250px] function-box"
      style={{
        position: "relative",
        zIndex: openDropdownId === func.id ? 9999 : 1,
      }}
    >
      <div className="flex items-center gap-2 mb-4 font-semibold text-[#A5A5A5] text-sm">
        <SixDots />
        Function: {func.id}
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700 text-xs">Equation</label>
          <input
            aria-label="equation"
            type="text"
            value={func.equation}
            onChange={(e) => onEquationChange(func.id, e.target.value)}
            className={`border-[#D3D3D3] p-2 border rounded-lg w-full font-medium text-xs
              ${func.equationError ? "border-red-500" : ""}`}
          />
          {func.equationError && (
            <span className="mt-1 text-red-500 text-xs">
              {func.equationError}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700 text-xs">
            Next function
          </label>
          <CustomDropdown
            functionId={func.id}
            currentValue={func.nextFunction}
            onSelect={() => {}}
            openDropdownId={openDropdownId}
            setOpenDropdownId={setOpenDropdownId}
            functions={functions}
          />
        </div>
      </div>
      <div className="relative mt-11 h-5">
        <div className="top-1/2 -left-1.5 absolute flex bg-blue-500 rounded-full w-2 h-2 -translate-y-1/2 input-point outline outline-[#DBDBDB] outline-2 outline-offset-2">
          <p className="font-medium text-gray-700 text-xs -translate-y-1/2 translate-x-4">
            input
          </p>
        </div>

        <div className="top-1/2 -right-1.5 absolute flex bg-blue-500 rounded-full w-2 h-2 -translate-y-1/2 outline outline-[#DBDBDB] outline-2 outline-offset-2 output-point">
          <p className="font-medium text-gray-700 text-xs -translate-x-[46px] -translate-y-1/2">
            output
          </p>
        </div>
      </div>
    </div>
  );
};
