const { telegramService } = require('../lib/telegram.ts');

async function testTelegramIntegration() {
  console.log('🤖 Testing Telegram Integration...\n');

  try {
    // Test getting chat members count
    console.log('1. Testing getChatMembersCount...');
    const memberCount = await telegramService.getChatMembersCount();
    console.log(`✅ Chat has ${memberCount} members\n`);

    // Test getting administrators
    console.log('2. Testing getChatAdministrators...');
    const admins = await telegramService.getChatAdministrators();
    console.log(`✅ Found ${admins.length} administrators`);
    if (admins.length > 0) {
      console.log('   First admin:', {
        id: admins[0].id,
        name: `${admins[0].first_name} ${admins[0].last_name || ''}`.trim(),
        username: admins[0].username || 'No username'
      });
    }
    console.log('');

    // Test getting recent chat members
    console.log('3. Testing getRecentChatMembers...');
    const members = await telegramService.getRecentChatMembers(5);
    console.log(`✅ Retrieved ${members.length} recent members`);
    members.forEach((member, index) => {
      console.log(`   ${index + 1}. ${member.first_name} ${member.last_name || ''} ${member.username ? `(@${member.username})` : ''}`);
    });
    console.log('');

    // Test getting active users
    console.log('4. Testing getActiveUsers...');
    const activeUsers = await telegramService.getActiveUsers('weekly');
    console.log(`✅ Retrieved ${activeUsers.length} active users`);
    if (activeUsers.length > 0) {
      console.log('   Top user:', {
        name: `${activeUsers[0].first_name} ${activeUsers[0].last_name || ''}`.trim(),
        username: activeUsers[0].username || 'No username',
        messages: activeUsers[0].message_count,
        rank: activeUsers[0].rank
      });
    }
    console.log('');

    // Test getting activity stats
    console.log('5. Testing getActivityStats...');
    const stats = await telegramService.getActivityStats();
    console.log('✅ Activity stats retrieved successfully');
    console.log(`   - Total members: ${stats.total_members}`);
    console.log(`   - Daily active: ${stats.daily.length}`);
    console.log(`   - Weekly active: ${stats.weekly.length}`);
    console.log(`   - Monthly active: ${stats.monthly.length}`);

    console.log('\n🎉 All Telegram tests passed!');
    
    if (memberCount === 0) {
      console.log('\n💡 Note: If member count is 0, check:');
      console.log('1. Your bot token is correct');
      console.log('2. Your chat ID is correct');
      console.log('3. The bot is added to the group/channel');
      console.log('4. The bot has necessary permissions');
    }

  } catch (error) {
    console.error('❌ Telegram test failed:', error);
    console.log('\n🔧 This might be because:');
    console.log('1. TELEGRAM_BOT_TOKEN is not set in .env.local');
    console.log('2. TELEGRAM_CHAT_ID is not set in .env.local');
    console.log('3. Bot is not added to the Telegram group');
    console.log('4. Network connectivity issues');
    console.log('\nThe system will use mock data as fallback.');
  }
}

// Run test if called directly
if (require.main === module) {
  testTelegramIntegration()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('💥 Test script failed:', error);
      process.exit(1);
    });
}

module.exports = { testTelegramIntegration };