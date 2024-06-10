import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";

export const injectDocument = async (docs: string[], collectionName: string) => {
    const docsParse: Document[] = docs.map((pageContent) => new Document({
        pageContent
    }))

    const vectorStore = await QdrantVectorStore.fromDocuments(
        docsParse,
        new OpenAIEmbeddings(),
        {
            url: process.env.QDRANT_URL,
            collectionName,
            apiKey: process.env.QDRANT_API
        }
    );

    return vectorStore
}
