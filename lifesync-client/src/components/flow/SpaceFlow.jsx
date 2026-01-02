import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Handle,
  Position,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { useQuery } from "@tanstack/react-query";
import { getSpaceFlow, saveSpaceFlow } from "../../services/flow.service";
import { motion } from "framer-motion";
import { Plus, Trash2, X } from "lucide-react";

/* ---------------- CLASSY NODE ---------------- */
const ClassyNode = ({ data, selected }) => {
  return (
    <div
      className={`min-w-[150px] shadow-sm rounded-xl backdrop-blur-md transition-all duration-300 ${
        selected
          ? "bg-white/95 ring-1 ring-indigo-400 shadow-indigo-100"
          : "bg-white/80 hover:bg-white border border-white/60 hover:border-white/80"
      }`}
    >
      <div className={`h-1.5 w-full rounded-t-xl opacity-90 ${selected ? "bg-indigo-500" : "bg-slate-200"}`} />
      
      <div className="px-4 py-3">
        <h3 className="text-sm font-sans font-medium text-slate-700 tracking-wide">
          {data.label}
        </h3>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-slate-400 border-2 border-white rounded-full transition-colors hover:bg-indigo-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-slate-400 border-2 border-white rounded-full transition-colors hover:bg-indigo-500"
      />
    </div>
  );
};

/* ---------------- DEMO FLOW ---------------- */
const DEMO_NODES = [
  {
    id: "demo-1",
    position: { x: 200, y: 200 },
    data: { label: "Start Idea" },
    type: "classy",
  },
  {
    id: "demo-2",
    position: { x: 450, y: 200 },
    data: { label: "Next Step" },
    type: "classy",
  },
];

const DEMO_EDGES = [
  {
    id: "demo-edge",
    source: "demo-1",
    target: "demo-2",
  },
];

/* ---------------- COMPONENT ---------------- */
const SpaceFlow = ({ spaceId, role }) => {
  const canEdit = role === "owner" || role === "editor";
  const initializedRef = useRef(false);

  // Define custom node types
  const nodeTypes = useMemo(() => ({ classy: ClassyNode }), []);

  const [editingNodeId, setEditingNodeId] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  // Instance state for Viewport management
  const [rfInstance, setRfInstance] = useState(null);

  /* ---------------- LOAD FLOW ---------------- */
  const { data, isLoading } = useQuery({
    queryKey: ["space-flow", spaceId],
    queryFn: () => getSpaceFlow(spaceId),
  });

  useEffect(() => {
    if (!data || initializedRef.current) return;

    // Restore Nodes & Edges
    if (!data.updatedAt) {
      setNodes(DEMO_NODES);
      setEdges(DEMO_EDGES);
    } else {
      setNodes(data.nodes || []);
      setEdges(data.edges || []);
    }
    
    // Restore Viewport if available and instance is ready
    if (data.viewport && rfInstance) {
      const { x, y, zoom } = data.viewport;
      rfInstance.setViewport({ x, y, zoom });
    }

    // Only mark initialized if we have data. 
    // Note: We might re-run viewport restoration if instance comes later.
    if (rfInstance || !data.viewport) {
       initializedRef.current = true;
    }
  }, [data, setNodes, setEdges, rfInstance]);

  /* ---------------- CONNECT ---------------- */
  const onConnect = useCallback(
    (params) => {
      if (!canEdit) return;
      setEdges((eds) => addEdge(params, eds));
    },
    [canEdit, setEdges]
  );

  /* ---------------- AUTOSAVE ---------------- */
  useEffect(() => {
    if (!canEdit) return;

    const t = setTimeout(() => {
      const flowData = {
        nodes,
        edges,
        viewport: rfInstance ? rfInstance.getViewport() : { x: 0, y: 0, zoom: 1 }
      };
      saveSpaceFlow(spaceId, flowData);
    }, 800);

    return () => clearTimeout(t);
  }, [nodes, edges, canEdit, spaceId, rfInstance]);

  /* ---------------- ADD NODE ---------------- */
  const addNode = () => {
    setNodes((nds) => [
      ...nds,
      {
        id: crypto.randomUUID(),
        position: { x: 250, y: 250 },
        data: { label: "New Idea" },
        type: "classy",
      },
    ]);
  };

  /* ---------------- CLEAR CANVAS ---------------- */
  const clearCanvas = () => {
    if (window.confirm("Are you sure you want to clear the entire canvas?")) {
      setNodes([]);
      setEdges([]);
    }
  };

  /* ---------------- RENAME NODE ---------------- */
  const updateNodeLabel = (id, value) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, label: value } } : n
      )
    );
  };

  // Inject editing logic into display nodes if needed
  const displayNodes = nodes.map((node) => {
    const isEditing = node.id === editingNodeId;
    return {
      ...node,
      type: "classy",
      data: {
        ...node.data,
        label: isEditing ? (
          <input
            autoFocus
            value={node.data.label}
            className="w-full bg-transparent border-b border-indigo-400 outline-none text-sm font-sans text-slate-700"
            onChange={(e) => updateNodeLabel(node.id, e.target.value)}
            onBlur={() => setEditingNodeId(null)}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === "Enter") setEditingNodeId(null);
            }}
            onClick={(e) => e.stopPropagation()} 
          />
        ) : (
          <div
            onDoubleClick={(e) => {
              e.stopPropagation();
              canEdit && setEditingNodeId(node.id);
            }}
            className="cursor-text w-full"
          >
            {node.data.label}
          </div>
        ),
      },
    };
  });

  const deleteNode = (id) => {
     setNodes((nds) => nds.filter((n) => n.id !== id));
     setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  };

  const deleteEdge = (id) => {
     setEdges((eds) => eds.filter((e) => e.id !== id));
  };

  /* ---------------- DELETE KEY HANDLER ---------------- */
  useEffect(() => {
    if (!canEdit) return;

    const handleKeyDown = (e) => {
      if (editingNodeId) return;
      if (e.key !== "Delete" && e.key !== "Backspace") return;

      const selectedNode = nodes.find((n) => n.selected);
      if (selectedNode) {
        deleteNode(selectedNode.id);
        return;
      }

      const selectedEdge = edges.find((e) => e.selected);
      if (selectedEdge) {
        deleteEdge(selectedEdge.id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canEdit, editingNodeId, nodes, edges]);

  if (isLoading) {
    return <div className="p-4">Loading canvas...</div>;
  }

  const selectedNode = nodes.find((n) => n.selected);
  const selectedEdge = edges.find((e) => e.selected);

  /* ---------------- UI ---------------- */
  return (
    <div className="w-full h-full relative font-sans">
      {/* CONTROLS OVERLAY */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-3">
        {!canEdit && (
           <div className="glass-panel px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-medium text-slate-500">
             <span>🔒</span> Read-only mode
           </div>
        )}

        {canEdit && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-3 items-start"
          >
            {/* Primary Actions Group */}
            <div className="flex items-center gap-2">
              <button
                onClick={addNode}
                className="glass-panel pl-3 pr-4 py-2.5 rounded-xl hover:bg-white text-slate-700 hover:text-indigo-700 transition-all shadow-sm flex items-center gap-2 group"
              >
                <div className="bg-indigo-100 p-1 rounded-md text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm">Add Node</span>
              </button>
            </div>

            {/* Context Actions */}
            {(selectedNode || selectedEdge) && (
              <div className="flex flex-col gap-2 mt-2">
                 {selectedNode && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => deleteNode(selectedNode.id)}
                    className="glass-panel pl-3 pr-4 py-2 rounded-xl hover:bg-red-50 text-slate-600 hover:text-red-600 transition-all shadow-sm flex items-center gap-2 group w-full"
                  >
                     <div className="bg-red-100 p-1 rounded-md text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-medium text-xs">Delete Node</span>
                  </motion.button>
                )}

                {selectedEdge && (
                  <motion.button
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                    onClick={() => deleteEdge(selectedEdge.id)}
                    className="glass-panel pl-3 pr-4 py-2 rounded-xl hover:bg-orange-50 text-slate-600 hover:text-orange-600 transition-all shadow-sm flex items-center gap-2 group w-full"
                  >
                     <div className="bg-orange-100 p-1 rounded-md text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                       <X className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-medium text-xs">Remove Link</span>
                  </motion.button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* TOP RIGHT CONTROLS */}
      {canEdit && nodes.length > 0 && (
        <div className="absolute top-6 right-6 z-10">
          <button
            onClick={clearCanvas}
            className="glass-panel p-2.5 rounded-xl hover:bg-white text-slate-600 hover:text-red-600 transition-all shadow-sm group tooltip-trigger relative"
            title="Clear Canvas"
          >
            <div className="bg-slate-100 p-1 rounded-md text-slate-500 group-hover:bg-red-100 group-hover:text-red-500 transition-colors">
              <Trash2 className="w-4 h-4" />
            </div>
             <span className="absolute right-full mr-3 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
               Clear Setup
             </span>
          </button>
        </div>
      )}

      <ReactFlow
        nodes={displayNodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={canEdit ? onNodesChange : undefined}
        onEdgesChange={canEdit ? onEdgesChange : undefined}
        onConnect={canEdit ? onConnect : undefined}
        onInit={setRfInstance}
        nodesDraggable={canEdit}
        nodesConnectable={canEdit}
        elementsSelectable={canEdit}
        fitView={!initializedRef.current} 
        className="bg-slate-50/50"
      >
        <Background gap={20} size={1} color="#cbd5e1" />
        <Controls className="!bg-white !border-white/50 !shadow-sm !text-slate-600 !rounded-lg" />
      </ReactFlow>
    </div>
  );
};

export default SpaceFlow;
