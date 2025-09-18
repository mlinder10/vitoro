export const SYSTEMS = [
  {
    system: "Blood & Lymphoreticular System",
    categories: [
      "Infectious and immunologic",
      "Neoplasms",
      "Anemia, cytopenias, and polycythemia anemias",
      "Coagulation disorders",
      "Traumatic, mechanical, and vascular disorders",
      "Adverse effects of drugs",
    ],
  },
  {
    system: "Pregnancy, Childbirth, & the Puerperium",
    categories: ["Obstetric complications"],
  },
  {
    system: "Multisystem Processes & Disorders",
    categories: ["Infectious, Immunologic, and Inflammatory Disorders"],
  },
  {
    system: "Cardiovascular System",
    categories: [
      "Infections/inflammation",
      "Neoplasms",
      "Ischemic heart disease",
      "Dysrhythmias",
      "Heart failure",
      "Valvular heart disease",
      "Myocardial diseases",
      "Pericardial diseases",
      "Congenital disorders",
      "Hypotension",
      "Hypertension",
      "Dyslipidemia",
      "Vascular disorders",
      "Traumatic/mechanical disorders",
      "Adverse drug effects",
    ],
  },
  {
    system: "Gastrointestinal System",
    categories: [
      "Dyslipidemia",
      "Infectious/inflammatory",
      "Autoimmune/inflammatory",
      "Neoplasms",
      "Signs, symptoms, ill-defined",
      "Stomach/intestine diseases",
      "Rectum/anus disorders",
      "Liver/biliary",
      "Pancreatic disorders",
      "Peritoneal disorders",
      "Congenital disorders",
      "Trauma/mechanical",
      "Adverse drug effects",
    ],
  },
  {
    system: "Nervous System & Special Senses",
    categories: ["Traumatic/mechanical disorders"],
  },
  {
    system: "Cardiovascular/Neurology",
    categories: ["Congenital disorders"],
  },
  {
    system: "Respiratory System",
    categories: [
      "Infectious/inflammatory",
      "Neoplasms",
      "Obstructive airway disease",
      "Restrictive/ILD",
      "Respiratory failure & pulmonary vascular",
      "Metabolic/structural disorders",
      "Pleura/mediastinum/chest wall",
      "Trauma/mechanical",
      "Congenital disorders",
      "Adverse effects of drugs",
    ],
  },
  {
    system: "Behavioral Health",
    categories: ["Psychotic disorders"],
  },
  {
    system: "Psychiatric/Behavioral",
    categories: ["Psychotic disorders"],
  },
] as const;

export type System = (typeof SYSTEMS)[number]["system"];

export type AnyCategory = (typeof SYSTEMS)[number]["categories"][number];

export function getCategories(systems: string[]) {
  const collection: string[] = [];
  for (const system of SYSTEMS) {
    if (systems.length === 0 || systems.includes(system.system)) {
      system.categories.forEach((category) =>
        collection.includes(category) ? null : collection.push(category)
      );
    }
  }
  return collection;
}
