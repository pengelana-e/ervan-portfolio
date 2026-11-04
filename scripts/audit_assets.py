import re
import os

assets = set()
pattern = re.compile(r'[\'"`](\.?/?Asset/[^\'"`]+)[\'"`]')

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith(('.jsx', '.js', '.json', '.css')):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
                for m in pattern.findall(content):
                    assets.add(m)

# Also check index.html
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()
    for m in pattern.findall(content):
        assets.add(m)

print(f"Found {len(assets)} unique asset references:")
for a in sorted(assets):
    print(" ", a)
