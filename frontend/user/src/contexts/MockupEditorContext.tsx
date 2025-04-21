import React, {
    createContext,
    useContext,
    useReducer,
    useEffect,
    useRef,
    useMemo,
    ReactNode,
    useState,
  } from "react";
//   import * as fabric from "fabric";
  import { FabricObject , Canvas} from "fabric";
  import axios from "axios";
  import { Mockup, MockupTemplate } from "@/types";
  import { createEmptyMockup, createEmptyTemplate } from "@/types/mockup";

  // --- Constants ---
  const DEFAULT_HISTORY_CONFIG: HistoryConfig = {
    enabled: true,
    maxSize: 50,
    debounceTime: 500, // Slightly reduced debounce time
  };

  // --- Types ---
  export type Orientation = "front" | "back";
  export type ViewMode = "design" | "preview";
  export type CanvasAction = "add" | "modify" | "remove";

  export type HistoryConfig = {
    enabled: boolean;
    maxSize: number;
    debounceTime: number;
  };

  export type HistoryItem = {
    action: string; // Optional: Action that triggered this state (e.g., "Add Text")
    description: string; // Optional: User-friendly description
    timestamp: number;
    canvasState: string; // JSON representation of the canvas for the *current* orientation
    printAreas: PrintAreas;
    orientation: Orientation; // The orientation this state belongs to
  };

  export type PrintAreas = Record<Orientation, string[]>;

  export interface EditorState {
    canvas: Canvas | null;
    mockup: Mockup;
    template: MockupTemplate;
    currentOrientation: Orientation;
    selectedObject: FabricObject | null;
    printAreas: PrintAreas;
    viewMode: ViewMode;
    orientationCanvasStates: Record<Orientation, string | null>;
    currentCanvasStateToLoad: string | null;
    isCanvasLoading: boolean;
  }

  export interface HistoryState {
    past: HistoryItem[];
    future: HistoryItem[];
    config: HistoryConfig;
    isEnabled: boolean;
  }

  export interface AppState {
    editor: EditorState;
    history: HistoryState;
  }

  // --- Action Types & Definitions ---
  const ActionTypes = {
    // Editor Actions
    SET_CANVAS: "SET_CANVAS",
    SET_TEMPLATE: "SET_TEMPLATE",
    SET_MOCKUP: "SET_MOCKUP",
    SET_ORIENTATION: "SET_ORIENTATION",
    SET_SELECTED_OBJECT: "SET_SELECTED_OBJECT",
    UPDATE_PRINT_AREAS: "UPDATE_PRINT_AREAS",
    SET_VIEW_MODE: "SET_VIEW_MODE",
    SET_CANVAS_STATE: "SET_CANVAS_STATE",
    SET_ORIENTATION_CANVAS_STATE: "SET_ORIENTATION_CANVAS_STATE",

    SET_CURRENT_CANVAS_STATE_TO_LOAD: "SET_CURRENT_CANVAS_STATE_TO_LOAD",
    SET_CANVAS_LOADING: "SET_CANVAS_LOADING",

    // History Actions
    SAVE_HISTORY: "SAVE_HISTORY",
    UNDO: "UNDO",
    REDO: "REDO",
    TOGGLE_HISTORY: "TOGGLE_HISTORY",
    CLEAR_HISTORY: "CLEAR_HISTORY",
    SET_HISTORY_CONFIG: "SET_HISTORY_CONFIG",
  } as const;

  type SetCanvasAction = { type: typeof ActionTypes.SET_CANVAS; payload: Canvas | null };
  type SetTemplateAction = { type: typeof ActionTypes.SET_TEMPLATE; payload: MockupTemplate };
  type SetMockupAction = { type: typeof ActionTypes.SET_MOCKUP; payload: Mockup };
  type SetOrientationAction = { type: typeof ActionTypes.SET_ORIENTATION; payload: Orientation };
  type SetSelectedObjectAction = {
    type: typeof ActionTypes.SET_SELECTED_OBJECT;
    payload: FabricObject | null;
  };
  type UpdatePrintAreasAction = {
    type: typeof ActionTypes.UPDATE_PRINT_AREAS;
    payload: { orientation: Orientation; objectId: string; action: CanvasAction };
  };
  type SetViewModeAction = { type: typeof ActionTypes.SET_VIEW_MODE; payload: ViewMode };
  type SetCanvasStateAction = {
    type: typeof ActionTypes.SET_CANVAS_STATE;
    payload: { orientation: Orientation; state: string | null };
  };
  type SetOrientationCanvasStateAction = {
    type: typeof ActionTypes.SET_ORIENTATION_CANVAS_STATE;
    payload: { orientation: Orientation; state: string | null };
  };
  type SetCurrentCanvasStateToLoadAction = {
    type: typeof ActionTypes.SET_CURRENT_CANVAS_STATE_TO_LOAD;
    payload: string | null;
  };
  type SetCanvasLoadingAction = { type: typeof ActionTypes.SET_CANVAS_LOADING; payload: boolean };

  type SaveHistoryAction = {
    type: typeof ActionTypes.SAVE_HISTORY;
    payload: Omit<HistoryItem, "timestamp">;
  };
  type UndoAction = { type: typeof ActionTypes.UNDO };
  type RedoAction = { type: typeof ActionTypes.REDO };
  type ToggleHistoryAction = { type: typeof ActionTypes.TOGGLE_HISTORY };
  type ClearHistoryAction = { type: typeof ActionTypes.CLEAR_HISTORY };
  type SetHistoryConfigAction = {
    type: typeof ActionTypes.SET_HISTORY_CONFIG;
    payload: Partial<HistoryConfig>;
  };

  type AppAction =
    | SetCanvasAction
    | SetTemplateAction
    | SetMockupAction
    | SetOrientationAction
    | SetSelectedObjectAction
    | UpdatePrintAreasAction
    | SetViewModeAction
    | SetCanvasStateAction
    | SetOrientationCanvasStateAction
    | SetCurrentCanvasStateToLoadAction
    | SetCanvasLoadingAction
    | SaveHistoryAction
    | UndoAction
    | RedoAction
    | ToggleHistoryAction
    | ClearHistoryAction
    | SetHistoryConfigAction;


// Ensure that all Fabric objects serialize their "name" property.
  (function () {
    const originalToObject = FabricObject.prototype.toObject;
    FabricObject.prototype.toObject = function (propertiesToInclude) {
      return originalToObject.call(
        this,
        ["name", ...(propertiesToInclude || [])]
      );
    };
  })();

  // --- Initial State Creators ---
  const createInitialEditorState = (template: MockupTemplate): EditorState => ({
    canvas: null,
    mockup: createEmptyMockup(),
    template,
    currentOrientation: "front",
    selectedObject: null,
    printAreas: { front: [], back: [] },
    viewMode: "design",
    orientationCanvasStates: { front: null, back: null },
    currentCanvasStateToLoad: null,
    isCanvasLoading: false,
  });

  const createInitialHistoryState = (config?: Partial<HistoryConfig>): HistoryState => ({
    past: [],
    future: [],
    config: { ...DEFAULT_HISTORY_CONFIG, ...config },
    isEnabled: config?.enabled ?? DEFAULT_HISTORY_CONFIG.enabled,
  });

  // --- Reducer ---
  const editorReducer = (state: AppState, action: AppAction): AppState => {
    switch (action.type) {
      case ActionTypes.SET_CANVAS:
        return { ...state, editor: { ...state.editor, canvas: action.payload } };
      case ActionTypes.SET_TEMPLATE:
        return { ...state, editor: { ...state.editor, template: action.payload } };
      case ActionTypes.SET_MOCKUP:
        return { ...state,  editor: { ...state.editor, mockup: action.payload } };
      case ActionTypes.SET_ORIENTATION: {
        if (action.payload === state.editor.currentOrientation || state.editor.isCanvasLoading) {
          return state;
        }
        const stateToLoad = state.editor.orientationCanvasStates[action.payload];
        return {
          ...state,
          editor: {
            ...state.editor,
            currentOrientation: action.payload,
            currentCanvasStateToLoad: stateToLoad,
            selectedObject: null,
          },
        };
      }
      case ActionTypes.SET_SELECTED_OBJECT:
        return { ...state, editor: { ...state.editor, selectedObject: action.payload } };
      case ActionTypes.UPDATE_PRINT_AREAS: {
        const { orientation, objectId, action: areaAction } = action.payload;
        const currentAreas = state.editor.printAreas[orientation] || [];
        const updatedAreas =
          areaAction === "add"
            ? currentAreas.includes(objectId)
              ? currentAreas
              : [...currentAreas, objectId]
            : currentAreas.filter((id) => id !== objectId);
        return {
          ...state,
          editor: {
            ...state.editor,
            printAreas: { ...state.editor.printAreas, [orientation]: updatedAreas },
          },
        };
      }
      case ActionTypes.SET_VIEW_MODE:
        return {
          ...state,
          editor: { ...state.editor, viewMode: action.payload, selectedObject: null },
        };
        case ActionTypes.SET_CANVAS_STATE: {
            const { orientation, state: canvasState } = action.payload;
            return {
              ...state,
              editor: {
                ...state.editor,
                orientationCanvasStates: {
                  ...state.editor.orientationCanvasStates,
                  [orientation]: canvasState,
                },
              },
            };
        }
      case ActionTypes.SET_ORIENTATION_CANVAS_STATE: {
        const { orientation, state: canvasState } = action.payload;
        return {
          ...state,
          editor: {
            ...state.editor,
            orientationCanvasStates: {
              ...state.editor.orientationCanvasStates,
              [orientation]: canvasState,
            },
          },
        };
      }
      case ActionTypes.SET_CURRENT_CANVAS_STATE_TO_LOAD:
        return { ...state, editor: { ...state.editor, currentCanvasStateToLoad: action.payload } };
      case ActionTypes.SET_CANVAS_LOADING:
        return { ...state, editor: { ...state.editor, isCanvasLoading: action.payload } };
      case ActionTypes.SAVE_HISTORY: {
        if (!state.history.isEnabled) return state;
        const historyItem: HistoryItem = { ...action.payload, timestamp: Date.now() };
        const newPast = [...state.history.past, historyItem];
        if (newPast.length > state.history.config.maxSize) {
          newPast.shift();
        }
        return {
          ...state,
          history: { ...state.history, past: newPast, future: [] },
        };
      }
      case ActionTypes.UNDO: {
        if (!state.history.isEnabled || state.history.past.length === 0 || state.editor.isCanvasLoading) {
          return state;
        }
        const previous = state.history.past[state.history.past.length - 1];
        const newPast = state.history.past.slice(0, state.history.past.length - 1);
        if (!state.editor.canvas) return state;
        const currentState: HistoryItem = {
          action: "CURRENT",
          description: "Current state before undo",
          timestamp: Date.now(),
          canvasState: JSON.stringify(state.editor.canvas.toJSON()),
          printAreas: state.editor.printAreas,
          orientation: state.editor.currentOrientation,
        };
        return {
          ...state,
          editor: {
            ...state.editor,
            currentOrientation: previous.orientation,
            printAreas: previous.printAreas,
            currentCanvasStateToLoad: previous.canvasState,
            selectedObject: null,
          },
          history: {
            ...state.history,
            past: newPast,
            future: [currentState, ...state.history.future],
          },
        };
      }
      case ActionTypes.REDO: {
        if (!state.history.isEnabled || state.history.future.length === 0 || state.editor.isCanvasLoading) {
          return state;
        }
        const next = state.history.future[0];
        const newFuture = state.history.future.slice(1);
        return {
          ...state,
          editor: {
            ...state.editor,
            currentOrientation: next.orientation,
            printAreas: next.printAreas,
            currentCanvasStateToLoad: next.canvasState,
            selectedObject: null,
          },
          history: {
            ...state.history,
            past: [...state.history.past, next],
            future: newFuture,
          },
        };
      }
      case ActionTypes.TOGGLE_HISTORY:
        return { ...state, history: { ...state.history, isEnabled: !state.history.isEnabled } };
      case ActionTypes.CLEAR_HISTORY:
        return { ...state, history: { ...state.history, past: [], future: [] } };
      case ActionTypes.SET_HISTORY_CONFIG:
        return {
          ...state,
          history: { ...state.history, config: { ...state.history.config, ...action.payload } },
        };
      default:
        return state;
    }
  };

  // --- Context Setup ---
  interface EditorContextValue {
    state: AppState;
    actions: {
      setCanvas: (canvas: Canvas | null) => void;
      setTemplate: (template: MockupTemplate) => void;
      setMockup: (mockup: Mockup) => void;
      setOrientation: (orientation: Orientation) => void;
      setSelectedObject: (object: FabricObject | null) => void;
      updatePrintAreas: (orientation: Orientation, objectId: string, action: CanvasAction) => void;
      setViewMode: (mode: ViewMode) => void;
      addHistory: (actionDesc: string, description: string) => void;
      saveCurrentCanvasStateForOrientation: (orientation: Orientation, state: string | null) => void;
      setCanvasLoading: (isLoading: boolean) => void;
      undo: () => void;
      redo: () => void;
      toggleHistory: () => void;
      clearHistory: () => void;
      setHistoryConfig: (config: Partial<HistoryConfig>) => void;
    };
  }

  // Use undefined as the default so that consumers must check for a valid context
  const EditorContext = createContext<EditorContextValue | undefined>(undefined);

  // --- Provider Component ---
  interface EditorProviderProps {
    children: ReactNode;
    historyConfig?: Partial<HistoryConfig>;
    templateId?: string;
    mockupId?: number;
  }

  export const EditorProvider: React.FC<EditorProviderProps> = ({
    children,
    historyConfig,
    templateId,
    mockupId,
  }) => {
    const [initialTemplate, setInitialTemplate] = useState<MockupTemplate | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastSavedCanvasStateRef = useRef<string | null>(null);

    // Fetch template data on mount or when templateId changes
    // useEffect(() => {
    //   let isMounted = true;
    //   const loadTemplate = async () => {
    //     setIsLoading(true);
    //     setError(null);
    //     try {
    //       // Replace with your actual API endpoint fetching logic.
    //       // Ensure that `route` is defined in your environment.
    //     //   const response = await axios.get<{ data: MockupTemplate }>(
    //     //     route("mockup-templates.show", { template: templateId })
    //     //   );
    //     //   if (isMounted) {
    //     //     if (response.status === 200 && response.data.data) {
    //     //       setInitialTemplate(response.data.data);
    //     //       console.log("Template loaded:", response.data.data);
    //     //     } else {
    //     //       throw new Error(`Failed to load template: Status ${response.status}`);
    //     //     }
    //     //   }
    //     const response = await axios.get<MockupTemplate>(
    //         route("mockup-templates.show", { template: templateId })
    //       );

    //       if (isMounted) {
    //         if (response.status === 200 && response.data) {
    //           setInitialTemplate(response.data);
    //           console.log("Template loaded:", response.data);
    //         } else {
    //           throw new Error(`Failed to load template: Status ${response.status}`);
    //         }
    //       }

    //     } catch (err) {
    //       console.error("Error loading template:", err);
    //       if (isMounted) {
    //         setError(err instanceof Error ? err.message : "An unknown error occurred while loading the template.");
    //         setInitialTemplate(createEmptyTemplate());
    //       }
    //     } finally {
    //       if (isMounted) {
    //         setIsLoading(false);
    //       }
    //     }
    //   };

    //   loadTemplate();

    //   return () => {
    //     isMounted = false;
    //   };
    // }, [templateId]);
    useEffect(() => {
        const loadInitial = async () => {
          console.log('loadInitial')
          console.log('mockupId',mockupId)
          try {
            if (mockupId) {
              const { data: mockup } = await axios.get(route("mockups.show", { mockup: mockupId }));
              console.log("Mockup loaded:", mockup);
              dispatch({ type: ActionTypes.SET_MOCKUP, payload: mockup });
            //   dispatch({ type: ActionTypes.SET_TEMPLATE, payload: mockup.template });

              if (mockup.front_canvas_state) {
                dispatch({
                  type: ActionTypes.SET_CANVAS_STATE,
                  payload: { orientation: "front", state: mockup.front_canvas_state }
                });
              }

              if (mockup.back_canvas_state) {
                dispatch({
                  type: ActionTypes.SET_CANVAS_STATE,
                  payload: { orientation: "back", state: mockup.back_canvas_state }
                });
              }
            } else if (templateId) {
             console.log('templateId',templateId)
              const { data: template } = await axios.get(route("mockup-templates.show", { template: templateId }));
              dispatch({ type: ActionTypes.SET_TEMPLATE, payload: template });
            } else {
              throw new Error("Missing templateId or mockupId");
            }
          } catch (err) {
            console.error("Failed to load editor data", err);
            setError("Failed to load template or mockup");
          } finally {
            setIsLoading(false);
          }
        };
        loadInitial();
      }, [templateId, mockupId]);

    // Always initialize the reducer with a fallback template
    const initialState: AppState = useMemo(
      () => ({
        editor: createInitialEditorState(initialTemplate || createEmptyTemplate()),
        history: createInitialHistoryState(historyConfig),
      }),
      [initialTemplate, historyConfig]
    );

    const [state, dispatch] = useReducer(editorReducer, initialState);

    // Update the template in the reducer when it is loaded
    useEffect(() => {
      if (initialTemplate) {
        dispatch({ type: ActionTypes.SET_TEMPLATE, payload: initialTemplate });
      }
    }, [initialTemplate]);

    // --- Actions ---
    const actions = useMemo(() => {
      const debouncedSaveHistory = (item: Omit<HistoryItem, "timestamp">) => {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }
        debounceTimeoutRef.current = setTimeout(() => {
          if (item.canvasState !== lastSavedCanvasStateRef.current) {
            dispatch({ type: ActionTypes.SAVE_HISTORY, payload: item });
            lastSavedCanvasStateRef.current = item.canvasState;
          }
          debounceTimeoutRef.current = null;
        }, state.history.config.debounceTime ?? DEFAULT_HISTORY_CONFIG.debounceTime);
      };

      return {
        setCanvas: (canvas: Canvas | null) =>
          dispatch({ type: ActionTypes.SET_CANVAS, payload: canvas }),
        setTemplate: (template: MockupTemplate) =>
          dispatch({ type: ActionTypes.SET_TEMPLATE, payload: template }),
        setMockup: (mockup: Mockup) =>
          dispatch({ type: ActionTypes.SET_MOCKUP, payload: mockup }),
        setOrientation: (orientation: Orientation) => {
          if (state.editor.canvas && state.editor.currentOrientation !== orientation) {
            const currentState = JSON.stringify(state.editor.canvas.toJSON());
            dispatch({
              type: ActionTypes.SET_ORIENTATION_CANVAS_STATE,
              payload: { orientation: state.editor.currentOrientation, state: currentState },
            });
          }
          dispatch({ type: ActionTypes.SET_ORIENTATION, payload: orientation });
        },
        setSelectedObject: (object: FabricObject | null) =>
          dispatch({ type: ActionTypes.SET_SELECTED_OBJECT, payload: object }),
        updatePrintAreas: (orientation: Orientation, objectId: string, actionType: CanvasAction) =>
          dispatch({
            type: ActionTypes.UPDATE_PRINT_AREAS,
            payload: { orientation, objectId, action: actionType },
          }),
        setViewMode: (mode: ViewMode) =>
          dispatch({ type: ActionTypes.SET_VIEW_MODE, payload: mode }),
        saveCurrentCanvasStateForOrientation: (orientation: Orientation, stateStr: string | null) =>
          dispatch({
            type: ActionTypes.SET_ORIENTATION_CANVAS_STATE,
            payload: { orientation, state: stateStr },
          }),
        setCanvasLoading: (isLoading: boolean) =>
          dispatch({ type: ActionTypes.SET_CANVAS_LOADING, payload: isLoading }),
        addHistory: (actionDesc: string, description: string) => {
          if (!state.history.isEnabled || !state.editor.canvas) return;
          const currentCanvasState = JSON.stringify(state.editor.canvas.toJSON());
          debouncedSaveHistory({
            action: actionDesc,
            description,
            canvasState: currentCanvasState,
            printAreas: state.editor.printAreas,
            orientation: state.editor.currentOrientation,
          });
        },
        undo: () => dispatch({ type: ActionTypes.UNDO }),
        redo: () => dispatch({ type: ActionTypes.REDO }),
        toggleHistory: () => dispatch({ type: ActionTypes.TOGGLE_HISTORY }),
        clearHistory: () => {
          dispatch({ type: ActionTypes.CLEAR_HISTORY });
          lastSavedCanvasStateRef.current = null;
        },
        setHistoryConfig: (config: Partial<HistoryConfig>) =>
          dispatch({ type: ActionTypes.SET_HISTORY_CONFIG, payload: config }),
      };
    }, [state]);

    // Effect to load canvas state (e.g., after undo/redo or orientation change)
    useEffect(() => {
      if (
        !state.editor.canvas ||
        state.editor.currentCanvasStateToLoad === null ||
        state.editor.isCanvasLoading
      ) {
        return;
      }
      const canvas = state.editor.canvas;
      const stateToLoad = state.editor.currentCanvasStateToLoad;
      dispatch({ type: ActionTypes.SET_CANVAS_LOADING, payload: true });
      dispatch({ type: ActionTypes.SET_CURRENT_CANVAS_STATE_TO_LOAD, payload: null });
      console.log("Loading canvas state:", stateToLoad);
      canvas.loadFromJSON(stateToLoad, () => {
        canvas.renderAll();
        dispatch({ type: ActionTypes.SET_CANVAS_LOADING, payload: false });
        console.log("Canvas state loaded.");
        lastSavedCanvasStateRef.current = stateToLoad;
      });
    }, [
      state.editor.canvas,
      state.editor.currentCanvasStateToLoad,
      state.editor.isCanvasLoading,
    ]);

    // Cleanup debounce timer on unmount
    useEffect(() => {
      return () => {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }
      };
    }, []);

    // Render errors or loading states before providing context
    if (error) {
      return <div>Error loading template: {error}</div>;
    }
    if (isLoading) {
      return <div>Loading template...</div>;
    }

    const contextValue: EditorContextValue = { state, actions };

    return <EditorContext.Provider value={contextValue}>{children}</EditorContext.Provider>;
  };

  // --- Custom Hook ---
  export const useMockupEditor = (): EditorContextValue => {
    const context = useContext(EditorContext);
    if (!context) {
      throw new Error("useMockupEditor must be used within an EditorProvider");
    }
    return context;
  };
