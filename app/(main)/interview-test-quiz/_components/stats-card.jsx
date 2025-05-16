import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Brain, Trophy} from "lucide-react";

function StatsCard({assessments}) {
    const getAverageScore = () => {
        if (!assessments?.length) return 0;
        const total = assessments.reduce(
            (sum, assessments) => sum + assessments.quizScore,
            0
        );
        return (total / assessments.length).toFixed(1);
    };

    const getLatestAssessment = () => {
        if (!assessments?.length) return null;
        return assessments[0];
    };

    const getTotalQuestions = () => {
        if (!assessments?.length) return 0;
        return assessments.reduce(
            (sum, assessment) => sum + assessment.questions.length,
            0
        );

    }

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-medium font-semibold">Average Score</CardTitle>
                    <Trophy className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-semibold">{getAverageScore()}%</div>
                    <p className="text-xs text-muted-foreground"> Across all assessments </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-medium font-semibold"> Questions Practiced </CardTitle>
                    <Brain className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-semibold">{getTotalQuestions()}</div>
                    <p className="text-xs text-muted-foreground"> Total Questions </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-medium font-semibold">Latest Score</CardTitle>
                    <Trophy className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-semibold">
                        {getLatestAssessment()?.quizScore.toFixed(1) || 0 }%
                    </div>
                    <p className="text-xs text-muted-foreground"> Most Recent Quiz</p>
                </CardContent>
            </Card>
        </div>
    );
}

export default StatsCard;