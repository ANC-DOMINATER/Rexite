"use client";

import {useEffect, useState} from "react";
import {format} from "date-fns";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {GitCommitVertical} from "lucide-react";
import {ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart";
import {CartesianGrid, Line, LineChart, XAxis, YAxis} from "recharts";

function PerformanceChart({assessments}) {
    const [chartData, setChartData] = useState([])

    useEffect(() => {
        if (assessments) {
            const formattedData = assessments.map((assessment) => ({
                data: format(new Date(assessment.createdAt), "MMM dd"),
                score: assessment.quizScore,
            }));
            setChartData(formattedData);
        }
    }, [assessments]);
    const chartConfig = {
        desktop: {
            label: "date",
            color: "#ffffff",
        },
        mobile: {
            label: "score",
            color: "#c6c6c6",
        },
    }
    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle className="text-3xl md:text-4xl gradient-title">Performance Trend</CardTitle>
                <CardDescription>You Quiz score Over Time</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[350px]">
                    <ChartContainer config={chartConfig} className="h-[350px] w-full">
                        <LineChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                left: 12,
                                right: 12,
                            }}
                        >
                            <CartesianGrid vertical={true} />
                            <XAxis
                                dataKey="date"
                                tickLine={true}
                                axisLine={true}
                                tickMargin={8}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <YAxis domain={[0, 100]} />

                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Line
                                dataKey="score"
                                type="natural"
                                stroke="var(--color-desktop)"
                                strokeWidth={2}
                                dot={{
                                    fill: "var(--color-desktop)",
                                }}
                                activeDot={{
                                    r: 6,
                                }}
                            />
                        </LineChart>
                    </ChartContainer>
                </div>
            </CardContent>

        </Card>

    );
}

export default PerformanceChart;
