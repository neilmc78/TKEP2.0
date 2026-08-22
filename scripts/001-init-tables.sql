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
    total_world_population BIGINT NOT NULL
);

-- Create the user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_clicks BIGINT DEFAULT 0,
    countries_cleared INT DEFAULT 0,
    last_country_id TEXT REFERENCES countries(id) ON DELETE SET NULL,
    time_spent_playing BIGINT DEFAULT 0, -- in seconds
    global_contribution BIGINT DEFAULT 0 -- sum of total_clicks for the user
);

-- Function to update global_stats.total_world_population on country population changes
CREATE OR REPLACE FUNCTION update_global_total_population()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE global_stats
        SET total_world_population = total_world_population + NEW.initial_population
        WHERE id = 1;
    ELSIF TG_OP = 'UPDATE' AND NEW.current_population IS DISTINCT FROM OLD.current_population THEN
        UPDATE global_stats
        SET total_world_population = total_world_population - (OLD.current_population - NEW.current_population)
        WHERE id = 1;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE global_stats
        SET total_world_population = total_world_population - OLD.initial_population
        WHERE id = 1;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update global_stats.total_world_population
CREATE TRIGGER trg_update_global_total_population
AFTER INSERT OR UPDATE OF current_population OR DELETE ON countries
FOR EACH ROW EXECUTE FUNCTION update_global_total_population();

-- Ensure global_stats has an initial row
INSERT INTO global_stats (id, total_world_clicks, total_world_population)
VALUES (1, 0, 0)
ON CONFLICT (id) DO NOTHING;
