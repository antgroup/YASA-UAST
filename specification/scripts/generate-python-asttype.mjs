import path from "path";
import { fileURLToPath } from "url";
import generateAstTypes from "./generators/ast-types-python.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..");
const outputDir = path.join(repoRoot, "parser-Python", "uast");

generateAstTypes(outputDir);
