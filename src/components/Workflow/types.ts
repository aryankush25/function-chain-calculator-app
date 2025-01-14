export interface Function {
  id: number;
  equation: string;
  nextFunction?: number;
  previousFunction?: number;
  equationError?: string;
}

export interface Connection {
  start: { x: number; y: number };
  end: { x: number; y: number };
  isTerminal?: boolean;
}

export interface SVGDimensions {
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface ConnectionPoint {
  element: Element;
  type: "input" | "output";
  containerRect: DOMRect;
}
