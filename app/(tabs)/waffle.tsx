import { PatternStudioScreen } from '@/screens/PatternStudioScreen';

export default function WaffleTab() {
  return (
    <PatternStudioScreen
      patternType="waffle"
      patternIndex={3}
      title="waffle"
      subtitle="dimensional cells"
      hint="basic pattern: 1, 2, 3, 4, 3, 2, 1"
    />
  );
}
