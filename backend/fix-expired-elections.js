/**
 * Fix expired elections - extends their end_date to tomorrow
 * Run with: node fix-expired-elections.js
 */
const db = require('./src/models/db');

const fixExpiredElections = async () => {
  try {
    console.log('🔧 Fixing expired elections...\n');
    
    const elections = await db('elections').select('*');
    const now = new Date();

    const expiredElections = elections.filter(e => {
      const endDate = new Date(e.end_date);
      return now > endDate;
    });

    if (expiredElections.length === 0) {
      console.log('✅ No expired elections found');
      process.exit(0);
    }

    console.log(`Found ${expiredElections.length} expired election(s)\n`);

    for (const election of expiredElections) {
      // Set new end date to 7 days from now
      const newEndDate = new Date();
      newEndDate.setDate(newEndDate.getDate() + 7);

      await db('elections')
        .where({ id: election.id })
        .update({ 
          end_date: newEndDate,
          updated_at: now
        });

      console.log(`✅ Election "${election.title}" (ID: ${election.id})`);
      console.log(`   Old end: ${new Date(election.end_date).toISOString()}`);
      console.log(`   New end: ${newEndDate.toISOString()}\n`);
    }

    console.log('✅ All expired elections have been extended!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

fixExpiredElections();
