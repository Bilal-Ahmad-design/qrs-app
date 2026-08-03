#!/usr/bin/env node
/**
 * Seed Script: Update User Role to Admin
 * Usage: node scripts/seed-admin.js <email> [role]
 * Example: node scripts/seed-admin.js clients.1356@gmail.com admin
 */

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function seedAdmin() {
  try {
    const email = process.argv[2];
    const role = process.argv[3] || 'admin';

    if (!email) {
      console.error('❌ Error: Email is required');
      console.log('Usage: node scripts/seed-admin.js <email> [role]');
      console.log('Example: node scripts/seed-admin.js clients.1356@gmail.com admin');
      process.exit(1);
    }

    // Validate role
    const validRoles = ['super-admin', 'admin', 'editor', 'reviewer', 'read-only'];
    if (!validRoles.includes(role)) {
      console.error(`❌ Error: Invalid role. Must be one of: ${validRoles.join(', ')}`);
      process.exit(1);
    }

    console.log(`🔄 Connecting to database...`);

    // Check if user exists
    const checkResult = await pool.query(
      'SELECT id, email, role FROM users WHERE email = $1',
      [email]
    );

    if (checkResult.rows.length === 0) {
      console.error(`❌ Error: User not found with email: ${email}`);
      process.exit(1);
    }

    const user = checkResult.rows[0];
    console.log(`✓ Found user: ${user.email} (current role: ${user.role})`);

    // Update role
    console.log(`🔄 Updating role to '${role}'...`);
    const updateResult = await pool.query(
      'UPDATE users SET role = $1 WHERE email = $2 RETURNING id, email, role',
      [role, email]
    );

    if (updateResult.rows.length > 0) {
      const updatedUser = updateResult.rows[0];
      console.log(`✅ Success! User role updated:`);
      console.log(`   Email: ${updatedUser.email}`);
      console.log(`   New Role: ${updatedUser.role}`);
      console.log(`\n📝 Next steps:`);
      console.log(`   1. Logout from dashboard`);
      console.log(`   2. Close browser completely`);
      console.log(`   3. Login again`);
      console.log(`   4. Admin button should now appear in sidebar`);
    } else {
      console.error(`❌ Error: Failed to update user`);
      process.exit(1);
    }

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database error:', error.message);
    process.exit(1);
  }
}

seedAdmin();
