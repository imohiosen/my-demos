import Konva from 'konva';
import { useEffect, useRef } from 'react';
import { Transformer } from 'react-konva';
type Props = {
  nodeIds: string[];
}

const XSelect = (props: Props) => {
  const ref = useRef<Konva.Transformer>(null)

  useEffect(() => {
    // This effect runs once when the component mounts
    // You can add any initialization logic here if needed
    if (ref.current) {
      // Example: Log the ref to see if it's correctly assigned
      console.log('Transformer ref:', ref.current);
      const stage = ref.current.getStage();


      const nodes = props.nodeIds
        .map(id => stage?.findOne(`#${id}`))
        .filter(node => node !== null);
      ref.current.nodes(nodes as Konva.Node[]);
      ref.current?.getLayer()?.batchDraw();
    }
  }, [props.nodeIds, ref]);

  return (
     <Transformer 
        ref={ref}
        anchorSize={8}
        rotateEnabled={true}
        enabledAnchors={[
          'top-left', 'top-right', 'bottom-left', 'bottom-right',
          'top-center', 'middle-left', 'middle-right', 'bottom-center'
        ]}
        boundBoxFunc={(oldBox, newBox) => {
          // Prevent resizing to negative dimensions
          if (newBox.width < 0 || newBox.height < 0) {
            return oldBox;
          }
          return newBox;
        }}
        visible={true}
      />
    )
}

export default XSelect