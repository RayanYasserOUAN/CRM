-- =============================================
-- FlowCRM Seed Data for Supabase SQL Editor
-- Paste this into Supabase Dashboard → SQL Editor
-- Run AFTER Vercel deploys and migrations run
-- =============================================

-- 1. Admin User
INSERT INTO "User" (username, password, name)
VALUES ('admin', '$2a$10$Wrpg5BinswCPP0aAe7YTJ.u0uUToRr0Ho3bBgncm3UKFS3Ktbkp5G', 'Admin');

-- 2. Contacts (10)
INSERT INTO "Contact" (name, email, phone, company, status) VALUES
  ('Alice Johnson',  'alice@techcorp.com',    '+1 (555) 123-4567', 'TechCorp',      'Active'),
  ('Bob Martinez',   'bob@innovate.io',       '+1 (555) 234-5678', 'Innovate.io',   'Active'),
  ('Carol Chen',     'carol@buildlab.co',     '+1 (555) 345-6789', 'BuildLab',      'Lead'),
  ('David Kim',      'david@nexus.com',       '+1 (555) 456-7890', 'Nexus Systems', 'Active'),
  ('Eva Larsson',    'eva@nordictech.se',     '+46 70 123 45 67',  'Nordic Tech',   'Active'),
  ('Frank Okafor',   'frank@africanli.com',   '+234 801 234 5678', 'Africanli',     'Inactive'),
  ('Grace Patel',     'grace@dataview.com',    '+1 (555) 567-8901', 'DataView',      'Active'),
  ('Henry Thompson',  'henry@greenfield.org',  '+1 (555) 678-9012', 'Greenfield Org','Lead'),
  ('Iris Nakamura',   'iris@tokyotech.jp',     '+81 90 1234 5678',  'Tokyo Tech',    'Active'),
  ('Jake Williams',   'jake@solveit.com',      '+1 (555) 789-0123', 'SolveIt',       'Active');

-- 3. Deals (8, linked to contacts 1-10)
INSERT INTO "Deal" (title, value, stage, "contactId") VALUES
  ('Enterprise SaaS Deal',    45000, 'Proposal',  1),
  ('Cloud Migration Package', 28000, 'Contacted', 2),
  ('Data Analytics Platform', 12000, 'Lead',      3),
  ('Infrastructure Upgrade',  75000, 'Won',       4),
  ('Security Audit Contract', 15000, 'Contacted', 5),
  ('Mobile App Development',  35000, 'Proposal',  7),
  ('Consulting Engagement',   22000, 'Lost',      9),
  ('DevOps Setup',            18000, 'Lead',      10);
