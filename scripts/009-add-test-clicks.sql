-- Add 700 clicks to help test progression
-- Replace 'YOUR_USER_ID_HERE' with your actual user ID from auth.users table

-- First, let's see what user IDs exist (run this to find your ID)
-- SELECT id, email FROM auth.users ORDER BY created_at DESC LIMIT 5;

-- Then use your actual user ID in the queries below
-- For now, I'll use a placeholder - you'll need to replace it

DO $$
DECLARE
    target_user_id UUID;
    current_country_id TEXT;
    clicks_to_add INTEGER := 700;
    i INTEGER;
BEGIN
    -- Get the most recent user (assuming that's you)
    SELECT id INTO target_user_id 
    FROM auth.users 
    ORDER BY created_at DESC 
    LIMIT 1;
    
    -- Get the current target country (Vatican City should be first)
    SELECT id INTO current_country_id
    FROM countries
    WHERE is_cleared = FALSE
    ORDER BY order_index ASC
    LIMIT 1;
    
    -- Add the clicks using the existing process_click function
    FOR i IN 1..clicks_to_add LOOP
        PERFORM process_click(target_user_id, current_country_id);
        
        -- Check if country was cleared and get next one
        IF (SELECT is_cleared FROM countries WHERE id = current_country_id) THEN
            SELECT id INTO current_country_id
            FROM countries
            WHERE is_cleared = FALSE
            ORDER BY order_index ASC
            LIMIT 1;
            
            -- Exit if no more countries
            EXIT WHEN current_country_id IS NULL;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Added % clicks for user %', clicks_to_add, target_user_id;
    RAISE NOTICE 'Current country: %', current_country_id;
END $$;

-- Show the results
SELECT 
    u.email,
    up.total_clicks,
    c.name as current_country,
    c.current_population as remaining_population
FROM auth.users u
JOIN user_progress up ON u.id = up.user_id
LEFT JOIN countries c ON up.last_country_id = c.id
ORDER BY up.total_clicks DESC
LIMIT 5;
