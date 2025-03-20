import SnippetItem from './SnippetItem';
import snippets from './snippets';

function SnippetTools() {
  return (
    <>
      {snippets.map((snippet) => (
        <SnippetItem snippet={snippet} key={snippet.title} />
      ))}
    </>
  );
}

export default SnippetTools;
