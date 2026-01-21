// Reset superadmin password using environment variables
require('dotenv').config();
const bcrypt = require('bcrypt');
const knex = require('knex')(require('./knexfile').development);

async function resetAdminPassword() {
  try {
    // Get credentials from environment variables (NEVER hardcode)
    const email = process.env.ADMIN_EMAIL;
    const newPassword = process.env.ADMIN_PASSWORD;

    if (!email || !newPassword) {
      console.error('❌ Error: ADMIN_EMAIL and ADMIN_PASSWORD environment variables not set!');
      console.error('Set these in your Render dashboard Environment section.');
      process.exit(1);
    }

    console.log('🔍 Looking for admin with email:', email);
    const admin = await knex('users').where({ email }).first();

    if (!admin) {
      console.log('❌ Admin not found! Creating new one...');
      
      // Create new admin if doesn't exist
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await knex('users').insert({
        email: email,
        password: hashedPassword,
        role: 'admin',
        admin_type: 'SUPER_ADMIN',
        created_at: new Date(),
        updated_at: new Date()
      });

      console.log('✅ Admin created successfully!');
    } else {
      console.log('✅ Admin found, resetting password...');
      
      // Update password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await knex('users').where({ id: admin.id }).update({
        password: hashedPassword,
        updated_at: new Date()
      });

      console.log('✅ Password reset successfully!');
    }

    console.log('\n✅ Admin credentials updated (check Render environment variables for details)');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resetAdminPassword();
