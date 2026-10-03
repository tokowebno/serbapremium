import re

with open("app/globals.css", "r") as f:
    css = f.read()

glass_card_regex = re.compile(r'@utility glass-card[\s\S]*?\}', re.MULTILINE)
css = glass_card_regex.sub('@utility glass-card {\n  background: var(--surface);\n  border: 2px solid var(--border);\n  box-shadow: 4px 4px 0 0 var(--border);\n  transition: box-shadow 0.25s var(--ease-out), transform 0.25s var(--ease-out), border-color 0.25s var(--ease-out);\n}', css)

glass_card_hover_regex = re.compile(r'@utility glass-card-hover[\s\S]*?\}', re.MULTILINE)
css = glass_card_hover_regex.sub('@utility glass-card-hover {\n  &:hover {\n    border-color: var(--border-strong);\n    box-shadow: 6px 6px 0 0 var(--border-strong);\n    transform: translateY(-2px);\n  }\n}', css)

ambient_bg_regex = re.compile(r'@utility ambient-bg[\s\S]*?\}', re.MULTILINE)
css = ambient_bg_regex.sub('@utility ambient-bg {\n  background: var(--bg);\n}', css)

with open("app/globals.css", "w") as f:
    f.write(css)
