interface SinhalaTextProps {
  text: string;
  className?: string;
}

type UnicodeMapping = {
  [key: string]: string;
};

// Helper functions
const isSinhalaCharacter = (char: string): boolean => {
  const sinhalaRange = /[\u0D80-\u0DFF]/; // Unicode range for Sinhala
  return sinhalaRange.test(char);
};

const containsSinhala = (text: string): boolean => {
  return [...text].some((char) => isSinhalaCharacter(char));
};

// sinhalaMapping.ts
export const unicodeToLegacy: UnicodeMapping = {
  // Vowels
  අ: "w",
  ආ: "wd",
  ඇ: "we",
  ඈ: "wE",
  ඉ: "b",
  ඊ: "B",
  උ: "W",
  ඌ: "W!",
  ඍ: "R",
  ඎ: "RD",
  ඏ: "Z",
  ඐ: "X",
  එ: "t",
  ඒ: "ta",
  ඓ: "ft",
  ඔ: "T",
  ඕ: "Ta",
  ඖ: "T!",

  // Consonants
  ක: "l",
  ඛ: "L",
  ග: ".",
  ඝ: ">",
  ච: "p",
  ඡ: "P",
  ජ: "c",
  ඣ: "C",
  ට: "g",
  ඨ: "G",
  ඩ: "v",
  ඪ: "V",
  ණ: "K",
  ත: ";",
  ථ: ":",
  ද: "o",
  ධ: "O",
  න: "k",
  ප: "m",
  ඵ: "M",
  බ: "n",
  භ: "N",
  ම: "u",
  ය: "h",
  ර: "r",
  ල: ",",
  ව: "j",
  ශ: "Y",
  ෂ: "I",
  ස: "i",
  හ: "y",
  ළ: "<",
  ෆ: "*",

  // Modifiers (Pili)
  "්": "a",
  "ා": "d",
  "ැ": "e",
  "ෑ": "E",
  "ි": "s",
  "ී": "S",
  "ු": "q",
  "ූ": "Q",
  "ෘ": "D",
  "ෙ": "f",
  "ේ": "fa",
  "ෛ": "ff",
  "ො": "fd",
  "ෝ": "fda",
  "ෞ": "f!",
  "ං": "x",
  "ඃ": "H",

  // Common Combinations
  කො: "fld",
  කෝ: "flda",
  කෙ: "fl",
  කේ: "fla",
  කි: "ls",
  කී: "lS",
  කැ: "le",
  කෑ: "lE",
  කු: "l=",
  කූ: "l+",

  ගො: "f.d",
  ගෝ: "f.da",
  ගෙ: "f.",
  ගේ: "f.",
  ගි: ".s",
  ගී: ".S",
  ගැ: ".e",
  ගෑ: ".E",
  ගු: ".=",
  ගූ: ".+",

  තො: "f;d",
  තෝ: "f;da",
  තෙ: "f;",
  තේ: "f;a",
  ති: ";s",
  තී: ";S",
  තැ: ";e",
  තෑ: ";E",
  තු: ";=",
  තූ: ";+",

  දො: "fod",
  දෝ: "foda",
  දෙ: "fo",
  දේ: "foa",
  දි: "os",
  දී: "oS",
  දැ: "oe",
  දෑ: "oE",
  දු: "ÿ",
  දූ: "o+",

  නො: "fkd",
  නෝ: "fkda",
  නෙ: "fk",
  නේ: "fka",
  නි: "ks",
  නී: "kS",
  නැ: "ke",
  නෑ: "kE",
  නු: "kq",
  නූ: "kQ",

  පො: "fmd",
  පෝ: "fmda",
  පෙ: "fm",
  පේ: "fma",
  පි: "ms",
  පී: "mS",
  පැ: "me",
  පෑ: "mE",
  පු: "mq",
  පූ: "mQ",

  බො: "fnd",
  බෝ: "fnda",
  බෙ: "fn",
  බේ: "fna",
  බි: "ns",
  බී: "nS",
  බැ: "ne",
  බෑ: "nE",
  බු: "nq",
  බූ: "nQ",

  මො: "fud",
  මෝ: "fuda",
  මෙ: "fu",
  මේ: "fua",
  මි: "us",
  මී: "uS",
  මැ: "ue",
  මෑ: "uE",
  මු: "uq",
  මූ: "uQ",

  යො: "fhd",
  යෝ: "fhda",
  යෙ: "fh",
  යේ: "fha",
  යි: "hs",
  යී: "hS",
  යැ: "he",
  යෑ: "hE",
  යු: "hq",
  යූ: "hQ",

  රො: "frd",
  රෝ: "frda",
  රෙ: "fr",
  රේ: "fra",
  රි: "rs",
  රී: "rS",
  රැ: "re",
  රෑ: "rE",
  රු: "re",
  රූ: "rE",

  ලො: "f,d",
  ලෝ: "f,da",
  ලෙ: "f,",
  ලේ: "f,a",
  ලි: ",s",
  ලී: ",S",
  ලැ: ",e",
  ලෑ: ",E",
  ලු: ",q",
  ලූ: ",Q",

  වො: "fjd",
  වෝ: "fjda",
  වෙ: "fj",
  වේ: "fõ",
  වි: "ú",
  වී: "ù",
  වැ: "je",
  වෑ: "jE",
  වු: "jq",
  වූ: "jQ",

  සො: "fid",
  සෝ: "fida",
  සෙ: "fi",
  සේ: "fia",
  සි: "is",
  සී: "iS",
  සැ: "ie",
  සෑ: "iE",
  සු: "iq",
  සූ: "iQ",

  හො: "fyd",
  හෝ: "fyda",
  හෙ: "fy",
  හේ: "fya",
  හි: "ys",
  හී: "yS",
  හැ: "ye",
  හෑ: "yE",
  හු: "yq",
  හූ: "yQ",

  // Special combinations
  ර්‍ය: "H_",
  ර්: "¾",
  ශ්‍ර: "Y%",
  ෂ්: "IH",
  ත්‍ර: ";%",
  ද්‍ර: "ø",
  ක්‍ර: "l%",
  ක්: "la",
  න්: "ka",
  ණ්: "Ka",
  ට්: "Ü",

  // Common modern additions
  ඬ: "`",
  ඳ: "|",
  ඟ: "{",
};

export const convertToLegacy = (unicodeText: string): string => {
  let legacyText = "";
  let i = 0;

  // Special characters to preserve
  const preserveChars = new Set([
    // Punctuation
    "?",
    ".",
    "!",
    ",",
    ";",
    ":",
    '"',
    "'",
    // Spaces and line breaks
    " ",
    "\n",
    "\t",
    "\r",
    // Brackets and special characters
    "(",
    ")",
    "[",
    "]",
    "{",
    "}",
    "/",
    "\\",
    // Common symbols
    "@",
    "#",
    "$",
    "%",
    "^",
    "&",
    "*",
    "-",
    "+",
    "=",
    "_",
    // Additional symbols
    "~",
    "`",
    "<",
    ">",
    "|",
    // Emojis and other special characters
    "😊",
    "❤️",
    "👍",
    "🙏",
    // Numbers
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
  ]);

  while (i < unicodeText.length) {
    // Check for English word
    let englishWord = "";
    let j = i;
    while (
      j < unicodeText.length &&
      !isSinhalaCharacter(unicodeText[j]) &&
      !preserveChars.has(unicodeText[j])
    ) {
      englishWord += unicodeText[j];
      j++;
    }

    if (englishWord.length > 0) {
      legacyText += englishWord;
      i = j;
      continue;
    }

    // Check for preserved characters
    if (preserveChars.has(unicodeText[i])) {
      legacyText += unicodeText[i];
      i++;
      continue;
    }

    // Try 3-character Sinhala combinations
    if (i + 2 < unicodeText.length) {
      const threeChars = unicodeText.slice(i, i + 3);
      if (containsSinhala(threeChars) && unicodeToLegacy[threeChars]) {
        legacyText += unicodeToLegacy[threeChars];
        i += 3;
        continue;
      }
    }

    // Try 2-character Sinhala combinations
    if (i + 1 < unicodeText.length) {
      const twoChars = unicodeText.slice(i, i + 2);
      if (containsSinhala(twoChars) && unicodeToLegacy[twoChars]) {
        legacyText += unicodeToLegacy[twoChars];
        i += 2;
        continue;
      }
    }

    // Single character
    const char = unicodeText[i];
    if (isSinhalaCharacter(char) && unicodeToLegacy[char]) {
      legacyText += unicodeToLegacy[char];
    } else {
      legacyText += char; // Keep non-Sinhala characters as is
    }
    i++;
  }

  return legacyText;
};
