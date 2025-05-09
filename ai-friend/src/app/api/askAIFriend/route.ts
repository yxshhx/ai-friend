import { db } from "@/app/lib/firebase";
import { collection, addDoc, Timestamp, query, orderBy, limit, getDocs } from "firebase/firestore";

async function saveChat(userInput: string, aiResponse: string): Promise<void> {
  try {
    await addDoc(collection(db, "chats"), {
      userMessage: userInput,
      aiMessage: aiResponse,
      timestamp: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error saving chat:", error);
  }
}

async function getKeyMemories(): Promise<{ userName: string; lastMood: string }> {
  try {
    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, orderBy("timestamp", "desc"), limit(10)); // Fetch last 10 chats
    const querySnapshot = await getDocs(q);

    let userName = "";
    let lastMood = "";

    querySnapshot.docs.forEach((doc) => {
      const { userMessage, aiMessage } = doc.data();

      // Check for user introducing themselves
      if (userMessage.toLowerCase().includes("my name is")) {
        const parts = userMessage.split("my name is");
        if (parts.length > 1) {
          const extractedName = parts[1].trim().split(" ")[0];
          if (extractedName) userName = extractedName;
        }
      }

      // Check for AI responding about mood
      if (aiMessage.toLowerCase().includes("feeling")) {
        const parts = aiMessage.split("feeling");
        if (parts.length > 1) {
          const extractedMood = parts[1].trim().split(" ")[0];
          if (extractedMood) lastMood = extractedMood;
        }
      }
    });

    return { userName, lastMood };
  } catch (error) {
    console.error("Error fetching memories:", error);
    return { userName: "", lastMood: "" };
  }
}

export async function POST(req: Request): Promise<Response> {
  try {
    const { userInput, tone }: { userInput: string; tone?: string } = await req.json();

    if (!userInput) {
      return new Response(JSON.stringify({ error: "No input provided." }), { status: 400 });
    }

    const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-001:generateContent?key=AIzaSyACHcCe_2daPdF2Or39iQDFyeXDT1tZZSg";

    const responseTone = tone || "neutral";
    const { userName, lastMood } = await getKeyMemories();

    // Construct memory-aware prompt
    let memoryContext = "";
    if (userName) memoryContext += `You are talking to ${userName}. `;
    if (lastMood) memoryContext += `Last time, you were feeling ${lastMood}. `;

    // Special case: user asks for their name
    if (userInput.toLowerCase().includes("what is my name")) {
      const nameResponse = userName
        ? `Of course, I remember! Your name is ${userName}.`
        : `I don't think you've told me your name yet.`;
      return new Response(JSON.stringify({ response: nameResponse }));
    }

    const responseText = `${memoryContext}Now, I say: '${userInput}'. I am feeling: '${responseTone}'. Remember key facts like my name but respond naturally as a human friend.`;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: responseText }] }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      return new Response(JSON.stringify({ error: "Failed to fetch AI response." }), { status: response.status });
    }

    const data = await response.json();
    const aiMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response.";

    // Save chat history
    await saveChat(userInput, aiMessage);

    return new Response(JSON.stringify({ response: aiMessage }));
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "Error getting response from AI Friend." }), { status: 500 });
  }
}
