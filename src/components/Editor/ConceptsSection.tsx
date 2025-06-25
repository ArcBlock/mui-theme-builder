import { ConceptMenu } from '../Header/ConceptMenu';

// 作为 Section 包装，便于在 Editor 中复用
export default function ConceptsSection() {
  return (
    <div className="concepts-section">
      <ConceptMenu />
    </div>
  );
}
