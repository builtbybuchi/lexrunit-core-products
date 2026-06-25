import os
import glob

# Search in specific directories
dirs = ['pages', 'components', 'constants.tsx', 'lib']

replacements = {
    'LexCare HMS': "L'Hopital",
    'LexCare Patient App': "L'Hopital",
    'Patient App': "L'Hopital",
    'HMS': "L'Hopital"
}

def replace_in_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    # Order matters: replace longer strings first to avoid partial replacements
    for old, new in replacements.items():
        new_content = new_content.replace(old, new)
        
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file_path}")

for d in dirs:
    if os.path.isfile(d):
        replace_in_file(d)
    else:
        for root, _, files in os.walk(d):
            for file in files:
                if file.endswith(('.tsx', '.ts', '.js', '.jsx')):
                    replace_in_file(os.path.join(root, file))

print("Done replacing.")
