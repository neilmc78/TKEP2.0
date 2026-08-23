-- Function to handle click processing atomically
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

    -- Decrement population
    v_current_population := GREATEST(0, v_current_population - 1);

    UPDATE countries
    SET current_population = v_current_population
    WHERE id = p_country_id;

    -- Update or insert user progress
    INSERT INTO user_progress (user_id, total_clicks, global_contribution, last_country_id)
    VALUES (p_user_id, 1, 1, p_country_id)
    ON CONFLICT (user_id) DO UPDATE SET
        total_clicks = user_progress.total_clicks + 1,
        global_contribution = user_progress.global_contribution + 1,
        last_country_id = p_country_id,
        updated_at = NOW();

    -- Update global stats
    UPDATE global_stats
    SET total_world_clicks = total_world_clicks + 1
    WHERE id = 1;

    -- Check if country is cleared
    IF v_current_population = 0 THEN
        UPDATE countries
        SET is_cleared = TRUE
        WHERE id = p_country_id;

        UPDATE user_progress
        SET countries_cleared = countries_cleared + 1
        WHERE user_id = p_user_id;

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
