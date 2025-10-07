    /* ====================================
              MAIN AI FUNCTIONALITY - GROQ API
          Fungsi utama untuk mendapatkan Chat dari AI
          ==================================== */
    async function getChatFromAi( key_api, content) {
      document.getElementById("inputChat").value;
      document.getElementById("inputChat").focus();
      const inputChat = document.getElementById("inputChat").value.trim();
      const hasil = document.getElementById("hasil");
      // Validasi input
      if (!inputChat) {
        alert("Mohon masukkan chat terlebih dahulu");
        return;
      }

      // Show loading state
      hasil.classList.remove("hidden");
      hasil.innerHTML = `AI sedang menganalisis ...`;

      try {
        // Call Groq API
        const response = await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: key_api,
            },
            body: JSON.stringify({
              model: "llama-3.1-8b-instant",
              messages: [
                {
                  role: "system",
                  content: content,
                },
                {
                  role: "user",
                  content: inputChat,
                },
              ],
            }),
          }
        );

        // Check response status
        if (!response.ok) {
          throw new Error(
            `API error: ${response.status} - ${await response.text()}`
          );
        }

        // Parse response
        const data = await response.json();
        let output = data.choices[0].message.content;

        // Format output untuk tampilan yang lebih baik
        output = output
          .replace(/^####/, '')
          .replace(/ \*  \* (.*?) \* \* /g, '<strong class="text-green-800"> $1 </strong>') // Bold text
          .replace(/ \n  \n /g, '</p><p class="mb-4">') // Paragraphs
          .replace(/ \n- /g, '<li class="ml-6">') // Bullet points
          .replace(/ \n  \d+ \. \s /g, '<li class="ml-6">') // Numbered lists
          .replace(/ \n  /g, "<br>") // Line breaks
          .replace(/ <li> (.*?)($|<br>|<p)/g, '<li class="mb-2"> $1 </li>$2'); // Close list items

        // Display result with nice formatting
        hasil.innerHTML = `${output}`;

        // Scroll to result
        hasil.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } catch (error) {
        // Error handling with user-friendly message
        hasil.innerHTML = `
              <div class="flex items-start space-x-3">
                  <span class="text-2xl">⚠️</span>
                  <h3 class="font-bold text-red-800 mb-2">Terjadi Kesalahan</h3>
                  <p class="text-red-700 text-sm mb-4">${error.message}</p>
              </div>
          `;
      }
    }
