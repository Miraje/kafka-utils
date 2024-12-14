// Adapted from: https://microsoftedge.github.io/Demos/custom-highlight-api/
function highlight(text: string) {

  const allTextNodes = [];

  document.querySelectorAll(".highlight-content").forEach((item) => {
    const treeWalker = document.createTreeWalker(item, NodeFilter.SHOW_TEXT);
    let currentNode = treeWalker.nextNode();
    while (currentNode) {
      allTextNodes.push(currentNode);
      currentNode = treeWalker.nextNode();
    }
  });

  // @ts-ignore
  CSS.highlights.clear();
  const str = text.trim().toLowerCase();
  if (!str) {
    return;
  }

  const ranges = allTextNodes
    .map((el) => {
      return {el, text: el.textContent.toLowerCase()};
    })
    .filter(({text}) => text.includes(str))
    .map(({text, el}) => {
      // Find all instances of str in el.textContent
      const indices = [];
      let startPos = 0;
      while (startPos < text.length) {
        const index = text.indexOf(str, startPos);
        if (index === -1) break;
        indices.push(index);
        startPos = index + str.length;
      }

      return indices.map((index) => {
        const range = new Range();
        range.setStart(el, index);
        range.setEnd(el, index + str.length);
        return range;
      });
    });

  const highlight = new Highlight(...ranges.flat());
  // @ts-ignore
  CSS.highlights.set("search-result-highlight", highlight);
}

function clear() {
  // @ts-ignore
  CSS.highlights.clear();
}

export const HighlightUtils = {
  highlight: highlight,
  clear: clear
}
