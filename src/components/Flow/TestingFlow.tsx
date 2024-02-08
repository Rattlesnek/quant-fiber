import { useCallback, useRef, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  OnEdgesChange,
  OnNodesChange,
  OnConnect,
  applyEdgeChanges,
  applyNodeChanges,
  Node,
  Edge,
  SelectionMode,
  OnEdgeUpdateFunc,
  updateEdge,
} from "reactflow";
import { initialEdges, initialNodes } from "./flowDefinitions";
import { css } from "@emotion/css";
import "reactflow/dist/style.css";
import { getQuantizationFunc } from "./getQuantizationFunc";
import { NodeType, nodeTypes } from "./Nodes/types";
import { FlowPanel } from "./FlowPanel";

export const TestingFlow: React.FC = () => {
  const [nodeCnt, setNodeCnt] = useState(initialNodes.length);
  const [edgeCnt, setEdgeCnt] = useState(initialEdges.length);
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const func = getQuantizationFunc(nodes, edges);
  console.log(func.result);
  console.log(func.success);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect: OnConnect = ({
    source,
    sourceHandle,
    target,
    targetHandle,
  }) => {
    // No self connecting edge.
    if (source === target) {
      return;
    }

    setEdges((prev) => {
      // No duplicate edges.
      const noDuplicateEdges = prev.filter(
        (edge) =>
          (edge.source !== source || edge.sourceHandle !== sourceHandle) &&
          (edge.target !== target || edge.targetHandle !== targetHandle)
      );

      return [
        ...noDuplicateEdges,
        {
          id: `${source}-${target}-${edgeCnt}`,
          source: source ?? "",
          sourceHandle: sourceHandle ?? "",
          target: target ?? "",
          targetHandle: targetHandle ?? "",
        },
      ];
    });
    setEdgeCnt((prev) => prev + 1);
  };

  const edgeUpdateSuccessful = useRef(true);

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, [edgeUpdateSuccessful]);

  const onEdgeUpdate: OnEdgeUpdateFunc = useCallback(
    (oldEdge, newConnection) => {
      edgeUpdateSuccessful.current = true;
      setEdges((els) => updateEdge(oldEdge, newConnection, els));
    },
    [edgeUpdateSuccessful]
  );

  const onEdgeUpdateEnd = useCallback(
    (_: any, edge: Edge) => {
      if (!edgeUpdateSuccessful.current) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }

      edgeUpdateSuccessful.current = true;
    },
    [edgeUpdateSuccessful]
  );

  const addNode = (nodeType: NodeType): void => {
    setNodes((prev) => [
      ...prev,
      {
        id: `${nodeType}_${nodeCnt}`,
        type: nodeType,
        data: {},
        position: { x: 0, y: -50 },
      },
    ]);
    setNodeCnt((prev) => prev + 1);
  };

  return (
    <div className={styles.reactFlow}>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgeUpdate={onEdgeUpdate}
        onEdgeUpdateStart={onEdgeUpdateStart}
        onEdgeUpdateEnd={onEdgeUpdateEnd}
        fitView
        panOnScroll
        selectionOnDrag
        panOnDrag={[1, 2]}
        selectionMode={SelectionMode.Partial}
      >
        <FlowPanel addNode={addNode} />
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Cross} />
      </ReactFlow>
    </div>
  );
};

const styles = {
  reactFlow: css`
    position: absolute;
    width: 100%;
    height: 100%;
  `,
};
