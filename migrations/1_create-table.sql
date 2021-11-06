CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create sessions table
CREATE TABLE sessions(
    session_id uuid DEFAULT uuid_generate_v4(),
    course_id uuid NOT NULL,
    user_id uuid NOT NULL,
    total_modules_studied INTEGER NOT NULL,
    average_score INTEGER NOT NULL,
    started_at timestamptz NOT NULL DEFAULT NOW(),
    ended_at timestamptz,
    PRIMARY KEY (session_id)
);
