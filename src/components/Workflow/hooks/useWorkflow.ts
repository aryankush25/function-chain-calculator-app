import { useState, useCallback, useRef, useEffect } from "react";
import type { Function } from "../types";
import { Connection, SVGDimensions } from "../types";
import { getConnectionPoint } from "@/utils/workflow";

const evaluateExpression = (expression: string, x: number): number => {
  try {
    let jsExpression = expression.replace(/x\^(\d+)/g, "x**$1");
    jsExpression = jsExpression.replace(/(\d)x/g, "$1*x");
    jsExpression = jsExpression.replace(/x/g, `${x}`);
    const mathFunction = new Function("return " + jsExpression);
    const result = mathFunction();
    return Number(result.toFixed(2));
  } catch (error) {
    console.error("Error evaluating expression:", error);
    return 0;
  }
};

const validateEquation = (
  equation: string
): { isValid: boolean; error?: string } => {
  if (!equation.trim()) {
    return { isValid: false, error: "Equation cannot be empty" };
  }

  const cleanEquation = equation.replace(/\s+/g, "");
  const validCharPattern = /^[0-9x+\-*/^.]+$/;

  if (!validCharPattern.test(cleanEquation)) {
    return {
      isValid: false,
      error: "Only numbers, x, and operators (+,-,*,/,^) are allowed",
    };
  }

  const invalidPatterns = [
    /\.\./, // Multiple decimal points
    /[+\-*/^]{2,}/, // Multiple operators in sequence
    /^\W/, // Equation starting with an operator (except minus)
    /[+*/^]$/, // Equation ending with an operator
    /\d+x\d+/, // Numbers on both sides of x (like 2x2)
  ];

  for (const pattern of invalidPatterns) {
    if (pattern.test(cleanEquation)) {
      return {
        isValid: false,
        error: "Invalid equation format",
      };
    }
  }

  try {
    evaluateExpression(cleanEquation, 1);
    return { isValid: true };
  } catch {
    return { isValid: false, error: "Invalid equation format" };
  }
};

export const useWorkflow = () => {
  const [functions, setFunctions] = useState<Function[]>([
    { id: 1, equation: "x^2", previousFunction: 0, nextFunction: 2 },
    { id: 2, equation: "2x+4", previousFunction: 1, nextFunction: 4 },
    { id: 3, equation: "x^2+20", previousFunction: 5, nextFunction: -1 },
    { id: 4, equation: "x-2", previousFunction: 2, nextFunction: 5 },
    { id: 5, equation: "x/2", previousFunction: 4, nextFunction: 3 },
  ]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [initialValue, setInitialValue] = useState(2);
  const [finalOutput, setFinalOutput] = useState(0);
  const [svgDimensions, setSvgDimensions] = useState<SVGDimensions>({
    width: 0,
    height: 0,
  });
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateDimensionsAndConnections = useCallback(() => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    setSvgDimensions({
      width: containerRect.width,
      height: containerRect.height,
    });

    const newConnections: Connection[] = [];
    const boxes = containerRef.current.getElementsByClassName("function-box");
    const initialValueEl = containerRef.current.querySelector(".initial-value");
    const finalOutputEl = containerRef.current.querySelector(".final-output");

    const initialConnections = functions.filter(
      (f) => f.previousFunction === 0
    );
    initialConnections.forEach((targetFunc) => {
      const targetBox = Array.from(boxes).find(
        (b) => parseInt(b.getAttribute("data-id") || "0") === targetFunc.id
      );

      if (initialValueEl && targetBox) {
        const startPoint = getConnectionPoint({
          element: initialValueEl,
          type: "output",
          containerRect,
        });
        const endPoint = getConnectionPoint({
          element: targetBox,
          type: "input",
          containerRect,
        });

        if (startPoint && endPoint) {
          newConnections.push({
            start: startPoint,
            end: endPoint,
            isTerminal: true,
          });
        }
      }
    });

    functions.forEach((sourceFunc) => {
      console.log("#### sourceFunc.id", sourceFunc.id);
      console.log("#### sourceFunc.nextFunction", sourceFunc.nextFunction);

      if (sourceFunc.nextFunction === undefined) return;

      const sourceBox = Array.from(boxes).find(
        (b) => parseInt(b.getAttribute("data-id") || "0") === sourceFunc.id
      );

      let targetElement: Element | null = null;

      if (sourceFunc.nextFunction === -1) {
        targetElement = finalOutputEl;
      } else {
        targetElement =
          Array.from(boxes).find(
            (b) =>
              parseInt(b.getAttribute("data-id") || "0") ===
              sourceFunc.nextFunction
          ) || null;
      }

      if (sourceBox && targetElement) {
        const startPoint = getConnectionPoint({
          element: sourceBox,
          type: "output",
          containerRect,
        });
        const endPoint = getConnectionPoint({
          element: targetElement,
          type: "input",
          containerRect,
        });

        console.log("startPoint", startPoint);
        console.log("endPoint", endPoint);

        if (startPoint && endPoint) {
          newConnections.push({
            start: startPoint,
            end: endPoint,
            isTerminal: sourceFunc.nextFunction === -1,
          });
        }
      }
    });

    setConnections(newConnections);
  }, [functions]);

  const calculateOutput = useCallback(() => {
    let currentValue = initialValue;
    let currentFunctionId: number | undefined = functions.find(
      (f) => f.previousFunction === 0
    )?.id;

    const hasErrors = functions.some((f) => f.equationError);
    if (hasErrors) {
      setFinalOutput(0);
      return;
    }

    while (currentFunctionId && currentFunctionId > 0) {
      const currentFunction = functions.find((f) => f.id === currentFunctionId);
      if (!currentFunction) break;

      currentValue = evaluateExpression(currentFunction.equation, currentValue);

      if (currentFunction.nextFunction === -1) {
        setFinalOutput(currentValue);
        break;
      }
      currentFunctionId = currentFunction.nextFunction;
    }
  }, [functions, initialValue]);

  const handleEquationChange = useCallback(
    (functionId: number, newEquation: string) => {
      setFunctions((prev) =>
        prev.map((f) => {
          if (f.id === functionId) {
            const validation = validateEquation(newEquation);
            return {
              ...f,
              equation: newEquation,
              equationError: validation.error,
            };
          }
          return f;
        })
      );
    },
    []
  );

  useEffect(() => {
    updateDimensionsAndConnections();
  }, [updateDimensionsAndConnections]);

  useEffect(() => {
    calculateOutput();
  }, [calculateOutput]);

  useEffect(() => {
    const handleResize = () => updateDimensionsAndConnections();
    window.addEventListener("resize", handleResize);

    const mutationObserver = new MutationObserver(() => {
      updateDimensionsAndConnections();
    });

    if (containerRef.current) {
      mutationObserver.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style", "class"],
      });
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      mutationObserver.disconnect();
    };
  }, [updateDimensionsAndConnections]);

  return {
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
  };
};
