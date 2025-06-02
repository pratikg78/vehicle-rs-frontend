import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export interface Prediction {
  "Car Make": string;
  "Car Model": string;
  Color: string;
  Price: number;
  Year: number;
}

interface PredictionProps {
  predictions: Prediction[];
}

export default function PredictionResults({ predictions }: PredictionProps) {
  if(!predictions){
    return (
      <div>
        No data found
      </div>
    )
  }
  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Recommended Vehicles</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {predictions.map((car, index) => (
          <Card key={index} className="rounded-2xl shadow-md hover:shadow-lg transition duration-300">
            <CardContent className="p-5 space-y-2">
              <h3 className="text-xl font-semibold text-neutral-800">
                {car["Car Make"]} {car["Car Model"]}
              </h3>
              <Separator />
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary">Color: {car.Color}</Badge>
                <Badge variant="secondary">Year: {car.Year}</Badge>
                <Badge variant="secondary">Price: ${car.Price.toLocaleString()}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
