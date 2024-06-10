import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";

export const getInstance = async (collectionName: string) => {
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
        new OpenAIEmbeddings(),
        {
            url: process.env.QDRANT_URL,
            apiKey: process.env.QDRANT_API,
            collectionName,
        }
    );

    return vectorStore
}