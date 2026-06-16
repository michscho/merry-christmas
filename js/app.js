          const SECRET_KEY = "FroheWeihnachten2025!";

          function encrypt(text) {
            let result = "";
            for (let i = 0; i < text.length; i++) {
              const charCode =
                text.charCodeAt(i) ^
                SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
              result += String.fromCharCode(charCode);
            }
            return btoa(unescape(encodeURIComponent(result)))
              .replace(/\+/g, "-")
              .replace(/\//g, "_")
              .replace(/=/g, "");
          }

          function decrypt(encoded) {
            try {
              let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
              while (base64.length % 4) base64 += "=";
              const decoded = decodeURIComponent(escape(atob(base64)));
              let result = "";
              for (let i = 0; i < decoded.length; i++) {
                const charCode =
                  decoded.charCodeAt(i) ^
                  SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
                result += String.fromCharCode(charCode);
              }
              return result;
            } catch (e) {
              return null;
            }
          }

          let selectedGender = "n";

          function selectGender(gender) {
            selectedGender = gender;
            document
              .querySelectorAll(".gender-option")
              .forEach((opt) => opt.classList.remove("selected"));
            document
              .querySelector(`[data-gender="${gender}"]`)
              .classList.add("selected");
          }

          function getSalutation(gender) {
            switch (gender) {
              case "m":
                return "Lieber";
              case "f":
                return "Liebe";
              default:
                return "Liebe/r";
            }
          }

          function getDataFromURL() {
            const params = new URLSearchParams(window.location.search);
            const encryptedData = params.get("d");
            if (encryptedData) {
              const decrypted = decrypt(encryptedData);
              if (decrypted) {
                try {
                  return JSON.parse(decrypted);
                } catch (e) {}
              }
            }
            return null;
          }

          function initPage() {
            const data = getDataFromURL();
            if (data && data.name) {
              document.getElementById("recipientName").textContent = data.name;
              document.getElementById("messageName").textContent = data.name;
              document
                .getElementById("personalGreeting")
                .classList.add("visible");
              document
                .getElementById("personalMessage")
                .classList.add("visible");
              if (data.gender)
                document.getElementById("salutation").textContent =
                  getSalutation(data.gender);
              document.title = `Frohe Weihnachten, ${data.name}! 🎄`;
              if (data.from) {
                document.getElementById("fromName").textContent = data.from;
                document.getElementById("fromSection").classList.add("visible");
              }
              document
                .getElementById("shareSection")
                .classList.remove("visible");
            } else {
              document
                .getElementById("personalGreeting")
                .classList.remove("visible");
              document
                .getElementById("personalMessage")
                .classList.remove("visible");
              document
                .getElementById("fromSection")
                .classList.remove("visible");
              document.getElementById("shareSection").classList.add("visible");
            }
          }

          function openGift(element) {
            if (element.classList.contains("opened")) {
              element.classList.remove("opened");
              element.querySelector(".gift-label").textContent = "Klick mich!";
            } else {
              element.classList.add("opened");
              element.querySelector(".gift-label").textContent = "Nochmal?";
            }
          }

          function generateLink() {
            const nameInput = document.getElementById("nameInput").value.trim();
            const fromInput = document.getElementById("fromInput").value.trim();
            if (!nameInput) {
              alert("Bitte gib einen Empfänger-Namen ein!");
              return;
            }
            const data = { name: nameInput, gender: selectedGender };
            if (fromInput) data.from = fromInput;
            const encrypted = encrypt(JSON.stringify(data));
            const baseURL = window.location.origin + window.location.pathname;
            const link = `${baseURL}?d=${encrypted}`;
            document.getElementById("linkText").textContent = link;
            document.getElementById("shareLink").classList.add("visible");
            document.getElementById("copyBtn").classList.remove("copied");
            document.getElementById("copyBtn").textContent = "📋 Link kopieren";
          }

          function copyLink() {
            const linkText = document.getElementById("linkText").textContent;
            navigator.clipboard
              .writeText(linkText)
              .then(() => showCopied())
              .catch(() => {
                const textArea = document.createElement("textarea");
                textArea.value = linkText;
                textArea.style.position = "fixed";
                textArea.style.opacity = "0";
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand("copy");
                document.body.removeChild(textArea);
                showCopied();
              });
          }

          function showCopied() {
            const btn = document.getElementById("copyBtn");
            btn.classList.add("copied");
            btn.textContent = "✅ Kopiert!";
            setTimeout(() => {
              btn.classList.remove("copied");
              btn.textContent = "📋 Link kopieren";
            }, 2000);
          }

          document.addEventListener("DOMContentLoaded", function () {
            initPage();
            document.querySelectorAll(".share-input").forEach((input) => {
              input.addEventListener("keypress", function (e) {
                if (e.key === "Enter") generateLink();
              });
            });
          });
        


