import React, {useEffect, useState} from 'react';
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {entrySchema} from "@/app/lib/schema";
import {Button} from "@/components/ui/button";
import {Loader2, PlusCircle, Sparkles, X} from "lucide-react";
import {Card, CardContent,CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import {ImproveWithAI} from "@/actions/resume";
import {toast} from "sonner";
import {format, parse} from "date-fns";

// Add CSS for date inputs
const dateInputStyles = `
  .date-input {
    cursor: pointer !important;
    padding-right: 30px !important;
    position: relative !important;
  }
  
  .date-input::-webkit-calendar-picker-indicator {
    opacity: 1 !important;
    cursor: pointer !important;
    position: absolute !important;
    right: 8px !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    width: 20px !important;
    height: 20px !important;
    margin: 0 !important;
    z-index: 1 !important;
    background-color: transparent !important;
  }
  
  input[type="month"] {
    appearance: auto !important;
    -webkit-appearance: auto !important;
  }
  
  @media (prefers-color-scheme: dark) {
    .date-input::-webkit-calendar-picker-indicator {
      filter: invert(1) !important;
    }
  }
`;

const formatDisplayDate = (dateString) => {
    if (!dateString) return "";
    const date = parse(dateString, "yyyy-MM", new Date());
    return format(date, "MMM yyyy");
};

export function EntryForm({ type, entries, onChange }) {
    const [isAdding, setIsAdding] = useState(false);

    const {
        register,
        handleSubmit: handleValidation,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm({
        resolver: zodResolver(entrySchema),
        defaultValues: {
            title: "",
            organization: "",
            startDate: "",
            endDate: "",
            description: "",
            current: false,
        },
    });

    const current = watch("current");

    const handleAdd = handleValidation((data) => {
        const formattedEntry = {
            ...data,
            startDate: formatDisplayDate(data.startDate),
            endDate: data.current ? "" : formatDisplayDate(data.endDate),
        };

        onChange([...entries, formattedEntry]);

        reset();
        setIsAdding(false);
    });

    const handleDelete = (index) => {
        const newEntries = entries.filter((_, i) => i !== index);
        onChange(newEntries);
    };

    const {
        loading: isImproving,
        fn: improveWithAIFn,
        data: improvedContent,
        error: improveError,
    } = useFetch(ImproveWithAI);

    // Add this effect to handle the improvement result
    useEffect(() => {
        if (improvedContent && !isImproving) {
            setValue("description", improvedContent);
            toast.success("Description improved successfully!");
        }
        if (improveError) {
            toast.error(improveError.message || "Failed to improve description");
        }
    }, [improvedContent, improveError, isImproving, setValue]);

    // Replace handleImproveDescription with this
    const handleImproveDescription = async () => {
        const description = watch("description");
        const title = watch("title");
        const organization = watch("organization");
        
        if (!description) {
            toast.error("Please enter a description first");
            return;
        }

        await improveWithAIFn({
            current: description,
            type: type.toLowerCase(), // 'experience', 'education', or 'project'
            context: {
                title,
                organization,
                entryType: type
            }
        });
    };

    const handleDateClick = (e) => {
        // Force open the date picker when clicking anywhere on the input
        if (e.target.type === 'month') {
            // Create a MouseEvent for click
            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            
            // Find and click the calendar picker
            const picker = e.target.querySelector('::-webkit-calendar-picker-indicator') || e.target;
            picker.dispatchEvent(clickEvent);
        }
    };

    return (
        <div className="space-y-4">
            <style dangerouslySetInnerHTML={{ __html: dateInputStyles }} />
            <div className="space-y-4">
                {entries.map((item, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {item.title} @ {item.organization}
                            </CardTitle>
                            <Button
                                variant="outline"
                                size="icon"
                                type="button"
                                onClick={() => handleDelete(index)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                {item.current
                                    ? `${item.startDate} - Present`
                                    : `${item.startDate} - ${item.endDate}`}
                            </p>
                            <p className="mt-2 text-sm whitespace-pre-wrap">
                                {item.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {isAdding && (
                <Card>
                    <CardHeader>
                        <CardTitle>Add {type}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Title/Position</label>
                                <Input
                                    placeholder="Title/Position"
                                    {...register("title")}
                                    error={errors.title}
                                />
                                {errors.title && (
                                    <p className="text-sm text-red-500">{errors.title.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Organization/Company</label>
                                <Input
                                    placeholder="Organization/Company"
                                    {...register("organization")}
                                    error={errors.organization}
                                />
                                {errors.organization && (
                                    <p className="text-sm text-red-500">
                                        {errors.organization.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Start Date</label>
                                <Input
                                    type="month"
                                    className="date-input"
                                    {...register("startDate")}
                                    onClick={handleDateClick}
                                    error={errors.startDate}
                                />
                                {errors.startDate && (
                                    <p className="text-sm text-red-500">
                                        {errors.startDate.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">End Date</label>
                                <Input
                                    type="month"
                                    className="date-input"
                                    {...register("endDate")}
                                    onClick={handleDateClick}
                                    disabled={current}
                                    error={errors.endDate}
                                />
                                {errors.endDate && (
                                    <p className="text-sm text-red-500">
                                        {errors.endDate.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="current"
                                {...register("current")}
                                onChange={(e) => {
                                    setValue("current", e.target.checked);
                                    if (e.target.checked) {
                                        setValue("endDate", "");
                                    }
                                }}
                            />
                            <label htmlFor="current">Current {type}</label>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                                placeholder={`Description of your ${type.toLowerCase()}`}
                                className="h-32"
                                {...register("description")}
                                error={errors.description}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleImproveDescription}
                            disabled={isImproving || !watch("description")}
                        >
                            {isImproving ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Improving...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    Improve with AI
                                </>
                            )}
                        </Button>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                reset();
                                setIsAdding(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="button" onClick={handleAdd}>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Entry
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {!isAdding && (
                <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => setIsAdding(true)}
                >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add {type}
                </Button>
            )}
        </div>
    );
}
