(function (global) {
  // === Variabel internal framework ===
  let API_KEY = "";
  let SYSTEM_PROMPT = "";
  let INPUT_SELECTOR = "";
  let OUTPUT_SELECTOR = "";

  // === Fungsi konfigurasi ===
  function AddKeyApiAi(key) {
    API_KEY = key;
  }

  function AddContentAi(content) {
    SYSTEM_PROMPT = content;
  }

  function GetElementInput(selector) {
    INPUT_SELECTOR = selector;
  }

  function GetElementOutput(selector) {
    OUTPUT_SELECTOR = selector;
  }

  // === Fungsi utama untuk memanggil AI ===
  async function getChatFromAi() {
    if (!API_KEY) throw new Error("Tambahkan API Key dengan AddKeyApiAi()");
    if (!INPUT_SELECTOR) throw new Error("Tambahkan elemen input dengan GetElementInput()");
    if (!OUTPUT_SELECTOR) throw new Error("Tambahkan elemen output dengan GetElementOutput()");

    const inputEl = document.querySelector(INPUT_SELECTOR);
    const outputEl = document.querySelector(OUTPUT_SELECTOR);

    const message = inputEl.value.trim();
    if (!message) {
      outputEl.value = "⚠️ Tidak ada input!";
      return;
    }

    outputEl.value = "⏳ Sedang memproses...";
    
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": API_KEY
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: message }
          ]
        })
      });

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || "⚠️ Tidak ada respons dari AI.";
      outputEl.value = text;
    } catch (err) {
      outputEl.value = "❌ Error: " + err.message;
    }
    if (!response.ok) {
    const errMsg = await response.text();
    throw new Error(`API Error (${response.status}): ${errMsg}`);
}

  }

  // === Ekspor ke global scope ===
  global.AddKeyApiAi = AddKeyApiAi;
  global.AddContentAi = AddContentAi;
  global.GetElementInput = GetElementInput;
  global.GetElementOutput = GetElementOutput;
  global.getChatFromAi = getChatFromAi;

})(window);
