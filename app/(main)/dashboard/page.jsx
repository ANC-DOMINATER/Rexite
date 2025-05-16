import { redirect } from "next/navigation";
import { GetUserOnboardingStatus } from "@/actions/user"
import { getIndustriesInsights } from "@/actions/dashboard";
import DashboardView from "./_components/dashboard-view";

const IndustryInsightsPage = async() =>{
    const {isOnboarded}  = await GetUserOnboardingStatus();
    const insights = await getIndustriesInsights();
 

      if(!isOnboarded){
        redirect("/onboarding")
      }



    return (
      <div className="container mx-auto">
        <DashboardView  insights={insights} />
      </div>
    );
}


export default IndustryInsightsPage;