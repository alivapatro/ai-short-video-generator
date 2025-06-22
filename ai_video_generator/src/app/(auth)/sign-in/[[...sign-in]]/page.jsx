import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation.jsx";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <BackgroundGradientAnimation>
      {/* Optional dark overlay */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Sign-in Box */}
      <div className="relative z-20 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <SignIn />
        </div>
      </div>
    </BackgroundGradientAnimation>
  );
}
