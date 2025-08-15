import { isIdentifier, isLiteral } from "../validators/generated";
import cloneNode from "../clone/cloneNode";
import removePropertiesDeep from "../modifications/removePropertiesDeep";
import type * as t from "..";

export default function toKeyAlias(
  node: any,
  key: t.Node = node.key,
): string {
  let alias;

  if (node.kind === "method") {
    return toKeyAlias.increment() + "";
  } else if (isIdentifier(key)) {
    alias = key.name;
  } else if (isLiteral(key)) {
    alias = JSON.stringify(key.value);
  } else {
    alias = JSON.stringify(removePropertiesDeep(cloneNode(key)));
  }

  if (node.computed) {
    alias = `[${alias}]`;
  }

  if (node.static) {
    alias = `static:${alias}`;
  }

  return alias;
}

toKeyAlias.uid = 0;

toKeyAlias.increment = function () {
  if (toKeyAlias.uid >= Number.MAX_SAFE_INTEGER) {
    return (toKeyAlias.uid = 0);
  } else {
    return toKeyAlias.uid++;
  }
};
