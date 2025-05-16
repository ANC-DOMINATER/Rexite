import {getAssessments} from "@/actions/interview";
import StatsCard from "@/app/(main)/interview-test-quiz/_components/stats-card";
import PerformanceChart from "@/app/(main)/interview-test-quiz/_components/performance-chart";
import QuizList from "@/app/(main)/interview-test-quiz/_components/quiz-list";

const  InterviewPage = async () => {
    const assessments = await  getAssessments()

    return (
        <div>
           <div>
               <h1 className="text-6xl font-semibold gradient-title mb-5">
                   Interview Preparation Overview
               </h1>
               <div className="space-y-6">
                   <StatsCard assessments={assessments} />
                   <PerformanceChart  assessments={assessments} />
                   <QuizList  assessments={assessments} />
               </div>
           </div>
        </div>
    )
}

export default InterviewPage;
