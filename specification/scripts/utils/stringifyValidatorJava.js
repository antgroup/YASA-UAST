export let generatedCode = [];
export default function stringifyValidatorJava(validator, nodePrefix) {
  if (validator === undefined) {
    return "Object";
  }

  if (validator.each) {
    return `List<${stringifyValidatorJava(validator.each, nodePrefix)}>`;
  }

  if (validator.chainOf) {
    return stringifyValidatorJava(validator.chainOf[1], nodePrefix);
  }

  if (validator.oneOf) {
    return "String";
    // return validator.oneOf.map(JSON.stringify).join(" | ");
  }

  if (validator.oneOfNodeTypes) {
    const nodes = validator.oneOfNodeTypes;
    if (nodes.length === 1){
      return nodes[0];
    }else{
      return "ASTNode";
    }
    // return validator.oneOfNodeTypes.map(_ => nodePrefix + _).join(" | ");
  }

  if (validator.oneOfNodeOrValueTypes) {
    const nodes = validator.oneOfNodeOrValueTypes.filter(_ => !isValueType(_));
   if (nodes.length === 0){
     return "String";
   }else if (nodes.length === 1){
     return nodes[0];
   }else{
     return "Instruction"
   }
    // return validator.oneOfNodeOrValueTypes
    //   .map(_ => {
    //     return isValueType(_) ? _ : nodePrefix + _;
    //   })
    //   .join(" | ");
  }

  if (validator.type) {
    if(isValueType(validator.type)){
      const typeTable = {
        "string":"String",
        "boolean": "boolean",
        "number": "int"
      }
      let type = typeTable[validator.type];
      return type||"String";
    }
  }

  // if (validator.shapeOf) {
  //   return (
  //     "{ " +
  //     Object.keys(validator.shapeOf)
  //       .map(shapeKey => {
  //         const propertyDefinition = validator.shapeOf[shapeKey];
  //         if (propertyDefinition.validate) {
  //           const isOptional =
  //             propertyDefinition.optional || propertyDefinition.default != null;
  //           return (
  //             shapeKey +
  //             (isOptional ? "?: " : ": ") +
  //             stringifyValidator(propertyDefinition.validate)
  //           );
  //         }
  //         return null;
  //       })
  //       .filter(Boolean)
  //       .join(", ") +
  //     " }"
  //   );
  // }

  return "Object";
}

/**
 * Heuristic to decide whether or not the given type is a value type (eg. "null")
 * or a Node type (eg. "Expression").
 */
function isValueType(type) {
  return type.charAt(0).toLowerCase() === type.charAt(0);
}
