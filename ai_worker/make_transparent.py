from PIL import Image

img_path = r'e:\tooba(inacadfusion0\Tooba3.0\public\inacadfusion-hd-logo-transparent.png'
img = Image.open(img_path).convert('RGBA')

pixels = img.load()
width, height = img.size

# Mustard color: #FFC107 = R:255, G:193, B:7
MUSTARD = (255, 193, 7)

for y in range(height):
    for x in range(width):
        r, g, b, a = pixels[x, y]
        # Skip fully transparent pixels
        if a < 10:
            continue
        # Recolor every visible pixel to mustard, preserving alpha
        pixels[x, y] = (MUSTARD[0], MUSTARD[1], MUSTARD[2], a)

out_path = r'e:\tooba(inacadfusion0\Tooba3.0\public\inacadfusion-logo-mustard.png'
img.save(out_path, 'PNG')
print('Mustard logo saved to: ' + out_path)
