"use client";

import { useCallback, useMemo, useState } from "react";
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Handle,
    Position,
    BackgroundVariant,
    Connection,
    NodeProps,
    Node,
    Edge,
    SelectionMode
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
    Clock, Search, Mail, Bot, Zap, Activity, FileText, Send, Database,
    Globe, Webhook, BrainCircuit, GitBranch, Settings, X, Play, Code2,
    MessageSquare, Layers, Save, CheckCircle2, Loader2, Terminal,
    Maximize2, Minimize2
} from "lucide-react";
import { cn } from "@/lib/utils";

// Icon dictionary mapped from strings for clean node serialization
const IconMap: Record<string, React.ElementType> = {
    Webhook, Globe, BrainCircuit, GitBranch, Mail, Database, Send, Clock,
    Search, Activity, FileText, Bot, Zap, Code2, MessageSquare, Layers
};

type CustomNodeData = {
    label: string;
    sublabel: string;
    iconName: string;
    theme: string;
    action?: string;
    targetHandle?: boolean;
    sourceHandle?: boolean;
    nodeType: "trigger" | "action" | "agent" | "logic" | "endpoint";
    status?: "idle" | "running" | "success" | "error" | "skipped";
};

// The custom Node rendering component
const CustomNode = ({ data, selected, isConnectable }: NodeProps<Node<CustomNodeData>>) => {
    const Icon = IconMap[data.iconName] || Bot;
    const isRunning = data.status === "running";
    const isSuccess = data.status === "success";
    const isSkipped = data.status === "skipped";

    return (
        <div
            className={cn(
                "p-4 rounded-xl border backdrop-blur-md transition-all w-72 relative group",
                selected
                    ? "border-blue-500 bg-blue-500/10 shadow-[0_0_25px_rgba(59,130,246,0.15)] ring-2 ring-blue-500/50"
                    : "border-slate-700/80 bg-slate-900/90 hover:border-slate-500/80 shadow-xl",
                isRunning && "border-amber-500/50 bg-slate-900 ring-2 ring-amber-500/30",
                isSuccess && "border-emerald-500/50 bg-slate-900",
                isSkipped && "opacity-50 grayscale"
            )}
        >
            {/* Fake Operational Status Indicator */}
            {data.status === "idle" || !data.status ? (
                <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900 opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_rgba(16,185,129,0.8)]" title="Operational" />
            ) : null}

            {/* Execution Status Indicators */}
            {isRunning && (
                <div className="absolute -top-2 -right-2 bg-slate-900 rounded-full border border-amber-500 text-amber-500 p-0.5 shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                    <Loader2 size={14} className="animate-spin" />
                </div>
            )}
            {isSuccess && (
                <div className="absolute -top-2 -right-2 bg-slate-900 rounded-full border border-emerald-500 text-emerald-500 p-0.5 shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                    <CheckCircle2 size={14} />
                </div>
            )}

            {/* Target handle (incoming) */}
            {data.targetHandle && (
                <Handle
                    type="target"
                    position={Position.Left}
                    isConnectable={isConnectable}
                    className="w-3 h-3 bg-slate-200 border-2 border-slate-900 -ml-1.5"
                />
            )}

            <div className="flex items-start gap-3">
                <div
                    className={cn(
                        "p-2.5 rounded-xl border flex-shrink-0 mt-0.5 transition-colors",
                        data.theme === "blue" && "bg-blue-500/10 text-blue-400 border-blue-500/20",
                        data.theme === "emerald" && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                        data.theme === "amber" && "bg-amber-500/10 text-amber-400 border-amber-500/20",
                        data.theme === "purple" && "bg-purple-500/10 text-purple-400 border-purple-500/20",
                        data.theme === "slate" && "bg-slate-700/30 text-slate-300 border-slate-600/50",
                        !data.theme && "bg-slate-800 text-slate-300 border-slate-700",
                        isRunning && "border-amber-500/50 text-amber-400"
                    )}
                >
                    <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                        <h3 className="text-[14px] font-semibold text-slate-100 font-outfit truncate pr-2">
                            {data.label}
                        </h3>
                        {/* Node Type Badge */}
                        <span className="text-[8px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded-md uppercase tracking-widest border border-slate-700">
                            {data.nodeType}
                        </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-[190px] line-clamp-2">
                        {data.sublabel}
                    </p>
                    {data.action && (
                        <div className="mt-3 bg-[#0B1120] border border-slate-800 rounded-md p-1.5 px-2 text-[11px] font-mono text-slate-300 truncate flex items-center gap-1.5">
                            <Code2 size={12} className="text-slate-500" />
                            {data.action}
                        </div>
                    )}
                </div>
            </div>

            {/* Source Handles (outgoing) */}
            {data.nodeType === "logic" ? (
                <>
                    <Handle type="source" position={Position.Right} id="true" className="top-[35%] bg-emerald-500 w-3 h-3 border-2 border-slate-900 -mr-1.5" />
                    <span className="absolute right-0 top-[35%] -mt-2 -mr-11 text-[9px] text-emerald-500 font-bold bg-slate-900 px-1 leading-tight rounded border border-slate-800 z-10">TRUE</span>

                    <Handle type="source" position={Position.Right} id="false" className="top-[65%] bg-rose-500 w-3 h-3 border-2 border-slate-900 -mr-1.5" />
                    <span className="absolute right-0 top-[65%] -mt-2 -mr-12 text-[9px] text-rose-500 font-bold bg-slate-900 px-1 leading-tight rounded border border-slate-800 z-10">FALSE</span>
                </>
            ) : data.sourceHandle && (
                <Handle
                    type="source"
                    position={Position.Right}
                    isConnectable={isConnectable}
                    className="w-3 h-3 bg-blue-400 border-2 border-slate-900 -mr-1.5 z-10"
                />
            )}
        </div>
    );
};

// Realistic initial layout emphasizing advanced capabilities
const initialNodes: Node<CustomNodeData>[] = [
    {
        id: "webhook-1",
        type: "customTask",
        position: { x: 50, y: 300 },
        data: {
            label: "MLS Webhook", sublabel: "Triggers on new property listings in target zone",
            iconName: "Webhook", theme: "purple", targetHandle: false, sourceHandle: true,
            nodeType: "trigger", action: "POST /api/webhooks/mls", status: "idle"
        }
    },
    {
        id: "scrape-1",
        type: "customTask",
        position: { x: 400, y: 300 },
        data: {
            label: "Data Enrichment", sublabel: "Scrape Redfin/Zillow API for comps & history",
            iconName: "Globe", theme: "slate", targetHandle: true, sourceHandle: true,
            nodeType: "action", action: "Run Apify Actor", status: "idle"
        }
    },
    {
        id: "agent-1",
        type: "customTask",
        position: { x: 750, y: 300 },
        data: {
            label: "Prospector Analyzer", sublabel: "Evaluates deal viability & extracts metrics",
            iconName: "BrainCircuit", theme: "blue", targetHandle: true, sourceHandle: true,
            nodeType: "agent", action: "Prompt: Deal Metrics Evaluation", status: "idle"
        }
    },
    {
        id: "logic-1",
        type: "customTask",
        position: { x: 1100, y: 300 },
        data: {
            label: "Yield Condition", sublabel: "Does Cap Rate > 8%?",
            iconName: "GitBranch", theme: "amber", targetHandle: true, sourceHandle: false,
            nodeType: "logic", status: "idle"
        }
    },
    {
        id: "email-1",
        type: "customTask",
        position: { x: 1550, y: 200 },
        data: {
            label: "Investor Distribution", sublabel: "Generate deal brief and email buyers list",
            iconName: "Mail", theme: "emerald", targetHandle: true, sourceHandle: false,
            nodeType: "endpoint", action: "SendGrid Broadcast", status: "idle"
        }
    },
    {
        id: "slack-1",
        type: "customTask",
        position: { x: 1550, y: 400 },
        data: {
            label: "Human Review", sublabel: "Ping acquisition team in Slack for review",
            iconName: "Database", theme: "slate", targetHandle: true, sourceHandle: false,
            nodeType: "endpoint", action: "Slack Channel #deals", status: "idle"
        }
    }
];

const initialEdges: Edge[] = [
    { id: "e1", source: "webhook-1", target: "scrape-1", animated: true, style: { stroke: "#64748b", strokeWidth: 2 } },
    { id: "e2", source: "scrape-1", target: "agent-1", animated: true, style: { stroke: "#64748b", strokeWidth: 2 } },
    { id: "e3", source: "agent-1", target: "logic-1", animated: true, style: { stroke: "#64748b", strokeWidth: 2 } },
    { id: "e4", source: "logic-1", target: "email-1", sourceHandle: "true", animated: true, style: { stroke: "#10b981", strokeWidth: 2 } },
    { id: "e5", source: "logic-1", target: "slack-1", sourceHandle: "false", animated: true, style: { stroke: "#f43f5e", strokeWidth: 2 } },
];

export function AgentFlowBuilder() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // Track execution status and logs
    const [isTesting, setIsTesting] = useState(false);
    const [executionLogs, setExecutionLogs] = useState<{ time: string, msg: string, type: string }[]>([]);
    const [showTerminal, setShowTerminal] = useState(false);
    const [terminalExpanded, setTerminalExpanded] = useState(false);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: "#64748b", strokeWidth: 2 } }, eds)),
        [setEdges]
    );

    const nodeTypes = useMemo(() => ({ customTask: CustomNode }), []);

    // Get selected node for settings panel
    const selectedNode = nodes.find(n => n.selected) as Node<CustomNodeData> | undefined;

    const handleUpdateNode = (field: keyof CustomNodeData, value: string) => {
        if (!selectedNode) return;
        setNodes((nds) => nds.map((n) => {
            if (n.id === selectedNode.id) {
                return { ...n, data: { ...n.data, [field]: value } };
            }
            return n;
        }));
    };

    const addNodeOfType = (type: CustomNodeData["nodeType"], theme: string, icon: string, label: string) => {
        const newNode: Node<CustomNodeData> = {
            id: `${type}-${Date.now()}`,
            type: "customTask",
            position: { x: 200, y: 200 },
            data: {
                label: `New ${label}`,
                sublabel: "Configure node properties...",
                iconName: icon,
                theme: theme,
                targetHandle: type !== "trigger",
                sourceHandle: type !== "endpoint" && type !== "logic",
                nodeType: type,
                action: "Unconfigured",
                status: "idle"
            },
        };
        setNodes((nds) => [...nds, newNode]);
    };

    const addLog = (msg: string, type: "info" | "success" | "warn" | "error" = "info") => {
        setExecutionLogs(prev => [...prev, { time: new Date().toISOString().split("T")[1].substring(0, 8), msg, type }]);
    };

    const runTests = async () => {
        if (isTesting) return;
        setIsTesting(true);
        setShowTerminal(true);
        setExecutionLogs([]);
        addLog("Initializing Pipeline Engine v4.2...", "info");

        // Reset all nodes to idle
        setNodes(nds => nds.map(n => ({ ...n, data: { ...n.data, status: "idle" } })));

        // Slight pause for visual effect
        await new Promise(r => setTimeout(r, 600));

        // Get snapshot of current graph structure
        const currentNodes = [...nodes];
        const currentEdges = [...edges];

        // Find triggers
        let activeLayer = currentNodes.filter(n => n.data.nodeType === "trigger");

        if (activeLayer.length === 0) {
            addLog("No trigger node found. Pipeline aborted.", "error");
            setIsTesting(false);
            return;
        }

        addLog(`Found ${activeLayer.length} trigger(s). Starting execution.`, "info");

        // Execute level by level (BFS style)
        while (activeLayer.length > 0) {
            const nextLayer: Node<CustomNodeData>[] = [];

            for (const node of activeLayer) {
                // Set to running
                setNodes(nds => nds.map(n => n.id === node.id ? { ...n, data: { ...n.data, status: "running" } } : n));
                addLog(`Executing [${node.data.label}]`, "warn");

                // Simulate processing time
                const processingTime = node.data.nodeType === "agent" ? 1800 : (node.data.nodeType === "action" ? 1200 : 800);
                await new Promise(r => setTimeout(r, processingTime));

                // Set to success
                setNodes(nds => nds.map(n => n.id === node.id ? { ...n, data: { ...n.data, status: "success" } } : n));
                addLog(`Output confirmed: [${node.data.label}] finished in ${processingTime}ms`, "success");

                // Find outgoing edges
                const outgoingEdges = currentEdges.filter(e => e.source === node.id);

                // FAKE LOGIC EVALUATION
                // If it's a logic node, we will pretend the Cap Rate evaluation was TRUE
                const successfulEdges = outgoingEdges.filter(e => {
                    if (node.data.nodeType === "logic" && e.sourceHandle === "false") {
                        // Mark false branch as skipped
                        const targetFalse = currentNodes.find(n => n.id === e.target);
                        if (targetFalse) {
                            setNodes(nds => nds.map(n => n.id === targetFalse.id ? { ...n, data: { ...n.data, status: "skipped" } } : n));
                        }
                        return false;
                    }
                    return true;
                });

                if (node.data.nodeType === "logic") {
                    addLog(`Logic Evaluated: condition (Cap Rate > 8%) was TRUE`, "warn");
                }

                // Add valid next targets to next layer
                for (const e of successfulEdges) {
                    const target = currentNodes.find(n => n.id === e.target);
                    if (target && !nextLayer.some(n => n.id === target.id)) {
                        nextLayer.push(target);
                    }
                }
            }

            activeLayer = nextLayer;
        }

        addLog("Pipeline Execution Complete. Exit Code 0.", "success");
        setIsTesting(false);
    };

    return (
        <div className="w-full h-[750px] bg-[#090e17] rounded-2xl border border-slate-700/60 overflow-hidden relative shadow-2xl flex flex-col mt-4">

            <div className="flex-1 relative overflow-hidden">
                {/* Left Toolbar Dock */}
                <div className="absolute top-1/2 -translate-y-1/2 left-6 z-10 bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 p-2.5 rounded-2xl shadow-xl flex flex-col gap-3">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center border-b border-slate-800 pb-2 mb-1 cursor-default">
                        Add Nodes
                    </div>
                    <button onClick={() => addNodeOfType("trigger", "purple", "Webhook", "Trigger")} className="p-3 bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-400 rounded-xl transition-colors group relative" aria-label="Add Trigger">
                        <Zap size={20} />
                        <span className="absolute left-full ml-3 px-2 py-1 bg-slate-800 text-xs font-medium text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">Trigger Event</span>
                    </button>
                    <button onClick={() => addNodeOfType("action", "slate", "Globe", "Action")} className="p-3 bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-400 rounded-xl transition-colors group relative">
                        <Layers size={20} />
                        <span className="absolute left-full ml-3 px-2 py-1 bg-slate-800 text-xs font-medium text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">Data Action</span>
                    </button>
                    <button onClick={() => addNodeOfType("agent", "blue", "BrainCircuit", "AI Agent")} className="p-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl transition-colors border border-blue-500/20 group relative">
                        <BrainCircuit size={20} />
                        <span className="absolute left-full ml-3 px-2 py-1 bg-slate-800 text-xs font-medium text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">AI Agent</span>
                    </button>
                    <button onClick={() => addNodeOfType("logic", "amber", "GitBranch", "Condition")} className="p-3 bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-400 rounded-xl transition-colors group relative">
                        <GitBranch size={20} />
                        <span className="absolute left-full ml-3 px-2 py-1 bg-slate-800 text-xs font-medium text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">Logic / Branch</span>
                    </button>
                    <button onClick={() => addNodeOfType("endpoint", "emerald", "Send", "Endpoint")} className="p-3 bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-400 rounded-xl transition-colors group relative">
                        <Send size={20} />
                        <span className="absolute left-full ml-3 px-2 py-1 bg-slate-800 text-xs font-medium text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">Data Endpoint</span>
                    </button>
                </div>

                {/* Top Right Header Controls */}
                <div className="absolute top-6 right-6 z-10 flex gap-3 pointer-events-auto shadow-2xl">
                    <button
                        onClick={runTests}
                        disabled={isTesting}
                        className={cn(
                            "px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-lg",
                            isTesting
                                ? "bg-amber-500/20 text-amber-500 border border-amber-500/30 cursor-not-allowed"
                                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20"
                        )}
                    >
                        {isTesting ? (
                            <><Activity size={16} className="animate-pulse" /> Running Pipeline...</>
                        ) : (
                            <><Play size={16} /> Test Execution</>
                        )}
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-blue-600/20">
                        <Save size={16} /> Save Master Flow
                    </button>
                </div>

                {/* Flow Canvas */}
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    fitView
                    fitViewOptions={{ padding: 0.2 }}
                    selectionMode={SelectionMode.Partial}
                    className="bg-transparent"
                >
                    <Background
                        color="#334155"
                        variant={BackgroundVariant.Dots}
                        gap={20}
                        size={2}
                        className="opacity-40"
                    />
                    <Controls
                        className="bg-slate-900 border-slate-700 fill-slate-300 [&>button]:bg-slate-900 [&>button]:border-slate-700 [&>button]:text-slate-300 hover:[&>button]:bg-slate-800 absolute bottom-6 left-28"
                    />
                    <MiniMap
                        nodeColor={() => "#1e293b"}
                        maskColor="rgba(9, 14, 23, 0.8)"
                        className="overflow-hidden shadow-2xl rounded-xl border border-slate-700/80 mb-6 mr-6"
                        style={{ backgroundColor: '#0f172a' }}
                    />
                </ReactFlow>

                {/* Properties Panel Sidebar */}
                {selectedNode && !isTesting && (
                    <div className="absolute top-2 bottom-2 right-2 w-80 bg-slate-900/95 backdrop-blur-3xl border border-slate-700 shadow-2xl rounded-2xl flex flex-col z-20 overflow-hidden translate-x-0 transition-transform shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
                            <div className="flex items-center gap-2">
                                <Settings size={16} className="text-slate-400" />
                                <h3 className="text-xs font-bold text-white uppercase tracking-widest">Node Settings</h3>
                            </div>
                            <button
                                onClick={() => setNodes(nds => nds.map(n => ({ ...n, selected: false })))}
                                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Display Label</label>
                                    <input
                                        type="text"
                                        value={selectedNode.data.label}
                                        onChange={(e) => handleUpdateNode('label', e.target.value)}
                                        className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-outfit"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Description</label>
                                    <textarea
                                        value={selectedNode.data.sublabel}
                                        onChange={(e) => handleUpdateNode('sublabel', e.target.value)}
                                        rows={2}
                                        className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                                    />
                                </div>
                            </div>

                            <div className="h-px w-full bg-slate-800/80"></div>

                            {/* Node Type Specific Configurations */}
                            <div className="space-y-4">
                                <label className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Code2 size={14} /> Execution config
                                </label>

                                {selectedNode.data.nodeType === 'trigger' && (
                                    <div>
                                        <label className="text-xs text-slate-500 mb-1 block">Webhook Endpoint</label>
                                        <div className="flex bg-slate-950 border border-slate-700 rounded-lg overflow-hidden font-mono text-xs">
                                            <span className="bg-slate-800 text-slate-400 px-2 py-2 border-r border-slate-700">POST</span>
                                            <input type="text" readOnly defaultValue={`https://api.folio.com/hook/${selectedNode.id}`} className="bg-transparent px-2 py-2 text-slate-300 w-full focus:outline-none" />
                                        </div>
                                    </div>
                                )}

                                {selectedNode.data.nodeType === 'action' && (
                                    <div>
                                        <label className="text-xs text-slate-500 mb-1 block">API HTTP Request</label>
                                        <input
                                            type="text"
                                            value={selectedNode.data.action}
                                            onChange={(e) => handleUpdateNode('action', e.target.value)}
                                            className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2.5 font-mono text-xs text-indigo-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                        />
                                        <label className="text-xs text-slate-500 mt-3 mb-1 block">JSON Request Body</label>
                                        <textarea
                                            rows={4}
                                            placeholder="{}"
                                            className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 font-mono text-xs text-indigo-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                                        ></textarea>
                                    </div>
                                )}

                                {selectedNode.data.nodeType === 'agent' && (
                                    <div>
                                        <label className="text-xs text-slate-500 mb-1 block">Agent Prompt Directives</label>
                                        <textarea
                                            rows={6}
                                            value={selectedNode.data.action}
                                            onChange={(e) => handleUpdateNode('action', e.target.value)}
                                            placeholder="You are an expert underwriter..."
                                            className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none leading-relaxed"
                                        />
                                    </div>
                                )}

                                {selectedNode.data.nodeType === 'logic' && (
                                    <div>
                                        <label className="text-xs text-slate-500 mb-1 block">Evaluation Expression (JS)</label>
                                        <input
                                            type="text"
                                            value={selectedNode.data.action || "data.capRate > 0.08"}
                                            onChange={(e) => handleUpdateNode('action', e.target.value)}
                                            className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2.5 font-mono text-xs text-amber-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                                        />
                                    </div>
                                )}

                                {selectedNode.data.nodeType === 'endpoint' && (
                                    <div>
                                        <label className="text-xs text-slate-500 mb-1 block">Destination Route</label>
                                        <input
                                            type="text"
                                            value={selectedNode.data.action}
                                            onChange={(e) => handleUpdateNode('action', e.target.value)}
                                            className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2.5 font-mono text-xs text-emerald-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Extra stats showing off 'technical' aesthetic */}
                            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mt-8">
                                <div className="flex items-center gap-2 mb-3 cursor-default">
                                    <Database size={14} className="text-slate-500" />
                                    <span className="text-xs font-semibold text-slate-400">NODE METADATA</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                                    <div className="text-slate-500">Node ID:</div>
                                    <div className="text-slate-300 text-right truncate" title={selectedNode.id}>{selectedNode.id}</div>
                                    <div className="text-slate-500">Last run:</div>
                                    <div className="text-slate-300 text-right">Today, 08:31 AM</div>
                                    <div className="text-slate-500">Avg execution:</div>
                                    <div className="text-slate-300 text-right">241ms</div>
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </div>

            {/* Execution / Developer Terminal Panel */}
            {showTerminal && (
                <div className={cn(
                    "bg-[#0A0A0A] border-t border-slate-800 transition-all duration-300 ease-in-out flex flex-col z-30",
                    terminalExpanded ? "h-64" : "h-36"
                )}>
                    {/* Terminal Header */}
                    <div className="flex items-center justify-between px-4 py-1.5 bg-slate-900 border-b border-slate-800/80">
                        <div className="flex items-center gap-2">
                            <Terminal size={14} className="text-emerald-500" />
                            <span className="text-xs font-mono font-medium text-slate-300">pipeline_execution_logs.sh</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <button onClick={() => setTerminalExpanded(!terminalExpanded)} className="p-1 hover:bg-slate-800 text-slate-500 hover:text-slate-300 rounded transition-colors">
                                {terminalExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                            </button>
                            <button onClick={() => setShowTerminal(false)} className="p-1 hover:bg-slate-800 text-slate-500 hover:text-slate-300 rounded transition-colors">
                                <X size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Terminal Console Output */}
                    <div className="flex-1 overflow-y-auto p-3 font-mono text-[11px] leading-relaxed custom-scrollbar opacity-[0.98]">
                        <div className="space-y-1">
                            {executionLogs.map((log, i) => (
                                <div key={i} className="flex gap-3 hover:bg-white/5 px-2 py-0.5 rounded">
                                    <span className="text-slate-600 select-none min-w-[65px]">{log.time}</span>
                                    <span className={cn(
                                        "flex-1 flex gap-2 items-center",
                                        log.type === "info" && "text-slate-400",
                                        log.type === "warn" && "text-amber-300",
                                        log.type === "success" && "text-emerald-400 font-medium tracking-wide",
                                        log.type === "error" && "text-rose-400"
                                    )}>
                                        <span className={cn(
                                            "text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-sm flex-shrink-0",
                                            log.type === "info" && "bg-slate-800 text-slate-400",
                                            log.type === "warn" && "bg-amber-500/10 text-amber-500",
                                            log.type === "success" && "bg-emerald-500/10 text-emerald-500",
                                            log.type === "error" && "bg-rose-500/10 text-rose-500"
                                        )}>
                                            {log.type}
                                        </span>
                                        {log.msg}
                                    </span>
                                </div>
                            ))}
                            {isTesting && (
                                <div className="flex gap-3 px-2 py-0.5 items-center text-slate-500">
                                    <span className="opacity-0">00:00:00</span>
                                    <span className="w-1.5 h-3.5 bg-slate-500 animate-pulse"></span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
