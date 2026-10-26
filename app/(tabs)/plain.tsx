import { PatternStudioScreen } from '@/screens/PatternStudioScreen';

export default function PlainTab() {
  return (
    <PatternStudioScreen
      patternType="plain"
      patternIndex={0}
      title="plain weave"
      subtitle="classic over-under"
    />
  );
}
