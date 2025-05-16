"use server"
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"
import { generateAIInsights } from "./dashboard";

export async function updateUser(data) {
   const {userId} = await auth();
   if(!userId) throw new Error("Unauthorized");
   const user = await db.user.findUnique({
        where: {
            clerkUserId: userId,
        },
   });

   if(!user) throw new Error("User not found");

   try{
     const result = await db.$transaction(
        async(tx) =>{
            let  industryInsight = await tx.industryInsight.findUnique({
                where:{
                    industry : data.industry,
                },
            });
            
            if(!industryInsight){
              const insights = await generateAIInsights(data.industry);
              industryInsight = await db.industryInsight.create({
                data:{
                      industry : data.industry,
                      ...insights,
                      nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    }
            });
          }
          const updateUser = await tx.user.update({
            where:{
              id : user.id,
            },
            data:{
              industry : data.industry,
              experience: data.experience ? String(data.experience) : null,
              bio : data.bio,
              skills: Array.isArray(data.skills) ? data.skills.join(', ') : data.skills,
            }
          });
           return {updateUser , industryInsight}
          },

        {
            timeout: 15000, // 15 seconds timeout
        }
     )
     return {success:true,...result};
   }catch(error){
     console.error('Error updating user and Industry:', error.message);
     throw new Error('Failed to update the profile' + error.message);
     
   }
}

export async function GetUserOnboardingStatus() {
  const {userId} = await auth();
   if(!userId) throw new Error("Unauthorized");
   const user = await db.user.findUnique({
        where: {
            clerkUserId: userId,
        },
   });

   if(!user) throw new Error("User not found");

   try {
    const user = await db.user.findUnique({
      where:{
        clerkUserId: userId,
      },
      select:{
        industry: true,
      }
    });

    return{
      isOnboarded: !!user?.industry,
    };
    
   } catch (error) {
     console.error('Error Checking user onboarding status:', error.message);
     throw new Error('Failed to check user onboarding status');
   }
}