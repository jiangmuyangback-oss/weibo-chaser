const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

let _supabase;
function getSupabase() {
    if (!_supabase) {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.error('CRITICAL: Supabase URL or Key missing. Database operations will fail.');
            return null;
        }
        _supabase = createClient(supabaseUrl, supabaseKey);
    }
    return _supabase;
}

module.exports = { getSupabase };
