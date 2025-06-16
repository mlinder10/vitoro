export const SYSTEMS = [
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
        ],
      },
      {
        name: "Anemia, cytopenias, polycythemia",
        subcategories: [
          "Decreased production",
          "Hemolysis",
          "Membrane disorders",
          "Other causes",
          "Cytopenias",
          "Polycythemia",
        ],
      },
      {
        name: "Coagulation disorders",
        subcategories: ["Hypocoagulable", "Hypercoagulable"],
      },
      {
        name: "Reactions to blood components",
        subcategories: ["Transfusion reactions", "TRALI, anaphylactoid"],
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
        subcategories: ["Gender dysphoria", "Psychosexual dysfunctions"],
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
        subcategories: ["Stroke, TIA, hemorrhage, aneurysm, vascular dementia"],
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
        subcategories: ["Trigeminal neuralgia", "Fibromyalgia", "CRPS"],
      },
      {
        name: "Degenerative/amnestic disorders",
        subcategories: ["Alzheimer", "FTD", "Lewy body dementia", "MCI"],
      },
      {
        name: "Global cerebral dysfunction",
        subcategories: ["Delirium", "Coma", "Brain death"],
      },
      {
        name: "Neuromuscular disorders",
        subcategories: ["ALS", "Muscular dystrophies", "SMA"],
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
        subcategories: ["Neurotoxicity", "Serotonin syndrome", "EPS"],
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
        ],
      },
      {
        name: "Immunologic disorders",
        subcategories: [
          "RA",
          "Ankylosing spondylitis",
          "Juvenile idiopathic arthritis",
          "Dermatomyositis/polymyositis",
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
        ],
      },
      {
        name: "Congenital disorders",
        subcategories: [
          "Achondroplasia",
          "Hip dysplasia",
          "Osteogenesis imperfecta",
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
        subcategories: ["Endocarditis", "Myocarditis", "Pericarditis"],
      },
      {
        name: "Neoplasms",
        subcategories: ["Cardiac tumors", "Myxoma", "Metastases"],
      },
      {
        name: "Dysrhythmias",
        subcategories: [
          "Atrial fibrillation/flutter",
          "Ventricular tachycardia",
          "Heart block",
          "WPW",
          "Long QT",
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
        ],
      },
      {
        name: "Ischemic heart disease",
        subcategories: ["Angina", "MI", "Coronary artery disease"],
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
        ],
      },
      { name: "Hypotension", subcategories: ["Orthostatic hypotension"] },
      {
        name: "Hypertension",
        subcategories: ["Essential", "Secondary", "Hypertensive emergency"],
      },
      {
        name: "Dyslipidemia",
        subcategories: ["Hypercholesterolemia", "Hypertriglyceridemia"],
      },
      {
        name: "Vascular disorders",
        subcategories: [
          "Aneurysm",
          "Peripheral arterial disease",
          "DVT/PE",
          "Varicose veins",
        ],
      },
      {
        name: "Traumatic/mechanical disorders",
        subcategories: ["Aortic dissection", "Cardiac contusion", "Tamponade"],
      },
      {
        name: "Congenital disorders",
        subcategories: [
          "ASD",
          "VSD",
          "Tetralogy of Fallot",
          "Coarctation",
          "Transposition",
        ],
      },
      {
        name: "Adverse drug effects",
        subcategories: [
          "ACE inhibitors",
          "Cocaine-related",
          "Cardiotoxic drugs",
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
          "Upper airway infections",
          "Lower airway pneumonia",
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
        subcategories: ["ARDS", "PE", "Pulmonary hypertension", "Edema"],
      },
      {
        name: "Metabolic/structural disorders",
        subcategories: ["Hypoventilation", "Gas exchange disorders"],
      },
      {
        name: "Pleura/mediastinum/chest wall",
        subcategories: [
          "Pleural effusion",
          "Pneumothorax",
          "Empyema",
          "Mediastinitis",
          "Chylothorax",
        ],
      },
      {
        name: "Trauma/mechanical",
        subcategories: [
          "Epistaxis",
          "Barotrauma",
          "Sleep apnea",
          "Chest trauma",
          "Foreign body",
        ],
      },
      {
        name: "Congenital disorders",
        subcategories: ["Pulmonary sequestration", "Bronchogenic cyst", "CDH"],
      },
      {
        name: "Adverse effects of drugs",
        subcategories: [
          "Amiodarone lung",
          "Bleomycin toxicity",
          "Oxygen toxicity",
        ],
      },
    ],
  },
  {
    name: "Gastrointestinal System",
    categories: [
      {
        name: "Infectious/inflammatory",
        subcategories: [
          "Bacterial enteritis",
          "Viral hepatitis",
          "Fungal thrush",
          "Parasitic infections",
        ],
      },
      {
        name: "Autoimmune/inflammatory",
        subcategories: ["IBD", "Celiac", "Autoimmune hepatitis"],
      },
      {
        name: "Neoplasms",
        subcategories: [
          "Polypoid benign",
          "Adenocarcinomas",
          "GIST",
          "Pancreatic CA",
          "Liver CA",
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
        ],
      },
      {
        name: "Liver/biliary",
        subcategories: [
          "Cirrhosis",
          "Cholangitis",
          "Cholelithiasis",
          "PSC",
          "Fatty liver",
        ],
      },
      {
        name: "Pancreatic disorders",
        subcategories: ["Acute/chronic pancreatitis", "Pseudocyst"],
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
        ],
      },
      {
        name: "Adverse drug effects",
        subcategories: [
          "NSAID ulcers",
          "Opioid-induced constipation",
          "Acetaminophen hepatitis",
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
        ],
      },
      {
        name: "Neoplasms",
        subcategories: ["Renal cell CA", "Wilms tumor", "Bladder CA"],
      },
      {
        name: "Signs/symptoms",
        subcategories: ["Hematuria", "Proteinuria", "Oliguria/dysuria"],
      },
      {
        name: "Metabolic/regulatory",
        subcategories: [
          "AKI",
          "CKD",
          "Nephrotic/nephritic syndrome",
          "Renal calculi",
        ],
      },
      {
        name: "Vascular disorders",
        subcategories: ["Renal artery stenosis", "Renal vein thrombosis"],
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
        ],
      },
      {
        name: "Menopause",
        subcategories: [
          "Perimenopause",
          "Vasomotor symptoms",
          "Postmenopausal bleeding",
        ],
      },
      {
        name: "Menstrual and endocrine disorders",
        subcategories: ["Amenorrhea", "Dysmenorrhea", "PCOS", "Endometriosis"],
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
        subcategories: ["Prostate CA", "Testicular CA", "Penile CA"],
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
        ],
      },
      {
        name: "Congenital disorders",
        subcategories: [
          "Hypospadias",
          "Undescended testicle",
          "Klinefelter syndrome",
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
        ],
      },
      {
        name: "Thyroid disorders",
        subcategories: [
          "Hypothyroidism",
          "Hyperthyroidism",
          "Thyroid cancer",
          "Thyroiditis",
        ],
      },
      {
        name: "Parathyroid disorders",
        subcategories: ["Hyperparathyroidism", "Hypoparathyroidism"],
      },
      {
        name: "Adrenal disorders",
        subcategories: ["Addison's", "Cushing's", "Pheochromocytoma"],
      },
      {
        name: "Pituitary disorders",
        subcategories: [
          "Acromegaly",
          "Diabetes insipidus",
          "Prolactinoma",
          "Pituitary apoplexy",
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
        name: "Infectious disorders",
        subcategories: [
          "Brucellosis",
          "Lyme disease",
          "TB",
          "Q fever",
          "Fungal",
          "Parasitic",
        ],
      },
      {
        name: "Immunologic/inflammatory",
        subcategories: ["Vasculitis", "Autoimmune disorders"],
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

export type System = (typeof SYSTEMS)[number]["name"];
export type Category = (typeof SYSTEMS)[number]["categories"][number]["name"];
export type Subcategory =
  (typeof SYSTEMS)[number]["categories"][number]["subcategories"][number];
