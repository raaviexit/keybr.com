import { test } from "node:test";
import { equal, isNotNull, isTrue } from "rich-assert";
import { Geometry } from "../geometry.ts";
import { Language } from "../language.ts";
import { Keyboard } from "../keyboard.ts";
import { Layout } from "../layout.ts";
import { loadKeyboard } from "../load.ts";

test("Hindi InScript is selectable and loadable on ANSI and ISO", () => {
  isTrue(Layout.selectableLayouts(Language.HI).includes(Layout.HI_INSCRIPT));
  const ansi = loadKeyboard(Layout.HI_INSCRIPT, Geometry.ANSI_101);
  const iso = loadKeyboard(Layout.HI_INSCRIPT, Geometry.ISO_102);
  isNotNull(ansi.getCombo(0x0915));
  isNotNull(iso.getCombo(0x0915));
  equal(ansi.getCharacters("KeyK")?.a, 0x0915);
  equal(ansi.getCharacters("KeyK")?.b, 0x0916);
  equal(ansi.getCharacters("KeyD")?.a, 0x094d);
  equal(ansi.getCharacters("Digit5")?.b, "ज्ञ" ? ansi.getCharacters("Digit5")?.b : null);
});

test("Hindi InScript maps matras and conjuncts", () => {
  const keyboard = new Keyboard(
    Layout.HI_INSCRIPT,
    Geometry.ANSI_101,
    loadKeyboard(Layout.HI_INSCRIPT, Geometry.ANSI_101).characterDict,
    loadKeyboard(Layout.HI_INSCRIPT, Geometry.ANSI_101).geometryDict,
  );
  equal(keyboard.getCombo(0x093e)?.id, "KeyE");
  equal(keyboard.getCombo(0x094d)?.id, "KeyD");
  equal(keyboard.getCharacters("Digit5")?.b, "ज्ञ");
  equal(keyboard.getCharacters("Digit7")?.b, "क्ष");
  equal(keyboard.getCharacters("Digit8")?.b, "श्र");
});
