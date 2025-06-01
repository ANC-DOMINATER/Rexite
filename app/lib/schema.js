import {z} from "zod";

export const onboardingSchema = z.object({
    industry: z.string({
        required_error: "Please select an industry",
    }),
    subIndustry: z.string({
        required_error: "Please select a sub-industry",
    }),
    bio: z.string({
        required_error: "Please add a bio",
    }),
    experience: z
        .string()
        .transform((val) => parseInt(val, 10))
        .pipe(
            z
                .number()
                .min(0, "Experience must be a least 0 years")
                .max(50, "Experience must be less than 50 years")
        ),

    skills: z.string().transform((val) =>
        val
            ? val
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean)
            : undefined
    )
});

export const contactSchema = z.object({
    email: z.string().email("Invalid email address"),
    mobile: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
});

export const entrySchema = z.object({
    title: z.string().min(1, "Title is required"),
    organization: z.string().min(1, "Organization is required"),
    startDate: z.string().min(1, "Start Date is required"),
    endDate: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    current: z.boolean().default(false),
}).refine((data) => {
        if (!data.current && !data.endDate) {
            return false;
        }
        return true;
    },
    {
        message: "End Date is required unless this is your current job position",
        path: ["endDate"],
    }
);

export const resumeSchema = z.object({
    contactInfo: contactSchema,
    summary: z.string().min(1, "Professional Summary is required"),
    skills: z.string().min(1, "Skills are required"),
    experience: z.array(entrySchema),
    education: z.array(entrySchema),
    projects: z.array(entrySchema),
});


export const coverLetterSchema = z.object({
    companyName: z.string().min(1, "Company name is required"),
    jobTitle: z.string().min(1, "Job title is required"),
    jobDescription: z.string().min(1, "Job description is required"),
});