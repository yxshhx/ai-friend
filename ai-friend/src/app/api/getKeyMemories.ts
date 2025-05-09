import { db } from "@/app/lib/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

export async function getKeyMemories() {
  try {
    const q = query(collection(db, "chats"), orderBy("timestamp", "desc"), limit(10));
    const snapshot = await getDocs(q);

    let facts = "";
    snapshot.forEach((doc) => {
      const { userInput } = doc.data();
      if (userInput.toLowerCase().includes("my name is")) {
        facts += `User's name is: ${userInput.split("my name is")[1].trim()}.\n`;
      }
      if (userInput.toLowerCase().includes("i feel")) {
        facts += `User's mood: ${userInput.split("i feel")[1].trim()}.\n`;
      }
    });

    return facts;
  } catch (error) {
    console.error("Error retrieving memories:", error);
    return "";
  }
}
