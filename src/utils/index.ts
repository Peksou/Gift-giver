/**
 * Génère un dérangement (permutation où aucun élément n'est à sa position originale)
 * Garantit qu'aucun participant ne se tire lui-même
 */
export function generateDerangement<T>(array: T[]): T[] {
  let result = [...array];
  let attempts = 0;
  
  do {
    result = [...array].sort(() => Math.random() - 0.5);
    attempts++;
  } while (result.some((item, i) => item === array[i]) && attempts < 1000);

  // Si après 1000 tentatives il y a encore des éléments à leur place originale,
  // on fait un échange manuel pour garantir le dérangement
  if (result.some((item, i) => item === array[i])) {
    for (let i = 0; i < result.length; i++) {
      if (result[i] === array[i]) {
        const j = (i + 1) % result.length;
        [result[i], result[j]] = [result[j], result[i]];
      }
    }
  }
  
  return result;
}


/**
 * Valide le nom d'un participant
 */
export function validateParticipantName(name: string, existingNames: string[]): string | null {
  const trimmedName = name.trim();
  
  if (!trimmedName) {
    return 'Entrez un nom';
  }
  
  if (existingNames.some(existing => existing.toLowerCase() === trimmedName.toLowerCase())) {
    return 'Nom déjà utilisé';
  }
  
  return null;
}