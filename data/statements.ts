export type Statement = {
  id: number;
  label: string;
  value: number;
};

export const statements: { [key: number]: Statement[] } = {
  1: [
    { id: 1, label: "Partie annif romain", value: -63 },
    { id: 2, label: "Salaire natacha", value: 1844.38 },
    { id: 3, label: "Salaire fabian", value: 2830.92 },
    { id: 4, label: "Visa (25,99 Lenny, 15 Fabian, 58,19 Tristan)", value: -597.35 },
    { id: 5, label: "Boulangerie", value: -57 },
    { id: 6, label: "Assurance dentaire", value: -574.56 },
    { id: 7, label: "Ramonage cheminée", value: -99 },
    { id: 8, label: "Facture eau courante", value: -107.1 },
    { id: 9, label: "Assurance enfants", value: -89.99 },
    { id: 10, label: "Assurance pension natacha", value: -52.73 },
    { id: 11, label: "Facture CHU tristan", value: -12 },
    { id: 12, label: "Facture CHU natacha", value: -33.05 },
  ],

  // Tu pourras remplir les autres mois plus tard
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
  7: [],
  8: [],
  9: [],
  10: [],
};
