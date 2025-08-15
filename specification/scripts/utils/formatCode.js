import prettier from "prettier";
import path from 'path';

export default function formatCode(code, filename) {
  const prettierConfig = prettier.resolveConfig.sync(path.join(process.cwd(),filename));
  prettierConfig.filepath = filename;
  prettierConfig.parser = filename.endsWith(".ts") ? "babel-ts" : "babel";

  return prettier.format(code, prettierConfig);
}
