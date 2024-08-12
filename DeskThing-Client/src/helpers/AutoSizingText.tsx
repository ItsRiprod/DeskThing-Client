import { useEffect, useRef, useState } from 'react';

export type Props = {
  textContent: string;
  textSizesDescending: string[];
};

const AutoSizingText = ({
  textContent,
  textSizesDescending,
}: Props): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const [textSizeIndex, setTextSizeIndex] = useState(0);

  useEffect(() => {
    const adjustTextSize = (index: number) => {
      const preRenderDiv = ref.current;
      const parentDiv = parentRef.current;
      console.log('Setting the sizes', preRenderDiv.offsetWidth, parentDiv.offsetWidth, textSizesDescending[index], textSizeIndex)
      setTextSizeIndex(index)
      if (preRenderDiv && parentDiv) {
        // Check if the text is too large for the parent container
        if (preRenderDiv.offsetWidth > parentDiv.offsetWidth && index + 1 < textSizesDescending.length) {
          // Move to the next smaller size
          setTextSizeIndex(index + 1);
        }
      }
    };

    adjustTextSize(textSizeIndex);
  }, [textContent, textSizesDescending, textSizeIndex]);

  // Reset text size index if text content changes
  useEffect(() => {
    setTextSizeIndex(0);
  }, [textContent]);

  return (
    <div ref={parentRef} className="w-full">
      <div
        className={textSizesDescending[textSizeIndex] + ' w-fit'}
        ref={ref}
      >
        <p>
          {textContent}
        </p>
      </div>
    </div>
  );
};

export default AutoSizingText;
