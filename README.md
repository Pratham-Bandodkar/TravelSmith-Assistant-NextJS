# 🤖 TravelSmith Assistant – AI Travel Chatbot

An intelligent AI-powered travel chatbot built for **Travel Smith Goa**. 
This chatbot helps users explore Goa tour packages, adventure activities, heritage tours, and more using real tour data.

---

## 🚀 Features

- 💬 AI-powered responses using **Groq LLaMA 3.3-70b-versatile**
- 📚 Brochure-trained knowledge base (`data/tours.json`)
- 🧠 Conversation memory (context-aware replies)
- 🎨 Premium, mobile-responsive UI
- 🌍 Deployment ready for **Vercel**, Render, or Railway
- 🔒 Secure API key handling via environment variables

---

## ⚙️ Local Setup

1. **Clone repository:**
   ```bash
   git clone https://github.com/ery133/smith-assistant.git
   cd smith-assistant
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Linux/Mac:
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```

5. **Run the app:**
   ```bash
   python app.py
   ```
   Access at `http://127.0.0.1:5000`

---

## 🌍 Deployment on Vercel

This project is optimized for Vercel deployment.

1. Push your code to GitHub.
2. Connect your repository to Vercel.
3. Add the environment variable `GROQ_API_KEY` in the Vercel Dashboard.
4. Vercel will automatically detect `vercel.json` and deploy the Flask app.

---

## 👩‍💻 Developed By

**Eishwari Yadav**  
*BE Computer Engineering*

---

⭐ If you like this project, consider giving it a star!
