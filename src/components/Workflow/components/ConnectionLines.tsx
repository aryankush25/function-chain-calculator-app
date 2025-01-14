import React from "react";
import { Connection, SVGDimensions } from "../types";
import { COLORS, FUNCTION_DEFAULTS } from "@/constants/workflow";
import { createPath } from "@/utils/workflow";

interface ConnectionLinesProps {
  connections: Connection[];
  dimensions: SVGDimensions;
}

export const ConnectionLines: React.FC<ConnectionLinesProps> = ({
  connections,
  dimensions,
}) => {
  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={dimensions.width}
      height={dimensions.height}
      style={{ zIndex: 50 }}
    >
      {connections.map((conn, index) => (
        <path
          key={index}
          d={createPath(conn.start, conn.end, conn.isTerminal)}
          fill="none"
          stroke={COLORS.CONNECTION}
          strokeOpacity={FUNCTION_DEFAULTS.CONNECTION_OPACITY}
          strokeWidth={FUNCTION_DEFAULTS.CONNECTION_WIDTH}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
};
