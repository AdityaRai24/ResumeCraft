"use client";
import Navbar from "@/components/Navbar";
import React, { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";
import base64 from "base64-encode-file";
import { Button } from "@/components/ui/button";
import axios from "axios";

const page = () => {
  const [fileName, setFileName] = useState("");
  const [base64Data, setBase64Data] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResumeUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      let isValidImage = false;
      let isValidDoc = false;
      const validImages = ["image/png", "image/jpeg", "image/jpg"];
      const validDocs = ["application/pdf"];
      if (validImages.includes(file.type)) {
        isValidImage = true;
      }
      if (validDocs.includes(file.type)) {
        isValidDoc = true;
      }

      if (!(isValidImage || isValidDoc)) {
        toast.error("Invalid file type...");
      }

      if (isValidImage) {
        compressImage(file, async (compressedFile) => {
          let data: any = await base64(compressedFile);
          setBase64Data(data);
        });
      }
      if (isValidDoc) {
        let data: any = await base64(file);
        setBase64Data(data);
      }
    }
  };

  const extractDetails = async () => {
    if (!base64Data) {
      toast.error("Upload a valid report.");
      return;
    }
    

    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:3000/api/extract-resume-data`,
        { base64Data }
      );
      console.log(response.data)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  function compressImage(file: File, callback: (compressedFile: File) => void) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        ctx!.drawImage(img, 0, 0);

        const quality = 0.2;

        const dataURL = canvas.toDataURL("image/jpeg", quality);

        const byteString = atob(dataURL.split(",")[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const compressedFile = new File([ab], file.name, {
          type: "image/jpeg",
        });

        callback(compressedFile);
      };
      img.src = e.target!.result as string;
    };

    reader.readAsDataURL(file);
  }

  return (
    <div>
      <Navbar />

      <div className="flex flex-col items-center mt-8 justify-center">
        <input type="file" onChange={(e) => handleResumeUpload(e)} />
        <Button disabled={loading} onClick={() => extractDetails()}>
          {loading ? "Analysing" : "Start analysis"}
        </Button>
      </div>
    </div>
  );
};

export default page;
