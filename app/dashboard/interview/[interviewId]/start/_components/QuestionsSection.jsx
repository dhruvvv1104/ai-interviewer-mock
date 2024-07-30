import { Lightbulb, Volume2 } from 'lucide-react';
import React from 'react'

function QuestionsSection({ mockInterviewQuestion, activeQuestionIndex}) {
  // Check if mockInterviewQuestion is an array and has items
  const hasQuestions = Array.isArray(mockInterviewQuestion) && mockInterviewQuestion.length > 0;
  const textToSpeach=(text)=>{
    if('speechSynthesis' in window){
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech)
    }
    else{
      alert("Sorry, your browser does not support text to speech")
    }
  }
  return mockInterviewQuestion&&(
    <div className='p-4 border rounded-lg my-9'>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
        {hasQuestions ? (
          mockInterviewQuestion.map((question, index) => (
            <h2 className ={`p-2 bg-secondary rounded-md text-xs md:text-lg text-center 
                cursor-pointer ${activeQuestionIndex==index &&'bg-yellow-300 text-white'}`} key={index}>Question #{index + 1}</h2>
          ))
        ) : (
          <p>No questions available</p>
        )}
        
      </div>
      <h2 className='my-2 text-md md:text-lg'>{mockInterviewQuestion[activeQuestionIndex]?.Question}</h2>
      <Volume2 className = 'cursor-pointer'onClick={()=>textToSpeach(mockInterviewQuestion[activeQuestionIndex]?.Question)}/>
      <div className = 'border rounded-lg p-5 bg-blue-100 mt-20'>
          <h2 className = 'flex gap-2 items-center text-primary'>
            <Lightbulb/>
            <strong>Note:</strong>
          </h2>
          <h2 className ='text-sm text-primary my-2'>{process.env.NEXT_PUBLIC_QUESTION_NOTE}</h2>
      </div>
    </div>
  )
}

export default QuestionsSection
