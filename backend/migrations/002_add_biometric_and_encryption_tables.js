exports.up = function(knex) {
  return knex.schema
    // Voter Biometric Profiles
    .createTable('voter_profiles', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.text('embedding_encrypted').notNullable(); // base64 encrypted face embedding
      table.text('embedding_salt').notNullable(); // salt for encryption
      table.text('face_hash').notNullable(); // HMAC hash for quick matching
      table.timestamp('biometric_registered_at').defaultTo(knex.fn.now());
      table.timestamps(true, true);
      table.unique(['user_id']); // One profile per user
    })
    
    // Election Encryption Keys
    .createTable('election_keys', function(table) {
      table.increments('id').primary();
      table.integer('election_id').unsigned().references('id').inTable('elections').onDelete('CASCADE');
      table.text('public_key').notNullable(); // RSA public key (PEM format)
      table.text('private_key').notNullable(); // RSA private key (PEM format) - encrypted at rest
      table.text('public_key_fingerprint'); // SHA256 hash of public key
      table.string('key_owner').defaultTo('election-admin'); // Who manages the private key
      table.timestamp('key_created_at').defaultTo(knex.fn.now());
      table.timestamps(true, true);
      table.unique(['election_id']); // One key pair per election
    })
    
    // Vote Receipts
    .createTable('vote_receipts', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.integer('election_id').unsigned().references('id').inTable('elections').onDelete('CASCADE');
      table.text('receipt_hash').notNullable().unique(); // SHA256 hash for verification
      table.text('tx_hash'); // Blockchain transaction hash (optional)
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.index(['user_id', 'election_id']); // Fast lookup
    })
    
    // Add encrypted_vote column to existing votes table
    .table('votes', function(table) {
      table.text('encrypted_vote'); // Stores encrypted vote payload (optional, for E2E encryption)
      table.text('vote_salt'); // Salt used for encryption
    });
};

exports.down = function(knex) {
  return knex.schema
    .table('votes', function(table) {
      table.dropColumn('encrypted_vote');
      table.dropColumn('vote_salt');
    })
    .dropTableIfExists('vote_receipts')
    .dropTableIfExists('election_keys')
    .dropTableIfExists('voter_profiles');
};
