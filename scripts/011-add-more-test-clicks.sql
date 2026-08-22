-- Add 15,000 more clicks to help progress past small countries
-- This will help test the crosshair on larger, more visible countries

DO $$
DECLARE
    target_user_id UUID;
    current_country_id TEXT;
    clicks_to_add INTEGER := 15000;
    i INTEGER;
    batch_size INTEGER := 100;
    current_batch INTEGER;
BEGIN
    -- Get the most recent user (assuming that's you)
    SELECT id INTO target_user_id 
    FROM auth.users 
    ORDER BY created_at DESC 
    LIMIT 1;
    
    -- Get the current target country
    SELECT up.last_country_id INTO current_country_id
    FROM user_progress up
    WHERE up.user_id = target_user_id;
    
    -- If no last_country_id, get the first uncleared country
    IF current_country_id IS NULL THEN
        SELECT id INTO current_country_id
        FROM countries
        WHERE is_cleared = FALSE
        ORDER BY order_index ASC
        LIMIT 1;
    END IF;
    
    RAISE NOTICE 'Starting with user: %, country: %', target_user_id, current_country_id;
    
    -- Process clicks in batches for better performance
    FOR current_batch IN 1..CEIL(clicks_to_add::FLOAT / batch_size) LOOP
        -- Calculate how many clicks in this batch
        i := LEAST(batch_size, clicks_to_add - (current_batch - 1) * batch_size);
        
        -- Use the batch processing function
        PERFORM process_batch_clicks(target_user_id, current_country_id, i);
        
        -- Check if country was cleared and get next one
        IF (SELECT is_cleared FROM countries WHERE id = current_country_id) THEN
            SELECT id INTO current_country_id
            FROM countries
            WHERE is_cleared = FALSE
            ORDER BY order_index ASC
            LIMIT 1;
            
            -- Exit if no more countries
            EXIT WHEN current_country_id IS NULL;
            
            RAISE NOTICE 'Country cleared! Moving to: %', current_country_id;
        END IF;
        
        -- Progress indicator
        IF current_batch % 10 = 0 THEN
            RAISE NOTICE 'Processed % batches (% clicks)', current_batch, current_batch * batch_size;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Completed adding % clicks', clicks_to_add;
    RAISE NOTICE 'Current country: %', current_country_id;
END $$;

-- Show the updated results
SELECT 
    u.email,
    up.total_clicks,
    up.countries_cleared,
    c.name as current_country,
    c.current_population as remaining_population,
    c.initial_population as original_population,
    CASE 
        WHEN c.area_km2 IS NOT NULL THEN c.area_km2 || ' km²'
        ELSE 'Unknown area'
    END as country_area
FROM auth.users u
JOIN user_progress up ON u.id = up.user_id
LEFT JOIN countries c ON up.last_country_id = c.id
ORDER BY up.total_clicks DESC
LIMIT 5;

-- Show recently cleared countries
SELECT 
    name,
    initial_population,
    CASE 
        WHEN area_km2 IS NOT NULL THEN area_km2 || ' km²'
        ELSE 'Unknown area'
    END as area,
    order_index
FROM countries 
WHERE is_cleared = TRUE 
ORDER BY order_index DESC 
LIMIT 10;
