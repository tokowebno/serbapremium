import re

with open("app/globals.css", "r") as f:
    css = f.read()

# Remove overflow-x: hidden from html, body
css = re.sub(r'html,\s*body\s*\{[\s\S]*?\}', 'html, body {\n  scroll-behavior: smooth;\n}', css)

with open("app/globals.css", "w") as f:
    f.write(css)
