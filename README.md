# AI Mock Interviewer 🦑

A modern, full-stack web application designed to help users prepare for technical and behavioral interviews through AI-driven mock interviews. It intelligently generates customized questions based on the candidate's background and evaluates their spoken answers in real-time.

---

## 🚀 Key Features

* **Authentication**: Secure user login and registration powered by **Clerk**.
* **Personalized Mock Interviews**: Generates role-specific questions based on the user's provided "Executive Department" and "Past Experiences".
* **Speech-to-Text Integration**: Captures user answers via the microphone in real-time without requiring typing.
* **Camera Simulation**: Utilizes `react-webcam` to create a realistic interview environment.
* **AI Evaluation**: Provide instant ratings (out of 5) and constructive feedback identifying areas of improvement based on the user's spoken answer.
* **Feedback Dashboard**: A comprehensive review screen showing the original question, user's answer, correct expected answer, AI rating, and feedback.

---

## 🛠️ Technology Stack

* **Frontend**: [Next.js](https://nextjs.org/) (App Router), React, Tailwind CSS
* **Authentication**: [Clerk](https://clerk.dev/)
* **Database**: [Neon Postgres](https://neon.tech/) (Serverless Postgres)
* **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
* **Generative AI**: Google Gemini AI model
* **Microphone & Camera**: `react-hook-speech-to-text` and `react-webcam`

---

## 🧠 Generative AI Integration (Deep Dive)

The core functionality of this application revolves around its integration with the **Google Gemini AI Model**. It utilizes Generative AI for two primary tasks: **Data Generation (Questions)** and **Data Evaluation (Answers)**.

### 1. Generating Tailored Interview Questions

The AI initiates the interview process by crafting a custom interview scenario for the candidate rather than querying a static database of standard questions.

**How it works:**
1. Upfront, the user fills out a brief form with their target **Executive Department** (e.g., Frontend Developer) and **Past Experiences**.
2. The application acts as a prompt engineer behind the scenes, combining these details into a strict zero-shot prompt.
   * *Example Prompt logic: "Executive Department: [User Input], Past Experience: [User Input]. Based on this information give me 2 interview questions with Answers in json format, give 'question' and 'answer' as fields in JSON..."*
3. The prompt explicitly constraints the Gemini model to respond with **only** a valid JSON array. This prevents the model from generating conversational filler text like "Sure, here are your questions:".
4. The string response from Gemini is parsed back into a native JavaScript object/array and inserted into the Postgres database alongside a newly generated `mockId`.

### 2. Live Answer Evaluation

Once the interview begins, the user speaks their answer. The `react-hook-speech-to-text` library transcribes their raw audio to a text string. Once the user stops the recording or submits, the AI acts as an evaluator.

**How it works:**
1. The application constructs an evaluation prompt using the context of both the **Question** and the transcribed **User Answer**.
2. *Example Prompt logic: "Question: [Current Question], User Answer: [User Transcript]. Depending on the question and user answer... give a rating for the answer and feedback as an area of improvement... Ensure the response is a standard JSON object containing exactly two fields: 'rating' and 'feedback'."*
3. Gemini processes the semantic meaning of the user's transcript and measures it up against typical industry expectations.
4. It returns a `rating` (1 out of 5) and a short `feedback` string. 
5. The frontend parses this AI-generated JSON, records it to the `UserAnswer` database table via Drizzle, and clears the state to transition to the next question.

### Why JSON Formatting Matters
In generative workflows within web applications, forcing LLMs (Large Language Models) like Gemini to return data in **JSON** is vital. If a model returns markdown or plain text paragraphs, the Next.js application has no reliable way to map data to React component states or SQL columns. The constraints built into the prompts of this project ensure the AI operates as a predictable data API rather than an unpredictable chatbot.
