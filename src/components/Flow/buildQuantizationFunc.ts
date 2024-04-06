import { Node, Edge } from "reactflow";
import { NodeObject, NodeType } from "./Nodes/types";
import { BasicMathNodeObject, BasicMathOp } from "./Nodes/BasicMathNode";
import { OutputFuncNodeObject } from "./Nodes/OutputFuncNode";
import { PeriodicFuncNodeObject } from "./Nodes/PeriodicFuncNode";

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
  nodes: NodeObject[],
  edges: Edge[],
  currentNode: OutputFuncNodeObject
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

const basicMathOpMapping: Record<BasicMathOp, string> = {
  [BasicMathOp.Add]: "+",
  [BasicMathOp.Sub]: "-",
  [BasicMathOp.Mul]: "*",
  [BasicMathOp.Div]: "/",
};

const getBasicMath = (
  nodes: NodeObject[],
  edges: Edge[],
  currentNode: BasicMathNodeObject
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

  const { operation } = currentNode.data;
  const result = `${previousResults.map((r) => r.result).join()}    float ${
    currentNode.id
  } = ${operationArgs.join(` ${basicMathOpMapping[operation]} `)};\n`;

  return {
    result,
    isValid: previousResults.reduce((prev, curr) => prev && curr.isValid, true),
  };
};

const getPeriodicFunc = (
  nodes: NodeObject[],
  edges: Edge[],
  currentNode: PeriodicFuncNodeObject
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
  nodes: NodeObject[],
  edges: Edge[],
  currentNode: NodeObject
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
  nodes: NodeObject[],
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
