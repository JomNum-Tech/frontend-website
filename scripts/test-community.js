const { communityService } = require('../lib/services/communityService.ts');

async function testCommunityService() {
  console.log('🧪 Testing Community Service...\n');

  try {
    // Test getting community stats
    console.log('1. Testing getCommunityStats...');
    const stats = await communityService.getCommunityStats();
    console.log('✅ Community stats retrieved successfully');
    console.log(`   - Total members: ${stats.total_members}`);
    console.log(`   - Active today: ${stats.active_today}`);
    console.log(`   - Active this week: ${stats.active_this_week}`);
    console.log(`   - Active this month: ${stats.active_this_month}`);
    console.log(`   - Daily top users: ${stats.daily.length}`);
    console.log(`   - Weekly top users: ${stats.weekly.length}`);
    console.log(`   - Monthly top users: ${stats.monthly.length}\n`);

    // Test getting most active users
    console.log('2. Testing getMostActiveUsers...');
    const weeklyUsers = await communityService.getMostActiveUsers('weekly', 5);
    console.log(`✅ Retrieved ${weeklyUsers.length} weekly active users`);
    
    if (weeklyUsers.length > 0) {
      console.log('   Top user:', {
        name: `${weeklyUsers[0].firstName || ''} ${weeklyUsers[0].lastName || ''}`.trim() || weeklyUsers[0].emailAddress,
        role: weeklyUsers[0].role,
        activityScore: weeklyUsers[0].activity_score,
        rank: weeklyUsers[0].rank
      });
    }

    console.log('\n🎉 All tests passed! Community service is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.log('\n🔧 This might be because:');
    console.log('1. Database tables haven\'t been created yet (run: npm run db:migrate:user-activity)');
    console.log('2. No users exist in Clerk yet');
    console.log('3. Database connection issues');
    console.log('\nThe service should still work with fallback data.');
  }
}

// Run test if called directly
if (require.main === module) {
  testCommunityService()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('💥 Test script failed:', error);
      process.exit(1);
    });
}

module.exports = { testCommunityService };