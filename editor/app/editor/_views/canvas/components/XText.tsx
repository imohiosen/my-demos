import { useCanvasEditorStore } from "@/app/editor/_utils/zustand/konva/canvasEditorImpl";
import { DTextProps } from "@/app/editor/_utils/zustand/konva/types";
import Konva from "konva";
import { useEffect, useRef, useState, useCallback } from "react";
import { Rect, Text, Transformer } from "react-konva";
import { Html } from "react-konva-utils";

// Fix text rendering in Konva
Konva._fixTextRendering = true;

const TextEditor = (
  props: DTextProps & {
    onChange: (text: string) => void;
    onClose: () => void;
    notifyWidthChange?: (width: number) => void;
  }
) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;

    const handleOutsideClick = (e: MouseEvent) => {
      console.log("handleOutsideClick", e.target, textarea);
      if (e.target !== textarea) {
        props.onChange(textarea.value);
        props.onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      console.log("handleKeyDown", e.key, e.shiftKey);
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        console.log("Enter pressed, saving text");
        props.onChange(textarea.value);
        props.onClose();
      }
      if (e.key === "Escape") {
        props.onClose();
      }
    };

    // const handleInput = () => {
    //   console.log("handleInput", textarea.value);
    //    const scale = textNode.getAbsoluteScale().x;
    //    textarea.style.width = `${textNode.width() * scale}px`;
    //    textarea.style.height = "auto";
    //    textarea.style.height = `${
    //      textarea.scrollHeight + (textNode.fontSize() || 16)
    //    }px`;
    // };

    textarea.addEventListener("keydown", handleKeyDown);
    // textarea.addEventListener("input", handleInput);
    setTimeout(() => {
      window.addEventListener("click", handleOutsideClick);
    }, 0);

    return () => {
      textarea.removeEventListener("keydown", handleKeyDown);
      // textarea.removeEventListener("input", handleInput);
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [props]);

  return (
    <Html>
      <textarea
        ref={textareaRef}
        style={{
          minHeight: "1em",
          position: "absolute",
          color: props.fill || "red",
          top: props.y,
          left: props.x,
          width: props.width,
          height: props.height,
          fontSize: props.fontSize,
          fontFamily: props.fontFamily,
          lineHeight: props.lineHeight,
          letterSpacing: props.letterSpacing,
          padding: props.padding,
          margin: 0,
          overflow: "hidden",
          background: "none",
          border: "none",
          outline: "none",
          resize: "none",
          transformOrigin: "left top",
          textAlign: props.align,
          transform: `scale(${props.scaleX || props.scale.x}, ${
            props.scaleY || props.scale.y
          }) rotateZ(${props.rotation}deg)`,
          opacity: props.opacity,
        }}
        defaultValue={props.text}
        onChange={(e) => {
          props.onChange(e.target.value);
        }}
      />
    </Html>
  );
};

const XText$ = (
  props: DTextProps 
) => {
  const [isEditing, setIsEditing] = useState(false);
  const [textWidth, setTextWidth] = useState(props.width || 200);
  const mergeAttributesV2 = useCanvasEditorStore((state) => state.mergeAttributesV2);

  const handleTextDblClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const onChange = (newProps: DTextProps) => {
    mergeAttributesV2({
        componentId: props.componentId,
        sceneId: props.sceneId,
      }, newProps
    );
  };

  return (
    <>
      <Text
        draggable
        {...props}
        width={textWidth}
        visible={!isEditing}
        onDblClick={handleTextDblClick}
        onDblTap={handleTextDblClick}
      />
      {isEditing && (
        <TextEditor
          {...props}
          onChange={(text: string) => {
            onChange({
              ...props,
              text,
            });
          }}
          onClose={() => setIsEditing(false)}
          notifyWidthChange={(width: number) => {
            setTextWidth(width);
            onChange({
              ...props,
              width,
            });
          }}
        />
      )}
    </>
  );
};

export default XText$;
