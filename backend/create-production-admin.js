// Create super admin for production database
require('dotenv').config();
const bcrypt = require('bcrypt');
const knex = require('knex');
const knexConfig = require('./knexfile');

async function createSuperAdmin() {
  const db = knex(knexConfig.development);
  
  try {
    const email = 'superadmin@votex.com';
    const password = 'Admin@108';
    
    console.log('🔍 Checking if super admin already exists...');
    
    // Check if admin already exists
    const existing = await db('users').where({ email }).first();
    
    if (existing) {
      console.log('⚠️  Super admin already exists!');
      console.log('Email:', email);
      console.log('You can login with the password you set.');
      await db.destroy();
      return;
    }
    
    console.log('🔐 Creating super admin...');
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create super admin
    await db('users').insert({
      email: email,
      password: hashedPassword,
      role: 'admin',
      voter_id: 'ADMIN-SUPER-001',
      wallet_address: null,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    console.log('✅ Super admin created successfully!');
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('  SUPER ADMIN CREDENTIALS');
    console.log('═══════════════════════════════════════');
    console.log('  Email:    superadmin@votex.com');
    console.log('  Password: Admin@108');
    console.log('═══════════════════════════════════════');
    console.log('');
    console.log('🌐 Login at: https://securevotex.vercel.app/login');
    console.log('');
    
    await db.destroy();
  } catch (error) {
    console.error('❌ Error creating super admin:', error.message);
    await db.destroy();
    process.exit(1);
  }
}

createSuperAdmin();
