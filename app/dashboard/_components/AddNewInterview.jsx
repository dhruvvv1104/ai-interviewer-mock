"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { chatSession } from '@/utils/GeminiAIModel'
import { LoaderCircle } from 'lucide-react'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { useRouter } from 'next/navigation'

  
function AddNewInterview() {
    const [openDailog,setOpenDailog] = useState(false)
    const [ExecutiveDepartment,setExecutiveDepartment] = useState();
    const [PastExperiences,setPastExperiences] = useState();
    const [WhyGDSC,setWhyGDSC] = useState();
    const [loading,setLoading] = useState(false);
    const [jsonResponse, setJsonResponse] = useState([]);
    const router = useRouter();
    const {user} = useUser();

    const onSubmit= async(e)=> {

        setLoading(true)
        e.preventDefault()
        console.log(ExecutiveDepartment, PastExperiences, WhyGDSC);
        

        const InputPrompt= "Executive Department: "+ExecutiveDepartment+", Past Experience: "+PastExperiences+", Depends on this information give me 2 interview question with Answers in json format, give Question and Answerers as field in JSON"
        
        const result = await chatSession.sendMessage(InputPrompt);
        const MockJsonResp = (result.response.text()).replace('```json','').replace('```','')
        console.log(JSON.parse(MockJsonResp))
        setJsonResponse(MockJsonResp);

        if(MockJsonResp){
        const resp = await db.insert(MockInterview)
        .values({
            mockId:uuidv4(),
            jsonMockResp:MockJsonResp,
            ExecDepartment:ExecutiveDepartment,
            PastExperiences:PastExperiences,
            WhyGDSC:WhyGDSC,
            createdBy:user?.primaryEmailAddress?.emailAddress,
            createdAt:moment().format('DD-MM-YYYY')
            
        }).returning({mockId:MockInterview.mockId})

        console.log("Inserted ID:", resp)
        if(resp)
        {
            setOpenDailog(false);
            router.push('/dashboard/interview/'+resp[0]?.mockId)
        }
    }
    else{
        console.log("ERROR");
    }
        setLoading(false);
    
    }

  return (
    <div>
        <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
            onClick={()=> setOpenDailog(true)}>
            <h2 className='font-bold text-lg text-center'>+ Add New</h2>

        </div>
        <Dialog open={openDailog}>
        
        <DialogContent className = "max-w-2xl">
            <DialogHeader>
            <DialogTitle className='text-2xl'>Tell us more about why you're applying </DialogTitle>
            <DialogDescription>
            <form onSubmit={onSubmit}>
            <div>
                <h2> Add Details about executive department, past experiences, why GDSC </h2>
                

                <div className='mt-7 my-2'>
                    <label>Executive Department</label>
                    <Input placeholder = "Ex. Web Development" required onChange ={(event)=>setExecutiveDepartment(event.target.value)}/>
                </div>
        
                <div className='my-3'>
                    <label>Past Experiences (In Short)</label>
                    <Textarea placeholder = "Ex. Any projects/internships/" onChange ={(event)=>setPastExperiences(event.target.value)}/>
                </div>

                <div className='my-3'>
                    <label>Why GDSC? (In Short)</label>
                    <Textarea placeholder = " " max="100" onChange ={(event)=>setWhyGDSC(event.target.value)}/>
                </div>

            
            </div>    

                <div className='flex gap-5 justify-end'>
                    <Button type="button" variant="ghost" onClick={()=> setOpenDailog(false)}>Cancel</Button>
                    <Button type="submit" disabled={loading} >
                        {loading? 
                        <>
                        <LoaderCircle className='animate-spin'/>'Generating from AI' </>: "Start Interview"}
                        
                        </Button>
                </div>
                </form>
            </DialogDescription>
            </DialogHeader>
        </DialogContent>
        </Dialog>

    </div>
  )
}

export default AddNewInterview