// POSTMAN COLLECTION - Auto Save Token
// Paste script ini di tab "Tests" untuk request register/login

// Otomatis simpan token setelah register/login berhasil
if (pm.response.code === 200 || pm.response.code === 201) {
    const responseJson = pm.response.json();

    if (responseJson.data && responseJson.data.token) {
        // Simpan token ke environment variable
        pm.environment.set("token", responseJson.data.token);

        // Simpan user info juga
        pm.environment.set("userId", responseJson.data.user.id);
        pm.environment.set("userEmail", responseJson.data.user.email);
        pm.environment.set("userRole", responseJson.data.user.role);

        console.log("✅ Token berhasil disimpan!");
        console.log("Token:", responseJson.data.token.substring(0, 20) + "...");
        console.log("Role:", responseJson.data.user.role);
    }
}

// Cara menggunakan:
// 1. Copy script ini
// 2. Di Postman, buka request POST /auth/register atau /auth/login
// 3. Klik tab "Tests" (sebelah tab Body)
// 4. Paste script ini
// 5. Setiap kali login/register, token otomatis tersimpan!
// 6. Gunakan {{token}} di request lain
