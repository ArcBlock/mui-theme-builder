import { useState, useEffect } from 'react';

// This is a simplified list. In a real application, you would fetch this from the Google Fonts API
// and likely need an API key for production use.
const popularFonts = [
  'Roboto',
  'Pacifico',
  'Caveat',
  'Bai Jamjuree',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Oswald',
  'Source Sans Pro',
  'Raleway',
  'Poppins',
  'Nunito Sans',
  'Merriweather',
];

interface GoogleFont {
  family: string;
}

const useGoogleFonts = (searchQuery: string) => {
  const [fonts, setFonts] = useState<GoogleFont[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFonts = async () => {
      setLoading(true);
      try {
        // This is a mock API call.
        if (searchQuery) {
          const filteredFonts = popularFonts
            .filter((font) => font.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((family) => ({ family }));
          setFonts(filteredFonts);
        } else {
          setFonts(popularFonts.map((family) => ({ family })));
        }
      } catch (error) {
        console.error('Failed to fetch Google fonts', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchFonts();
    }, 300); // Debounce API calls

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  return { fonts, loading };
};

export default useGoogleFonts; 