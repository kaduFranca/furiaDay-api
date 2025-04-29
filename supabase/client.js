// supabase/client.js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rlvblksgyvczdtxctspj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsdmJsa3NneXZjemR0eGN0c3BqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4ODM3NTgsImV4cCI6MjA2MTQ1OTc1OH0.WXaYDOygQpNo9qIzuZLN9LMMuhKISmhLZ5tAOEhCnCI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = supabase;
