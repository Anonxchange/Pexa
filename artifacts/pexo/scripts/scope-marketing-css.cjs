const fs = require("node:fs");
const postcss = require("../../../node_modules/.pnpm/postcss@8.5.29/node_modules/postcss");
const selectorParser = require("../../../node_modules/.pnpm/postcss-selector-parser@6.0.10/node_modules/postcss-selector-parser");

const file = "src/styles.css";
const rawFile = "scripts/.export-source-styles.css";
const root = postcss.parse(fs.readFileSync(rawFile, "utf8"));

root.walkAtRules("charset", (rule) => rule.remove());
root.walkRules((rule) => {
  let parent = rule.parent;
  while (parent && parent.type !== "root") {
    if (parent.type === "atrule" && /keyframes$/i.test(parent.name)) return;
    parent = parent.parent;
  }
  rule.selector = selectorParser((selectors) => {
    selectors.each((selector) => {
      const first = selector.nodes[0];
      if (first?.type === "tag" && ["html", "body"].includes(first.value.toLowerCase())) {
        first.replaceWith(selectorParser.className({ value: "export-page" }));
      } else if (first?.type === "pseudo" && first.value === ":root") {
        first.replaceWith(selectorParser.className({ value: "export-page" }));
      } else if (first?.type !== "class" || first.value !== "export-page") {
        selector.prepend(selectorParser.combinator({ value: " " }));
        selector.prepend(selectorParser.className({ value: "export-page" }));
      }
    });
  }).processSync(rule.selector);
});

root.append(postcss.comment({ text: "Native export interactions and live catalog states" }));
root.append(postcss.parse(`
.export-page .sp-live-state{display:flex;align-items:center;gap:12px;min-height:120px;padding:20px;color:#485751;font-size:15px}
.export-page .sp-live-state button{border:1px solid #091e1c;border-radius:999px;background:#d8ff85;color:#091e1c;padding:9px 16px;cursor:pointer;font-weight:700}
.export-page .sp-pr img{width:100%;height:100%;object-fit:contain;padding:18px}
.export-page .sp-product-mark{display:grid;place-items:center;width:88px;height:88px;border-radius:50%;background:#d8ff85;color:#091e1c;font-size:32px;font-weight:800}
.export-page .sp-card[role=link]{cursor:pointer}
.export-page .px-dd.is-open .px-dd-l{display:block;opacity:1;visibility:visible}
.export-page .px-nav.is-open .px-menu{display:flex;opacity:1;visibility:visible}
.export-page .g-empty{padding:18px 20px;border:1px dashed var(--line);border-radius:14px;color:var(--mute);background:#fff}
.export-page .t .cd{position:relative;display:flex;flex-direction:column;justify-content:space-between;min-height:142px;border-radius:16px;padding:16px;overflow:hidden;text-align:left;box-shadow:0 9px 20px rgba(11,43,38,.14)}
.export-page .t .cd .nm{font-size:18px;font-weight:800;line-height:1.1;max-width:85%}
.export-page .t .cd .ro{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:700}
.export-page .g-search button{border:0;background:transparent;cursor:pointer}
.export-page .g-search svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round}
@media(max-width:991px){.export-page .px-nav.is-open .px-menu{display:flex}}
`));
const indexCss = fs.readFileSync("src/index.css", "utf8");
const appHeaderCss = fs.readFileSync("src/components/app-header.css", "utf8");
const authShellCss = fs.readFileSync("src/components/auth-page-shell.css", "utf8");
fs.writeFileSync(file, `${indexCss}\n${appHeaderCss}\n${authShellCss}\n${root.toString()}`);
fs.unlinkSync(rawFile);
