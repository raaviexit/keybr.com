import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const file = (p) => path.join(root, p);
const read = (p) => fs.readFileSync(file(p), "utf8");
const write = (p, s) => fs.writeFileSync(file(p), s);
const insertOnce = (s, marker, text) => {
  if (s.includes(text.trim())) return s;
  const i = s.indexOf(marker);
  if (i < 0) throw new Error(`Marker not found: ${marker}`);
  return s.slice(0, i) + text + s.slice(i);
};
const run = (cmd, args) => execFileSync(cmd, args, { stdio: "inherit" });

{
  let s = read("packages/keybr-keyboard/lib/language.ts");
  s = insertOnce(s, '  static readonly HR =', '  static readonly HI = new Language(\n    /* id= */ "hi",\n    /* script= */ "devanagari",\n    /* direction= */ "ltr",\n    /* alphabet= */ "अआइईउऊऋॠऌॡएऐओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसहळऴक़ख़ग़ज़ड़ढ़फ़ऱऩय़़ंँः्ािीुूृॄॢॣेैोौॉॊॅॆ॒॑॓॔ऽॐ॰।॥",\n  );\n');
  s = s.replace("    Language.HU,\n", "    Language.HI,\n    Language.HU,\n");
  s = s.replace('    | "cyrillic"\n', '    | "cyrillic"\n    | "devanagari"\n');
  s = s.replace('    this.upperCase = (v) => v.toLocaleUpperCase(locale);\n    this.lowerCase = (v) => v.toLocaleLowerCase(locale);\n    this.capitalCase = (v) =>\n      v.substring(0, 1).toLocaleUpperCase(locale) +\n      v.substring(1).toLocaleLowerCase(locale);\n', '    this.upperCase = (v) => script === "devanagari" ? v : v.toLocaleUpperCase(locale);\n    this.lowerCase = (v) => script === "devanagari" ? v : v.toLocaleLowerCase(locale);\n    this.capitalCase = (v) => script === "devanagari" ? v : v.substring(0, 1).toLocaleUpperCase(locale) + v.substring(1).toLocaleLowerCase(locale);\n');
  s = s.replace('      if (!this.alphabet.includes(codePoint)) {\n', '      if (this.script === "devanagari" && (codePoint === 0x200c || codePoint === 0x200d)) continue;\n      if (!this.alphabet.includes(codePoint)) {\n');
  s = s.replace('      case "greek":\n', '      case "devanagari":\n        return (codePoint >= 0x0900 && codePoint <= 0x097f) || codePoint === 0x200c || codePoint === 0x200d;\n      case "greek":\n');
  s = s.replace('    case "greek":\n      return "Τρώτε περισσότερα μήλα και πορτοκάλια.";\n', '    case "devanagari":\n      return "अधिक सेब और संतरे खाइए।";\n    case "greek":\n      return "Τρώτε περισσότερα μήλα και πορτοκάλια.";\n');
  s = s.replace('    case "greek":\n      return [0x03b1, 0x03b2, 0x03b3, 0x03b4, 0x03b5, 0x03b6];\n', '    case "devanagari":\n      return [0x0915, 0x092e, 0x092f, 0x0930, 0x0932, 0x0935];\n    case "greek":\n      return [0x03b1, 0x03b2, 0x03b3, 0x03b4, 0x03b5, 0x03b6];\n');
  write("packages/keybr-keyboard/lib/language.ts", s);
}

{
  const p = "packages/keybr-generators/lib/generate-layouts.ts";
  let s = read(p);
  s = insertOnce(s, '  ["hu_hu",', '  ["hi_inscript", importCldr("cldr-keyboards-43.0/keyboards/windows/hi-t-k0-windows.xml")],\n');
  write(p, s);
  run("npx", ["tsx", "packages/keybr-generators/lib/generate-layouts.ts"]);
}

{
  const p = "packages/keybr-keyboard/lib/layout.ts";
  let s = read(p);
  s = insertOnce(s, "  static readonly BR_CHWERTY_MATHS =", '  static readonly HI_INSCRIPT = new Layout(\n    /* id= */ "hi-inscript",\n    /* xid= */ 0xc0,\n    /* name= */ "Devanagari InScript",\n    /* family= */ "inscript",\n    /* language= */ Language.HI,\n    /* emulate= */ false,\n    /* geometries= */ new Enum(Geometry.ANSI_101, Geometry.ANSI_101_FULL, Geometry.ISO_102, Geometry.ISO_102_FULL, Geometry.MATRIX),\n  );\n');
  s = s.replace("    Layout.HE_IL_ARKN,\n", "    Layout.HE_IL_ARKN,\n    Layout.HI_INSCRIPT,\n");
  write(p, s);
  const lpath = "packages/keybr-keyboard/lib/load.ts";
  let l = read(lpath);
  l = insertOnce(l, 'import { LAYOUT_HU_HU }', 'import { LAYOUT_HI_INSCRIPT } from "./layout/hi_inscript.ts";\n');
  l = insertOnce(l, '  [Layout.HU_HU,', '  [Layout.HI_INSCRIPT, LAYOUT_HI_INSCRIPT],\n');
  write(lpath, l);
}

const words = [
  "के","है","में","की","एक","यह","और","से","को","पर","हैं","का","ने","कि","लिए","नहीं","भी","इस","जो","उस","होने","करने","कर","था","थी","थे","तो","ही","या","आप","मैं","हम","वह","वे","मुझे","अपने","बहुत","जब","तक","सकता","सकते","सभी","कुछ","समय","काम","घर","दिन","लोग","देश","दुनिया","भारत","जीवन","बात","वर्ष","साल","आदमी","महिला","बच्चे","बड़ा","छोटा","अच्छा","आज","कल","अब","फिर","क्यों","कैसे","जहाँ","वहाँ","कौन","क्या","कहाँ","क्योंकि","लेकिन","इसलिए","अगर","जबकि","साथ","बिना","बाद","पहले","बीच","ऊपर","नीचे","अंदर","बाहर","सामने","पास","नाम","पानी","रास्ता","शहर","गाँव","सरकार","समाज","शिक्षा","भाषा","सवाल","जवाब","मदद","जानकारी","विचार","स्थिति","मौका","ज़रूरी","सच","सही","गलत","नया","पुराना","दूसरा","पहला","अलग","पूरा","खाना","पीना","देखना","सुनना","बोलना","लिखना","पढ़ना","सीखना","समझना","सोचना","चलना","बैठना","उठना","आना","जाना","देना","लेना","रखना","होता","करता","जाता","आता","कहता","रहता","मिलता","चाहिए","चाहता","चाहते","प्यार","खुशी","शांति","प्रकृति","संगीत","किताब","कहानी","कविता","प्रश्न","उत्तर","विद्यालय","विश्वविद्यालय","कंप्यूटर","तकनीक","इंटरनेट","मोबाइल","समाचार","मुश्किल","आसान","अवसर","प्रयास","परिवार","दोस्त","मित्र","कमरा","दरवाज़ा","खिड़की","सड़क","बाज़ार","किसान","मज़दूर","नौकरी","पैसा","कीमत","संख्या","समस्या","समाधान","कारण","परिणाम","उदाहरण","विकास","प्रगति","भविष्य","वर्तमान","इतिहास"
];
write("packages/keybr-content-words/lib/data/words-hi.json", JSON.stringify(words, null, 2) + "\n");
write("packages/keybr-generators/dictionaries/dictionary-hi.csv", words.map((word, i) => `${word},${words.length - i}`).join("\n") + "\n");

{
  const p = "packages/keybr-content-words/lib/load.ts";
  let s = read(p);
  if (!s.includes("case Language.HI:")) {
    s = s.replace("    case Language.HR:", '    case Language.HI:\n      return (await import(/* webpackChunkName: "words-hi" */ "./data/words-hi.json", { with: { type: "json" } })).default;\n    case Language.HR:');
    write(p, s);
  }
}

{
  const p = "packages/keybr-keyboard/lib/language.test.ts";
  let s = read(p);
  if (!s.includes('test("Hindi Devanagari language"')) {
    s += `\n\ntest("Hindi Devanagari language", () => {\n  equal(Language.HI.id, "hi");\n  equal(Language.HI.script, "devanagari");\n  equal(Language.HI.direction, "ltr");\n  equal(Language.HI.upperCase("हिंदी"), "हिंदी");\n  equal(Language.HI.lowerCase("हिंदी"), "हिंदी");\n  isTrue(Language.HI.test("कर्म"));\n  isTrue(Language.HI.test("क़लम"));\n  isTrue(Language.HI.test("क\\u200dष"));\n  equal(Language.HI.letterName(0x0915), "क");\n});\n`;
    write(p, s);
  }
}

// The upstream generator reads dictionary-${id}.csv directly after the .gz attempt,
// creates model-${id}.data, and also regenerates words-${id}.json.
run("npx", ["tsx", "packages/keybr-generators/lib/generate-languages.ts"]);

fs.rmSync(file("scripts/implement-hindi-inscript.mjs"));
fs.rmSync(file(".github/workflows/hindi-inscript-implementation.yml"));
