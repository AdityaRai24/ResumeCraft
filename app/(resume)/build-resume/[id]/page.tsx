"use client";
import { useParams } from "next/navigation";
import React from "react";
import ResumeBuilderLayout from "./layout";

const page = () => {

  const params = useParams();
  console.log(params);

  return <>
    <ResumeBuilderLayout>
        <div>hello</div>
    </ResumeBuilderLayout>
  </>;
};

export default page;
