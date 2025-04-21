import { useCallback } from "react";
import { FabricObject } from "fabric";
import { useMockupEditor } from "@/contexts/MockupEditorContext";

export function useMockupLayers() {
  // Extract both state and actions from the context.
  const { state, actions } = useMockupEditor();
  const { editor } = state;
  const { addHistory } = actions;
  const canvas = editor.canvas;

  const getLayers = useCallback(() => {
    if (!canvas) return [];
    return canvas.getObjects();
  }, [canvas]);

  const addLayer = useCallback((object: FabricObject) => {
    if (!canvas) return;

    canvas.add(object);
    canvas.setActiveObject(object);
    canvas.renderAll();

    addHistory("ADD_LAYER", `Added ${object.get("type") || "object"}`);
  }, [canvas, addHistory]);

  const removeLayer = useCallback((object: FabricObject) => {
    if (!canvas) return;

    canvas.remove(object);
    canvas.renderAll();

    addHistory("REMOVE_LAYER", `Removed ${object.get("type") || "object"}`);
  }, [canvas, addHistory]);

  const moveLayer = useCallback((object: FabricObject, forward: boolean) => {
    if (!canvas) return;

    if (forward) {
      canvas.bringObjectForward(object);
    } else {
      canvas.sendObjectBackwards(object);
    }
    canvas.renderAll();
    addHistory("MOVE_LAYER", `Reordered ${object.get("type") || "object"}`);
  }, [canvas, addHistory]);

  const toggleLayerVisibility = useCallback((object: FabricObject) => {
    if (!canvas) return;

    const isVisible = object.visible;
    object.set("visible", !isVisible);
    canvas.renderAll();
    addHistory(
      "TOGGLE_LAYER_VISIBILITY",
      `${isVisible ? "Hidden" : "Shown"} ${object.get("type") || "object"}`
    );
  }, [canvas, addHistory]);

  const toggleLayerLock = useCallback((object: FabricObject) => {
    if (!canvas) return;

    const isLocked = object.lockMovementX && object.lockMovementY;
    object.set({
      lockMovementX: !isLocked,
      lockMovementY: !isLocked,
      lockRotation: !isLocked,
      lockScalingX: !isLocked,
      lockScalingY: !isLocked,
      hasControls: isLocked,
      selectable: isLocked,
    });
    canvas.renderAll();
    addHistory(
      "TOGGLE_LAYER_LOCK",
      `${isLocked ? "Unlocked" : "Locked"} ${object.get("type") || "object"}`
    );
  }, [canvas, addHistory]);

  return {
    getLayers,
    addLayer,
    removeLayer,
    moveLayer,
    toggleLayerVisibility,
    toggleLayerLock,
  };
}
