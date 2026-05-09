// Examples of regex to search for.
// They help users understand how to use regex.
export const villesRegexExamples = [
    { regex: '^Rouen$', description: "Exactement 'Rouen'" },
    { regex: '^R...n$', description: 'Commence par R, se termine par n et contient 5 lettres' },
    { regex: 'ouen$', description: "Se termine par 'ouen'" },
    { regex: '^Rou', description: "Commence par 'Rou'" },
    { regex: '^.{3}$', description: 'Ville de 3 lettres' },
    { regex: 'y{2}', description: 'Contient 2 y consécutifs' },
    { regex: '^(le|la|les) \\w+ \\w+ \\w+$', description: "'le' ou 'la' ou 'les' suivi de 3 mots" },
    { regex: '(a|e|i|o|u)\\1', description: 'Comporte 2 voyelles identiques consécutives' },
    { regex: '^a.*a$', description: 'Commence et finit par la lettre a' },
];
