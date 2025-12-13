async function testLogin() {
    console.log('Testing Login with your credentials...\n');

    const credentials = {
        email: 'rutik@gmail.com',
        password: 'rutik123'
    };

    try {
        console.log('Attempting login with:', credentials.email);

        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();

        console.log('\n=== RESPONSE ===');
        console.log('Status Code:', response.status);
        console.log('Response Data:', JSON.stringify(data, null, 2));

        if (response.status === 200) {
            console.log('\n✅ SUCCESS: Login successful!');
            console.log('User Role:', data.role);
            console.log('User Name:', data.name);
        } else if (response.status === 401) {
            console.log('\n❌ FAILURE: Invalid credentials');
            console.log('This means either:');
            console.log('  1. Email is not in the database');
            console.log('  2. Password does not match');
        } else if (response.status === 500) {
            console.log('\n❌ FAILURE: Server error');
            console.log('Error:', data.error);
        } else {
            console.log('\n❌ FAILURE: Unexpected status code');
        }

    } catch (error) {
        console.error('\n❌ ERROR: Could not connect to backend server.');
        console.error('Error:', error.message);
        console.error('\nMake sure the backend server is running:');
        console.error('  cd server');
        console.error('  node index.js');
    }
}

testLogin();
