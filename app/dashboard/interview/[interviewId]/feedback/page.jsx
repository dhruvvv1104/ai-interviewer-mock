"use client";

import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

function Feedback({ params }) {
  const [feedbackList, setFeedbackList] = useState([]);
  const router = useRouter();
  const [overallRating, setOverallRating] = useState(0); // Initialize to 0

  useEffect(() => {
    const GetFeedback = async () => {
      const result = await db.select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, params.interviewId))
        .orderBy(UserAnswer.id);

      console.log(result); // Optional: Log results for debugging
      setFeedbackList(result);

      // Calculate and set overall rating after fetching feedback
      const ratings = result.map((item) => item.rating); // Extract ratings
      const averageRating = Math.min(
        ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length,
        10
      ); // Calculate capped average (max 10)
      setOverallRating(averageRating);
    };

    GetFeedback();
  }, [params]); // Ensure useEffect runs only on params change

  const handleGoHome = () => {
    setOverallRating(0); // Reset overall rating on go back
    router.replace('/dashboard');
  };

  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold text-green-500">Congratulations!</h2>
      <h2 className="font-bold text-2xl">Here is your interview feedback</h2>
      <h2 className="text-primary text-lg my-3">
        Your overall interview rating: <strong>{overallRating}/10</strong>
      </h2>
      <h2 className="text-sm text-gray-500">
        Find below the interview question with the correct answer, Your answer and
        feedback for improvement
      </h2>

      {feedbackList &&
        feedbackList.map((item, index) => (
          <Collapsible key={index} className="mt-7">
            <CollapsibleTrigger className="p-2 bg-secondary rounded-lg flex justify-between my-2 text-left gap-7 w-full">
              {item.question} <ChevronsUpDown className="h-5 w-5" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="flex flex-col gap-2">
                <h2 className="text-red-500 p-2 border rounded-lg">
                  <strong>Rating:</strong>{item.rating}
                </h2>
                <h2 className="p-2 border rounded-lg bg-red-50 text-sm text-red-900">
                  <strong>Your Answer: </strong>{item.userAns}
                </h2>
                <h2 className="p-2 border rounded-lg bg-green-50 text-sm text-green-900">
                  <strong>Correct Answer: </strong>{item.correctAns}
                </h2>
                <h2 className="p-2 border rounded-lg bg-blue-50 text-sm text-primary">
                  <strong>Feedback: </strong>{item.feedback}
                </h2>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}

      <Button onClick={handleGoHome}>Go Home</Button>
    </div>
  );
}

export default Feedback;
