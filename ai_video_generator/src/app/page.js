import { Button } from "@/components/ui/button.jsx";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h2>hello world</h2>
      <UserButton/>
    </div>
  );
}
