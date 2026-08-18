// AfriLingo — helpers RTL / N'Ko.
// N'Ko = RTL. Le chrome reste LTR ; seuls les blocs de contenu N'Ko passent dir="rtl".

export const NKO_DIR = "rtl" as const;
export const LTR_DIR = "ltr" as const;

/** Plage Unicode N'Ko : U+07C0–U+07FF. */
export function isNkoChar(ch: string): boolean {
  if (!ch) return false;
  const cp = ch.codePointAt(0);
  if (cp === undefined) return false;
  return cp >= 0x07c0 && cp <= 0x07ff;
}

/** Détecte si une chaîne contient au moins un glyphe N'Ko. */
export function containsNko(s: string | undefined): boolean {
  if (!s) return false;
  for (const ch of s) {
    if (isNkoChar(ch)) return true;
  }
  return false;
}

/** Direction logique d'un bloc selon son contenu. */
export function dirFor(text: string | undefined): "rtl" | "ltr" {
  return containsNko(text) ? NKO_DIR : LTR_DIR;
}