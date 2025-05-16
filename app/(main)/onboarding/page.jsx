import { GetUserOnboardingStatus } from "@/actions/user"
import { industries } from "@/Data/industries";
import { redirect } from "next/navigation";
import OnboardingForm from "./_components/onboarding-form";

export const OnboardingPage = async() => {

  const {isOnboarded}  = await GetUserOnboardingStatus();
  if(isOnboarded){
    redirect("/dashboard")
  }
return(
    <main>
       <OnboardingForm industries={industries}/>
    
    </main>
)

}


export default OnboardingPage;