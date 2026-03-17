#!/bin/bash
# 先跑全量测试，通过后再打新 tag 并 push，避免对已有 tag 重复建 release（422 already_exists）
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

# 1) 全量测试
echo "========== Running full test suite =========="
./test.sh

# 2) 决定新 tag
LATEST_TAG=$(git tag -l 'v*' 2>/dev/null | sort -V | tail -1 || true)
if [ -z "$LATEST_TAG" ]; then
  NEW_TAG="v0.1.0"
else
  # 默认 bump patch：v0.2.00 -> v0.2.01
  if [ -n "${1:-}" ]; then
    NEW_TAG="$1"
  else
    if [[ "$LATEST_TAG" =~ ^v([0-9]+)\.([0-9]+)\.([0-9]+)$ ]]; then
      MAJOR="${BASH_REMATCH[1]}"
      MINOR="${BASH_REMATCH[2]}"
      PATCH="${BASH_REMATCH[3]}"
      PATCH=$((10#$PATCH + 1))
      NEW_TAG="v${MAJOR}.${MINOR}.${PATCH}"
    else
      echo "Cannot auto-bump tag from: $LATEST_TAG (expected vX.Y.Z)"
      echo "Usage: $0 [NEW_TAG]   e.g. $0 v0.2.01"
      exit 1
    fi
  fi
fi

# 避免重复：本地/远程已存在则报错
if git rev-parse "$NEW_TAG" >/dev/null 2>&1; then
  echo "Error: tag $NEW_TAG already exists locally. Use a new tag or delete it first."
  exit 1
fi
if git ls-remote --exit-code --tags origin "$NEW_TAG" >/dev/null 2>&1; then
  echo "Error: tag $NEW_TAG already exists on origin. Use a new tag."
  exit 1
fi

# 3) 打 tag 并 push
echo ""
echo "========== Creating and pushing tag: $NEW_TAG =========="
git tag -a "$NEW_TAG" -m "Release $NEW_TAG"
git push origin "$NEW_TAG"

echo ""
echo "Done. CI will create the release for $NEW_TAG."
