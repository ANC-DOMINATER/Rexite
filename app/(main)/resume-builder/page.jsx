import {getResume} from "@/actions/resume";
import ResumeBuilder from "@/app/(main)/resume-builder/_components/ResumeBuilder";


const ResumePage = async() =>{
    const resume = await getResume()


    return(
        <div className="container mx-auto py-6">
            <ResumeBuilder initialContent={resume?.content} />
        </div>
    );
}

export default ResumePage;