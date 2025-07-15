export interface GoogleFont {
  f: string; // family
  c: string; // category
  p: number; // popularity
}

export interface GoogleFontsData {
  t: number; // totalCount
  all: GoogleFont[]; // allFonts
}

export interface FontFilter {
  category?: string;
  searchQuery?: string;
}
