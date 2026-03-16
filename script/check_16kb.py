import os
import sys
import struct

def check_elf_alignment(filepath):
    try:
        with open(filepath, 'rb') as f:
            e_ident = f.read(16)
            if e_ident[:4] != b'\x7fELF':
                return None
            
            ei_class = e_ident[4] # 1: 32-bit, 2: 64-bit
            ei_data = e_ident[5]  # 1: little-endian, 2: big-endian
            
            endian = '<' if ei_data == 1 else '>'
            
            # Read ELF header
            if ei_class == 1: # 32-bit
                hdr = f.read(36)
                if len(hdr) < 36: return None
                e_type, e_machine, e_version, e_entry, e_phoff, e_shoff, e_flags, e_ehsize, e_phentsize, e_phnum = struct.unpack(endian + 'HHIIIIIIHH', hdr[:32])
                ph_struct = endian + 'IIIIIIII'
                ph_size = 32
                align_idx = 7
            elif ei_class == 2: # 64-bit
                hdr = f.read(48)
                if len(hdr) < 48: return None
                e_type, e_machine, e_version, e_entry, e_phoff, e_shoff, e_flags, e_ehsize, e_phentsize, e_phnum = struct.unpack(endian + 'HHIQQQIHHH', hdr[:44])
                ph_struct = endian + 'IIQQQQQQ'
                ph_size = 56
                align_idx = 7
            else:
                return None
            
            # Read program headers
            f.seek(e_phoff)
            alignments = []
            for _ in range(e_phnum):
                ph_data = f.read(e_phentsize)
                if len(ph_data) < ph_size: break
                ph = struct.unpack(ph_struct, ph_data[:ph_size])
                p_type = ph[0]
                if p_type == 1: # PT_LOAD
                    p_align = ph[align_idx]
                    alignments.append(p_align)
            
            if alignments:
                return max(alignments)
            return None
    except Exception as e:
        return None

def main():
    directory = sys.argv[1]
    issues = set()
    total = 0
    checked = 0
    for root, _, files in os.walk(directory):
        for name in files:
            if name.endswith('.so'):
                total += 1
                filepath = os.path.join(root, name)
                align = check_elf_alignment(filepath)
                if align is not None:
                    checked += 1
                    # Less than 16KB (16384) alignment
                    if align < 16384:
                        # group by package/module instead of individual file to avoid spamming
                        # assume node_modules/<package_name>/...
                        parts = filepath.split('/')
                        if 'node_modules' in parts:
                            idx = parts.index('node_modules')
                            if idx + 1 < len(parts):
                                pkg = parts[idx + 1]
                                if pkg.startswith('@') and idx + 2 < len(parts):
                                    pkg = pkg + '/' + parts[idx + 2]
                                issues.add((pkg, align))
    
    print(f"Total .so files found: {total}")
    print(f"Total ELF files checked: {checked}")
    if issues:
        print("\n[WARNING] Found libraries NOT 16KB aligned (align < 16384):")
        for pkg, align in sorted(issues):
            print(f"- {pkg} (Align: {align} bytes = {align//1024}KB)")
    else:
        print("\n[SUCCESS] All checked libraries are 16KB aligned!")

if __name__ == '__main__':
    main()
