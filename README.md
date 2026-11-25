# 🌌 AetherAI — Next-Gen Cognitive Chatbot

A high-performance, beautifully animated, enterprise-grade AI chatbot created exclusively using **vanilla HTML5, CSS3, and modern JavaScript (ES6+)**. 

Powered directly by **Groq's Ultra-Fast LLM API** (`openai/gpt-oss-120b`, `qwen/qwen3.8-27b`, and `allam-2-7b`) with real-time SSE streaming, deep reasoning chain extraction, interactive stickers, custom procedural synth sound effects, and multi-layer physics animations.

---

## 🌟 Key Chatbot Considerations Implemented

Every single critical pillar requested has been carefully engineered into the user interface and conversational logic:

### 1. 🎯 Use Case and Complexity
* **Smart Mode Switching**:
  * 🧠 **Smart General**: Open-ended problem solving, code generation, and complex queries.
  * 💼 **Support & Help**: Structured diagnostic steps, interactive troubleshooting checklists, and escalation pathways.
  * ⚡ **Fast FAQ**: Ultra-concise, direct bullet-point answers without filler text.
  * 🎨 **Creative Co-pilot**: Brainstorming, imaginative narratives, and expressive ideation.
* **Model Selection**: Switch effortlessly between `openai/gpt-oss-120b` (Deep Reasoning with expandable thought process) and `qwen/qwen3.8-27b` (Instant ultra-fast responses).

### 2. 🛡️ Accuracy and Guardrails
* **Factual Grounding**: System prompts explicitly constrain the model to verifiable truths, disallowing hallucinated facts, false citations, or unauthorized assumptions.
* **Strict Accuracy Guardrail Toggle**: A real-time toggle in the sidebar enforcing boundary controls and limitation disclosures.
* **Visual Trust Badges**: Verified bot replies display a `🛡️ Grounded Guardrail` pill.
* **Deep Reasoning Capture**: For models with analysis channels (e.g., `openai/gpt-oss-120b`), internal thoughts are rendered inside a collapsible **"🧠 Thought Process & Analysis"** drawer.

### 3. 👩‍💼 Human Handoff (Escalation & Ticketing)
* **One-Click Handoff Buttons**: Located prominently in the top navigation header and sidebar.
* **Automatic Frustration & Sentiment Detection**: Scans user prompts for frustration cues (e.g., *"talk to human"*, *"bad bot"*, *"agent please"*, *"frustrated"*), or when clicking 👎 on any answer.
* **Full Live Transfer Simulation**:
  * Smooth radar scan and conversation context packaging.
  * Seamless queue connection to **Sarah Jenkins (Senior Support Specialist)**.
  * Real-time ticket ID generation (`#TK-XXXX-HUMAN`) with handoff into the live chat thread.

### 4. 🔒 Data Privacy and Security
* **Client-side PII Data Masking**: Automatically catches and redacts sensitive data (Email addresses, Credit card numbers, Phone numbers) before dispatching requests over the network.
* **Interactive PII Shield Toast**: Visual indicator that informs the user their sensitive details were redacted client-side.
* **Local Storage & Zero Telemetry**: Conversation logs are stored locally in the browser's `localStorage`. Includes quick **Clear Chat** and **Export Transcript (.md)** utilities.

### 5. 💡 User Experience and Transparency
* **AI Identity Disclosed**: Distinct transparency banner and header tags clearly informing users they are conversing with an autonomous AI assistant powered by Groq.
* **Multilingual Selector**: Instant support for English, Spanish, French, German, Hindi, Japanese, and Arabic.
* **Speech-to-Text (Voice Dictation)**: Hands-free voice input via Web Speech API with pulsing glowing mic animation.
* **Text-to-Speech (Audio Voice Reader)**: Click `🔊 Listen` on any bot bubble to hear it read aloud with native browser speech synthesis.
* **Message Actions**: Copy text, markdown syntax-highlighted code blocks with one-click copy, and emoji reaction burst (👍, ❤️, 💡, 👎).

---

## 🎨 Theme, Stickers & Multi-Layer Animations

* **Layer 1: Ambient Mesh Glow Gradients**: Three floating, slowly morphing colored radial orbs that create a fluid glowing aurora effect.
* **Layer 2: Interactive Particle Canvas**: Physics-based starry particle mesh with cursor repulsion and dynamic connecting lines.
* **Layer 3: Glassmorphism**: Frost-glass containers (`backdrop-filter: blur(16px)`), neon glowing borders, and smooth shadows.
* **Layer 4: Interactive Avatar Face**: An animated robot face with blinking eyes and playful bounce reactions on click/poke.
* **Layer 5: Interactive Sticker Drawer**: 32 curated animated stickers across 4 categories (*Robots*, *Expressions*, *Tech & Work*, *Fun & Memes*).
  * Sending a sticker renders an animated bouncing sticker card in the chat.
  * AetherAI automatically responds with an appreciative contextual reaction!
* **Layer 6: Dynamic Procedural Sound Synthesizer**: Uses Web Audio API (no external MP3/WAV dependencies) to synthesize pleasant futuristic chimes for sending, receiving, clicking, popping stickers, and human handoff ringing.
* **Theme Modes**: One-click cycle between **Dark Nebula (🌙)**, **Cyber-Neon (⚡)**, and **Clean Light (☀️)**.

---

## 🚀 How to Run

1. Open `index.html` directly in any modern web browser (Google Chrome, Edge, Safari, Brave, Firefox):
   - You can double-click `index.html` or open it with your browser.
2. Or run a simple local web server:
   ```bash
   python3 -m http.server 8000
   ```
   Then open `http://localhost:8000` in your browser.

3. Your Groq API key is already configured and ready to go!
