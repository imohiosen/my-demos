import { DTextProps } from '@/app/editor/_utils/zustand/konva/types';
import Konva from 'konva';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Rect, Text, Transformer } from 'react-konva';
import { Html } from 'react-konva-utils';

// Fix text rendering in Konva
Konva._fixTextRendering = true;

const TextEditor = (props: DTextProps) => {
  return <Rect 
    x={0}
    y={0}
    width={ 200}
    height={ 50}
    fill="red"
    stroke="black"
    strokeWidth={1}
  />;
  console.log('TextEditor rendered:', props.text);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const textPosition = textNode.position();
    const areaPosition = {
      x: textPosition.x,
      y: textPosition.y,
    };

    // Match styles with the text node
    textarea.value = textNode.text();
    textarea.style.position = 'absolute';
    textarea.style.top = `${areaPosition.y}px`;
    textarea.style.left = `${areaPosition.x}px`;
    textarea.style.width = `${textNode.width() - (textNode.padding() || 0) * 2}px`;
    textarea.style.height = `${textNode.height() - (textNode.padding() || 0) * 2 + 5}px`;
    textarea.style.fontSize = `${textNode.fontSize() || 16}px`;
    textarea.style.border = 'none';
    textarea.style.padding = '0px';
    textarea.style.margin = '0px';
    textarea.style.overflow = 'hidden';
    textarea.style.background = 'none';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.lineHeight = `${textNode.lineHeight() || 1}`;
    textarea.style.fontFamily = textNode.fontFamily() || 'Arial';
    textarea.style.transformOrigin = 'left top';
    textarea.style.textAlign = textNode.align() || 'left';
    const fillValue = textNode.fill();
    textarea.style.color = typeof fillValue === 'string' ? fillValue : 'black';

    const rotation = textNode.rotation();
    let transform = '';
    if (rotation) {
      transform += `rotateZ(${rotation}deg)`;
    }
    textarea.style.transform = transform;

    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight + 3}px`;

    textarea.focus();

    const handleOutsideClick = (e: MouseEvent) => {
      if (e.target !== textarea) {
        onChange(textarea.value);
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onChange(textarea.value);
        onClose();
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleInput = () => {
      const scale = textNode.getAbsoluteScale().x;
      textarea.style.width = `${textNode.width() * scale}px`;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight + (textNode.fontSize() || 16)}px`;
    };

    textarea.addEventListener('keydown', handleKeyDown);
    textarea.addEventListener('input', handleInput);
    setTimeout(() => {
      window.addEventListener('click', handleOutsideClick);
    });

    return () => {
      textarea.removeEventListener('keydown', handleKeyDown);
      textarea.removeEventListener('input', handleInput);
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [textNode, onChange, onClose]);
  return (
    <Html>
      <textarea
        ref={textareaRef}
        style={{
          minHeight: '1em',
          position: 'absolute',
        }}
        value={value} // Ensure textarea has initial text
      />
    </Html>
  );
};

const XText = (props: DTextProps) => { // don't change this line
  const [isEditing, setIsEditing] = useState(false);
  const [textWidth, setTextWidth] = useState(props.width || 200);
  const [currentText, setCurrentText] = useState(props.text || 'Text');


  const handleTextDblClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleTextChange = useCallback((newText: string) => {
    setCurrentText(newText);
  }, []);

  return (
    <>
      <Text
        text={currentText}
        draggable
        width={textWidth}
        onDblClick={handleTextDblClick}
        onDblTap={handleTextDblClick}
        visible={!isEditing}
        fontSize={props.fontSize || 16}
        fontFamily={props.fontFamily || 'Arial'}
        fill={props.fill || 'black'}
        align={props.align || 'left'}
        {...props}
      />
      {isEditing && (
        <TextEditor
          {...props}
        />
      )}
    </>
  );
};

export default XText;