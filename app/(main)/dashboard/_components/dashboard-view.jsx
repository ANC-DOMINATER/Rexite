"use client";

import { Badge } from "@/components/ui/badge";
import { format, formatDistanceToNow } from "date-fns";
import { Brain, Briefcase, LineChart, TrendingDown, TrendingUp } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "#d4d4d4",
        color1: "#ffffff",
    },
    mobile: {
        label: "Mobile",
        color: "#8f8f8f",
    },
}


const DashboardView = ({ insights }) => {
    const salaryData = insights.salaryRanges.map((range) => ({
        name: range.role,
        min: range.min / 1000,
        max: range.max / 1000,
        median: range.median / 1000,
    }))

    const getDemandLevelColor = (level) => {
        switch (level) {
            case "HIGH":
                return "bg-green-500";
            case "MEDIUM":
                return "bg-yellow-500";
            case "LOW":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    };

    const getMarketOutlookInfo = (outlook) => {

        switch (outlook.toUpperCase()) {
            case "POSITIVE":
                return { icon: TrendingUp, color: "text-green-500" }
            case "NEUTRAL":
                return { icon: LineChart, color: "text-yellow-500" }
            case "NEGATIVE":
                return { icon: TrendingDown, color: "text-red-500" }
            default:
                return { icon: LineChart, color: "text-grey-500" }

        }

    };

    const OutlookIcon = getMarketOutlookInfo(insights.marketOutlook).icon;
    const OutlookColor = getMarketOutlookInfo(insights.marketOutlook).color;
    const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");
    const nextUpdatedDate = formatDistanceToNow(
        new Date(insights.nextUpdate),
        { addSuffix: true }
    )




    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Badge variant="outline" >Last Updated Date : {lastUpdatedDate} </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-medium font-semibold">Market Outlook</CardTitle>
                        <OutlookIcon className={`h-4 w-4 ${OutlookColor}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-semibold">{insights.marketOutlook}</div>
                        <p className="text-xs text-muted-foreground">Next Update {nextUpdatedDate} </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-medium font-semibold">Industry Growth</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-semibold">
                            {insights.growthRate.toFixed(1)}%
                        </div>
                        <Progress value={insights.growthRate} className="mt-2" />


                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-medium font-semibold">Demand Level</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-semibold">{insights.demandLevel}</div>
                        <div
                            className={`h-2 w-full rounded-full ${getDemandLevelColor(insights.demandLevel)}`}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-medium font-semibold">Top Skills</CardTitle>
                        <Brain className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {insights.topSkills.map((skill) => (
                                <Badge key={skill} variant="secondary">
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader >
                    <CardTitle >Top Skills</CardTitle>
                    <CardDescription>
                        Displaying minimum , median and maximum salaries (in Thousands)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                        <BarChart accessibilityLayer data={salaryData}>
                            <CartesianGrid vertical={true} />
                            <XAxis
                                dataKey="name"
                                tickLine={true}
                                tickMargin={10}
                                axisLine={true}
                                tickFormatter={(value) => value.slice(0, 30)}
                                className="text-s font-semibold text-muted-foreground"
                            />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="min" fill="#8f8f8f" radius={4} name="Min Salary (k)" />
                            <Bar dataKey="median" fill="#d4d4d4" radius={4} name="MedianSalary (k)" />
                            <Bar dataKey="max" fill="#ffffff" radius={4} name="Max Salary (k)" />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
                <Card>
                    <CardHeader >
                        <CardTitle >Key Industry Trends </CardTitle>
                        <CardDescription>
                            Current  Trends shaping the Industry
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                         {insights.keyTrends.map((trend, index) => (
                            <li key={index} className="flex items-start space-x-2">
                                <div className="h-2 w-4 mt-2 rounded-full bg-primary" />
                                <span> {trend} </span>
                            </li>
                         ))}
                        </ul>

                    </CardContent>
                </Card>

                <Card>
                    <CardHeader >
                        <CardTitle >Recommended Skills </CardTitle>
                        <CardDescription>
                            Skills to consider for the future
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-4 ">
                        { insights.recommendedSkills.map((skill) =>{
                            return(
                                <Badge key={skill} variant="outline" className="text-1xl text-s" >
                                    {skill}
                                </Badge>

                            )
                        }) }

                      </div>
                    </CardContent>
                </Card>
            </div>

        </div>
    )
}

export default DashboardView;
