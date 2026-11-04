import os
import zipfile
import shutil

dist_name = "ervan-portfolio-production.zip"
print(f"Creating production package: {dist_name}...")

# Files and directories to include
include_files = [
    "index.html",
    ".htaccess",
    "robots.txt",
    "sitemap.xml"
]

include_dirs = [
    "Asset"
]

# Excluded extensions / files inside Asset
exclude_patterns = [
    ".backup.png",
    ".DS_Store",
    "Thumbs.db"
]

total_files = 0
with zipfile.ZipFile(dist_name, 'w', zipfile.ZIP_DEFLATED) as zipf:
    # 1. Add root files
    for fname in include_files:
        if os.path.exists(fname):
            zipf.write(fname, arcname=fname)
            print(f"  Added file: {fname}")
            total_files += 1
        else:
            print(f"  WARNING: {fname} not found!")

    # 2. Add Asset directory recursively
    for dir_name in include_dirs:
        if os.path.exists(dir_name):
            for root, dirs, files in os.walk(dir_name):
                for file in files:
                    # Skip excluded files
                    if any(file.endswith(ext) for ext in exclude_patterns):
                        continue
                    file_path = os.path.join(root, file)
                    arcname = os.path.relpath(file_path, start=".")
                    zipf.write(file_path, arcname=arcname)
                    total_files += 1
            print(f"  Added directory: {dir_name}/")

zip_size_mb = os.path.getsize(dist_name) / (1024 * 1024)
print(f"\n[SUCCESS] Production package created:")
print(f"File: {os.path.abspath(dist_name)}")
print(f"Total files: {total_files}")
print(f"Package size: {zip_size_mb:.2f} MB")
