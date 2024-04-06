import { Handle, Node, NodeProps, Position } from "reactflow";
import { nodeStyles } from "./nodeStyles";
import { NodeType } from "./types";

export type InputPositionNodeData = {};

export type InputPositionNodeObject = Node<
  InputPositionNodeData,
  NodeType.inputPosition
>;

export const InputPositionNode: React.FC<
  NodeProps<InputPositionNodeData>
> = () => {
  return (
    <div className={nodeStyles.node}>
      Input
      <Handle
        id="xPos"
        type="source"
        position={Position.Right}
        style={{ top: "10px" }}
      />
      <Handle
        id="yPos"
        type="source"
        position={Position.Right}
        style={{ top: "30px" }}
      />
    </div>
  );
};
