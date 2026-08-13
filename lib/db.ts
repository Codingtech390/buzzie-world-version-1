import { connectToDatabase } from "@/lib/mongoose";

export async function dbConnect() {
  return connectToDatabase();
}
