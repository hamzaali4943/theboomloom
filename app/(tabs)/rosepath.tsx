import { PatternStudioScreen } from '@/screens/PatternStudioScreen';

// patternIndex must match ROSEPATH's position in PATTERN_ROWS
// (pattern-data.ts): [PLAIN, TWILL, DIAMOND, WAFFLE, ROSEPATH] -> 4.
// TypeScript cannot catch a wrong index here — any PatternIndex compiles.
export default function RosepathTab() {
  return (
    <PatternStudioScreen
      patternType="rosepath"
      patternIndex={4}
      title="rosepath"
      subtitle="stepping diamond motif"
    />
  );
}
