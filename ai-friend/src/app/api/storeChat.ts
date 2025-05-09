import { db } from "@/app/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function storeChat(userInput: string, aiResponse: string, emotion: string) {
  try {
    await addDoc(collection(db, "chats"), {
      userInput,
      aiResponse,
      emotion,
      timestamp: serverTimestamp(),
    });
    console.log("Chat stored successfully");
  } catch (error) {
    console.error("Error storing chat:", error);
  }
}
