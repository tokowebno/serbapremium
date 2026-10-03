import re

with open("app/globals.css", "r") as f:
    css = f.read()

# We will remove all the complex mat-func, mat-clear, mat-strong, mat-tint, mat-elev bg variables
css = re.sub(r'--mat-.*?;\n', '', css)

# We will remove the liquid-glass classes
liquid_regex = re.compile(r'\.liquid-glass[\s\S]*?\}', re.MULTILINE)
css = liquid_regex.sub('', css)

tile_regex = re.compile(r'\.liquid-tile[\s\S]*?\}', re.MULTILINE)
css = tile_regex.sub('', css)

squircle_regex = re.compile(r'\.apple-squircle[\s\S]*?\}', re.MULTILINE)
css = squircle_regex.sub('', css)

with open("app/globals.css", "w") as f:
    f.write(css)
