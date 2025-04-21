// frontend/user/src/types/mockup.ts
import { FabricObject } from 'fabric';
import { z } from 'zod';
// export interface Mockup {
//     id: number;
//     title: string;
//     base_image_url: string;
//     preview_url: string;
//     layers: MockupLayer[];
// }
export type MockupFabricCanvasData = {
    version: string;
    objects: FabricObject[];
    background: string;
  };
export  type MockupJsonDataType = {
    front?: MockupFabricCanvasData;
    back?: MockupFabricCanvasData;
    [key: string]: any; // Allow additional unknown properties
  };
export type MockupStatus = 'draft' | 'completed';
export type PrintAreaPosition = 'front' | 'back' |'leftSleeve' | 'rightSleeve';

export interface Mockup {
    id: number;
    name: string;
    slug: string;
    user_id: number;
    design_id: number | null;
    template_id: number | null;
    status: 'draft' | 'completed';
    type: string; // Default is 't-shirt'
    layer_configurations: any | null;
    json_data: any | null;
    print_areas: any | null;
    front_canvas_state: any | null;
    back_canvas_state: any | null;
    metadata: any | null;
    current_view: 'front' | 'back';
    thumbnail: string;
    created_at: string;
    updated_at: string;
  }

export interface MockupConfig {
    /**
     * Array of design layers applied to the mockup
     */
    layers: MockupLayer[];

    /**
     * Reference to the product template being used
     */
    productId: string;

    /**
     * Reference to the design being applied
     */
    designId: string;

    /**
     * Global transformation settings
     */
    transform?: {
      scale?: number;
      rotation?: number;
      flipX?: boolean;
      flipY?: boolean;
      opacity: number;
    };

    /**
     * Canvas rendering settings
     */
    canvas?: {
      width: number;
      height: number;
      backgroundColor?: string;
      resolution?: number;
    };

    /**
     * Configuration version for schema validation
     */
    version: string;
  }

  export interface MockupLayer {
    /**
     * Unique identifier for the layer
     */
    id: string;

    /**
     * Layer type (image/text/pattern)
     */
    type: 'image' | 'text' | 'pattern';

    /**
     * Position coordinates
     */
    position: {
      x: number;
      y: number;
      zIndex: number;
    };

    /**
     * Layer dimensions
     */
    size?: {
      width?: number;
      height?: number;
      lockAspectRatio?: boolean;
    };

    /**
     * Rotation in degrees
     */
    rotation?: number;

    /**
     * Opacity (0-1)
     */
    opacity?: number;

    /**
     * Layer-specific content
     */
    content?: LayerContent;
  }

  export type LayerContent = ImageLayerContent | TextLayerContent | PatternLayerContent;

  export interface ImageLayerContent {
    type: 'image';
    src: string;
    filters?: {
      brightness?: number;
      contrast?: number;
      saturation?: number;
    };
  }

  export interface TextLayerContent {
    type: 'text';
    text: string;
    font: {
      family: string;
      size: number;
      color: string;
      weight?: number;
      style?: 'normal' | 'italic';
      decoration?: 'underline' | 'line-through' | 'none';
    };
    alignment?: 'left' | 'center' | 'right';
  }

  export interface PatternLayerContent {
    type: 'pattern';
    patternType: 'stripes' | 'dots' | 'custom';
    color: string;
    spacing: number;
    size: number;
  }

  // Optional: Zod validation schema
  export const mockupConfigSchema = z.object({
    // ... Zod validation rules matching the interface
  });

  // frontend/user/src/types/mockup.ts

// export const mockupConfigSchema = z.object({
//   productId: z.string().uuid(),
//   designId: z.string().uuid(),
//   version: z.string().default('1.0.0'),
//   layers: z.array(
//     z.discriminatedUnion('type', [
//       z.object({
//         type: z.literal('image'),
//         src: z.string().url(),
//         filters: z.object({
//           brightness: z.number().min(0).max(1).optional(),
//           contrast: z.number().min(0).max(2).optional(),
//           saturation: z.number().min(0).max(2).optional()
//         }).optional()
//       }),
//       z.object({
//         type: z.literal('text'),
//         text: z.string(),
//         font: z.object({
//           family: z.string(),
//           size: z.number().positive(),
//           color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
//         })
//       })
//     ])
//   ),
//   canvas: z.object({
//     width: z.number().positive(),
//     height: z.number().positive(),
//     backgroundColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
//     resolution: z.number().positive().default(300)
//   })
// });

// export type MockupConfig = z.infer<typeof mockupConfigSchema>;

// Define the types used in the mockup editor

export type DesignTab = 'DESIGN' | 'STYLES' | 'LAUNCH';

export interface Position {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface TextStyle {

  fontSize?: number;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
  backgroundColor?: string;
  fontFamily?: string;
}

export interface MockupColor {
  id: string;
  name: string;
  hex: string;
}

export interface DesignElement {
  id: string;
  type: 'text' | 'image' | 'shape';
  content: string;
  position: Position;
  dimensions: Dimensions;
  rotation?: number;
  style?: TextStyle | Record<string, any>;
  cssStyle?: React.CSSProperties;
}

export interface Template {
  id: string;
  name: string;
  type: string;
  defaultColors: MockupColor[];
  layers: string;
}

export interface MockupTemplateEditorProps {
  template?: Template;
  initialData?: any;
}

// / Interface for a single print area
export interface MockupPrintArea {
  // Position coordinates
  left: number;
  top: number;

  // Dimensions
  width: number;
  height: number;

  visible: boolean;

  // Optional properties for more advanced configurations
  rotation?: number;      // Rotation in degrees
  scale?: number;         // Scale factor
  zIndex?: number;        // Stacking order
  name?: string;          // Identifier for the print area
  allowedTypes?: string[]; // Content types allowed in this area
  maxDPI?: number;        // Maximum supported resolution
}

// Interface for managing multiple print areas
// export interface MockupPrintAreas {
//   // Required areas
//   front: MockupPrintArea;

//   // Optional areas
//   back?: MockupPrintArea;
//   leftSleeve?: MockupPrintArea;
//   rightSleeve?: MockupPrintArea;

//   // Method to get a specific print area
//   getArea(position: string): MockupPrintArea | undefined;

//   // Method to update a print area
//   updateArea(position: string, updates: Partial<MockupPrintArea>): void;

//   // Method to check if a position has a print area
//   hasArea(position: string): boolean;
// }

// export type PrintAreaPosition = 'front' | 'back' | 'leftSleeve' | 'rightSleeve';

export interface MockupPrintArea {
  width: number;
  height: number;
  top: number;
  left: number;
  visible: boolean;
}

export class MockupPrintAreas {
  private areas: Record<PrintAreaPosition, MockupPrintArea | undefined> = {
    front: {
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      visible: false,
    },
    back: undefined,
    leftSleeve: undefined,
    rightSleeve: undefined,

  };

  getArea(position: PrintAreaPosition): MockupPrintArea | undefined {
    return this.areas[position];
  }

  updateArea(position: PrintAreaPosition, updates: Partial<MockupPrintArea>): void {
    if (this.areas[position]) {
      this.areas[position] = {
        ...this.areas[position]!,
        ...updates,
      };
    } else {
      this.areas[position] = {
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        visible: false,
        ...updates,
      };
    }
  }

  hasArea(position: PrintAreaPosition): boolean {
    return !!this.areas[position];
  }

  toObject() {
    return { ...this.areas };
  }

  // Optional: clone this instance (e.g. for undo/redo, immutability)
  clone(): MockupPrintAreas {
    const clone = new MockupPrintAreas();
    (Object.keys(this.areas) as PrintAreaPosition[]).forEach(pos => {
      if (this.areas[pos]) {
        clone.updateArea(pos, { ...this.areas[pos]! });
      }
    });
    return clone;
  }
}

export const createEmptyMockupPrintAreas = (): MockupPrintAreas => {
    return new MockupPrintAreas();
  };


// export const createEmptyMockupPrintAreas = (): MockupPrintAreas => {
//     const areas: {
//       front: MockupPrintArea;
//       back?: MockupPrintArea;
//       leftSleeve?: MockupPrintArea;
//       rightSleeve?: MockupPrintArea;
//     } = {
//       front: {
//         width: 0,
//         height: 0,
//         top: 0,
//         left: 0,
//         visible: false,
//       },
//     };

//     return {
//       ...areas,

//       getArea(position: string): MockupPrintArea | undefined {
//         return areas[position as keyof typeof areas];
//       },

//       updateArea(position: string, updates: Partial<MockupPrintArea>): void {
//         if (areas[position as keyof typeof areas]) {
//           areas[position as keyof typeof areas] = {
//             ...areas[position as keyof typeof areas]!,
//             ...updates,
//           };
//         } else {
//           // Optional: handle new area creation if needed
//           areas[position as keyof typeof areas] = {
//             width: 0,
//             height: 0,
//             top: 0,
//             left: 0,
//             visible: false,
//             ...updates,
//           };
//         }
//       },

//       hasArea(position: string): boolean {
//         return Boolean(areas[position as keyof typeof areas]);
//       },
//     };
//   };

export interface MockupTemplate {
    id: string;
    name: string;
    slug: string;
    category_id: number | null;
    description: string | null;
    view_angle: 'front' | 'back' | 'left' | 'right' | '3d';
    color_code: string | null;
    model_type: 'male' | 'female' | 'unisex' | 'child' | 'flat';
    type: 'tshirt';
    front_config: any | null;
    back_config: any | null;
    shared_config: any | null;
    file_type: 'svg' | 'png' | 'jpeg';
    is_active: boolean;
    created_at: string;
    updated_at: string;
    thumbnail: string;
  }


  export function createEmptyTemplate(): MockupTemplate {
    return {
      id: '',
      name: '',
      slug: '',
      category_id: null,
      description: null,
      view_angle: 'front', // default view angle
      color_code: null,
      model_type: 'unisex', // default model type
      type: 'tshirt',
      front_config: null,
      back_config: null,
      shared_config: null,
      file_type: 'svg', // default file type
      is_active: false,
      created_at: '',
      updated_at: '',
      thumbnail: '',
    };
  }

  export function createEmptyMockup(): Mockup {
    return {
      id: 0,
      name: 'Untitled Design-' + new Date().getTime().toString(),
      slug: '',
      user_id: 0,
      design_id: null,
      template_id: null,
      status: 'draft',
      type: 't-shirt', // default type
      layer_configurations: null,
      json_data: null,
      print_areas: null,
      front_canvas_state: null,
      back_canvas_state: null,
      metadata: null,
      current_view: 'front',
      thumbnail: '',
      created_at: '',
      updated_at: '',
    };
  }
