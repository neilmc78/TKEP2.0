-- Optimized batch click processing function
CREATE OR REPLACE FUNCTION process_batch_clicks(
    p_user_id UUID, 
    p_country_id TEXT, 
    p_click_count INTEGER
)
RETURNS JSON AS $$
DECLARE
    v_current_population BIGINT;
    v_is_cleared BOOLEAN;
    v_clicks_to_process INTEGER;
    v_next_country_id TEXT;
    v_new_population BIGINT;
BEGIN
    -- Validate input
    IF p_click_count <= 0 THEN
        RETURN json_build_object('success', false, 'message', 'Invalid click count');
    END IF;

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

    -- Calculate how many clicks we can actually process
    v_clicks_to_process := LEAST(p_click_count, v_current_population);
    v_new_population := v_current_population - v_clicks_to_process;

    -- Update country population
    UPDATE countries
    SET current_population = v_new_population
    WHERE id = p_country_id;

    -- Update or insert user progress
    INSERT INTO user_progress (user_id, total_clicks, global_contribution, last_country_id)
    VALUES (p_user_id, v_clicks_to_process, v_clicks_to_process, p_country_id)
    ON CONFLICT (user_id) DO UPDATE SET
        total_clicks = user_progress.total_clicks + v_clicks_to_process,
        global_contribution = user_progress.global_contribution + v_clicks_to_process,
        last_country_id = p_country_id,
        updated_at = NOW();

    -- Update global stats
    UPDATE global_stats
    SET total_world_clicks = total_world_clicks + v_clicks_to_process
    WHERE id = 1;

    -- Check if country is cleared
    IF v_new_population = 0 THEN
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

        RETURN json_build_object(
            'success', true,
            'clicks_processed', v_clicks_to_process,
            'country_cleared', true,
            'next_country_id', v_next_country_id,
            'new_population', v_new_population
        );
    END IF;

    RETURN json_build_object(
        'success', true,
        'clicks_processed', v_clicks_to_process,
        'country_cleared', false,
        'new_population', v_new_population
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
