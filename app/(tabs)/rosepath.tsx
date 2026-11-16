import { PatternStudioScreen } from '@/screens/PatternStudioScreen';

export default function RosepathTab() {
  return (
    <PatternStudioScreen
      patternType="rosepath"
      patternIndex={4}
      title="rosepath"
      subtitle="diamond motif"
      hint="basic pattern: 1, 2, 3, 4, 3, 2, 1"
    />
  );
}