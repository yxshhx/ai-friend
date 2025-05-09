
# 🤖 AI Friend

**AI Friend** is an emotionally intelligent AI companion that recognizes your facial expressions and responds empathetically using advanced conversational AI. It aims to support users dealing with loneliness, anxiety, or difficulty expressing emotions by providing a comforting and interactive experience.

---

## 🌟 Features

- 🧠 **Emotion Detection** using `face-api.js`  
- 🎤 **Voice Input & Output** with `react-speech-recognition`  
- 💬 **Conversational AI** using Gemini API  
- ☁️ **Firebase** for chat history & authentication  
- 🌐 **Next.js App** with a smooth, modern UI  
- 🔒 Secure environment with hidden API keys via `.env`

---

## 📸 Screenshots
![Screenshot 2025-03-28 180007](https://github.com/user-attachments/assets/c4637498-ecfb-452f-8d5c-a53ef8ad9624)


---

## 🚀 Tech Stack

| Layer       | Technology                       |
|-------------|----------------------------------|
| Frontend    | Next.js, Tailwind CSS            |
| Emotion AI  | face-api.js                      |
| Speech      | react-speech-recognition         |
| AI Model    | Gemini (Google Generative AI)    |
| Backend     | Firebase (Auth & Firestore)      |

---

## 🛠️ Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/yxshhx/ai-friend.git
cd ai-friend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your `.env` file

Create a `.env` file in the root directory:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
# Add all Firebase env values here
```

### 4. Run the development server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

---

## 📁 Folder Structure

```
src/
├── app/
│   ├── EmotionDetection.tsx        # Face emotion detection
│   ├── api/askAIFriend/route.ts    # API route for AI response
│   ├── auth/                       # Firebase Auth (next-auth)
│   ├── page.tsx                    # Main UI & Logic
├── components/                     # UI components (if added)
├── styles/
│   └── globals.css
.env                                 # Environment variables (not committed)
```

---

## 💡 Future Plans

- Add more 3D character options
- Voice customization
- Improved emotion accuracy
- Chat memory and mood tracking

---

## 🧠 Why AI Friend?

In a world where people often feel isolated, AI Friend serves as a comforting digital presence that listens, understands, and responds—emotionally and intelligently.

---

## 📝 License

MIT License. Feel free to fork and build on top of it. Contributions welcome!

---

## 🙋‍♂️ Author

Made with ❤️ by [Yash Solanki](https://github.com/yxshhx)
