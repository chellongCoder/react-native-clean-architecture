#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ARTIFACT_PATH="${1:-}"

if [ -z "$ARTIFACT_PATH" ]; then
    echo "Usage: $0 <path-to-aab-or-apk>"
    exit 1
fi

bash "${SCRIPT_DIR}/verify_android_native_libs.sh" "$ARTIFACT_PATH"

tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT

case "$ARTIFACT_PATH" in
    *.aab)
        unzip -qq "$ARTIFACT_PATH" 'base/lib/*' -d "$tmp_dir"
        ;;
    *.apk)
        unzip -qq "$ARTIFACT_PATH" 'lib/*' -d "$tmp_dir"
        ;;
    *)
        unzip -qq "$ARTIFACT_PATH" 'base/lib/*' 'lib/*' -d "$tmp_dir" >/dev/null 2>&1 || true
        ;;
esac

if [ -d "$tmp_dir/base/lib" ]; then
    libs_dir="$tmp_dir/base/lib"
elif [ -d "$tmp_dir/lib" ]; then
    libs_dir="$tmp_dir/lib"
else
    echo "Could not locate extracted native libraries in $ARTIFACT_PATH"
    exit 1
fi

check_output="$(bash "${SCRIPT_DIR}/check_16kb.sh" "$libs_dir")"
printf '%s\n' "$check_output"

if printf '%s\n' "$check_output" | grep -Fq "chưa hỗ trợ 16KB"; then
    echo "16KB alignment verification failed"
    exit 1
fi

echo "Release artifact verification passed"
