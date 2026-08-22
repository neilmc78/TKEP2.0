-- Fix the countries_cleared to be a global stat, not per-user

-- First, let's see the current state
SELECT 'Before fix:' as status;
SELECT user_id, countries_cleared FROM user_progress ORDER BY countries_cleared DESC;
SELECT COUNT(*) as total_cleared_countries FROM countries WHERE is_cleared = TRUE;

-- Add a global countries_cleared column to global_stats if it doesn't exist
ALTER TABLE global_stats ADD COLUMN IF NOT EXISTS countries_cleared INTEGER DEFAULT 0;

-- Set the correct global count
UPDATE global_stats 
SET countries_cleared = (SELECT COUNT(*) FROM countries WHERE is_cleared = TRUE)
WHERE id = 1;

-- Remove the countries_cleared column from user_progress since it should be global
-- (We'll keep it for now but stop using it in the logic)

-- Create a new fixed process_click function that doesn't increment per-user countries_cleared
CREATE OR REPLACE FUNCTION process_click(p_user_id UUID, p_country_id TEXT)
RETURNS JSON AS $$
DECLARE
    v_current_population BIGINT;
    v_is_cleared BOOLEAN;
    v_next_country_id TEXT;
    v_result JSON;
BEGIN
    -- Lock the country row to prevent race conditions
    SELECT current_population, is_cleared INTO v_current_population, v_is_cleared
    FROM countries
    WHERE id = p_country_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'message', 'Country not found');
    END IF;

    IF v_is_cleared THEN
        RETURN json_build_object('success', false, 'message', 'Country already cleared');
    END IF;

    IF v_current_population <= 0 THEN
        RETURN json_build_object('success', false, 'message', 'Country population is already zero');
    END IF;

    -- Decrement population by exactly 1
    v_current_population := v_current_population - 1;

    -- Update country population
    UPDATE countries
    SET current_population = v_current_population
    WHERE id = p_country_id;

    -- Update or insert user progress (increment by exactly 1, but DON'T touch countries_cleared)
    INSERT INTO user_progress (user_id, total_clicks, global_contribution, last_country_id)
    VALUES (p_user_id, 1, 1, p_country_id)
    ON CONFLICT (user_id) DO UPDATE SET
        total_clicks = user_progress.total_clicks + 1,
        global_contribution = user_progress.global_contribution + 1,
        last_country_id = p_country_id,
        updated_at = NOW();

    -- Update global stats (increment by exactly 1)
    UPDATE global_stats
    SET total_world_clicks = total_world_clicks + 1
    WHERE id = 1;

    -- Check if country is cleared
    IF v_current_population = 0 THEN
        UPDATE countries
        SET is_cleared = TRUE
        WHERE id = p_country_id;

        -- Update GLOBAL countries_cleared count (not per-user)
        UPDATE global_stats
        SET countries_cleared = countries_cleared + 1
        WHERE id = 1;

        -- Find the next country to unlock
        SELECT id INTO v_next_country_id
        FROM countries
        WHERE is_cleared = FALSE AND order_index > (SELECT order_index FROM countries WHERE id = p_country_id)
        ORDER BY order_index ASC
        LIMIT 1;

        IF v_next_country_id IS NOT NULL THEN
            UPDATE user_progress
            SET last_country_id = v_next_country_id
            WHERE user_id = p_user_id;
        END IF;

        v_result := json_build_object(
            'success', true, 
            'message', 'Country cleared!', 
            'country_cleared', true,
            'next_country_id', v_next_country_id
        );
    ELSE
        v_result := json_build_object(
            'success', true, 
            'message', 'Population reduced', 
            'country_cleared', false
        );
    END IF;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Reset all user countries_cleared to 0 since it's now a global stat
UPDATE user_progress SET countries_cleared = 0;

-- Verify the fix
SELECT 'After fix:' as status;
SELECT user_id, countries_cleared FROM user_progress ORDER BY total_clicks DESC LIMIT 5;
SELECT countries_cleared as global_countries_cleared FROM global_stats WHERE id = 1;
SELECT COUNT(*) as actual_cleared_countries FROM countries WHERE is_cleared = TRUE;
