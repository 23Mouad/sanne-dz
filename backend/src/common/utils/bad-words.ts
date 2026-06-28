// Contains English, standard Arabic, and Algerian slang bad words.
// Used to auto-flag reviews for manual admin approval.

const englishBadWords = [
  'fuck', 'shit', 'bitch', 'asshole', 'cunt', 'dick', 'pussy', 'whore', 'slut', 'bastard', 'motherfucker',
  'cock', 'faggot', 'nigger', 'nigga', 'bullshit', 'damn', 'crap', 'douche', 'dyke', 'fag', 'homo',
  'jerk', 'prick', 'twat', 'wanker', 'wore', 'skank', 'hoe', 'ho', 'cum', 'jackass', 'retard'
];

const arabicBadWords = [
  'قحبة', 'زب', 'نيك', 'منيوك', 'طبون', 'شرموطة', 'كلب', 'حمار', 'خرا', 'زامل', 'عطاي', 'ديوث', 'قواد', 'رخيس', 'زبي',
  'حيوان', 'عاهرة', 'مخنث', 'لوطي', 'خول', 'عرص', 'قواد', 'مومس', 'نجس', 'بغل', 'زبل', 'شواذ', 'ساقطة'
];

const algerianSlangBadWords = [
  'kahba', 'zabi', 'nik', 'mniok', 'tabon', 'zamel', 'atay', '9ahba', '9a7ba', 'zebi', 'zbi', 'kavi', 'kawad', 'rkhis',
  'kelb', 'hmar', 'khra', 'khera', 'bouhali', 't7an', 'tahhan', 'hmar', 'baghli', 'chmata', 'chkara', 'm3afon', 'm3afna',
  'nayk', 'nayek', 'zb', '9awad', 'qawad', 'qahba', 'qa7ba', 'zaba', 'zboba', 'namo', 'namok', 'dinmouk', 'dinmok',
  'yema', 'yemak', 'zbiya', 'zbiy', 'na3l', 'na3let', 'kba', 'qba', 'k7ba', 'q7ba'
];

const allBadWords = [...englishBadWords, ...arabicBadWords, ...algerianSlangBadWords];

export function containsBadWords(text: string): boolean {
  if (!text) return false;
  
  // Normalize text: lowercase and remove excessive punctuation
  const normalizedText = text.toLowerCase().replace(/[.,!?;:]/g, ' ');
  const words = normalizedText.split(/\s+/);
  
  // Create a collapsed version of bad words to match against collapsed input words (e.g., 'zbii' -> 'zbi')
  const collapsedBadWords = allBadWords.map(bw => bw.replace(/(.)\1+/g, '$1'));

  for (const word of words) {
    const collapsedWord = word.replace(/(.)\1+/g, '$1');

    // Check for exact matches
    if (allBadWords.includes(word) || collapsedBadWords.includes(collapsedWord)) {
      return true;
    }
    
    // Check for substrings for certain core bad words to catch variations
    for (const badWord of allBadWords) {
      if (badWord.length >= 3 && word.includes(badWord)) {
        // Only trigger on 3-letter words if they are very specific Algerian slurs to avoid false positives in English/French
        const isHighRisk = ['zbi', 'nik', 'zeb'].some(risk => badWord.includes(risk));
        if (badWord.length >= 4 || isHighRisk) {
          return true;
        }
      }
    }
  }
  
  return false;
}
