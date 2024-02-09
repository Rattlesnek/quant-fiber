import { Node, Edge } from "reactflow";
import { NodeType } from "./Nodes/types";

type FuncResult = {
  result: string;
  isValid: boolean;
};

const invalidResult: FuncResult = {
  result: "||NULL||",
  isValid: false,
};

const validResult = (result: string): FuncResult => ({
  result: result,
  isValid: true,
});

const getInputParam = (currentNode: Node, currentEdge: Edge): string | null => {
  if (currentNode.type !== NodeType.inputPosition) {
    return null;
  }
  return currentEdge.sourceHandle ?? null;
};

const getOutputFunc = (
  nodes: Node[],
  edges: Edge[],
  currentNode: Node
): FuncResult => {
  const inEdge = edges.find((edge) => edge.target === currentNode.id);
  if (!inEdge) {
    return invalidResult;
  }
  const inNode = nodes.find((node) => node.id === inEdge.source)!;

  const inputParam = getInputParam(inNode, inEdge);
  if (inputParam !== null) {
    return validResult(`    return ${inputParam};\n`);
  }

  const previousResult = getQuantFunc(nodes, edges, inNode);

  const result = `${previousResult.result}    return ${inEdge.source};\n`;
  return { result, isValid: previousResult.isValid };
};

const getBasicMath = (
  nodes: Node[],
  edges: Edge[],
  currentNode: Node
): FuncResult => {
  const inEdges = edges.filter((edge) => edge.target === currentNode.id);
  if (inEdges.length === 0) {
    return invalidResult;
  }

  const previousResults: FuncResult[] = [];
  const operationArgs: string[] = [];
  inEdges.forEach((inEdge) => {
    const inNode = nodes.find((node) => node.id === inEdge.source)!;
    const inputParam = getInputParam(inNode, inEdge);
    if (inputParam !== null) {
      operationArgs.push(inputParam);
      return;
    }

    operationArgs.push(inEdge.source);
    const previousResult = getQuantFunc(nodes, edges, inNode);
    previousResults.push(previousResult);
  });

  const result = `${previousResults.map((r) => r.result).join()}    float ${
    currentNode.id
  } = ${operationArgs.join(" + ")};\n`;

  return {
    result,
    isValid: previousResults.reduce((prev, curr) => prev && curr.isValid, true),
  };
};

const getPeriodicFunc = (
  nodes: Node[],
  edges: Edge[],
  currentNode: Node
): FuncResult => {
  const inEdge = edges.find((edge) => edge.target === currentNode.id);
  if (!inEdge) {
    return invalidResult;
  }
  const inNode = nodes.find((node) => node.id === inEdge.source)!;

  const inputParam = getInputParam(inNode, inEdge);
  if (inputParam !== null) {
    return validResult(`    float ${currentNode.id} = sin(${inputParam});\n`);
  }

  const previousResult = getQuantFunc(nodes, edges, inNode);

  const result = `${previousResult.result}    float ${currentNode.id} = sin(${inEdge.source});\n`;
  return { result, isValid: previousResult.isValid };
};

const getQuantFunc = (
  nodes: Node[],
  edges: Edge[],
  currentNode: Node
): FuncResult => {
  switch (currentNode.type) {
    case NodeType.outputFunc:
      return getOutputFunc(nodes, edges, currentNode);

    case NodeType.basicMath:
      return getBasicMath(nodes, edges, currentNode);

    case NodeType.periodicFunc:
      return getPeriodicFunc(nodes, edges, currentNode);

    default:
      break;
  }

  return invalidResult;
};

export const buildQuantizationFunc = (
  nodes: Node[],
  edges: Edge[]
): FuncResult => {
  const outputNode = nodes.find((node) => node.type === NodeType.outputFunc)!;
  const functionContent = getQuantFunc(nodes, edges, outputNode);

  const functionWrapped = `float function(float xPos, float yPos, float time)\n{\n${functionContent.result}}\n`;

  return {
    result: functionWrapped,
    isValid: functionContent.isValid,
  };
};
