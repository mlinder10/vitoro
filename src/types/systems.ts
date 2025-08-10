export const SYSTEMS: {
  name: string;
  categories: {
    name: string;
    subcategories: string[];
  }[];
}[] = [
  {
    name: "Human Development",
    categories: [
      {
        name: "Normal age-related findings and care of the well patient",
        subcategories: [
          "Infancy and childhood (0-12 years)",
          "Adolescence (13-17 years)",
          "Adulthood (18-64 years)",
          "Older Adulthood (65 years and older)",
        ],
      },
    ],
  },
  {
    name: "Immune System",
    categories: [
      {
        name: "Disorders associated with immunodeficiency",
        subcategories: [
          "Deficiency primarily of humoral immunity",
          "Deficiency/dysfunction primarily of cell-mediated immunity",
          "Complement deficiency",
          "Deficiency of phagocytic cells and natural killer cells",
        ],
      },
      {
        name: "HIV/AIDS",
        subcategories: ["HIV1 and HIV2; AIDS; complications"],
      },
      {
        name: "Immunologically mediated disorders",
        subcategories: [
          "Hypersensitivity reactions",
          "Transplantation (rejection/GVHD)",
        ],
      },
      {
        name: "Adverse effects of drugs on the immune system",
        subcategories: [
          "Jarisch-Herxheimer reaction",
          "Immunomodulatory drug effects",
        ],
      },
    ],
  },
  {
    name: "Blood & Lymphoreticular System",
    categories: [
      {
        name: "Infectious and immunologic",
        subcategories: [
          "Infectious disorders",
          "Primary infections of lymphoid tissue",
          "Immunologic/inflammatory disorders",
        ],
      },
      {
        name: "Neoplasms",
        subcategories: [
          "Leukemias",
          "Lymphomas",
          "Multiple myeloma and related neoplasms",
          "Others",
        ],
      },
      {
        name: "Anemia, cytopenias, and polycythemia anemias",
        subcategories: [
          "Decreased production",
          "Hemolysis",
          "Disorders of hemoglobin/heme/membrane",
          "Other causes",
          "Cytopenias",
          "Polycythemia",
        ],
      },
      {
        name: "Coagulation disorders",
        subcategories: [
          "Hypocoagulable",
          "Hypercoagulable",
          "Reactions to blood components",
        ],
      },
      {
        name: "Traumatic/mechanical/vascular disorders",
        subcategories: ["Mechanical hemolysis", "Splenic disorders"],
      },
      {
        name: "Adverse effects of drugs",
        subcategories: ["Anticoagulants", "Chemotherapeutics", "Others"],
      },
    ],
  },
  {
    name: "Behavioral Health",
    categories: [
      {
        name: "Psychotic disorders",
        subcategories: ["Brief psychotic disorder", "Schizophrenia", "Others"],
      },
      {
        name: "Anxiety disorders",
        subcategories: ["GAD, panic, phobias", "PTSD, OCD, etc."],
      },
      {
        name: "Mood disorders",
        subcategories: [
          "Major depressive",
          "Bipolar",
          "Cyclothymic",
          "Premenstrual dysphoric",
        ],
      },
      {
        name: "Somatic symptom & related disorders",
        subcategories: [
          "Somatic symptom disorder",
          "Conversion disorder",
          "Illness anxiety",
        ],
      },
      {
        name: "Factitious disorders",
        subcategories: ["Factitious disorder imposed on self"],
      },
      {
        name: "Eating & impulse-control disorders",
        subcategories: [
          "Anorexia",
          "Bulimia",
          "Binge-eating",
          "Disruptive/Impulse-control",
          "Others",
        ],
      },
      {
        name: "Disorders originating in infancy/childhood",
        subcategories: [
          "ADHD",
          "Autism",
          "Attachment disorders",
          "Elimination disorders",
          "Speech/language disorders",
        ],
      },
      {
        name: "Personality disorders",
        subcategories: ["Cluster A-C personality disorders"],
      },
      {
        name: "Psychosocial disorders/behaviors",
        subcategories: ["Adjustment, grief, psychosocial stressors"],
      },
      {
        name: "Sexual disorders & gender dysphoria",
        subcategories: [
          "Gender dysphoria",
          "Psychosexual dysfunctions",
          "Others",
        ],
      },
      {
        name: "Substance use disorders",
        subcategories: [
          "Alcohol",
          "Nicotine",
          "Cannabis",
          "Opioids",
          "Stimulants",
          "Hallucinogens",
          "Sedatives/hypnotics",
          "Polysubstance",
        ],
      },
    ],
  },
  {
    name: "Nervous System & Special Senses",
    categories: [
      {
        name: "Infectious/immunologic/inflammatory",
        subcategories: ["Meningitis", "Encephalitis", "Others"],
      },
      {
        name: "Immunologic/inflammatory disorders",
        subcategories: ["Myasthenia gravis", "MS", "Transverse myelitis"],
      },
      {
        name: "Neoplasms",
        subcategories: ["Benign", "Malignant", "Metastatic"],
      },
      {
        name: "Cerebrovascular disease",
        subcategories: [
          "Stroke, TIA, hemorrhage, aneurysm, vascular dementia",
          "Others",
        ],
      },
      {
        name: "Spinal cord/root disorders",
        subcategories: ["Cauda equina", "Cord compression", "Spinal stenosis"],
      },
      {
        name: "Peripheral nerve disorders",
        subcategories: [
          "Guillain‑Barré",
          "Neuropathies",
          "Entrapment syndromes",
        ],
      },
      {
        name: "Pain syndromes",
        subcategories: [
          "Trigeminal neuralgia",
          "Fibromyalgia",
          "CRPS",
          "Others",
        ],
      },
      {
        name: "Degenerative/amnestic disorders",
        subcategories: [
          "Alzheimer",
          "FTD",
          "Lewy body dementia",
          "MCI",
          "Others",
        ],
      },
      {
        name: "Global cerebral dysfunction",
        subcategories: ["Delirium", "Coma", "Brain death", "AMS"],
      },
      {
        name: "Neuromuscular disorders",
        subcategories: ["ALS", "Muscular dystrophies", "Others"],
      },
      {
        name: "Movement disorders",
        subcategories: [
          "Parkinson’s",
          "Huntington’s",
          "Tremor",
          "Dystonia",
          "Tic disorders",
        ],
      },
      {
        name: "Metabolic neurologic disorders",
        subcategories: ["Metabolic encephalopathies", "Adrenoleukodystrophy"],
      },
      {
        name: "Paroxysmal disorders",
        subcategories: ["Headache types", "Seizures"],
      },
      {
        name: "Sleep disorders",
        subcategories: [
          "Insomnia",
          "Narcolepsy",
          "Parasomnias",
          "Restless legs",
        ],
      },
      {
        name: "Trauma/mechanical/ICP disorders",
        subcategories: ["TBI", "Hematomas", "Hydrocephalus", "↑ICP"],
      },
      {
        name: "Congenital disorders",
        subcategories: [
          "Neural tube defects",
          "Tuberous sclerosis",
          "Friedreich ataxia",
        ],
      },
      {
        name: "Adverse drug effects",
        subcategories: ["Neurotoxicity", "Serotonin syndrome", "EPS", "Others"],
      },
      {
        name: "Eye and eyelid disorders",
        subcategories: [
          "Infections",
          "Structural",
          "Neoplasms",
          "Trauma",
          "Drug effects",
        ],
      },
      {
        name: "Ear disorders",
        subcategories: [
          "Otitis",
          "Hearing loss",
          "Neoplasms",
          "Balance disorders",
          "Trauma",
          "Drug effects",
        ],
      },
    ],
  },
  {
    name: "Skin & Subcutaneous Tissue",
    categories: [
      {
        name: "Infections & inflammation",
        subcategories: [
          "Bacterial",
          "Viral",
          "Fungal",
          "Parasitic",
          "Infestations",
        ],
      },
      {
        name: "Immunologic/inflammatory dermatoses",
        subcategories: [
          "Eczematous/papulosquamous",
          "Vesiculobullous",
          "Urticaria/exanthems",
          "Autoimmune",
        ],
      },
      {
        name: "Neoplasms",
        subcategories: ["Benign lesions", "Malignant neoplasms"],
      },
      {
        name: "Integumentary disorders",
        subcategories: [
          "Hair",
          "Nails",
          "Glands",
          "Oral mucosa",
          "Pigmentation",
        ],
      },
      {
        name: "Trauma/mechanical",
        subcategories: ["Burns", "Bites", "Wounds", "Burn-related"],
      },
      {
        name: "Congenital disorders",
        subcategories: ["Xeroderma pigmentosum", "Neonatal lesions"],
      },
      {
        name: "Adverse drug effects",
        subcategories: ["Drug eruptions", "Vaccine reactions"],
      },
    ],
  },
  {
    name: "Musculoskeletal System",
    categories: [
      {
        name: "Infections/inflammation",
        subcategories: [
          "Osteomyelitis",
          "Septic arthritis",
          "Myositis",
          "Discitis",
          "Others",
        ],
      },
      {
        name: "Immunologic disorders",
        subcategories: [
          "RA",
          "Ankylosing spondylitis",
          "Juvenile idiopathic arthritis",
          "Dermatomyositis/polymyositis",
          "Others",
        ],
      },
      {
        name: "Inflammatory disorders",
        subcategories: [
          "Bursitis",
          "Tendinitis",
          "Frozen shoulder",
          "Myofascial pain",
        ],
      },
      {
        name: "Neoplasms",
        subcategories: ["Bone sarcomas", "Metastases", "Ganglion cyst"],
      },
      {
        name: "Degenerative/metabolic",
        subcategories: [
          "Osteoarthritis",
          "Osteoporosis",
          "Paget disease",
          "Osteomalacia",
          "Gout",
          "Muscle disorders",
          "Others",
        ],
      },
      {
        name: "Trauma/mechanical",
        subcategories: [
          "Fractures",
          "Sprains",
          "Dislocations",
          "Amputation",
          "Compartment syndrome",
          "Others",
        ],
      },
      {
        name: "Congenital disorders",
        subcategories: [
          "Achondroplasia",
          "Hip dysplasia",
          "Osteogenesis imperfecta",
          "Others",
        ],
      },
      {
        name: "Adverse drug effects",
        subcategories: [
          "Steroid myopathy",
          "Statin myopathy",
          "Malignant hyperthermia",
        ],
      },
    ],
  },
  {
    name: "Cardiovascular System",
    categories: [
      {
        name: "Infections/inflammation",
        subcategories: [
          "Endocarditis",
          "Myocarditis",
          "Pericarditis",
          "Atherosclerosis",
        ],
      },
      {
        name: "Neoplasms",
        subcategories: ["Cardiac tumors", "Myxoma", "Metastases"],
      },
      {
        name: "Dysrhythmias",
        subcategories: [
          "Tachyarrhythmias",
          "Bradyarrhythmias",
          "Heart block",
          "Premature beats",
          "Others",
        ],
      },
      {
        name: "Heart failure",
        subcategories: [
          "Systolic",
          "Diastolic",
          "High-output",
          "Cor pulmonale",
          "CHF",
          "Other causes",
        ],
      },
      {
        name: "Ischemic heart disease",
        subcategories: ["Angina", "ACS/MI", "Coronary artery disease"],
      },
      {
        name: "Myocardial diseases",
        subcategories: [
          "Cardiomyopathies",
          "Myocarditis",
          "Post-MI complications",
        ],
      },
      {
        name: "Pericardial diseases",
        subcategories: [
          "Tamponade",
          "Constrictive pericarditis",
          "Pericardial effusion",
          "Others",
        ],
      },
      {
        name: "Valvular heart disease",
        subcategories: [
          "Stenosis",
          "Regurgitation",
          "Prolapse",
          "Vegetations",
          "Rheumatic disease",
          "Others",
        ],
      },
      { name: "Hypotension", subcategories: ["Orthostatic hypotension"] },
      {
        name: "Hypertension",
        subcategories: [
          "Essential",
          "Secondary",
          "Hypertensive emergency",
          "Others",
        ],
      },
      {
        name: "Dyslipidemia",
        subcategories: [
          "Hypercholesterolemia",
          "Hypertriglyceridemia",
          "Others",
        ],
      },
      {
        name: "Vascular disorders",
        subcategories: [
          "Aneurysm",
          "Peripheral arterial disease",
          "DVT/PE",
          "Varicose veins",
          "Others",
        ],
      },
      {
        name: "Traumatic/mechanical disorders",
        subcategories: [
          "Aortic dissection",
          "Cardiac contusion",
          "Tamponade",
          "Others",
        ],
      },
      {
        name: "Congenital disorders",
        subcategories: [
          "ASD",
          "VSD",
          "Tetralogy of Fallot",
          "Coarctation",
          "Transposition",
          "Others",
        ],
      },
      {
        name: "Adverse drug effects",
        subcategories: [
          "ACE inhibitors",
          "Cocaine-related",
          "Cardiotoxic drugs",
          "Others",
        ],
      },
    ],
  },
  {
    name: "Respiratory System",
    categories: [
      {
        name: "Infectious/inflammatory",
        subcategories: [
          "Upper airway infections/inflammation",
          "Lower airway infections/inflammation",
          "Tuberculosis",
          "Fungal infections",
        ],
      },
      {
        name: "Neoplasms",
        subcategories: ["Lung cancer", "Mesothelioma", "Head and neck cancer"],
      },
      {
        name: "Obstructive airway disease",
        subcategories: ["Asthma", "COPD", "Bronchiectasis"],
      },
      {
        name: "Restrictive/ILD",
        subcategories: [
          "Pneumoconiosis",
          "ILD",
          "Hypersensitivity pneumonitis",
        ],
      },
      {
        name: "Respiratory failure & pulmonary vascular",
        subcategories: [
          "ARDS",
          "PE",
          "Pulmonary hypertension",
          "Edema",
          "Others",
        ],
      },
      {
        name: "Metabolic/structural disorders",
        subcategories: ["Hypoventilation", "Gas exchange disorders", "Others"],
      },
      {
        name: "Pleura/mediastinum/chest wall",
        subcategories: [
          "Pleural effusion",
          "Pneumothorax",
          "Empyema",
          "Mediastinitis",
          "Chylothorax",
          "Others",
        ],
      },
      {
        name: "Trauma/mechanical",
        subcategories: [
          "Epistaxis",
          "Barotrauma",
          "Sleep apnea",
          "Trauma",
          "Foreign body",
          "Others",
        ],
      },
      {
        name: "Congenital disorders",
        subcategories: [
          "Pulmonary sequestration",
          "Bronchogenic cyst",
          "CDH",
          "Others",
        ],
      },
      {
        name: "Adverse effects of drugs",
        subcategories: [
          "Amiodarone lung",
          "Bleomycin toxicity",
          "Oxygen toxicity",
          "Others",
        ],
      },
    ],
  },
  {
    name: "Gastrointestinal System",
    categories: [
      {
        name: "Infectious/inflammatory",
        subcategories: ["Bacterial", "Viral", "Fungal", "Parasitic", "Other"],
      },
      {
        name: "Autoimmune/inflammatory",
        subcategories: ["IBD", "Celiac", "Autoimmune hepatitis", "Other"],
      },
      {
        name: "Neoplasms",
        subcategories: [
          "Others",
          "Oral Tumors",
          "Pancreatic Tumors",
          "Liver/Gallbladder Tumors",
          "Gastric Tumors",
          "Small Intestine Tumors",
          "Large Intestine Tumors",
        ],
      },
      {
        name: "Signs, symptoms, ill-defined",
        subcategories: [
          "Bleeding",
          "Obstruction",
          "Pain",
          "Diarrhea",
          "Constipation",
          "Nausea/vomiting",
        ],
      },
      {
        name: "Oral/esophageal disorders",
        subcategories: [
          "Caries",
          "Achalasia",
          "GERD",
          "Mallory‑Weiss",
          "Strictures",
        ],
      },
      {
        name: "Stomach/intestine diseases",
        subcategories: [
          "Peptic ulcer",
          "Appendicitis",
          "IBS",
          "Volvulus",
          "Malabsorption",
          "Others",
        ],
      },
      {
        name: "Rectum/anus disorders",
        subcategories: ["Fissure", "Abscess", "Fistula", "Ulcer", "Others"],
      },
      {
        name: "Liver/biliary",
        subcategories: [
          "Cirrhosis",
          "Cholangitis",
          "Cholelithiasis",
          "PSC",
          "Fatty liver",
          "Others",
        ],
      },
      {
        name: "Pancreatic disorders",
        subcategories: ["Pancreatitis", "Pseudocyst", "Others"],
      },
      {
        name: "Peritoneal disorders",
        subcategories: ["Ascites", "Peritonitis"],
      },
      {
        name: "Trauma/mechanical",
        subcategories: ["Hernias", "Adhesions", "Perforation", "Foreign body"],
      },
      {
        name: "Congenital disorders",
        subcategories: [
          "Meckel diverticulum",
          "Atresias",
          "Malrotation",
          "Annular pancreas",
          "Others",
        ],
      },
      {
        name: "Adverse drug effects",
        subcategories: [
          "NSAID ulcers",
          "Opioid-induced constipation",
          "Acetaminophen hepatitis",
          "Others",
        ],
      },
    ],
  },
  {
    name: "Renal & Urinary System",
    categories: [
      {
        name: "Infectious/inflammatory",
        subcategories: [
          "UTIs",
          "Pyelonephritis",
          "Glomerulonephritis",
          "Interstitial nephritis",
          "Others",
        ],
      },
      {
        name: "Neoplasms",
        subcategories: ["Renal cell CA", "Wilms tumor", "Bladder CA", "Others"],
      },
      {
        name: "Signs/symptoms",
        subcategories: [
          "Hematuria",
          "Proteinuria",
          "Oliguria/dysuria",
          "Anuria",
        ],
      },
      {
        name: "Metabolic/regulatory",
        subcategories: [
          "AKI",
          "CKD",
          "Nephrotic/nephritic syndrome",
          "Calculi",
          "Renal Insufficiency",
          "Others",
        ],
      },
      {
        name: "Vascular disorders",
        subcategories: [
          "Renal artery stenosis",
          "Renal vein thrombosis",
          "Renal infarction",
        ],
      },
      {
        name: "Trauma/mechanical",
        subcategories: [
          "Bladder rupture",
          "Obstructive uropathy",
          "Neurogenic bladder",
        ],
      },
      {
        name: "Congenital disorders",
        subcategories: ["Horseshoe kidney", "Duplications", "Renal agenesis"],
      },
      {
        name: "Adverse drug effects",
        subcategories: [
          "Aminoglycoside toxicity",
          "NSAIDs",
          "ACE inhibitors",
          "Contrast nephropathy",
        ],
      },
    ],
  },
  {
    name: "Pregnancy, Childbirth, & the Puerperium",
    categories: [
      {
        name: "Prenatal care",
        subcategories: [
          "Preconception",
          "Risk assessment",
          "Normal pregnancy supervision",
        ],
      },
      {
        name: "Obstetric complications",
        subcategories: [
          "Eclampsia/HELLP",
          "Placental issues",
          "Ectopic",
          "Gestational diabetes",
          "Infections",
          "Bleeding",
          "Trauma",
        ],
      },
      {
        name: "Labor and delivery",
        subcategories: [
          "Normal labor",
          "Complicated labor",
          "Preterm/post‑term",
          "Prolapsed cord",
        ],
      },
      {
        name: "Puerperium and complications",
        subcategories: [
          "Postpartum hemorrhage",
          "Postpartum sepsis",
          "Cardiomyopathy",
          "Lactation issues",
        ],
      },
      {
        name: "Newborn (birth-4 weeks)",
        subcategories: [
          "Normal newborn care",
          "Neonatal disorders",
          "Screening",
          "Birth trauma",
          "Jaundice",
          "Infections",
          "SIDS",
        ],
      },
      {
        name: "Adverse drug effects",
        subcategories: ["Teratogens", "Prenatal exposure drugs"],
      },
      {
        name: "Systemic disorders affecting pregnancy",
        subcategories: [
          "Diabetes",
          "Hypertension",
          "Renal disease",
          "Psychiatric disorders",
        ],
      },
    ],
  },
  {
    name: "Female and Transgender Reproductive System & Breast",
    categories: [
      {
        name: "Breast disorders",
        subcategories: [
          "Mastitis",
          "Breast abscess",
          "Benign neoplasms",
          "Breast cancer",
        ],
      },
      {
        name: "Infectious/inflammatory reproductive",
        subcategories: ["Vaginitis", "PID", "STIs"],
      },
      {
        name: "Reproductive neoplasms",
        subcategories: [
          "Cervical/endometrial/ovarian cancers",
          "Benign cysts/polyps",
          "Trophoblastic disease",
        ],
      },
      {
        name: "Fertility and contraception",
        subcategories: [
          "IVF, IUD, oral contraceptives, condoms",
          "Infertility workup",
          "Others",
        ],
      },
      {
        name: "Menopause",
        subcategories: [
          "Perimenopause",
          "Vasomotor symptoms",
          "Postmenopausal bleeding",
          "Others",
        ],
      },
      {
        name: "Menstrual and endocrine disorders",
        subcategories: [
          "Amenorrhea",
          "Dysmenorrhea",
          "PCOS",
          "Endometriosis",
          "Others",
        ],
      },
      {
        name: "Trauma/mechanical disorders",
        subcategories: ["Asherman syndrome", "Pelvic organ prolapse", "Injury"],
      },
      {
        name: "Congenital disorders",
        subcategories: ["Müllerian agenesis", "Bicornuate uterus"],
      },
      {
        name: "Adverse drug effects",
        subcategories: [
          "SSRIs",
          "Antihypertensives",
          "Opioids",
          "Hormonal agents",
        ],
      },
    ],
  },
  {
    name: "Male and Transgender Reproductive System",
    categories: [
      {
        name: "Infectious/inflammatory",
        subcategories: ["Prostatitis", "Epididymitis", "STIs"],
      },
      {
        name: "Immunologic/inflammatory",
        subcategories: ["Autoimmune hypogonadism"],
      },
      {
        name: "Neoplasms",
        subcategories: ["Prostate CA", "Testicular CA", "Penile CA", "Others"],
      },
      {
        name: "Sexual dysfunction and metabolism",
        subcategories: [
          "Erectile dysfunction",
          "Infertility",
          "Premature ejaculation",
        ],
      },
      {
        name: "Trauma/mechanical disorders",
        subcategories: [
          "BPH",
          "Hydrocele",
          "Varicocele",
          "Penile fracture",
          "Circumcision complications",
          "Others",
        ],
      },
      {
        name: "Congenital disorders",
        subcategories: [
          "Hypospadias",
          "Undescended testicle",
          "Klinefelter syndrome",
          "Others",
        ],
      },
      {
        name: "Adverse drug effects",
        subcategories: [
          "Antipsychotics",
          "SSRIs",
          "Finasteride",
          "Testosterone",
          "Marijuana",
          "Others",
        ],
      },
    ],
  },
  {
    name: "Endocrine System",
    categories: [
      {
        name: "Pancreatic disorders",
        subcategories: [
          "Type 1/2 diabetes",
          "DKA",
          "Hypoglycemia",
          "Insulinoma",
          "Others",
        ],
      },
      {
        name: "Thyroid disorders",
        subcategories: [
          "Hypothyroidism",
          "Hyperthyroidism",
          "Thyroid cancer",
          "Thyroiditis",
          "Others",
        ],
      },
      {
        name: "Parathyroid disorders",
        subcategories: ["Hyperparathyroidism", "Hypoparathyroidism"],
      },
      {
        name: "Adrenal disorders",
        subcategories: [
          "Addison's",
          "Cushing's",
          "Pheochromocytoma",
          "Neoplasms",
          "Others",
        ],
      },
      {
        name: "Pituitary disorders",
        subcategories: [
          "Acromegaly",
          "Diabetes insipidus",
          "Prolactinoma",
          "Pituitary apoplexy",
          "Others",
        ],
      },
      {
        name: "Hypothalamic disorders",
        subcategories: ["MEN1/2", "Growth hormone deficiency"],
      },
      {
        name: "Congenital endocrine disorders",
        subcategories: [
          "CAH",
          "Congenital hypothyroidism",
          "Androgen insensitivity",
        ],
      },
      {
        name: "Adverse drug effects",
        subcategories: [
          "Steroid-induced",
          "Anabolic steroids",
          "Drug-induced endocrine imbalance",
        ],
      },
    ],
  },
  {
    name: "Multisystem Processes & Disorders",
    categories: [
      {
        name: "Infectious, Immunologic, and Inflammatory Disorders",
        subcategories: [
          "Infectious Disorders",
          "Immunolgical and Inflammatory Disorders",
        ],
      },
      {
        name: "Paraneoplastic syndromes",
        subcategories: ["SIADH", "Hypercalcemia", "Neurologic syndromes"],
      },
      {
        name: "Inherited cancer syndromes",
        subcategories: ["HNPCC", "DNA repair disorders"],
      },
      {
        name: "Signs/symptoms",
        subcategories: [
          "Fever of unknown origin",
          "Shock",
          "Pain",
          "Fatigue",
          "Syncope",
        ],
      },
      {
        name: "Nutrition",
        subcategories: [
          "Malnutrition",
          "Obesity",
          "Vitamin/mineral deficiencies",
        ],
      },
      {
        name: "Toxins & environment",
        subcategories: [
          "Radiation",
          "Burns",
          "Hypothermia/Hyperthermia",
          "Chemical poisoning",
          "Venomous bites",
        ],
      },
      {
        name: "Fluid/electrolyte/acid-base",
        subcategories: ["Hyponatremia", "Acidosis", "Volume disorders"],
      },
      {
        name: "Abuse",
        subcategories: ["Child abuse", "Elder abuse", "Sexual assault"],
      },
      {
        name: "Multiple trauma",
        subcategories: ["Blast injuries", "Polytrauma"],
      },
      {
        name: "Shock",
        subcategories: ["Septic", "Cardiogenic", "Hypovolemic", "Neurogenic"],
      },
      {
        name: "Genetic/metabolic/developmental disorders",
        subcategories: [
          "Down syndrome",
          "Storage disorders",
          "CF",
          "Marfan",
          "Fragile X",
        ],
      },
      {
        name: "Adverse drug effects",
        subcategories: [
          "Electrolyte imbalances",
          "Drug‑induced acid/base disorders",
          "Others",
        ],
      },
    ],
  },
  {
    name: "Biostatistics, Epidemiology/Population Health, & Interpretation of the Medical Literature",
    categories: [
      {
        name: "Epidemiology & population health",
        subcategories: [
          "Disease frequency",
          "Survival analysis",
          "Outbreak investigation",
          "Screening",
        ],
      },
      {
        name: "Study design",
        subcategories: [
          "Observational",
          "Interventional",
          "Systematic review/meta‑analysis",
        ],
      },
      {
        name: "Measures of association",
        subcategories: ["Relative risk", "Odds ratio", "Hazard ratio"],
      },
      {
        name: "Distributions",
        subcategories: [
          "Central tendency",
          "Variability",
          "Regression to the mean",
        ],
      },
      {
        name: "Correlation & regression",
        subcategories: ["Correlation coefficients", "Multiple regression"],
      },
      {
        name: "Principles of testing & screening",
        subcategories: [
          "Sensitivity/specificity",
          "ROC curves",
          "Pre-/post-test probability",
        ],
      },
      {
        name: "Study interpretation",
        subcategories: [
          "Bias",
          "Confounding",
          "Causation vs chance",
          "Statistical vs clinical significance",
        ],
      },
      {
        name: "Clinical decision making",
        subcategories: [
          "Evidence-based medicine",
          "Patient-centered risk/benefit",
        ],
      },
      {
        name: "Research ethics",
        subcategories: [
          "Informed consent",
          "IRBs",
          "Privacy",
          "Trial phases",
          "Placebo use",
        ],
      },
    ],
  },
  {
    name: "Social Sciences",
    categories: [
      {
        name: "Communication & interpersonal skills",
        subcategories: [
          "Patient interviewing",
          "Health literacy",
          "Use of interpreter",
        ],
      },
      {
        name: "Medical ethics & jurisprudence",
        subcategories: [
          "Consent",
          "Capacity",
          "Privacy",
          "End of life",
          "Malpractice",
        ],
      },
      {
        name: "Systems-based practice & patient safety",
        subcategories: [
          "Quality improvement",
          "Error prevention",
          "Teamwork",
          "Health systems",
        ],
      },
      {
        name: "Health policy & economics",
        subcategories: [
          "Disparities",
          "Insurance types",
          "EMTALA",
          "Access to care",
        ],
      },
    ],
  },
] as const;

export type SystemsMap = {
  "Human Development": {
    "Normal age-related findings and care of the well patient": {
      "Infancy and childhood (0-12 years)": true;
      "Adolescence (13-17 years)": true;
      "Adulthood (18-64 years)": true;
      "Older Adulthood (65 years and older)": true;
    };
  };
  "Immune System": {
    "Disorders associated with immunodeficiency": {
      "Deficiency primarily of humoral immunity": true;
      "Deficiency/dysfunction primarily of cell-mediated immunity": true;
      "Complement deficiency": true;
      "Deficiency of phagocytic cells and natural killer cells": true;
    };
    "HIV/AIDS": {
      "HIV1 and HIV2; AIDS; complications": true;
    };
    "Immunologically mediated disorders": {
      "Hypersensitivity reactions": true;
      "Transplantation (rejection/GVHD)": true;
    };
    "Adverse effects of drugs on the immune system": {
      "Jarisch-Herxheimer reaction": true;
      "Immunomodulatory drug effects": true;
    };
  };
  "Blood & Lymphoreticular System": {
    "Infectious and immunologic": {
      "Infectious disorders": true;
      "Primary infections of lymphoid tissue": true;
      "Immunologic/inflammatory disorders": true;
    };
    Neoplasms: {
      Leukemias: true;
      Lymphomas: true;
      "Multiple myeloma and related neoplasms": true;
      Others: true;
    };
    "Anemia, cytopenias, polycythemia": {
      "Decreased production": true;
      Hemolysis: true;
      "Disorders of hemoglobin/heme/membrane": true;
      "Other causes": true;
      Cytopenias: true;
      Polycythemia: true;
    };
    "Coagulation disorders": {
      Hypocoagulable: true;
      Hypercoagulable: true;
      "Reactions to blood components": true;
    };
    "Traumatic/mechanical/vascular disorders": {
      "Mechanical hemolysis": true;
      "Splenic disorders": true;
    };
    "Adverse effects of drugs": {
      Anticoagulants: true;
      Chemotherapeutics: true;
      Others: true;
    };
  };
  "Behavioral Health": {
    "Psychotic disorders": {
      "Brief psychotic disorder": true;
      Schizophrenia: true;
      Others: true;
    };
    "Anxiety disorders": {
      "GAD, panic, phobias": true;
      "PTSD, OCD, etc.": true;
    };
    "Mood disorders": {
      "Major depressive": true;
      Bipolar: true;
      Cyclothymic: true;
      "Premenstrual dysphoric": true;
    };
    "Somatic symptom & related disorders": {
      "Somatic symptom disorder": true;
      "Conversion disorder": true;
      "Illness anxiety": true;
    };
    "Factitious disorders": {
      "Factitious disorder imposed on self": true;
    };
    "Eating & impulse-control disorders": {
      Anorexia: true;
      Bulimia: true;
      "Binge-eating": true;
      "Disruptive/Impulse-control": true;
      Others: true;
    };
    "Disorders originating in infancy/childhood": {
      ADHD: true;
      Autism: true;
      "Attachment disorders": true;
      "Elimination disorders": true;
      "Speech/language disorders": true;
    };
    "Personality disorders": {
      "Cluster A-C personality disorders": true;
    };
    "Psychosocial disorders/behaviors": {
      "Adjustment, grief, psychosocial stressors": true;
    };
    "Sexual disorders & gender dysphoria": {
      "Gender dysphoria": true;
      "Psychosexual dysfunctions": true;
      Others: true;
    };
    "Substance use disorders": {
      Alcohol: true;
      Nicotine: true;
      Cannabis: true;
      Opioids: true;
      Stimulants: true;
      Hallucinogens: true;
      "Sedatives/hypnotics": true;
      Polysubstance: true;
    };
  };
  "Nervous System & Special Senses": {
    "Infectious/immunologic/inflammatory": {
      Meningitis: true;
      Encephalitis: true;
      Others: true;
    };
    "Immunologic/inflammatory disorders": {
      "Myasthenia gravis": true;
      MS: true;
      "Transverse myelitis": true;
    };
    Neoplasms: {
      Benign: true;
      Malignant: true;
      Metastatic: true;
    };
    "Cerebrovascular disease": {
      "Stroke, TIA, hemorrhage, aneurysm, vascular dementia": true;
      Others: true;
    };
    "Spinal cord/root disorders": {
      "Cauda equina": true;
      "Cord compression": true;
      "Spinal stenosis": true;
    };
    "Peripheral nerve disorders": {
      "Guillain‑Barré": true;
      Neuropathies: true;
      "Entrapment syndromes": true;
    };
    "Pain syndromes": {
      "Trigeminal neuralgia": true;
      Fibromyalgia: true;
      CRPS: true;
      Others: true;
    };
    "Degenerative/amnestic disorders": {
      Alzheimer: true;
      FTD: true;
      "Lewy body dementia": true;
      MCI: true;
      Others: true;
    };
    "Global cerebral dysfunction": {
      Delirium: true;
      Coma: true;
      "Brain death": true;
      AMS: true;
    };
    "Neuromuscular disorders": {
      ALS: true;
      "Muscular dystrophies": true;
      Others: true;
    };
    "Movement disorders": {
      "Parkinson’s": true;
      "Huntington’s": true;
      Tremor: true;
      Dystonia: true;
      "Tic disorders": true;
    };
    "Metabolic neurologic disorders": {
      "Metabolic encephalopathies": true;
      Adrenoleukodystrophy: true;
    };
    "Paroxysmal disorders": {
      "Headache types": true;
      Seizures: true;
    };
    "Sleep disorders": {
      Insomnia: true;
      Narcolepsy: true;
      Parasomnias: true;
      "Restless legs": true;
    };
    "Trauma/mechanical/ICP disorders": {
      TBI: true;
      Hematomas: true;
      Hydrocephalus: true;
      "↑ICP": true;
    };
    "Congenital disorders": {
      "Neural tube defects": true;
      "Tuberous sclerosis": true;
      "Friedreich ataxia": true;
    };
    "Adverse drug effects": {
      Neurotoxicity: true;
      "Serotonin syndrome": true;
      EPS: true;
      Others: true;
    };
    "Eye and eyelid disorders": {
      Infections: true;
      Structural: true;
      Neoplasms: true;
      Trauma: true;
      "Drug effects": true;
    };
    "Ear disorders": {
      Otitis: true;
      "Hearing loss": true;
      Neoplasms: true;
      "Balance disorders": true;
      Trauma: true;
      "Drug effects": true;
    };
  };
  "Skin & Subcutaneous Tissue": {
    "Infections & inflammation": {
      Bacterial: true;
      Viral: true;
      Fungal: true;
      Parasitic: true;
      Infestations: true;
    };
    "Immunologic/inflammatory dermatoses": {
      "Eczematous/papulosquamous": true;
      Vesiculobullous: true;
      "Urticaria/exanthems": true;
      Autoimmune: true;
    };
    Neoplasms: {
      "Benign lesions": true;
      "Malignant neoplasms": true;
    };
    "Integumentary disorders": {
      Hair: true;
      Nails: true;
      Glands: true;
      "Oral mucosa": true;
      Pigmentation: true;
    };
    "Trauma/mechanical": {
      Burns: true;
      Bites: true;
      Wounds: true;
      "Burn-related": true;
    };
    "Congenital disorders": {
      "Xeroderma pigmentosum": true;
      "Neonatal lesions": true;
    };
    "Adverse drug effects": {
      "Drug eruptions": true;
      "Vaccine reactions": true;
    };
  };
  "Musculoskeletal System": {
    "Infections/inflammation": {
      Osteomyelitis: true;
      "Septic arthritis": true;
      Myositis: true;
      Discitis: true;
      Others: true;
    };
    "Immunologic disorders": {
      RA: true;
      "Ankylosing spondylitis": true;
      "Juvenile idiopathic arthritis": true;
      "Dermatomyositis/polymyositis": true;
      Others: true;
    };
    "Inflammatory disorders": {
      Bursitis: true;
      Tendinitis: true;
      "Frozen shoulder": true;
      "Myofascial pain": true;
    };
    Neoplasms: {
      "Bone sarcomas": true;
      Metastases: true;
      "Ganglion cyst": true;
    };
    "Degenerative/metabolic": {
      Osteoarthritis: true;
      Osteoporosis: true;
      "Paget disease": true;
      Osteomalacia: true;
      Gout: true;
      "Muscle disorders": true;
      Others: true;
    };
    "Trauma/mechanical": {
      Fractures: true;
      Sprains: true;
      Dislocations: true;
      Amputation: true;
      "Compartment syndrome": true;
      Ohters: true;
    };
    "Congenital disorders": {
      Achondroplasia: true;
      "Hip dysplasia": true;
      "Osteogenesis imperfecta": true;
      Others: true;
    };
    "Adverse drug effects": {
      "Steroid myopathy": true;
      "Statin myopathy": true;
      "Malignant hyperthermia": true;
    };
  };
  "Cardiovascular System": {
    "Infections/inflammation": {
      Endocarditis: true;
      Myocarditis: true;
      Pericarditis: true;
      Atherosclerosis: true;
    };
    Neoplasms: {
      "Cardiac tumors": true;
      Myxoma: true;
      Metastases: true;
    };
    Dysrhythmias: {
      Tachyarrhythmias: true;
      Bradyarrhythmias: true;
      "Heart block": true;
      "Premature beats": true;
      Others: true;
    };
    "Heart failure": {
      Systolic: true;
      Diastolic: true;
      "High-output": true;
      "Cor pulmonale": true;
      CHF: true;
      "Other causes": true;
    };
    "Ischemic heart disease": {
      Angina: true;
      "ACS/MI": true;
      "Coronary artery disease": true;
    };
    "Myocardial diseases": {
      Cardiomyopathies: true;
      Myocarditis: true;
      "Post-MI complications": true;
    };
    "Pericardial diseases": {
      Tamponade: true;
      "Constrictive pericarditis": true;
      "Pericardial effusion": true;
      Others: true;
    };
    "Valvular heart disease": {
      Stenosis: true;
      Regurgitation: true;
      Prolapse: true;
      Vegetations: true;
      "Rheumatic disease": true;
      Others: true;
    };
    Hypotension: {
      "Orthostatic hypotension": true;
    };
    Hypertension: {
      Essential: true;
      Secondary: true;
      "Hypertensive emergency": true;
      Others: true;
    };
    Dyslipidemia: {
      Hypercholesterolemia: true;
      Hypertriglyceridemia: true;
      Others: true;
    };
    "Vascular disorders": {
      Aneurysm: true;
      "Peripheral arterial disease": true;
      "DVT/PE": true;
      "Varicose veins": true;
      Others: true;
    };
    "Traumatic/mechanical disorders": {
      "Aortic dissection": true;
      "Cardiac contusion": true;
      Tamponade: true;
      Others: true;
    };
    "Congenital disorders": {
      ASD: true;
      VSD: true;
      "Tetralogy of Fallot": true;
      Coarctation: true;
      Transposition: true;
      Others: true;
    };
    "Adverse drug effects": {
      "ACE inhibitors": true;
      "Cocaine-related": true;
      "Cardiotoxic drugs": true;
      Others: true;
    };
  };
  "Respiratory System": {
    "Infectious/inflammatory": {
      "Upper airway infections/inflammation": true;
      "Lower airway infections/inflammation": true;
      Tuberculosis: true;
      "Fungal infections": true;
    };
    Neoplasms: {
      "Lung cancer": true;
      Mesothelioma: true;
      "Head and neck cancer": true;
    };
    "Obstructive airway disease": {
      Asthma: true;
      COPD: true;
      Bronchiectasis: true;
    };
    "Restrictive/ILD": {
      Pneumoconiosis: true;
      ILD: true;
      "Hypersensitivity pneumonitis": true;
    };
    "Respiratory failure & pulmonary vascular": {
      ARDS: true;
      PE: true;
      "Pulmonary hypertension": true;
      Edema: true;
      Others: true;
    };
    "Metabolic/structural disorders": {
      Hypoventilation: true;
      "Gas exchange disorders": true;
      Others: true;
    };
    "Pleura/mediastinum/chest wall": {
      "Pleural effusion": true;
      Pneumothorax: true;
      Empyema: true;
      Mediastinitis: true;
      Chylothorax: true;
      Others: true;
    };
    "Trauma/mechanical": {
      Epistaxis: true;
      Barotrauma: true;
      "Sleep apnea": true;
      "Chest trauma": true;
      "Foreign body": true;
      Others: true;
    };
    "Congenital disorders": {
      "Pulmonary sequestration": true;
      "Bronchogenic cyst": true;
      CDH: true;
      Others: true;
    };
    "Adverse effects of drugs": {
      "Amiodarone lung": true;
      "Bleomycin toxicity": true;
      "Oxygen toxicity": true;
      Others: true;
    };
  };
  "Gastrointestinal System": {
    "Infectious/inflammatory": {
      Bacterial: true;
      Viral: true;
      Fungal: true;
      Parasitic: true;
      Other: true;
    };
    "Autoimmune/inflammatory": {
      IBD: true;
      Celiac: true;
      "Autoimmune hepatitis": true;
      Other: true;
    };
    Neoplasms: {
      Others: true;
      "Oral Tumors": true;
      "Pancreatic Tumors": true;
      "Liver/Gallbladder Tumors": true;
      "Gastric Tumors": true;
      "Small Intestine Tumors": true;
      "Large Intestine Tumors": true;
    };
    "Signs, symptoms, ill-defined": {
      Bleeding: true;
      Obstruction: true;
      Pain: true;
      Diarrhea: true;
      Constipation: true;
      "Nausea/vomiting": true;
    };
    "Oral/esophageal disorders": {
      Caries: true;
      Achalasia: true;
      GERD: true;
      "Mallory‑Weiss": true;
      Strictures: true;
    };
    "Stomach/intestine diseases": {
      "Peptic ulcer": true;
      Appendicitis: true;
      IBS: true;
      Volvulus: true;
      Malabsorption: true;
      Others: true;
    };
    "Rectum/anus disorders": {
      Fissure: true;
      Abscess: true;
      Fistula: true;
      Ulcer: true;
      Others: true;
    };
    "Liver/biliary": {
      Cirrhosis: true;
      Cholangitis: true;
      Cholelithiasis: true;
      PSC: true;
      "Fatty liver": true;
      Others: true;
    };
    "Pancreatic disorders": {
      "Acute/chronic pancreatitis": true;
      Pseudocyst: true;
      Others: true;
    };
    "Peritoneal disorders": {
      Ascites: true;
      Peritonitis: true;
    };
    "Trauma/mechanical": {
      Hernias: true;
      Adhesions: true;
      Perforation: true;
      "Foreign body": true;
    };
    "Congenital disorders": {
      "Meckel diverticulum": true;
      Atresias: true;
      Malrotation: true;
      "Annular pancreas": true;
      Others: true;
    };
    "Adverse drug effects": {
      "NSAID ulcers": true;
      "Opioid-induced constipation": true;
      "Acetaminophen hepatitis": true;
      Others: true;
    };
  };
  "Renal & Urinary System": {
    "Infectious/inflammatory": {
      UTIs: true;
      Pyelonephritis: true;
      Glomerulonephritis: true;
      "Interstitial nephritis": true;
      Others: true;
    };
    Neoplasms: {
      "Renal cell CA": true;
      "Wilms tumor": true;
      "Bladder CA": true;
      Others: true;
    };
    "Signs/symptoms": {
      Hematuria: true;
      Proteinuria: true;
      "Oliguria/dysuria": true;
      Anuria: true;
    };
    "Metabolic/regulatory": {
      AKI: true;
      CKD: true;
      "Nephrotic/nephritic syndrome": true;
      Calculi: true;
      "Renal Insufficiency": true;
      Others: true;
    };
    "Vascular disorders": {
      "Renal artery stenosis": true;
      "Renal vein thrombosis": true;
      "Renal infarction": true;
    };
    "Trauma/mechanical": {
      "Bladder rupture": true;
      "Obstructive uropathy": true;
      "Neurogenic bladder": true;
    };
    "Congenital disorders": {
      "Horseshoe kidney": true;
      Duplications: true;
      "Renal agenesis": true;
    };
    "Adverse drug effects": {
      "Aminoglycoside toxicity": true;
      NSAIDs: true;
      "ACE inhibitors": true;
      "Contrast nephropathy": true;
    };
  };
  "Pregnancy, Childbirth, & the Puerperium": {
    "Prenatal care": {
      Preconception: true;
      "Risk assessment": true;
      "Normal pregnancy supervision": true;
    };
    "Obstetric complications": {
      "Eclampsia/HELLP": true;
      "Placental issues": true;
      Ectopic: true;
      "Gestational diabetes": true;
      Infections: true;
      Bleeding: true;
      Trauma: true;
    };
    "Labor and delivery": {
      "Normal labor": true;
      "Complicated labor": true;
      "Preterm/post‑term": true;
      "Prolapsed cord": true;
    };
    "Puerperium and complications": {
      "Postpartum hemorrhage": true;
      "Postpartum sepsis": true;
      Cardiomyopathy: true;
      "Lactation issues": true;
    };
    "Newborn (birth-4 weeks)": {
      "Normal newborn care": true;
      "Neonatal disorders": true;
      Screening: true;
      "Birth trauma": true;
      Jaundice: true;
      Infections: true;
      SIDS: true;
    };
    "Adverse drug effects": {
      Teratogens: true;
      "Prenatal exposure drugs": true;
    };
    "Systemic disorders affecting pregnancy": {
      Diabetes: true;
      Hypertension: true;
      "Renal disease": true;
      "Psychiatric disorders": true;
    };
  };
  "Female and Transgender Reproductive System & Breast": {
    "Breast disorders": {
      Mastitis: true;
      "Breast abscess": true;
      "Benign neoplasms": true;
      "Breast cancer": true;
    };
    "Infectious/inflammatory reproductive": {
      Vaginitis: true;
      PID: true;
      STIs: true;
    };
    "Reproductive neoplasms": {
      "Cervical/endometrial/ovarian cancers": true;
      "Benign cysts/polyps": true;
      "Trophoblastic disease": true;
    };
    "Fertility and contraception": {
      "IVF, IUD, oral contraceptives, condoms": true;
      "Infertility workup": true;
      Others: true;
    };
    Menopause: {
      Perimenopause: true;
      "Vasomotor symptoms": true;
      "Postmenopausal bleeding": true;
      Others: true;
    };
    "Menstrual and endocrine disorders": {
      Amenorrhea: true;
      Dysmenorrhea: true;
      PCOS: true;
      Endometriosis: true;
      Others: true;
    };
    "Trauma/mechanical disorders": {
      "Asherman syndrome": true;
      "Pelvic organ prolapse": true;
      Injury: true;
    };
    "Congenital disorders": {
      "Müllerian agenesis": true;
      "Bicornuate uterus": true;
    };
    "Adverse drug effects": {
      SSRIs: true;
      Antihypertensives: true;
      Opioids: true;
      "Hormonal agents": true;
    };
  };
  "Male and Transgender Reproductive System": {
    "Infectious/inflammatory": {
      Prostatitis: true;
      Epididymitis: true;
      STIs: true;
    };
    "Immunologic/inflammatory": {
      "Autoimmune hypogonadism": true;
    };
    Neoplasms: {
      "Prostate CA": true;
      "Testicular CA": true;
      "Penile CA": true;
      Others: true;
    };
    "Sexual dysfunction and metabolism": {
      "Erectile dysfunction": true;
      Infertility: true;
      "Premature ejaculation": true;
    };
    "Trauma/mechanical disorders": {
      BPH: true;
      Hydrocele: true;
      Varicocele: true;
      "Penile fracture": true;
      "Circumcision complications": true;
      Others: true;
    };
    "Congenital disorders": {
      Hypospadias: true;
      "Undescended testicle": true;
      "Klinefelter syndrome": true;
      Others: true;
    };
    "Adverse drug effects": {
      Antipsychotics: true;
      SSRIs: true;
      Finasteride: true;
      Testosterone: true;
      Marijuana: true;
      Others: true;
    };
  };
  "Endocrine System": {
    "Pancreatic disorders": {
      "Type 1/2 diabetes": true;
      DKA: true;
      Hypoglycemia: true;
      Insulinoma: true;
      Others: true;
    };
    "Thyroid disorders": {
      Hypothyroidism: true;
      Hyperthyroidism: true;
      "Thyroid cancer": true;
      Thyroiditis: true;
      Others: true;
    };
    "Parathyroid disorders": {
      Hyperparathyroidism: true;
      Hypoparathyroidism: true;
    };
    "Adrenal disorders": {
      "Addison's": true;
      "Cushing's": true;
      Pheochromocytoma: true;
      Neoplasms: true;
      Others: true;
    };
    "Pituitary disorders": {
      Acromegaly: true;
      "Diabetes insipidus": true;
      Prolactinoma: true;
      "Pituitary apoplexy": true;
      Others: true;
    };
    "Hypothalamic disorders": {
      "MEN1/2": true;
      "Growth hormone deficiency": true;
    };
    "Congenital endocrine disorders": {
      CAH: true;
      "Congenital hypothyroidism": true;
      "Androgen insensitivity": true;
    };
    "Adverse drug effects": {
      "Steroid-induced": true;
      "Anabolic steroids": true;
      "Drug-induced endocrine imbalance": true;
    };
  };
  "Multisystem Processes & Disorders": {
    "Infectious, Immunologic, and Inflammatory Disorders": {
      "Infectious Disorders": true;
      "Immunolgical and Inflammatory Disorders": true;
    };
    "Paraneoplastic syndromes": {
      SIADH: true;
      Hypercalcemia: true;
      "Neurologic syndromes": true;
    };
    "Inherited cancer syndromes": {
      HNPCC: true;
      "DNA repair disorders": true;
    };
    "Signs/symptoms": {
      "Fever of unknown origin": true;
      Shock: true;
      Pain: true;
      Fatigue: true;
      Syncope: true;
    };
    Nutrition: {
      Malnutrition: true;
      Obesity: true;
      "Vitamin/mineral deficiencies": true;
    };
    "Toxins & environment": {
      Radiation: true;
      Burns: true;
      "Hypothermia/Hyperthermia": true;
      "Chemical poisoning": true;
      "Venomous bites": true;
    };
    "Fluid/electrolyte/acid-base": {
      Hyponatremia: true;
      Acidosis: true;
      "Volume disorders": true;
    };
    Abuse: {
      "Child abuse": true;
      "Elder abuse": true;
      "Sexual assault": true;
    };
    "Multiple trauma": {
      "Blast injuries": true;
      Polytrauma: true;
    };
    Shock: {
      Septic: true;
      Cardiogenic: true;
      Hypovolemic: true;
      Neurogenic: true;
    };
    "Genetic/metabolic/developmental disorders": {
      "Down syndrome": true;
      "Storage disorders": true;
      CF: true;
      Marfan: true;
      "Fragile X": true;
    };
    "Adverse drug effects": {
      "Electrolyte imbalances": true;
      "Drug‑induced acid/base disorders": true;
      Others: true;
    };
  };
  "Biostatistics, Epidemiology/Population Health, & Interpretation of the Medical Literature": {
    "Epidemiology & population health": {
      "Disease frequency": true;
      "Survival analysis": true;
      "Outbreak investigation": true;
      Screening: true;
    };
    "Study design": {
      Observational: true;
      Interventional: true;
      "Systematic review/meta‑analysis": true;
    };
    "Measures of association": {
      "Relative risk": true;
      "Odds ratio": true;
      "Hazard ratio": true;
    };
    Distributions: {
      "Central tendency": true;
      Variability: true;
      "Regression to the mean": true;
    };
    "Correlation & regression": {
      "Correlation coefficients": true;
      "Multiple regression": true;
    };
    "Principles of testing & screening": {
      "Sensitivity/specificity": true;
      "ROC curves": true;
      "Pre-/post-test probability": true;
    };
    "Study interpretation": {
      Bias: true;
      Confounding: true;
      "Causation vs chance": true;
      "Statistical vs clinical significance": true;
    };
    "Clinical decision making": {
      "Evidence-based medicine": true;
      "Patient-centered risk/benefit": true;
    };
    "Research ethics": {
      "Informed consent": true;
      IRBs: true;
      Privacy: true;
      "Trial phases": true;
      "Placebo use": true;
    };
  };
  "Social Sciences": {
    "Communication & interpersonal skills": {
      "Patient interviewing": true;
      "Health literacy": true;
      "Use of interpreter": true;
    };
    "Medical ethics & jurisprudence": {
      Consent: true;
      Capacity: true;
      Privacy: true;
      "End of life": true;
      Malpractice: true;
    };
    "Systems-based practice & patient safety": {
      "Quality improvement": true;
      "Error prevention": true;
      Teamwork: true;
      "Health systems": true;
    };
    "Health policy & economics": {
      Disparities: true;
      "Insurance types": true;
      EMTALA: true;
      "Access to care": true;
    };
  };
};

export type System = keyof SystemsMap;

export type Category<S extends System> = keyof SystemsMap[S];
export type AnyCategory =
  (typeof SYSTEMS)[number]["categories"][number]["name"];

export type Subcategory<
  S extends System,
  C extends Category<S>,
> = keyof SystemsMap[S][C];
export type AnySubcategory =
  (typeof SYSTEMS)[number]["categories"][number]["subcategories"][number];

export function getSystems(
  system: System | undefined,
  category: AnyCategory | undefined
) {
  return {
    systems: SYSTEMS.map((s) => s.name),
    categories:
      SYSTEMS.find((s) => s.name === system)?.categories.map((c) => c.name) ??
      [],
    subcategories:
      SYSTEMS.find((s) => s.name === system)?.categories.find(
        (c) => c.name === category
      )?.subcategories ?? [],
  };
}
