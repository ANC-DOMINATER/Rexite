"use client";

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import QuizResults from "@/app/(main)/interview-test-quiz/_components/quiz-results";

function QuizList({ assessments }) {
    const router = useRouter();
    const [selectedQuiz, setSelectedQuiz] = useState(null);

    return (
        <>
            <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="gradient-title text-3xl md:text-4xl">Recent Quizzes</CardTitle>
                        <CardDescription>Review your past quiz performance</CardDescription>
                    </div>
                    <Button onClick={() => router.push("/interview-test-quiz/mock")}>Start New Quiz</Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {assessments.map((assessment, i) => (
                            <Card
                                key={assessment.id}
                                className="cursor-pointer hover:shadow-xl hover:bg-black/50 transition-colors"
                                onClick={() => setSelectedQuiz(assessment)}
                            >
                                <CardHeader>
                                    <CardTitle>Quiz {i + 1}</CardTitle>
                                    <CardDescription className="flex justify-between w-full">
                                        <div>
                                            Score: {assessment.quizScore.toFixed(1)}%
                                        </div>
                                        <div>
                                            {format(
                                                new Date(assessment.createdAt),
                                                "MMM dd, yyyy HH:mm"
                                            )}
                                        </div>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        {assessment.improvementTip}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Dialog */}
            <Dialog open={!!selectedQuiz} onOpenChange={() => setSelectedQuiz(null)}>
                <DialogContent className="w-[400px] max-w-[400px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle></DialogTitle>
                    </DialogHeader>
                    <div className="w-full">
                        <QuizResults
                            result={selectedQuiz}
                            onStartNew={() => router.push("/interview-test-quiz/mock")}
                            hideStartNew
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default QuizList;