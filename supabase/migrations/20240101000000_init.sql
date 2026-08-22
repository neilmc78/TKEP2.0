-- ============================================================================
-- TKEP2.0 (World Wipe) — consolidated initial schema
-- ----------------------------------------------------------------------------
-- This single migration supersedes the historical, incremental files under
-- /scripts (which were applied by hand in the original v0/Supabase-cloud build).
-- It is the source of truth for self-hosting: `supabase db reset` / `supabase
-- start` applies this, then seeds from supabase/seed.sql.
--
-- Design notes:
--   * Population is only ever decremented through the SECURITY DEFINER RPCs
--     (process_click / process_batch_clicks), never by direct table writes.
--   * Row Level Security is enabled on every table. Public read is allowed so
--     the anon/authenticated roles can render the game; all mutations happen
--     inside the RPCs (which bypass RLS) or, for profiles, are scoped to the
--     owning user.
--   * countries_cleared is a GLOBAL counter on global_stats (not per user).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS countries (
    id                 TEXT PRIMARY KEY,
    name               TEXT NOT NULL,
    initial_population BIGINT NOT NULL,
    current_population BIGINT NOT NULL,
    is_cleared         BOOLEAN NOT NULL DEFAULT FALSE,
    order_index        INT UNIQUE NOT NULL,
    area_km2           INTEGER
);

CREATE TABLE IF NOT EXISTS global_stats (
    id                     INT PRIMARY KEY DEFAULT 1,
    total_world_clicks     BIGINT NOT NULL DEFAULT 0,
    total_world_population BIGINT NOT NULL DEFAULT 0,
    countries_cleared      INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT global_stats_singleton CHECK (id = 1)
);

CREATE TABLE IF NOT EXISTS profiles (
    id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username     TEXT UNIQUE NOT NULL,
    display_name TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_progress (
    user_id             UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_clicks        BIGINT NOT NULL DEFAULT 0,
    countries_cleared   INT NOT NULL DEFAULT 0,   -- legacy per-user column; kept for compat, no longer written
    last_country_id     TEXT REFERENCES countries(id) ON DELETE SET NULL,
    time_spent_playing  BIGINT NOT NULL DEFAULT 0,
    global_contribution BIGINT NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Leaderboard / rank lookups sort on total_clicks.
CREATE INDEX IF NOT EXISTS user_progress_total_clicks_idx
    ON user_progress (total_clicks DESC);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
ALTER TABLE countries     ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_stats  ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles      ENABLE ROW LEVEL SECURITY;

-- Public read for the game state. Writes go through the RPCs below.
DROP POLICY IF EXISTS "Countries are viewable by everyone" ON countries;
CREATE POLICY "Countries are viewable by everyone"
    ON countries FOR SELECT USING (true);

DROP POLICY IF EXISTS "Global stats are viewable by everyone" ON global_stats;
CREATE POLICY "Global stats are viewable by everyone"
    ON global_stats FOR SELECT USING (true);

DROP POLICY IF EXISTS "Progress is viewable by everyone" ON user_progress;
CREATE POLICY "Progress is viewable by everyone"
    ON user_progress FOR SELECT USING (true);

-- Profiles: anyone can read; users manage only their own row.
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
CREATE POLICY "Profiles are viewable by everyone"
    ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE USING (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- Grants (PostgREST exposes tables/functions through the anon & authenticated
-- roles; be explicit rather than relying on default privileges).
-- ---------------------------------------------------------------------------
GRANT SELECT ON countries     TO anon, authenticated;
GRANT SELECT ON global_stats  TO anon, authenticated;
GRANT SELECT ON user_progress TO anon, authenticated;
GRANT SELECT ON profiles      TO anon, authenticated;
GRANT INSERT, UPDATE ON profiles TO authenticated;

-- ---------------------------------------------------------------------------
-- Auth: auto-create a profile when a new user signs up.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, display_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username',     'user_' || substr(NEW.id::text, 1, 8)),
        COALESCE(NEW.raw_user_meta_data->>'display_name', 'Anonymous Player')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ---------------------------------------------------------------------------
-- process_click: decrement the target country's population by exactly one,
-- crediting the user and the global totals. Advances to the next country when
-- the target is cleared. Atomic via row lock.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.process_click(p_user_id UUID, p_country_id TEXT)
RETURNS JSON AS $$
DECLARE
    v_current_population BIGINT;
    v_is_cleared         BOOLEAN;
    v_next_country_id    TEXT;
BEGIN
    SELECT current_population, is_cleared
      INTO v_current_population, v_is_cleared
      FROM countries
     WHERE id = p_country_id
       FOR UPDATE;

    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'message', 'Country not found');
    END IF;
    IF v_is_cleared OR v_current_population <= 0 THEN
        RETURN json_build_object('success', false, 'message', 'Country already cleared');
    END IF;

    v_current_population := v_current_population - 1;

    UPDATE countries
       SET current_population = v_current_population,
           is_cleared = (v_current_population = 0)
     WHERE id = p_country_id;

    INSERT INTO user_progress (user_id, total_clicks, global_contribution, last_country_id)
    VALUES (p_user_id, 1, 1, p_country_id)
    ON CONFLICT (user_id) DO UPDATE SET
        total_clicks        = user_progress.total_clicks + 1,
        global_contribution = user_progress.global_contribution + 1,
        last_country_id     = p_country_id,
        updated_at          = NOW();

    UPDATE global_stats
       SET total_world_clicks = total_world_clicks + 1
     WHERE id = 1;

    IF v_current_population = 0 THEN
        UPDATE global_stats
           SET countries_cleared = countries_cleared + 1
         WHERE id = 1;

        SELECT id INTO v_next_country_id
          FROM countries
         WHERE is_cleared = FALSE
           AND order_index > (SELECT order_index FROM countries WHERE id = p_country_id)
         ORDER BY order_index ASC
         LIMIT 1;

        IF v_next_country_id IS NOT NULL THEN
            UPDATE user_progress
               SET last_country_id = v_next_country_id
             WHERE user_id = p_user_id;
        END IF;

        RETURN json_build_object(
            'success', true,
            'message', 'Country cleared!',
            'country_cleared', true,
            'next_country_id', v_next_country_id
        );
    END IF;

    RETURN json_build_object(
        'success', true,
        'message', 'Population reduced',
        'country_cleared', false
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ---------------------------------------------------------------------------
-- process_batch_clicks: same as process_click but applies many clicks in one
-- round trip (used by the rapid-fire client to avoid one request per click).
-- Clamps the batch to the remaining population.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.process_batch_clicks(
    p_user_id     UUID,
    p_country_id  TEXT,
    p_click_count INTEGER
)
RETURNS JSON AS $$
DECLARE
    v_current_population BIGINT;
    v_is_cleared         BOOLEAN;
    v_clicks_to_process  INTEGER;
    v_new_population      BIGINT;
    v_next_country_id    TEXT;
BEGIN
    IF p_click_count <= 0 THEN
        RETURN json_build_object('success', false, 'message', 'Invalid click count');
    END IF;

    SELECT current_population, is_cleared
      INTO v_current_population, v_is_cleared
      FROM countries
     WHERE id = p_country_id
       FOR UPDATE;

    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'message', 'Country not found');
    END IF;
    IF v_is_cleared OR v_current_population <= 0 THEN
        RETURN json_build_object('success', false, 'message', 'Country already cleared');
    END IF;

    v_clicks_to_process := LEAST(p_click_count, v_current_population);
    v_new_population     := v_current_population - v_clicks_to_process;

    UPDATE countries
       SET current_population = v_new_population,
           is_cleared = (v_new_population = 0)
     WHERE id = p_country_id;

    INSERT INTO user_progress (user_id, total_clicks, global_contribution, last_country_id)
    VALUES (p_user_id, v_clicks_to_process, v_clicks_to_process, p_country_id)
    ON CONFLICT (user_id) DO UPDATE SET
        total_clicks        = user_progress.total_clicks + v_clicks_to_process,
        global_contribution = user_progress.global_contribution + v_clicks_to_process,
        last_country_id     = p_country_id,
        updated_at          = NOW();

    UPDATE global_stats
       SET total_world_clicks = total_world_clicks + v_clicks_to_process
     WHERE id = 1;

    IF v_new_population = 0 THEN
        UPDATE global_stats
           SET countries_cleared = countries_cleared + 1
         WHERE id = 1;

        SELECT id INTO v_next_country_id
          FROM countries
         WHERE is_cleared = FALSE
           AND order_index > (SELECT order_index FROM countries WHERE id = p_country_id)
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.process_click(UUID, TEXT)                TO authenticated;
GRANT EXECUTE ON FUNCTION public.process_batch_clicks(UUID, TEXT, INTEGER) TO authenticated;
