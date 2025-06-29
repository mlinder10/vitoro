-- Create Admin
INSERT INTO Admin 
  (userId)
VALUES
  ((SELECT id FROM User WHERE email = 'linder2015@outlook.com'));

INSERT INTO Admin 
  (userId)
VALUES
  ((SELECT id FROM User WHERE email = 'keaton.vitado@gmail.com'));

INSERT INTO Admin 
  (userId)
VALUES
  ((SELECT id FROM User WHERE email = 'adam.plotkin49@gmail.com'));

