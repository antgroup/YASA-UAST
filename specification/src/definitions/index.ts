import toFastProperties from "to-fast-properties";
import "./core";
import {
  VISITOR_KEYS,
  ALIAS_KEYS,
  FLIPPED_ALIAS_KEYS,
  NODE_FIELDS,
  BUILDER_KEYS,
  DEPRECATED_KEYS,
  NODE_PARENT_VALIDATIONS,
  NODE_COMMENTS,
  NODE_FIELD_COMMENTS,
} from "./utils";
import {
  PLACEHOLDERS,
  PLACEHOLDERS_ALIAS,
  PLACEHOLDERS_FLIPPED_ALIAS,
} from "./placeholders";

// We do this here, because at this point the visitor keys should be ready and setup
toFastProperties(VISITOR_KEYS);
toFastProperties(ALIAS_KEYS);
toFastProperties(FLIPPED_ALIAS_KEYS);
toFastProperties(NODE_FIELDS);
toFastProperties(BUILDER_KEYS);
toFastProperties(DEPRECATED_KEYS);

toFastProperties(PLACEHOLDERS_ALIAS);
toFastProperties(PLACEHOLDERS_FLIPPED_ALIAS);
toFastProperties(NODE_COMMENTS);
toFastProperties(NODE_FIELD_COMMENTS);

const TYPES: Array<string> = [].concat(
    Object.keys(VISITOR_KEYS),
    Object.keys(FLIPPED_ALIAS_KEYS),
    Object.keys(DEPRECATED_KEYS),
);

export {
  VISITOR_KEYS,
  ALIAS_KEYS,
  FLIPPED_ALIAS_KEYS,
  NODE_FIELDS,
  BUILDER_KEYS,
  DEPRECATED_KEYS,
  NODE_PARENT_VALIDATIONS,
  PLACEHOLDERS,
  PLACEHOLDERS_ALIAS,
  PLACEHOLDERS_FLIPPED_ALIAS,
  TYPES,
  NODE_COMMENTS,
  NODE_FIELD_COMMENTS,
};
