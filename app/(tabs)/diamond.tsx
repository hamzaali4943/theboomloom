import { PatternStudioScreen } from '@/screens/PatternStudioScreen';

export default function DiamondTab() {
  return (
    <PatternStudioScreen
      patternType="diamond"
      patternIndex={2}
      title="diamond"
      subtitle="mirrored twill pattern"
      hint="1 + 3 makes plain weave, 2 + 4 make floats"
    />
  );
}
