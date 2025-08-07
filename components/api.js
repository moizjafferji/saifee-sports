const API_URL = "https://script.google.com/macros/s/AKfycbxgDcRge-7srRlH0EdRUbEvruCQLTx0D-1JWRBhapx2jIjQ7zuUv5JYL6zVPbBlYEqq/exec";

async function callApi(method, data = {}) {
  try {
    const res = await fetch(API_URL + "?method=" + method, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: userSession.id_token,
      }
    });
    return await res.json();
  } catch (e) {
    console.error("API Error:", e);
    return { ok: false, error: e.message };
  }
}
