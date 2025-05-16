"use client";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {useEffect, useState} from "react";
import {generateQuiz} from "@/actions/interview";
import useFetch from "@/hooks/use-fetch";
import {Button} from "@/components/ui/button";
import {BarLoader, MoonLoader} from "react-spinners";
import {Label} from "@/components/ui/label"
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group"
import {toast} from "sonner";
import QuizResults from "@/app/(main)/interview-test-quiz/_components/quiz-results";
import { saveQuizResult } from "@/actions/interview";

const Quiz = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [showExplanation, setShowExplanation] = useState(false);

    const {
        loading: generatingQuiz,
        fn: generateQuizFn,
        data: quizData,
    } = useFetch(generateQuiz)

    const {
        loading: savingResult,
        fn : saveQuizResultFn,
        data: resultData,
        setData : setResultData,
    } = useFetch(saveQuizResult)

    useEffect(() => {
        if (quizData) {
            setAnswers(new Array(quizData.length).fill(null))
        }
    }, [quizData])

    const handleAnswer = (answer) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = answer;
        setAnswers(newAnswers);
    }

    const handleNext = () => {
        if(currentQuestion < quizData.length -1){
            setCurrentQuestion(currentQuestion + 1);
            setShowExplanation(false);
        }else{
            finishQuiz();
        }
    }

    const calculateScore = () => {
        let correct = 0;
        answers.forEach((answer,index) =>{
            if (answer === quizData[index].correctAnswer) {
                correct++;
            }
        });
        return (correct / quizData.length) * 100;
    }

    const finishQuiz = async () => {
        const score = calculateScore();

        try {
            await saveQuizResultFn(quizData,answers,score)
            toast.success("Quiz Completed Successfully")
        }catch (error) {
            toast.error(error.message || "Failed to save quiz results");
        }
    };

    const startNewQuiz = () => {
        setCurrentQuestion(0);
        setAnswers([0]);
        setShowExplanation(false);
        setResultData(null);
        generateQuizFn();
    }


    if (generatingQuiz) {
        return <BarLoader className="mt-4" width={"100%"} color="grey"/>
    }

    if (resultData){
        return (
            <div className="mx-2">
                <QuizResults result={resultData} onStartNew={startNewQuiz} />
            </div>
        )
    }

    if (!quizData) {
        return (
            <Card className="bg-background">
                <CardHeader>
                    <CardTitle>Ready to Test your Knowledge</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        This quiz contains 10 questions specific to your industry and skills. Take your time and choose
                        the right answer for each question
                    </p>
                </CardContent>
                <CardFooter>
                    <Button className='w-full' onClick={generateQuizFn}>Start Quiz</Button>
                </CardFooter>
            </Card>
        )
    }

    const question = quizData[currentQuestion];

    return (
        <Card className="bg-background">
            <CardHeader>
                <CardTitle>
                    Question {currentQuestion + 1} of {quizData.length}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-lg font-medium">
                    {question.question}
                </p>

                <RadioGroup defaultValue="space-y-2"
                            onValueChange={handleAnswer}
                            value={answers[currentQuestion]}
                >
                    {question.options.map((option, index) => {
                        return (
                            <div className="flex items-center space-x-2" key={index}>
                                <RadioGroupItem value={option} id={`option-${index}`}/>
                                <Label htmlFor={`option-${index}`}>{option}</Label>
                            </div>
                        );
                    })}
                </RadioGroup>

                {showExplanation && (
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                        <p className="font-medium">Explanation</p>
                        <p className="text-muted-foreground">{question.explanation}</p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between">
                {!showExplanation && (
                    <Button variant="outline"
                            onClick={() => setShowExplanation(true)}
                            disabled={!answers[currentQuestion]}
                    >
                        Show Explanation
                    </Button>
                )}

                <Button
                    variant="outline"
                    onClick={handleNext}
                    disabled={!answers[currentQuestion] || savingResult}
                    className="ml-auto"
                    style={{ backgroundColor: "white", borderColor: "#e5e7eb" , color: "black"}}
                >
                    {savingResult && <MoonLoader size={16} color="black" className="mr-2 mt-2 mb-2" />}
                    {currentQuestion < quizData.length - 1 ? "Next Question" : "Finish Quiz"}
                </Button>
            </CardFooter>
        </Card>
    );
}

export default Quiz;
