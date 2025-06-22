"use client"
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea"
function SelectTopic({onUserSelect}) {
  const options=['Custom prompt','Random AI story','Scary story','Historical stories','Bed Time Story','Motivational story','Fun Facts'];
  const [selectedOption,setSelectedOption]= useState();

  return (
    <div>
      <h2 className="font-bold text-2xl text-primary">Content</h2>
      <p className="text-gray-500">What is the topic of your video</p>
      <Select onValueChange={(value)=>{
        setSelectedOption(value);
        onUserSelect('topic',value)
      }}>
        <SelectTrigger className="w-full mt-2 p-6 text-lg">
          <SelectValue placeholder="Content Type" />
        </SelectTrigger>
        <SelectContent>
          {options.map((item,index)=>(
            <SelectItem key={item} value={item}>{item}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {
        selectedOption==="Custom prompt" && <Textarea className='mt-3'
        onChange={(e)=>onUserSelect('topic',e.target.value)}
        placeholder="Enter your custom prompt"/>
      }
    </div>
  );
}

export default SelectTopic;
