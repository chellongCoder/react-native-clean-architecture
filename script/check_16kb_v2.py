#!/usr/bin/env python3
import os
import sys
import subprocess
import re

def main():
    directory = sys.argv[1]
    bad_pkgs = set()
    total = 0
    for root, _, files in os.walk(directory):
        for name in files:
            if name.endswith('.so'):
                total += 1
                filepath = os.path.join(root, name)
                try:
                    out = subprocess.check_output(['objdump', '-p', filepath], stderr=subprocess.DEVNULL).decode('utf-8', errors='ignore')
                    if 'align 2**12' in out:
                        parts = filepath.split('/')
                        if 'node_modules' in parts:
                            idx = parts.index('node_modules')
                            pkg = parts[idx + 1]
                            if pkg.startswith('@') and idx + 2 < len(parts):
                                pkg += '/' + parts[idx + 2]
                            bad_pkgs.add(pkg)
                        else:
                            # Fallback if not in node_modules (e.g., scanning android folder)
                            bad_pkgs.add(name)
                except Exception:
                    pass

    print(f"Total .so files checked: {total}")
    if bad_pkgs:
        print("\nCác thư viện chưa hỗ trợ 16KB (Alignment 4KB - 2**12):")
        for pkg in sorted(bad_pkgs):
            print(f"- {pkg}")
    else:
        print("\nTất cả các file .so đều đã an toàn hoặc không dùng 4KB alignment!")

if __name__ == '__main__':
    main()
