import { EntropyDemo } from "@/components/ui/entropy-demo";
import { LockViewport } from "@/components/site/lock-viewport";

export const metadata = {
  title: "Entropy — reference demo",
  description: "The original Entropy component, unmodified, on black.",
};

export default function EntropyPage() {
  return (
    <>
      <LockViewport />
      <EntropyDemo />
    </>
  );
}
