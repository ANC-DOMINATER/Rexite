"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { GoogleGenerativeAI, } from "@google/generative-ai";
import {revalidatePath} from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model:"gemini-2.0-flash"
});


export async function saveResume(content) {
    const {userId} = await auth();
    if(!userId) throw new Error("Unauthorized");
    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId,
        },
    });

    if(!user) throw new Error("User not found");

    try{
        const resume = await db.resume.upsert({
            where:{
                userId : user.id,
            },
            update:{
                content,
            },
            create:{
                userId:user.id,
                content,
            },
        });
        revalidatePath("/resume")
    }catch (e) {
      console.error("Error saving resume:",e.message);
      throw new Error("Failed to save resume");
    }
}

export async function getResume(){
    const {userId} = await auth();
    if(!userId) throw new Error("Unauthorized");
    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId,
        },
    });

    if(!user) throw new Error("User not found");

    return await db.resume.findUnique({
        where:{
            userId: user.id,
        }
    });
}

export async function ImproveWithAI({ type, current, context }) {
    const {userId} = await auth();
    if(!userId) throw new Error("Unauthorized");
    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId,
        },
        include:{
            industryInsights: true,
        }
    });

    if(!user) throw new Error("User not found");

    // Extract context information
    const { title = "", organization = "" } = context || {};

    const prompt = `
    As an expert resume writer, improve the following ${type} description for a ${user.industry} professional.
    
    Entry Details:
    - Position/Title: ${title}
    - Organization/Company: ${organization}
    
    Current content: "${current}"

    Requirements:
    1. Use powerful action verbs specific to this role
    2. Include metrics and results where possible
    3. Highlight relevant technical skills
    4. Keep it concise but detailed
    5. Focus on achievements over responsibilities
    6. Use industry-specific keywords relevant to ${user.industry}
    7. Make this unique and personalized to the specific role at ${organization}

    Format the response as a single paragraph without any additional text or explanations.
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const improvedContent = response.text().trim();
        return improvedContent;
    }catch (e) {
        console.error("Error improving resume:",e.message);
        throw new Error("Failed to improve resume");
    }
}
