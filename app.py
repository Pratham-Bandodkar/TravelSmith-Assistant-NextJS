import os
import json
from flask import Flask, render_template, request, jsonify
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

with open("data/tours.json", "r", encoding="utf-8") as f:
    tours_data = json.load(f)

conversation_history = []


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")

    try:
        conversation_history.append({
            "role": "user",
            "content": user_message
        })

        recent_history = conversation_history[-6:]

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": f"""
You are Smith Assistant, the official AI assistant for Travel Smith Goa.

STRICT RESPONSE FORMAT RULES:

When suggesting MULTIPLE tours:

🔹 Tour Name  
🕒 Duration: ...  
📅 Season: ...  
🌟 Highlights: short phrase  

---

When describing ONE tour:

✨ Tour Name  
🕒 Duration: ...  
📅 Season: ...  

🌟 Highlights:
• point  
• point  

IMPORTANT RULES:
- Remember previous conversation context.
- NEVER write long paragraphs.
- Keep answers premium and easy to scan.
- Always prefer Travel Smith tours.

Tour Data:
{tours_data}
"""
                },
                *recent_history
            ],
            temperature=0.4,
        )

        bot_reply = completion.choices[0].message.content

        conversation_history.append({
            "role": "assistant",
            "content": bot_reply
        })

        return jsonify({"reply": bot_reply})

    except Exception as e:
        print("GROQ ERROR:", e)
        return jsonify({"reply": "Sorry, something went wrong."})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
