// XText.tsx
import React, { useState, useRef, useEffect } from "react";
import { Html } from "react-konva-utils";
import type { TextConfig } from "konva/lib/shapes/Text";

interface XTextProps extends TextConfig {
  /**
   * Called when the text is changed (Enter pressed or blur).
   * Provides the new text string.
   */
  onChange?: (newText: string) => void;
}

const XText: React.FC<XTextProps> = ({
    scale = { x: 1, y: 1 },
  x = 0,
  y = 0,
  text = "",
  fontSize = 20,
  fontFamily = "Arial",
  fill = "black",
  width,
  onChange,
  ...restProps
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentText, setCurrentText] = useState(text);

  const inputRef = useRef<HTMLInputElement>(null);

  // When “text” prop changes from parent, keep it in sync if not editing.
  useEffect(() => {
    if (!isEditing) {
      setCurrentText(text);
    }
  }, [text, isEditing]);

  // When entering edit mode, focus the <input> and move cursor to end
  useEffect(() => {
    if (isEditing && inputRef.current) {
      const el = inputRef.current;
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }, [isEditing]);

  // Handler for when user presses a key inside <input>
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // Commit on Enter
      finishEditing();
    } else if (e.key === "Escape") {
      // Cancel edit on Escape: revert to last committed value
      setCurrentText(text);
      setIsEditing(false);
    }
  };

  // Called when input loses focus or Enter is pressed
  const finishEditing = () => {
    setIsEditing(false);
    if (onChange) {
      onChange(currentText);
    }
  };

  return (
    <>
      <Html
        transform
        
        groupProps={{ x, y }}
        divProps={{
          style: {
            pointerEvents: "auto",
            margin: 0,
            padding: 0,
            display: "inline",
          },
        }}
      >

        
          <input
            ref={inputRef}
            type="text"
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            onBlur={finishEditing}
            onKeyDown={handleKeyDown}
            style={{
                scale: 2.5,
              margin: 0,
              padding: 0,
              fontSize: `36px`,
                fontWeight: 700,
              fontFamily: fontFamily,
              color: fill as string,
              outline: "none",
              border: "1px solid #ccc",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              backgroundColor: "transparent",
              display: "inline",
            }}
            {...restProps}
          />
      </Html>
    </>
  );
};

export default XText;
