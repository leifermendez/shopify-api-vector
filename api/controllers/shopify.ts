import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { PromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { getInstance } from '../qdrant';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatOpenAI } from '@langchain/openai';


const searchSchema = z.object({
    src: z.string().min(3),
    collection: z.string().min(3),
});

const ragSchema = z.object({
    question: z.string().min(3),
    collection: z.string().min(3),
    prompt: z.string().optional(),
});



export const getSearch = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { src, collection } = searchSchema.parse(req.query);
        const vectorStore = await getInstance(collection)
        const response = await vectorStore.similaritySearch(src, 20);
        res.send(response);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).send({ error: error.errors });
        }
        next(error);
    }
};

export const ragSearch = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const PROMPT_DEFAULT = `Utiliza los siguientes elementos de contexto para responder a la pregunta del final.
        Si no sabes la respuesta, di simplemente que no la sabes, no intentes inventarte una respuesta.
        Utiliza tres frases como máximo y procura que la respuesta sea lo más concisa posible.
        Di siempre «gracias por preguntar» al final de la respuesta.
        {context}

        Pregunta: {question}
        Respuesta útil:`

        const { question, collection, prompt } = ragSchema.parse(req.body);
        const vectorStore = await getInstance(collection)
        console.log('>>>>>>>>>', vectorStore)
        const template = prompt ?? PROMPT_DEFAULT;

        const llm = new ChatOpenAI({ model: "gpt-3.5-turbo", temperature: 0 });
        const customRagPrompt = PromptTemplate.fromTemplate(template);

        const ragChain = await createStuffDocumentsChain({
            llm,
            prompt: customRagPrompt,
            outputParser: new StringOutputParser(),
        });
        const retriever = vectorStore.asRetriever({ k: 20, searchType: "similarity" });

        const context = await retriever.invoke(
            question
        );

        const text = await ragChain.invoke({
            question,
            context,
        });

        const response = {
            messages: [
                {
                    type: 'to_user',
                    content: text
                }
            ],
            question,
            context
        }

        res.send(response);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).send({ error: error.errors });
        }
        next(error);
    }
};
