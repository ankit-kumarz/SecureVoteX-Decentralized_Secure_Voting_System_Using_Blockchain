/**
 * Debug script to check election dates and fix them if needed
 * Run with: node debug-elections.js
 */
const db = require('./src/models/db');

const fixElections = async () => {
  try {
    console.log('🔍 Checking elections...\n');
    
    const elections = await db('elections').select('*');
    
    if (elections.length === 0) {
      console.log('❌ No elections found in database');
      process.exit(1);
    }

    const now = new Date();
    console.log(`📅 Current time: ${now.toISOString()}\n`);

    elections.forEach(election => {
      const startDate = new Date(election.start_date);
      const endDate = new Date(election.end_date);
      const isActive = startDate <= now && now <= endDate;
      const hasStarted = startDate <= now;
      const hasEnded = now > endDate;

      console.log(`Election ID: ${election.id}`);
      console.log(`Title: ${election.title}`);
      console.log(`Start: ${startDate.toISOString()}`);
      console.log(`End: ${endDate.toISOString()}`);
      console.log(`Status: ${isActive ? '✅ ACTIVE' : hasEnded ? '⏹️ ENDED' : '⏳ NOT STARTED'}`);
      console.log('---\n');
    });

    // Check if any elections need fixing
    const inactiveElections = elections.filter(e => {
      const startDate = new Date(e.start_date);
      const endDate = new Date(e.end_date);
      return now > endDate; // Election has ended
    });

    if (inactiveElections.length > 0) {
      console.log(`\n⚠️  Found ${inactiveElections.length} expired election(s)\n`);
      console.log('Would you like to extend their dates? (Uncomment the code below)\n');
      
      // Uncomment this to fix elections - extend them by 7 days
      /*
      for (const election of inactiveElections) {
        const newEndDate = new Date();
        newEndDate.setDate(newEndDate.getDate() + 7);
        
        await db('elections')
          .where({ id: election.id })
          .update({ end_date: newEndDate });
        
        console.log(`✅ Extended election ${election.id} until ${newEndDate.toISOString()}`);
      }
      */
    } else {
      console.log('✅ All elections are within valid date ranges\n');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

fixElections();
