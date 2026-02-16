const path = require('path');
const dotenv = require('dotenv');
// Ensure environment variables are loaded BEFORE any other local modules
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const express = require('express');
const cors = require('cors');
const aiService = require('./aiService');
const { getSupabase } = require('./supabaseClient');

const app = express();
const PORT = process.env.PORT || 7777;

app.use(cors({
    origin: '*', // Allow all origins in production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Health check for Railway
app.get('/', (req, res) => {
    res.send('Weibo Sentiment Analysis API is running');
});

// Analyze Weibo content
app.post('/api/analyze', async (req, res) => {
    const { query } = req.body;
    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    try {
        console.log(`Analyzing query: ${query}`);
        const supabase = getSupabase();
        if (!supabase) throw new Error("Database client not initialized");

        // 1. Check if we already have this query in Supabase (optional caching)
        const { data: existingAnalysis, error: fetchError } = await supabase
            .from('analyses')
            .select('*')
            .eq('query', query)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (existingAnalysis) {
            console.log('Found existing analysis, fetching related data...');
            const { data: posts } = await supabase.from('posts').select('*').eq('analysis_id', existingAnalysis.id);
            const { data: keywords } = await supabase.from('keywords').select('*').eq('analysis_id', existingAnalysis.id);

            return res.json({
                posts,
                keywords,
                summary: existingAnalysis.summary
            });
        }

        // 2. Call AI Service
        const result = await aiService.analyzeWeiboContent(query);

        // 3. Store in Supabase
        const { data: newAnalysis, error: insertError } = await supabase
            .from('analyses')
            .insert([{ query, summary: result.summary }])
            .select()
            .single();

        if (insertError) throw insertError;

        // Store posts
        const postsToInsert = result.posts.map(post => ({
            ...post,
            analysis_id: newAnalysis.id
        }));
        await supabase.from('posts').insert(postsToInsert);

        // Store keywords
        const keywordsToInsert = result.keywords.map(kw => ({
            ...kw,
            analysis_id: newAnalysis.id
        }));
        await supabase.from('keywords').insert(keywordsToInsert);

        res.json(result);
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ error: 'Failed to analyze content', details: error.message });
    }
});

// Get analysis history
app.get('/api/history', async (req, res) => {
    try {
        const supabase = getSupabase();
        if (!supabase) throw new Error("Database client not initialized");

        const { data, error } = await supabase
            .from('analyses')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('History fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is listening on 0.0.0.0:${PORT}`);
    console.log(`Environment check: ARK_API_KEY is ${process.env.ARK_API_KEY ? 'SET' : 'NOT SET'}`);
    console.log(`Environment check: SUPABASE_URL is ${process.env.SUPABASE_URL ? 'SET' : 'NOT SET'}`);
});
