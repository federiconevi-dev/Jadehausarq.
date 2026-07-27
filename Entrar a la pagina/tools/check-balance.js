const fs = require("fs");
const html = fs.readFileSync(process.argv[2], "utf8");
const tags = ["div", "aside", "section", "header", "main", "footer", "form", "ul", "button"];
for (const t of tags) {
  const opens = (html.match(new RegExp("<" + t + "(\\s[^>]*)?>", "g")) || []).length;
  const closes = (html.match(new RegExp("</" + t + ">", "g")) || []).length;
  console.log(t, "opens:", opens, "closes:", closes, opens === closes ? "OK" : "MISMATCH");
}
