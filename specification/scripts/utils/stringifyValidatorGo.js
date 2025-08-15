import t from "../../dist/index.js";

export let generatedCode = [];
export default function stringifyValidatorGo(validator, nodePrefix) {
    if (validator === undefined) {
        return "interface{}";
    }
    
    if (validator.each) {
        return `[]${stringifyValidatorGo(validator.each, nodePrefix)}`;
    }
    
    if (validator.chainOf) {
        return stringifyValidatorGo(validator.chainOf[1], nodePrefix);
    }
    
    if (validator.oneOf) {
        return "string";
        // return validator.oneOf.map(JSON.stringify).join(" | ");
    }
    
    if (validator.oneOfNodeTypes) {
        const nodes = validator.oneOfNodeTypes;
        if (nodes.length === 1) {
            return getType(nodes[0]);
        } else {
            return "UNode";
        }
        // return validator.oneOfNodeTypes.map(_ => nodePrefix + _).join(" | ");
    }
    
    if (validator.oneOfNodeOrValueTypes) {
        const nodes = validator.oneOfNodeOrValueTypes.filter(_ => !isValueType(_));
        if (nodes.length === 0) {
            return "string";
        } else if (nodes.length === 1) {
            return getType(nodes[0]);
        } else {
            return "Instruction"
        }
        // return validator.oneOfNodeOrValueTypes
        //   .map(_ => {
        //     return isValueType(_) ? _ : nodePrefix + _;
        //   })
        //   .join(" | ");
    }
    
    if (validator.type) {
        if (isValueType(validator.type)) {
            const typeTable = {
                "string": "string",
                "boolean": "bool",
                "number": "int"
            }
            let type = typeTable[validator.type];
            return type || "string";
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
    
    return "interface{}";
}

/**
 * Heuristic to decide whether or not the given type is a value type (eg. "null")
 * or a Node type (eg. "Expression").
 */
function isValueType(type) {
    return type.charAt(0).toLowerCase() === type.charAt(0);
}


function getType(typ) {
    if (isValueType(typ)) {
        const typeTable = {
            "string": "string",
            "boolean": "bool",
            "number": "int"
        }
        let type = typeTable[typ];
        return type || "string";
    } else if (t.NODE_FIELDS[typ]) {
        return '*' + typ
    }
    return typ;
}
