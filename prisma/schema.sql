-- libsql

CREATE TABLE IF NOT EXISTS Admin (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email TEXT NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Question (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  createdAt TEXT DEFAULT (datetime('now')),
  creatorId TEXT NOT NULL,

  topic TEXT NOT NULL,
  concept TEXT NOT NULL,
  type TEXT NOT NULL,

  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  choices TEXT NOT NULL,
  explanations TEXT NOT NULL,

  difficulty TEXT NOT NULL,
  nbmeStyleNotes TEXT NOT NULL,

  FOREIGN KEY (creatorId) REFERENCES Admin(id)
);

CREATE TABLE IF NOT EXISTS Audit (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  questionId TEXT NOT NULL UNIQUE,

  checklist TEXT NOT NULL,
  suggestions TEXT NOT NULL,
  rating TEXT NOT NULL,

  FOREIGN KEY (questionId) REFERENCES Question(id)
);