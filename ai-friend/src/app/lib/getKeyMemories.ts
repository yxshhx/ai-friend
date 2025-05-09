import { db } from "@/app/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

export async function getKeyMemories() {
  const chatRef = collection(db, "chats");
  const querySnapshot = await getDocs(
    query(chatRef, orderBy("timestamp", "desc"), limit(10))
  );

  const memories: string[] = [];

  querySnapshot.forEach((doc) => {
    const chat = doc.data();

    if (chat.userMessage.toLowerCase().includes("my name is")) {
      const name = chat.userMessage.split("my name is")[1].trim();
      memories.push(`User's name is ${name}.`);
    }

    if (chat.userMessage.toLowerCase().includes("i like")) {
      const preference = chat.userMessage.split("i like")[1].trim();
      memories.push(`User likes ${preference}.`);
    }

    if (chat.userMessage.toLowerCase().includes("i feel")) {
      const mood = chat.userMessage.split("i feel")[1].trim();
      memories.push(`User felt ${mood} before.`);
    }
  });

  return memories.join(" ");
}
