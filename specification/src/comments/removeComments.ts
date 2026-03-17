import { COMMENT_KEYS } from "../constants";
import type * as t from "../ast-types/generated";

/**
 * Remove comment properties from a node.
 */
export default function removeComments<T extends t.Node>(node: T): T {
  COMMENT_KEYS.forEach(key => {
    node[key] = null;
  });

  return node;
}
