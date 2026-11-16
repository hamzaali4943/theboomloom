import { PatternStudioScreen } from '@/screens/PatternStudioScreen';

export default function TwillTab() {
  return (
    <PatternStudioScreen
      patternType="twill"
      patternIndex={1}
      title="2/2 twill"
      subtitle="diagonal rib"
      hint="basic pattern: 1, 2, 3, 4"
    />
  );
}
