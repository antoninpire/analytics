import { Card, CardContent } from "@/components/ui/card";

export default function FirstRowLoader() {
  return (
    <Card className="w-[22vw] h-[200px]">
      <CardContent className="flex justify-center h-full items-center">
        Loading...
      </CardContent>
    </Card>
  );
}
