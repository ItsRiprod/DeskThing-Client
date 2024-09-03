import { CSSProperties, memo, useEffect, useRef, useState } from 'react';

export type Props = {
  textContent: string;
  textSizesDescending: string[];
  className?: string;
  fades?: boolean
};

interface ScrollingTextProps {
  text: string;
  className?: string;
  fades?: boolean
}

const AutoSizingText = memo(
  ({
  textContent,
  textSizesDescending,
  className = '',
  fades = true
}: Props): JSX.Element => {

  return (
    <div className="w-full h-full">
      <ScrollingText fades={fades} text={textContent} className={textSizesDescending[0] + ' ' + className} />
    </div>
  );
}
)

export default AutoSizingText;

export function ScrollingText({ text, className = '', fades = true }: ScrollingTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const dupeTextRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [animationDuration, setAnimationDuration] = useState(0);
  const [textWidth, setTextWidth] = useState(0);

  const calculateOverflow = () => {
    const container = containerRef.current;
    const textElement = textRef.current;
    const dupe = dupeTextRef.current;

    if (container && textElement) {
      let isTextOverflowing;
      let len;

      if (dupe !== null) {
        isTextOverflowing = textElement.scrollWidth / 2 > container.offsetWidth;
        len = textElement.scrollWidth / 2;
      } else {
        isTextOverflowing = textElement.scrollWidth > container.offsetWidth;
        len = textElement.scrollWidth;
      }

      setIsOverflowing(isTextOverflowing);

      if (isTextOverflowing) {
        const duration = len / 30; // Adjust speed here
        setAnimationDuration(duration);
        setTextWidth(len);
      }
    }
  };

  useEffect(() => {
    calculateOverflow();
  }, [text]);

  useEffect(() => {
    window.addEventListener('resize', calculateOverflow);
    return () => window.removeEventListener('resize', calculateOverflow);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className} `}
    >
      {fades && (<>
            <div
            className={`${
              isOverflowing ? 'opacity-100' : 'opacity-0'
            } absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black to-transparent z-10 transition-all duration-500`}
            />
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black to-transparent z-10" />
          </>
        )
      }
      <div
        ref={textRef}
        className={`whitespace-nowrap ${
          isOverflowing ? 'animate-scroll-text' : ''
        }`}
        style={
          {
            animationDuration: isOverflowing ? `${animationDuration}s` : '0s',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            // the 0.5rem here is based off half the padding in the span below
            // (padding of value 4 is 1rem)
            '--text-width': `calc(${textWidth}px + 0.5rem)`,
          } as CSSProperties
        }
      >
        <span className="pr-4">{text}</span>
        {isOverflowing && <span ref={dupeTextRef}>{text}</span>}
      </div>
    </div>
  );
}
