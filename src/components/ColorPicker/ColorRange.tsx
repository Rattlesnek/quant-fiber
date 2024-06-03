import React, {
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { getRelativePosition, isTouch, preventDefaultMove } from "./utils";

interface ColorRangeProps {}

type ColorStep = {
  id: string;
  color: string;
  ratio: number;
};

export const ColorRange: React.FC<ColorRangeProps> = () => {
  const [selectedColorStepId, setSelectedColorStepId] = useState<string>();
  const [colorSteps, setColorSteps] = useState<Array<ColorStep>>([
    { id: "1", color: "red", ratio: 0 },
    { id: "2", color: "blue", ratio: 0.3 },
    { id: "3", color: "green", ratio: 0.6 },
    { id: "4", color: "yellow", ratio: 1 },
  ]);

  const getLinearGradient = (colorSteps: Array<ColorStep>): string => {
    const colorStepsSorted = colorSteps
      .map((c) => c)
      .sort((a, b) => a.ratio - b.ratio);

    const args = colorStepsSorted
      .map(({ color, ratio }) => `${color} ${ratio * 100}%`)
      .join(",");

    return `linear-gradient(to right, ${args})`;
  };

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: 500,
        height: 100,
        background: getLinearGradient(colorSteps),
      }}
    >
      {colorSteps.map((colorStep, index) => {
        return (
          <ColorRangePointer
            key={colorStep.id}
            containerRef={containerRef}
            isSelected={selectedColorStepId === colorStep.id}
            onSelect={() => setSelectedColorStepId(colorStep.id)}
            initRelativePositionX={colorStep.ratio}
            onMove={(ratio) =>
              setColorSteps((prev) => {
                prev[index] = { ...colorStep, ratio: ratio };
                return [...prev];
              })
            }
          />
        );
      })}
    </div>
  );
};

interface ColorRangePointerProps {
  containerRef: RefObject<HTMLDivElement>;
  isSelected: boolean;
  onSelect: () => void;
  initRelativePositionX: number;
  onMove: (relativePositionX: number) => void;
}

export const ColorRangePointer: React.FC<ColorRangePointerProps> = ({
  containerRef,
  isSelected,
  onSelect,
  initRelativePositionX,
  onMove,
}) => {
  const hasTouched = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [positionX, setPositionX] = useState(0);

  useLayoutEffect(() => {
    const { width } = containerRef.current?.getBoundingClientRect() ?? {};
    setPositionX(initRelativePositionX * (width ?? 0));
  }, []);

  // Prevent mobile browsers from handling mouse events (conflicting with touch ones).
  // If we detected a touch interaction before, we prefer reacting to touch events only.
  const isValid = (event: MouseEvent | TouchEvent): boolean => {
    if (hasTouched.current && !isTouch(event)) return false;
    hasTouched.current = isTouch(event);
    return true;
  };

  const handleMove = useCallback((event: MouseEvent | TouchEvent) => {
    preventDefaultMove(event);
    // If user moves the pointer outside of the window or iframe bounds and release it there,
    // `mouseup`/`touchend` won't be fired. In order to stop the picker from following the cursor
    // after the user has moved the mouse/finger back to the document, we check `event.buttons`
    // and `event.touches`. It allows us to detect that the user is just moving his pointer
    // without pressing it down
    const isDown = isTouch(event)
      ? event.touches.length > 0
      : event.buttons > 0;

    if (isDown && containerRef.current) {
      const relativePosition = getRelativePosition(containerRef.current, event);

      onMove(relativePosition.left);
      setPositionX(relativePosition.left * relativePosition.width);
    } else {
      setIsDragging(false);
    }
  }, []);

  const handleMoveStart = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      onSelect();

      preventDefaultMove(event.nativeEvent);
      if (!isValid(event.nativeEvent)) return;

      setIsDragging(true);
    },
    []
  );

  const handleMoveEnd = useCallback(() => setIsDragging(false), []);

  const toggleDocumentEvents = useCallback((state: boolean) => {
    const toggleEvent = state
      ? window.addEventListener
      : window.removeEventListener;
    toggleEvent(hasTouched.current ? "touchmove" : "mousemove", handleMove);
    toggleEvent(hasTouched.current ? "touchend" : "mouseup", handleMoveEnd);
  }, []);

  useEffect(() => {
    toggleDocumentEvents(isDragging);
    return () => {
      isDragging && toggleDocumentEvents(false);
    };
  }, [isDragging, toggleDocumentEvents]);

  return (
    <div
      style={{ position: "absolute", width: 20, top: 0, left: -10 + positionX }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 0,
          padding: 0,
          paddingBottom: "100%",
        }}
      >
        <svg
          height="500"
          width="500"
          viewBox="100 100 300 300"
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            left: 0,
            top: 0,
          }}
        >
          <defs>
            <polygon id="triangle" points="100,100 250,400 400,100" />

            <clipPath id="insideTriangleOnly">
              <use xlinkHref="#triangle" />
            </clipPath>
          </defs>

          <use
            xlinkHref="#triangle"
            strokeWidth="50"
            stroke="black"
            fill={isSelected ? "black" : "transparent"}
            clipPath="url(#insideTriangleOnly)"
            onMouseDown={handleMoveStart}
            onTouchStart={handleMoveStart}
          />
        </svg>
      </div>
    </div>
  );
};
