require('dotenv').config();
const knex = require('knex')(require('./knexfile').development);

async function createSuperAdmin() {
  try {
    const existingAdmin = await knex('users')
      .where({ email: 'superadmin@securevotex.com' })
      .first();

    if (existingAdmin) {
      console.log('❌ SUPER_ADMIN already exists with email: superadmin@securevotex.com');
      console.log('   Use a different email or delete the existing admin first.');
      process.exit(1);
    }

    const result = await knex('users')
      .insert({
        email: 'superadmin@securevotex.com',
        password: '$2b$10$HulljBR3t74M4uYrED5if.rBBTO3BmCtTcJq/xX4YS.mT3.Xa5KaW',
        role: 'admin',
        admin_type: 'SUPER_ADMIN',
        created_at: new Date(),
        updated_at: new Date()
      })
      .returning(['id', 'email', 'admin_type']);

    console.log('✅ SUPER_ADMIN created successfully!');
    console.log('   Email: superadmin@securevotex.com');
    console.log('   Password: Admin@123');
    console.log('   Admin Type: SUPER_ADMIN');
    console.log('\n📌 IMPORTANT: Change this password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating SUPER_ADMIN:', error.message);
    process.exit(1);
  }
}

createSuperAdmin();
