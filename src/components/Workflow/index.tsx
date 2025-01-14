import React from "react";
import Image from "next/image";
import background from "@/assets/background/pattern.png";
import { InitialValue } from "./components/InitialValue";
import { FinalOutput } from "./components/FinalOutput";
import { FunctionBox } from "./components/FunctionBox";
import { ConnectionLines } from "./components/ConnectionLines";
import { useWorkflow } from "./hooks/useWorkflow";

export default function Workflow() {
  const {
    functions,
    connections,
    initialValue,
    finalOutput,
    svgDimensions,
    openDropdownId,
    containerRef,
    setInitialValue,
    setOpenDropdownId,
    handleEquationChange,
  } = useWorkflow();

  return (
    <div
      className="relative flex justify-center items-center gap-8 bg-gray-50 mx-auto p-8 max-w-screen-2xl min-h-screen"
      ref={containerRef}
    >
      <div className="top-0 left-0 fixed bg-gray-50 w-full h-full">
        <Image
          src={background}
          alt="Background"
          layout="fill"
          objectFit="cover"
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center gap-8 w-full">
        {/* Initial Value */}
        <InitialValue value={initialValue} onChange={setInitialValue} />

        <div className="flex flex-wrap justify-center items-center gap-x-40 gap-y-20">
          {functions.map((func) => (
            <FunctionBox
              key={func.id}
              func={func}
              onEquationChange={handleEquationChange}
              openDropdownId={openDropdownId}
              setOpenDropdownId={setOpenDropdownId}
              functions={functions}
            />
          ))}
        </div>

        {/* Final Output */}
        <FinalOutput value={finalOutput} />
      </div>

      {/* SVG Layer */}
      <ConnectionLines connections={connections} dimensions={svgDimensions} />
    </div>
  );
}
