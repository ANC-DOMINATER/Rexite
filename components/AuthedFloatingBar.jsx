"use client";

import { SignedIn } from '@clerk/nextjs';
import FloatingBar from '@/components/Home/floating-bar';

export default function AuthedFloatingBar() {
    return (
        <SignedIn>
            <FloatingBar />
        </SignedIn>
    );
}