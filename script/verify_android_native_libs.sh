#!/bin/bash

set -euo pipefail

ARTIFACT_PATH="${1:-}"

if [ -z "$ARTIFACT_PATH" ]; then
    echo "Usage: $0 <path-to-aab-or-apk>"
    exit 1
fi

if [ ! -f "$ARTIFACT_PATH" ]; then
    echo "Artifact not found: $ARTIFACT_PATH"
    exit 1
fi

artifact_entries="$(unzip -Z1 "$ARTIFACT_PATH")"
required_abi="arm64-v8a"
required_libs=(
    "libreactnative.so"
    "libhermes.so"
    "libfbjni.so"
    "libc++_shared.so"
)
forbidden_abis=(
    "x86"
    "x86_64"
)

contains_entry() {
    local relative_path="$1"
    grep -Fq -e "lib/${relative_path}" -e "base/lib/${relative_path}" <<< "$artifact_entries"
}

echo "Verifying native libraries in $ARTIFACT_PATH"

for lib_name in "${required_libs[@]}"; do
    if ! contains_entry "${required_abi}/${lib_name}"; then
        echo "Missing required native library for ${required_abi}: ${lib_name}"
        exit 1
    fi
done

for abi_name in "${forbidden_abis[@]}"; do
    if printf '%s\n' "$artifact_entries" | grep -Eq "(^|.*/)lib/${abi_name}/"; then
        echo "Unexpected native libraries found for unsupported ABI: ${abi_name}"
        exit 1
    fi
done

echo "Native library verification passed for ${required_abi}"
