

const API_URL = 'http://localhost:8000/api/v1';
const ROLES = {
  admin: { email: 'admin@ruangtani.id', password: 'password', token: null },
  petani: { email: 'budi@ruangtani.id', password: 'password', token: null },
  pengurus: { email: 'ahmad@ruangtani.id', password: 'password', token: null },
  bpp: { email: 'hendra@ruangtani.id', password: 'password', token: null }
};

async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Login failed for ${email}: ${res.status} ${txt}`);
  }
  const data = await res.json();
  return data.data.token;
}

async function testEndpoint(name, url, method, token, body = null, expectedStatus = 200) {
  const options = {
    method,
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };
  if (body) options.body = JSON.stringify(body);
  
  const res = await fetch(`${API_URL}${url}`, options);
  
  if (res.status !== expectedStatus) {
    const errText = await res.text();
    console.error(`❌ [${name}] FAILED. Expected ${expectedStatus}, got ${res.status}. Response: ${errText}`);
    return false;
  }
  console.log(`✅ [${name}] SUCCESS (${res.status})`);
  return true;
}

async function runTests() {
  try {
    console.log("=== PHASE 1: LOGIN & AUTH ===");
    for (const role in ROLES) {
      ROLES[role].token = await login(ROLES[role].email, ROLES[role].password);
      console.log(`✅ Logged in as ${role}`);
    }

    console.log("\\n=== PHASE 2: ADMIN ENDPOINTS ===");
    const adminToken = ROLES.admin.token;
    await testEndpoint('Get Users', '/users', 'GET', adminToken);
    await testEndpoint('Get Lahan', '/lahan', 'GET', adminToken);
    await testEndpoint('Get Dashboard', '/dashboard/stats', 'GET', adminToken);
    await testEndpoint('Get Berita', '/berita', 'GET', adminToken);
    
    console.log("\\n=== PHASE 3: PETANI ENDPOINTS ===");
    const petaniToken = ROLES.petani.token;
    await testEndpoint('Get Lahan Petani', '/lahan', 'GET', petaniToken);
    await testEndpoint('Get Sewa Petani', '/sewa', 'GET', petaniToken);
    
    console.log("\\n=== PHASE 4: PENGURUS ENDPOINTS ===");
    const pengurusToken = ROLES.pengurus.token;
    await testEndpoint('Get Sewa Pengurus', '/sewa', 'GET', pengurusToken);
    
    console.log("\\n=== PHASE 5: BPP ENDPOINTS ===");
    const bppToken = ROLES.bpp.token;
    await testEndpoint('Get Verifikasi Lahan', '/verifikasi-lahan', 'GET', bppToken);
    
    console.log("\\n=== PHASE 6: ERROR HANDLING & EDGE CASES ===");
    await testEndpoint('Unauthorized Access (No Token)', '/users', 'GET', '', null, 401);
    
    console.log("\\nAll API tests completed.");
  } catch (err) {
    console.error("Test execution failed:", err);
  }
}

runTests();
