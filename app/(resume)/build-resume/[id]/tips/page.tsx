"use client"
import ContineBtn from '@/components/ContineBtn'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { tipsData } from '@/lib/tipsData'
import { cn } from '@/lib/utils'
import { montserrat } from '@/utils/font'
import { useQuery } from 'convex/react'
import { useParams, useSearchParams } from 'next/navigation'
import React from 'react'

const page = () => {

    const searchParams = useSearchParams()
    const sec = searchParams.get('sec')

    const params = useParams()
    const resumeId = params.id
    const resume = useQuery(api.resume.getTemplateDetails,{
        id:resumeId as Id<"resumes">
    })

    if(resume === null){
        return <div>no document</div>
    }

    if(resume === undefined){
        return <div>loading...</div>
    }

    let sectionArray : string[] = []
    resume?.sections?.map((item)=>(
        sectionArray.push(item.type)
    ))

    const index = sectionArray.findIndex((item)=>item === sec)
    const currentTips = tipsData.find(item => item.sec===sec)

    const nextSection = sectionArray[index]
    const prevSection = sectionArray[index-1] ? sectionArray[index-1] : "header"

  return (
    <div className="flex items-center justify-start max-w-[70%] mx-16">
    <div className="mt-24 flex flex-col gap-4">
      <h2 className="text-lg">  {currentTips?.topText}</h2>
      <h1 className={cn("text-6xl font-extrabold leading-[1.25]",montserrat.className)}>{currentTips?.mainText}</h1>
      <div className="flex items-center gap-5">
        {currentTips?.bottomIcon && <currentTips.bottomIcon size={48}/>}
        <div>
          <h2 className="font-bold text-2xl">{currentTips?.bottomMainText}</h2>
          <p className="font-medium text-xl">
            {currentTips?.bottomText}
          </p>
        </div>
      </div>
      <div className="flex items-center mt-8 justify-between">
        <ContineBtn path={`/build-resume/${resumeId}/section/${prevSection}`} text="Back" type={"outline"} />
        <ContineBtn path={`/build-resume/${resumeId}/section/${nextSection}`} text="Continue" type={"default"} />
      </div>
    </div>
  </div>
  )
}

export default page