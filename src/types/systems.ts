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
export type AnyCategory = (typeof SYSTEMS)[number]["categories"][number];

export type Subcategory<
  S extends System,
  C extends Category<S>,
> = keyof SystemsMap[S][C];
export type AnySubcategory = (typeof SYSTEMS)[number]["categories"][number];

export function getCategories(systems: string[]) {
  const collection = [];
  for (const system of systems) {
    for (const category of SYSTEMS.find((s) => s.system === system)!
      .categories) {
      collection.push(category);
    }
  }
  return collection;
}
