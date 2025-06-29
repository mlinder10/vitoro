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

DELETE FROM Question WHERE id IN (
  '02558686-5be8-42d8-96f5-4ee903f8dcf1',
  '4001a013-4481-4bef-8899-05c91a99247e',
  '4d40bcce-c42b-4a70-b8e9-2a2d1d64241e',
  '95943a2c-911c-41e0-a8aa-d23ab4716df4',
  'b2af16f0-da32-4037-85e0-21c6622562ce',
  'be907b61-cfbb-46d1-9ea8-9df4cfe5fcd2',
  'ec85070c-c8b4-4e76-862d-aa01d0839f39'
);
