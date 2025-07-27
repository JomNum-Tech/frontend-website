const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function testPaaSAPI() {
  try {
    console.log('🧪 Testing PaaS API setup...');
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL not found in environment');
    }
    
    const sql = neon(process.env.DATABASE_URL);
    
    // Test database connection
    console.log('📡 Testing database connection...');
    const result = await sql`SELECT NOW() as current_time`;
    console.log('✅ Database connected:', result[0].current_time);
    
    // Check if paas_deployments table exists
    console.log('🔍 Checking if paas_deployments table exists...');
    try {
      const tableCheck = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_name = 'paas_deployments'
      `;
      
      if (tableCheck.length > 0) {
        console.log('✅ paas_deployments table exists');
        
        // Get table structure
        const columns = await sql`
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = 'paas_deployments'
          ORDER BY ordinal_position
        `;
        
        console.log('📋 Table structure:');
        columns.forEach(col => {
          console.log(`  - ${col.column_name}: ${col.data_type}`);
        });
        
        // Test insert/select
        const testId = 'test-' + Date.now();
        await sql`
          INSERT INTO paas_deployments (
            id, user_id, name, subdomain, framework, status
          ) VALUES (
            ${testId}, 'test-user', 'test-app', 'test-app-${Date.now()}', 'static', 'building'
          )
        `;
        
        const inserted = await sql`SELECT * FROM paas_deployments WHERE id = ${testId}`;
        console.log('✅ Test record inserted:', inserted[0].name);
        
        // Clean up
        await sql`DELETE FROM paas_deployments WHERE id = ${testId}`;
        console.log('🧹 Test record cleaned up');
        
      } else {
        console.log('❌ paas_deployments table does not exist');
        console.log('💡 Run: npm run db:migrate:paas to create the table');
      }
    } catch (error) {
      console.log('❌ Table check failed:', error.message);
    }
    
    console.log('🎉 PaaS API test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testPaaSAPI();