import { isClassDefinition, isFunctionDefinition } from "./generated";
import type * as t from "..";

/**
 * Check if the input `node` is block scoped.
 */
export default function isBlockScoped(node: t.Node): boolean {
  return isFunctionDefinition(node) || isClassDefinition(node) ;
}
