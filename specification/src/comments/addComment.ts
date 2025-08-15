import addComments from "./addComments";
import type * as t from "..";

/**
 * Add comment of certain type to a node.
 */
export default function addComment<T extends t.Node>(
  node: T,
  type: string,
  content: string,
  line?: boolean,
): T {
  return addComments(node, type, [
    {
      type: line ? "CommentLine" : "CommentBlock",
      value: content,
    } ,
  ]);
}
