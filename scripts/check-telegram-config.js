const fetch = require('node-fetch');

async function checkTelegramConfig() {
  console.log('🔍 Checking Telegram Configuration...\n');

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  // Check environment variables
  console.log('1. Environment Variables:');
  console.log(`   TELEGRAM_BOT_TOKEN: ${botToken ? '✅ Set' : '❌ Missing'}`);
  console.log(`   TELEGRAM_CHAT_ID: ${chatId ? '✅ Set' : '❌ Missing'}\n`);

  if (!botToken) {
    console.log('❌ Bot token is missing. Please:');
    console.log('1. Create a bot with @BotFather on Telegram');
    console.log('2. Add TELEGRAM_BOT_TOKEN=your_token to .env.local');
    return;
  }

  if (!chatId) {
    console.log('❌ Chat ID is missing. Please:');
    console.log('1. Add your bot to the Telegram group');
    console.log('2. Send a message in the group');
    console.log('3. Visit: https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates');
    console.log('4. Find the chat.id and add TELEGRAM_CHAT_ID=your_chat_id to .env.local');
    return;
  }

  // Test bot token
  console.log('2. Testing Bot Token...');
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
    const data = await response.json();
    
    if (response.ok && data.ok) {
      console.log('✅ Bot token is valid');
      console.log(`   Bot name: ${data.result.first_name}`);
      console.log(`   Bot username: @${data.result.username}\n`);
    } else {
      console.log('❌ Bot token is invalid');
      console.log(`   Error: ${data.description || 'Unknown error'}\n`);
      return;
    }
  } catch (error) {
    console.log('❌ Failed to test bot token');
    console.log(`   Error: ${error.message}\n`);
    return;
  }

  // Test chat access
  console.log('3. Testing Chat Access...');
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getChatMembersCount`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId })
    });
    const data = await response.json();
    
    if (response.ok && data.ok) {
      console.log('✅ Chat access is working');
      console.log(`   Member count: ${data.result}\n`);
    } else {
      console.log('❌ Chat access failed');
      console.log(`   Error: ${data.description || 'Unknown error'}`);
      console.log('\n🔧 Common issues:');
      console.log('1. Bot is not added to the group');
      console.log('2. Chat ID is incorrect');
      console.log('3. Bot doesn\'t have necessary permissions');
      console.log('4. Chat ID should be negative for groups/channels\n');
      return;
    }
  } catch (error) {
    console.log('❌ Failed to test chat access');
    console.log(`   Error: ${error.message}\n`);
    return;
  }

  // Test administrators access
  console.log('4. Testing Administrator Access...');
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getChatAdministrators`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId })
    });
    const data = await response.json();
    
    if (response.ok && data.ok) {
      console.log('✅ Administrator access is working');
      console.log(`   Found ${data.result.length} administrators`);
      if (data.result.length > 0) {
        const firstAdmin = data.result[0].user;
        console.log(`   First admin: ${firstAdmin.first_name} ${firstAdmin.last_name || ''} ${firstAdmin.username ? `(@${firstAdmin.username})` : ''}`);
      }
      console.log('');
    } else {
      console.log('❌ Administrator access failed');
      console.log(`   Error: ${data.description || 'Unknown error'}`);
      console.log('   Note: This might still work for basic functionality\n');
    }
  } catch (error) {
    console.log('❌ Failed to test administrator access');
    console.log(`   Error: ${error.message}`);
    console.log('   Note: This might still work for basic functionality\n');
  }

  console.log('🎉 Telegram configuration check completed!');
  console.log('If all tests passed, your community page should show real Telegram data.');
  console.log('If some tests failed, the system will use mock data as fallback.');
}

// Run check if called directly
if (require.main === module) {
  checkTelegramConfig()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('💥 Configuration check failed:', error);
      process.exit(1);
    });
}

module.exports = { checkTelegramConfig };