export const highlightText = (text, glossary) => {
    return text.split(" ").map((word) => {
      const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toUpperCase();
      if (glossary[cleanWord]) {
        return (
          <span key={word} className="highlight" data-tip={glossary[cleanWord]}>
            {word}
          </span>
        );
      }
      return `${word} `;
    });
  };
  