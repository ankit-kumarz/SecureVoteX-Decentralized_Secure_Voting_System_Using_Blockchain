// Reset superadmin password to a known value
require('dotenv').config();
const bcrypt = require('bcrypt');
const knex = require('knex')(require('./knexfile').development);

async function resetAdminPassword() {
  try {
    const email = 'admin@votex.com';
    const newPassword = 'Ankit@108';

    console.log('🔍 Looking for superadmin...');
    const admin = await knex('users').where({ email }).first();

    if (!admin) {
      console.log('❌ Superadmin not found! Creating new one...');
      
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

      console.log('✅ Superadmin created successfully!');
    } else {
      console.log('✅ Superadmin found, resetting password...');
      
      // Update password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await knex('users').where({ id: admin.id }).update({
        password: hashedPassword,
        updated_at: new Date()
      });

      console.log('✅ Password reset successfully!');
    }

    console.log('\n═══════════════════════════════════════');
    console.log('  SUPERADMIN CREDENTIALS');
    console.log('═══════════════════════════════════════');
    console.log('  Email:    ' + email);
    console.log('  Password: ' + newPassword);
    console.log('═══════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resetAdminPassword();
