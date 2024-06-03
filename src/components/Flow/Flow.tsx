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
  OnEdgeUpdateFunc,
} from "reactflow";
import {
  getDefaultNodeObjectBasedOnNodeType,
  initialEdges,
  initialNodes,
} from "./flowDefinitions";
import { css } from "@emotion/css";
import "reactflow/dist/style.css";
import { buildQuantizationFunc } from "./buildQuantizationFunc";
import {
  NodeObject,
  NodeType,
  OnNodeDataChange,
  nodeTypes,
} from "./Nodes/types";
import { FlowPanel } from "./FlowPanel";
import { useShaderFuncState } from "../../state/shaderFuncState";

interface FlowProps {}

export const Flow: React.FC<FlowProps> = () => {
  const [nodeCnt, setNodeCnt] = useState(initialNodes.length);
  const [edgeCnt, setEdgeCnt] = useState(initialEdges.length);
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [shouldBuildFunc, setShouldBuildFunc] = useState(true);

  const { setShaderFunc } = useShaderFuncState();

  const onNodeDataChange: OnNodeDataChange = useCallback<OnNodeDataChange>(
    (nodeId, nodeData) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id !== nodeId) {
            return node;
          }

          return {
            ...node,
            data: nodeData,
          };
        })
      );
      setShouldBuildFunc(true);
    },
    []
  );

  useEffect(() => {
    // Inject onNodeDataChange function to initial nodes.
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onNodeDataChange,
        },
      }))
    );
  }, [onNodeDataChange]);

  useEffect(() => {
    if (!shouldBuildFunc) {
      return;
    }

    const { result: func, isValid } = buildQuantizationFunc(
      nodes as NodeObject[],
      edges
    );

    console.log(func);
    console.log(isValid);

    if (isValid) {
      setShaderFunc(func);
    }

    setShouldBuildFunc(false);
  }, [shouldBuildFunc, nodes, edges, setShaderFunc, setShouldBuildFunc]);

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
    (_: MouseEvent | TouchEvent, edge: Edge) => {
      if (!edgeUpdateSuccessful.current) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }

      edgeUpdateSuccessful.current = true;
      setShouldBuildFunc(true);
    },
    [edgeUpdateSuccessful]
  );

  const addNode = useCallback(
    (nodeType: NodeType, position: { x: number; y: number }): void => {
      setNodes((prev) => [
        ...prev,
        getDefaultNodeObjectBasedOnNodeType({
          nodeType,
          nodeId: nodeCnt,
          position,
          onNodeDataChange,
        }),
      ]);
      setNodeCnt((prev) => prev + 1);
    },
    [nodeCnt, onNodeDataChange]
  );

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
        <FlowPanel
          addNode={(nodeType) => addNode(nodeType, { x: 0, y: -50 })}
        />
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
