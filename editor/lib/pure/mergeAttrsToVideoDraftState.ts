import { DComponent, DElementProps, DMediaProps, VideoDraftState, Selection } from "@/app/editor/_utils/zustand/konva/types";

export function mergeAttrsToVideoDraftState(
  set: (fn: (state: VideoDraftState) => void) => void,
  selection: Selection,
  attrs: Partial<DElementProps | DMediaProps>
): void {
  set((state) => {
    const selectedSceneId: string = selection.sceneId;

    if (!selectedSceneId) throw new Error(`No scene selected`);
    const component: DComponent = state.current.scenes[selectedSceneId].find(
      (c: DComponent) => c.componentId === selection.componentId
    ) as DComponent;

    if (!component) {
      throw new Error(
        `Component with id ${selection.componentId} not found in scene ${selectedSceneId}`
      );
    }

    switch (component.type) {
      case "element":
        if (!component.element || !component.element.attribute) {
          throw new Error(
            `Element component does not have element attribute`
          );
        }
        component.element.attribute = {
          ...component.element.attribute,
          ...attrs,
        };
        break;
      case "media":
          if (!component.media || !component.media.attribute) {
            throw new Error(
              `Media component does not have media attribute`
            );
          }
  
          component.media.attribute = {
            ...component.media.attribute,
            ...attrs,
          };
          break;
        
      case "avatar":
        if (!component.avatar || !component.avatar.attribute) {
          throw new Error(
            `Media component does not have media attribute`
          );
        }

        component.avatar.attribute = {
          ...component.avatar.attribute,
          ...attrs,
        };
        break;
      case "text":
        if (!component.text || !component.text.attribute) {
          throw new Error(
            `Text component does not have text attribute`
          );
        }
        component.text.attribute = {
          ...component.text.attribute,
          ...attrs,
        };
        break;
      default:
        throw new Error(
          `Unsupported component type for mergeAttributesV2: ${component.type}`
        );
    }
  });
}