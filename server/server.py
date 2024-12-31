from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Global context for the chatbot
context = """
My name is BERT, and I am a chatbot designed to answer your questions. I was created by researchers to understand and generate human-like text.
I specialize in answering questions based on the context provided to me.
"""

@app.route("/chat", methods=["POST"])
def chat():
    try:
        # Get the user's question from the request
        user_input = request.json.get("message", "")
        if not user_input:
            return jsonify({"error": "No message provided"}), 400

        # Generate an answer using the QA pipeline
        qa_response = qa_pipeline({
            "question": user_input,
            "context": context
        })

        # Extract the bot's reply
        bot_reply = qa_response["answer"]

        # Perform NSFW classification
        nsfw_result = nsfw_pipeline(bot_reply)[0]

        # Send the bot's reply and NSFW analysis back as JSON
        return jsonify({
            "reply": bot_reply,
            "nsfw": {
                "label": nsfw_result["label"],
                "score": nsfw_result["score"]
            }
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/update_context", methods=["POST"])
def update_context():
    global context
    new_context = request.json.get("context", "")
    if not new_context:
        return jsonify({"error": "No context provided"}), 400

    context = new_context
    return jsonify({"message": "Context updated successfully!"})


if __name__ == "__main__":
    # Initialize pipelines inside the main block to prevent multiprocessing issues
    print("Initializing the pipelines...")
    qa_pipeline = pipeline("question-answering", model="distilbert-base-cased-distilled-squad")
    nsfw_pipeline = pipeline("text-classification", model="michellejieli/NSFW_text_classifier")

    # Start the Flask app
    app.run(host="0.0.0.0", port=5009)
