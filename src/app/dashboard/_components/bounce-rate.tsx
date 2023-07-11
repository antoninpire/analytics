import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowBottomLeftIcon, FaceIcon } from "@radix-ui/react-icons";

export default async function BounceRate() {
  return (
    <Card className="w-[22vw] h-[200px]">
      <CardHeader>
        <CardTitle className="text-xl">
          <div className="flex items-center justify-between">
            Bounce Rate
            <FaceIcon className="w-6 h-6" />
          </div>
        </CardTitle>
        <CardDescription className="h-[40px]">
          The percentage of users who left your website and exited quickly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">125</p>
        <div className="flex items-center gap-1 text-sm">
          <ArrowBottomLeftIcon className="text-red-500" />
          50%
        </div>
      </CardContent>
    </Card>
  );
}
