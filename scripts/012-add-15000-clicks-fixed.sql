-- Add 15,000 clicks with proper country transition handling
-- This version stops when a country is cleared and moves to the next one properly

DO $$
DECLARE
    target_user_id UUID;
    current_country_id TEXT;
    clicks_to_add INTEGER := 15000;
    clicks_processed INTEGER := 0;
    current_population BIGINT;
    result JSON;
BEGIN
    -- Get the most recent user (assuming that's you)
    SELECT id INTO target_user_id 
    FROM auth.users 
    ORDER BY created_at DESC 
    LIMIT 1;
    
    -- Get the current target country from user progress
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
    
    -- Process clicks one by one, handling country transitions
    WHILE clicks_processed < clicks_to_add AND current_country_id IS NOT NULL LOOP
        -- Check if current country is already cleared
        SELECT countries.current_population INTO current_population
        FROM countries
        WHERE id = current_country_id;
        
        -- If country is already at 0, move to next
        IF current_population <= 0 THEN
            SELECT id INTO current_country_id
            FROM countries
            WHERE is_cleared = FALSE
            ORDER BY order_index ASC
            LIMIT 1;
            
            IF current_country_id IS NULL THEN
                RAISE NOTICE 'All countries cleared! Stopping at % clicks', clicks_processed;
                EXIT;
            END IF;
            
            RAISE NOTICE 'Moving to next country: %', current_country_id;
            CONTINUE;
        END IF;
        
        -- Process one click
        SELECT process_click(target_user_id, current_country_id) INTO result;
        clicks_processed := clicks_processed + 1;
        
        -- Check if this click cleared the country
        IF (result->>'country_cleared')::boolean = true THEN
            current_country_id := result->>'next_country_id';
            RAISE NOTICE 'Country cleared! Next country: %', current_country_id;
        END IF;
        
        -- Progress indicator every 1000 clicks
        IF clicks_processed % 1000 = 0 THEN
            RAISE NOTICE 'Processed % clicks, current country: %', clicks_processed, current_country_id;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Completed! Processed % clicks total', clicks_processed;
    RAISE NOTICE 'Final country: %', current_country_id;
END $$;

-- Show the updated results
SELECT 
    u.email,
    up.total_clicks,
    c.name as current_country,
    c.current_population as remaining_population,
    c.initial_population as original_population
FROM auth.users u
JOIN user_progress up ON u.id = up.user_id
LEFT JOIN countries c ON up.last_country_id = c.id
ORDER BY up.total_clicks DESC
LIMIT 5;

-- Show recently cleared countries
SELECT 
    name,
    initial_population,
    order_index,
    'CLEARED' as status
FROM countries 
WHERE is_cleared = TRUE 
ORDER BY order_index DESC 
LIMIT 10;
