-- Remove NOT NULL constraint from project_url in client_projects table
ALTER TABLE client_projects ALTER COLUMN project_url DROP NOT NULL;