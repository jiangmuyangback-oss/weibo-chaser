const { supabase } = require('./server/supabaseClient');

async function checkData() {
    console.log("Checking analyses table...");
    const { data: analyses, error: aError } = await supabase.from('analyses').select('*').limit(5);
    if (aError) console.error("Analyses Error:", aError);
    else console.log("Analyses found:", analyses.length, analyses.map(a => a.query));

    console.log("Checking posts table...");
    const { data: posts, error: pError } = await supabase.from('posts').select('*').limit(5);
    if (pError) console.error("Posts Error:", pError);
    else console.log("Posts found:", posts.length);
}

checkData();
