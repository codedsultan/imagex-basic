import { Canvas, FabricObject, FabricObject as FabricBaseObject,Shadow,FabricImage, Rect} from "fabric";
import { DesignElement, DesignTab, Mockup, MockupColor, MockupPrintAreas, MockupTemplate, Template } from "./mockup";
// Derive the type of the filters property from a fabric.Image instance
type FabricImageFilters = InstanceType<typeof FabricImage>['filters'];
export type EditorTemplateType = "mockup" | "design" | "packaging";

export interface EditorTemplate {
  id: string;
  name: string;
  type: EditorTemplateType;
  layers: string;
  configuration: string;
  width?: number;
  height?: number;
  thumbnail?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EditorLayer extends FabricObject {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  locked: boolean;
}

export interface MockupEditorLayer
    extends Omit<FabricObject, 'opacity' | 'width' | 'height' | 'angle' | 'shadow'> {
    // Required Properties
    id: string;
    name: string;
    type: 'text' | 'image' | 'shape' | 'path' | 'background' | 'group';
    visible: boolean;
    locked: boolean;
    zIndex: number;

    // Fabric-Compatible Properties (redefined with optional modifiers)
    width?: number;
    height?: number;
    opacity?: number;
    angle?: number;  // Use Fabric's standard rotation property name

    // Extended Features
    blendMode?: GlobalCompositeOperation;
    isGroup?: boolean;
    metadata?: Record<string, unknown>;
    clipPath?: FabricObject;  // For clipping boundaries
    shadow?: Shadow | null;
    filters?: FabricImageFilters[];

}

export interface DesignEditorLayer
  extends Omit<FabricObject, 'opacity' | 'width' | 'height' | 'angle' | 'shadow'> {
  // Required Properties
  id: string;
  name: string;
  type: 'text' | 'image' | 'shape' | 'path' | 'background' | 'group';
  visible: boolean;
  locked: boolean;
  zIndex: number;

  // Fabric-Compatible Properties (redefined with optional modifiers)
  width?: number;
  height?: number;
  opacity?: number;
  angle?: number;  // Use Fabric's standard rotation property name

  // Extended Features
  blendMode?: GlobalCompositeOperation;
  isGroup?: boolean;
  metadata?: Record<string, unknown>;
  clipPath?: FabricObject;  // For clipping boundaries
  shadow?: Shadow | null;
  filters?: FabricImageFilters[];
}



export interface HistoryAction {
  id: string;
  timestamp: number;
  state: string; // JSON representation
  description: string;
}

export interface CanvasOptions {
  width: number;
  height: number;
  backgroundColor?: string;
  preserveObjectStacking?: boolean;
}

// export interface CanvasOptions {
//     width: number;
//     height: number;
//     backgroundColor?: string;
//     preserveObjectStacking?: boolean;
// }
// export interface EditorState {
//   template: EditorTemplate;
// //   config: any;
//   canvas: Canvas | null;
//   selectedObject: FabricBaseObject | null;
//   history: HistoryAction[];
//   historyIndex: number;
//   isModified: boolean;
//   isAutoSaving: boolean;
//   zoom: number;
//   loading: boolean;
//   error: string | null;
// }

// Base interface for shared properties
export interface BaseEditorState {
    canvas: Canvas | null;
    isModified?: boolean; // Optional if not all states need it
    loading?: boolean;
    error?: string | null;
  }

  // Specialized interfaces
  export interface MockupEditorState extends BaseEditorState {
    // template: EditorTemplate;
    viewMode: 'design' | 'preview' ;
    orientation: 'front' | 'back'; //'front' | 'back' | 'left' | 'right' | '3d'

    // template: Template;
    template: Partial<MockupTemplate>;
    mockup: Partial<Mockup>//Mockup;
    printAreas: MockupPrintAreas;
    printAreaGuides: Rect[];
    showGuides: boolean;
    gridSnapping: boolean;
    layers: MockupEditorLayer[];
    selectedObject: FabricBaseObject | null;
    history: HistoryAction[];
    historyIndex: number;
    isAutoSaving: boolean;
    zoom: number;
    // template: Template;
    activeTab: DesignTab;
    selectedColor: MockupColor;
    designElements: DesignElement[];
    selectedElementId: string | null;
    // viewMode: 'front' | 'back' | 'side';
    price: string;
    profit: string;
  }

  export interface DesignEditorState extends BaseEditorState {
    showGuides: boolean;
    gridSnapping: boolean;
    layers: DesignEditorLayer[];
    selectedObject: FabricBaseObject | null;
    history: HistoryAction[];
    historyIndex: number;
    isAutoSaving: boolean;
    zoom: number;
  }

  export interface EditorState extends BaseEditorState {
    template: EditorTemplate;
    selectedObject: FabricBaseObject | null;
    history: HistoryAction[];
    historyIndex: number;
    isAutoSaving: boolean;
    zoom: number;
  }

export interface EditorContextType {
  state: EditorState;
  setTemplate: (template: EditorTemplate) => void;
  setCanvas: (canvas: Canvas | null) => void;
  setSelectedObject: (object: FabricBaseObject | null) => void;
  addHistoryAction: (description: string) => void;
  undo: () => void;
  redo: () => void;
  setAutoSaving: (isAutoSaving: boolean) => void;
  setZoom: (zoom: number) => void;
  saveTemplate: () => Promise<void>;
  loadTemplate: (templateId: string) => Promise<void>;
}

export interface DesignEditorContextType {
    state: EditorState;
    setCanvas: (canvas: Canvas | null) => void;
    // setSelectedObject: (object: FabricBaseObject | null) => void;
    // addHistoryAction: (description: string) => void;
    // undo: () => void;
    // redo: () => void;
    // setAutoSaving: (isAutoSaving: boolean) => void;
    // setZoom: (zoom: number) => void;
    // saveTemplate: () => Promise<void>;
    // loadTemplate: (templateId: string) => Promise<void>;
  }
export interface PrintArea {
    id: string;
    name: string;
    view: "front" | "back";
    left: number;
    top: number;
    width: number;
    height: number;
    x:number;
    y:number;
  }

// export interface MockupEditorState {
//     canvas: Canvas | null;
//     printAreas: PrintArea[];
// }

// export interface DesignEditorState {
//     canvas: Canvas | null;
//     showGuides: boolean;
//     gridSnapping: boolean;
// }
