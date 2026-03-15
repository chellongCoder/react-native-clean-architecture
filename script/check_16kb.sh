#!/bin/bash
DIR="$1"
found_issues=0
declare -A bad_pkgs

while IFS= read -r -d '' so_file; do
    # Check if the file has a LOAD segment with 4KB (2**12) alignment
    if objdump -p "$so_file" 2>/dev/null | grep -q 'LOAD.*align 2\*\*12'; then
        # It has 4KB alignment, extract package name from path
        if [[ "$so_file" == *"node_modules"* ]]; then
            pkg=$(echo "$so_file" | sed -E 's|.*node_modules/(@?[^/]+(/[^/]+)?).*|\1|')
            bad_pkgs["$pkg"]=1
            found_issues=1
        fi
    fi
done < <(find "$DIR" -name "*.so" -type f -print0)

if [ $found_issues -eq 1 ]; then
    echo "Các thư viện chưa hỗ trợ 16KB (Alignment: 4KB / 2**12):"
    for pkg in "${!bad_pkgs[@]}"; do
        echo "- $pkg"
    done
else
    echo "Tất cả các file .so đều đã an toàn hoặc không dùng 4KB alignment!"
fi
