import { useCallback, useEffect, useRef, useState } from "react";
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
} from "reactflow";
import { initialEdges, initialNodes } from "./flowDefinitions";
import { css } from "@emotion/css";
import "reactflow/dist/style.css";
import { buildQuantizationFunc } from "./buildQuantizationFunc";
import { NodeType, nodeTypes } from "./Nodes/types";
import { FlowPanel } from "./FlowPanel";
import { useShaderFuncState } from "../../state/shaderFuncState";

export const FunctionFlow: React.FC = () => {
  const [nodeCnt, setNodeCnt] = useState(initialNodes.length);
  const [edgeCnt, setEdgeCnt] = useState(initialEdges.length);
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [shouldBuildFunc, setShouldBuildFunc] = useState(true);

  const { setShaderFunc } = useShaderFuncState();

  useEffect(() => {
    if (!shouldBuildFunc) {
      return;
    }

    const { result: func, isValid } = buildQuantizationFunc(nodes, edges);

    console.log(func);
    console.log(isValid);

    if (isValid) {
      setShaderFunc(func);
    }

    setShouldBuildFunc(false);
  }, [nodes, edges]);

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
        (edge) => edge.target !== target || edge.targetHandle !== targetHandle
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
    setShouldBuildFunc(true);
  };

  const edgeUpdateSuccessful = useRef(true);

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, [edgeUpdateSuccessful]);

  const onEdgeUpdate: OnEdgeUpdateFunc = useCallback(
    (oldEdge, newConnection) => {
      edgeUpdateSuccessful.current = true;
      setEdges((prev) => {
        // No duplicate edges.
        const noDuplicateEdges = prev.filter(
          (edge) =>
            (edge.target !== newConnection.target ||
              edge.targetHandle !== newConnection.targetHandle) &&
            edge.id !== oldEdge.id
        );
        return [
          ...noDuplicateEdges,
          {
            id: oldEdge.id,
            source: newConnection.source ?? "",
            sourceHandle: newConnection.sourceHandle ?? "",
            target: newConnection.target ?? "",
            targetHandle: newConnection.targetHandle ?? "",
          },
        ];
      });
    },
    [edgeUpdateSuccessful]
  );

  const onEdgeUpdateEnd = useCallback(
    (_: any, edge: Edge) => {
      if (!edgeUpdateSuccessful.current) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }

      edgeUpdateSuccessful.current = true;
      setShouldBuildFunc(true);
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
