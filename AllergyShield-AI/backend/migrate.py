#!/usr/bin/env python
"""
Migration script to add reset_token and reset_token_expires columns to users table
"""
from sqlalchemy import text
from app.database.database import engine

def migrate():
    """Add missing columns to users table"""
    with engine.connect() as conn:
        # Check if columns exist first
        result = conn.execute(text("""
            SELECT column_name FROM information_schema.columns 
            WHERE table_name='users' AND (column_name='reset_token' OR column_name='reset_token_expires')
        """))
        existing_columns = {row[0] for row in result}
        
        # Add reset_token column if it doesn't exist
        if 'reset_token' not in existing_columns:
            print("Adding reset_token column...")
            conn.execute(text("ALTER TABLE users ADD COLUMN reset_token VARCHAR(255) NULL"))
            conn.commit()
            print("✓ reset_token column added")
        else:
            print("✓ reset_token column already exists")
        
        # Add reset_token_expires column if it doesn't exist
        if 'reset_token_expires' not in existing_columns:
            print("Adding reset_token_expires column...")
            conn.execute(text("ALTER TABLE users ADD COLUMN reset_token_expires TIMESTAMP NULL"))
            conn.commit()
            print("✓ reset_token_expires column added")
        else:
            print("✓ reset_token_expires column already exists")
        
        print("\nMigration completed successfully!")

if __name__ == "__main__":
    migrate()
