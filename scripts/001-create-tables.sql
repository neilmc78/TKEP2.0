-- Create the countries table
CREATE TABLE IF NOT EXISTS countries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    initial_population BIGINT NOT NULL,
    current_population BIGINT NOT NULL,
    is_cleared BOOLEAN DEFAULT FALSE,
    order_index INT UNIQUE NOT NULL
);

-- Create the global_stats table (single row)
CREATE TABLE IF NOT EXISTS global_stats (
    id INT PRIMARY KEY DEFAULT 1,
    total_world_clicks BIGINT DEFAULT 0,
    total_world_population BIGINT NOT NULL DEFAULT 0
);

-- Create the user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_clicks BIGINT DEFAULT 0,
    countries_cleared INT DEFAULT 0,
    last_country_id TEXT REFERENCES countries(id) ON DELETE SET NULL,
    time_spent_playing BIGINT DEFAULT 0,
    global_contribution BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Initialize global_stats
INSERT INTO global_stats (id, total_world_clicks, total_world_population)
VALUES (1, 0, 0)
ON CONFLICT (id) DO NOTHING;
