"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, User } from 'lucide-react'
import { toast } from 'sonner'
import { chatSession } from '@/utils/GeminiAIModel'
import { UserAnswer } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { db } from '@/utils/db'


function RecordAnswerSection({mockInterviewQuestion,activeQuestionIndex, interviewData}) {
    const[userAnswer,setUserAnswer]= useState('');
    const {user} = useUser();
    const [loading,setLoading] = useState(false);
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

    useEffect(()=>{
        let finalAns = '';
        results.forEach((result) => {
            finalAns += result?.transcript;
        });
        setUserAnswer(finalAns);
    },[results])

    useEffect(()=>{
        if(!isRecording && userAnswer.length>10)
        {
            UpdateUserAnswer();
        }
    },[userAnswer, isRecording])

    const StartStopRecording =async()=>{
        if(isRecording)
        {
            stopSpeechToText()
        }
        else{
            startSpeechToText();
        }
    }

    const UpdateUserAnswer=async()=>{
        console.log(userAnswer)
        setLoading(true)
        const feedbackPrompt = "Question:"+ mockInterviewQuestion[activeQuestionIndex]?.question +
            ", User Answer:"+ userAnswer+ ",Depends on question and user answer for given interview question "+
            "please give us a rating for the answer and feedback as area of improvement if any, also provide rating out of 5, it's okay if the answers are not very detailed" +
            " in just 1-2 lines to improve it. Ensure the response is a standard JSON object containing exactly two fields: 'rating' and 'feedback'. Do NOT return an array.";

            const result = await chatSession.sendMessage(feedbackPrompt);

            const mockJsonResp = (result.response.text()).replace('```json','').replace('```','');
            console.log(mockJsonResp);
            let JsonFeedbackResp = JSON.parse(mockJsonResp);

            if (Array.isArray(JsonFeedbackResp)) {
                JsonFeedbackResp = JsonFeedbackResp[0];
            }

            try {
                const resp = await db.insert(UserAnswer)
                .values({
                    mockIdRef:interviewData?.mockId,
                    question:mockInterviewQuestion[activeQuestionIndex]?.question,
                    correctAns:mockInterviewQuestion[activeQuestionIndex]?.answer,
                    userAns:userAnswer,
                    feedback:JsonFeedbackResp?.feedback,
                    rating: String(JsonFeedbackResp?.rating),
                    userEmail:user?.primaryEmailAddress?.emailAddress,
                    createdAt:moment().format('DD-MM-yyyy')
                })
                if(resp)
                {
                    toast("User Answer Recorded Successfully");
                    setUserAnswer('');
                    setResults([]);
                }
            } catch (error) {
                console.error("Error inserting answer to database:", error);
                toast("Error recording answer");
            } finally {
                setResults([]);
                setLoading(false);
            }
        }

  return (
    <div className = "flex items-center justify-center flex-col">
      <div className = 'flex flex-col my-20 justify-center items-center bg-black rounded-lg p-5'>
          <Webcam
          mirrored={true}
          style={{
            height: 330,
            width: '100%',
            zIndex:10,

          }}
          />
          

      </div>
      <Button disabled ={loading} variant="outline" className="my-1" onClick={StartStopRecording}
      >
        {isRecording?
        <h2 className='text-red-500 flex gap-2'>
            <Mic/>'Stop Recording'
        </h2>

        :

        'Record Answer'}</Button>


    </div>
      
  )
}

export default RecordAnswerSection
