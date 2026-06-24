import os
from PIL import Image

def generate_favicons(source_path, output_dir):
    if not os.path.exists(source_path):
        print(f"Source file not found: {source_path}")
        return

    img = Image.open(source_path)
    
    # Ensure output directory exists
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Generate apple-touch-icon.png (180x180)
    img_180 = img.resize((180, 180), Image.Resampling.LANCZOS)
    img_180.save(os.path.join(output_dir, "apple-touch-icon.png"))
    print("Generated apple-touch-icon.png")

    # Generate icon-192.png
    img_192 = img.resize((192, 192), Image.Resampling.LANCZOS)
    img_192.save(os.path.join(output_dir, "icon-192.png"))
    print("Generated icon-192.png")

    # Generate icon-512.png
    img_512 = img.resize((512, 512), Image.Resampling.LANCZOS)
    img_512.save(os.path.join(output_dir, "icon-512.png"))
    print("Generated icon-512.png")

    # Generate favicon.ico (multi-size)
    # We'll include 16, 32, 48
    sizes = [(16, 16), (32, 32), (48, 48)]
    img.save(os.path.join(output_dir, "favicon.ico"), format='ICO', sizes=sizes)
    print("Generated favicon.ico")

if __name__ == "__main__":
    source = "public/logo-source.png"
    output = "public"
    generate_favicons(source, output)
