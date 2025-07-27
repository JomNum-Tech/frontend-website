const { communityService } = require('../lib/services/communityService.ts');
const { clerkClient } = require('@clerk/nextjs/server');

async function seedCommunityData() {
  console.log('🌱 Seeding community data...\n');

  try {
    // Get some users from Clerk
    console.log('1. Fetching users from Clerk...');
    const client = await clerkClient();
    const response = await client.users.getUserList({ limit: 10 });
    
    if (response.data.length === 0) {
      console.log('❌ No users found in Clerk. Please create some users first.');
      return;
    }

    console.log(`✅ Found ${response.data.length} users in Clerk\n`);

    // Create some mock activities for these users
    console.log('2. Creating mock activities...');
    
    const activityTypes = ['login', 'page_visit', 'profile_update', 'file_upload'];
    let activitiesCreated = 0;

    for (const user of response.data) {
      // Create random activities for each user
      const numActivities = Math.floor(Math.random() * 15) + 5; // 5-20 activities per user
      
      for (let i = 0; i < numActivities; i++) {
        const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
        const daysAgo = Math.floor(Math.random() * 30); // Activities within last 30 days
        
        const metadata = {
          page: activityType === 'page_visit' ? ['/courses', '/profile', '/community', '/about'][Math.floor(Math.random() * 4)] : undefined,
          timestamp: new Date(Date.now() - (daysAgo * 24 * 60 * 60 * 1000)).toISOString()
        };

        await communityService.trackActivity(
          user.id,
          activityType,
          metadata,
          '127.0.0.1',
          'Mozilla/5.0 (Test Seeder)'
        );
        
        activitiesCreated++;
      }
      
      console.log(`   ✅ Created ${numActivities} activities for user: ${user.firstName || user.emailAddresses[0]?.emailAddress}`);
    }

    console.log(`\n✅ Created ${activitiesCreated} total activities\n`);

    // Refresh user stats
    console.log('3. Refreshing user statistics...');
    await communityService.refreshUserStats();
    console.log('✅ User statistics refreshed\n');

    // Test the results
    console.log('4. Testing results...');
    const stats = await communityService.getCommunityStats();
    
    console.log('📊 Community Statistics:');
    console.log(`   - Total members: ${stats.total_members}`);
    console.log(`   - Active today: ${stats.active_today}`);
    console.log(`   - Active this week: ${stats.active_this_week}`);
    console.log(`   - Active this month: ${stats.active_this_month}`);
    console.log(`   - Daily top users: ${stats.daily.length}`);
    console.log(`   - Weekly top users: ${stats.weekly.length}`);
    console.log(`   - Monthly top users: ${stats.monthly.length}`);

    if (stats.weekly.length > 0) {
      console.log('\n🏆 Top Weekly User:');
      const topUser = stats.weekly[0];
      console.log(`   - Name: ${topUser.firstName || ''} ${topUser.lastName || ''}`.trim() || topUser.emailAddress);
      console.log(`   - Role: ${topUser.role}`);
      console.log(`   - Activity Score: ${topUser.activity_score}`);
      console.log(`   - Weekly Activities: ${topUser.recent_activity.weekly_logins}`);
    }

    console.log('\n🎉 Community data seeded successfully!');
    console.log('You can now visit /community to see the active users.');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    console.log('\n🔧 Make sure to:');
    console.log('1. Run the database migration: npm run db:migrate:user-activity');
    console.log('2. Have users in your Clerk instance');
    console.log('3. Check your database connection');
  }
}

// Run seeder if called directly
if (require.main === module) {
  seedCommunityData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('💥 Seeding script failed:', error);
      process.exit(1);
    });
}

module.exports = { seedCommunityData };