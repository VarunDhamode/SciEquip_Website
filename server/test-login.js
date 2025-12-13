// Native fetch is available in Node 18+

async function testLogin() {
    console.log('Testing Login...');
    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test@example.com', // We'll just check if we get a valid response (401 or 200), not necessarily a success
                password: 'password123'
            })
        });

        const data = await response.json();
        console.log('Status Code:', response.status);
        console.log('Response:', data);

        if (response.status === 200) {
            console.log('SUCCESS: Login endpoint is reachable and working (User found).');
        } else if (response.status === 401) {
            console.log('SUCCESS: Login endpoint is reachable (User not found/Invalid creds, which is expected for test data). DB Connection is likely GOOD.');
        } else {
            console.log('FAILURE: Unexpected status code.');
        }

    } catch (error) {
        console.error('ERROR: Could not connect to login endpoint.', error.message);
    }
}

testLogin();
