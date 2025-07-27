// Simple test to check if the hosting feature is working
async function testHostingBasic() {
  console.log('🧪 Testing basic hosting functionality...');
  
  try {
    // Test if we can access the API endpoint
    const response = await fetch('http://localhost:3000/api/paas/deployments', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('📡 API Response Status:', response.status);
    
    if (response.status === 401) {
      console.log('✅ API is working (401 Unauthorized is expected without auth)');
    } else if (response.ok) {
      const data = await response.json();
      console.log('✅ API Response:', data);
    } else {
      const error = await response.text();
      console.log('❌ API Error:', error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run if this is the main module
if (typeof window === 'undefined') {
  testHostingBasic();
}

module.exports = { testHostingBasic };