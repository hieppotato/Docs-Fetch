export function renderContent(blocks) {
    const listStack = [];
    const result = [];
  
    blocks.forEach((block, index) => {
      if (block.paragraph) {
        const { elements, paragraphStyle, bullet } = block.paragraph;
        const alignment = paragraphStyle?.alignment?.toLowerCase() || "left";
        const namedStyle = paragraphStyle?.namedStyleType;
        const isList = !!bullet;
  
        const Tag = getTagFromStyle(namedStyle, isList);
  
        const children = elements.map((el, i) => {
          const text = el.textRun?.content || "";
          const style = el.textRun?.textStyle || {};
          const link = style.link?.url;
  
          const spanStyle = {
            fontWeight: style.bold ? "bold" : undefined,
            fontStyle: style.italic ? "italic" : undefined,
            textDecoration: style.underline ? "underline" : undefined,
            fontSize: style.fontSize?.magnitude
              ? `${style.fontSize.magnitude}px`
              : undefined,
            fontFamily: style.fontFamily || undefined,
            color: style.foregroundColor?.color?.rgbColor
              ? rgbToHex(style.foregroundColor.color.rgbColor)
              : undefined,
          };
  
          const content = (
            <span key={i} style={spanStyle}>
              {text}
            </span>
          );
  
          return link ? (
            <a key={i} href={link} target="_blank" rel="noopener noreferrer">
              {content}
            </a>
          ) : (
            content
          );
        });
  
        if (isList) {
          const listId = bullet.listId;
          const prev = listStack[listStack.length - 1];
          if (!prev || prev.id !== listId) {
            const listType = getListTag(bullet.nestingLevel); // ul / ol
            const newList = { id: listId, tag: listType, items: [] };
            listStack.push(newList);
          }
  
          listStack[listStack.length - 1].items.push(
            <li key={index} style={{ textAlign: alignment }}>
              {children}
            </li>
          );
        } else {
          result.push(
            <Tag key={index} style={{ textAlign: alignment }}>
              {children}
            </Tag>
          );
        }
      }
    });
  
    listStack.forEach((list, i) => {
      const ListTag = list.tag;
      result.push(
        <ListTag key={`list-${i}`} className="pl-6 my-2 list-inside">
          {list.items}
        </ListTag>
      );
    });
  
    return result;
  }
  
  function getTagFromStyle(namedStyle, isList) {
    if (isList) return "li";
    switch (namedStyle) {
      case "TITLE":
        return "h1";
      case "SUBTITLE":
        return "h2";
      case "HEADING_1":
        return "h2";
      case "HEADING_2":
        return "h3";
      case "HEADING_3":
        return "h4";
      default:
        return "p";
    }
  }
  
  function getListTag(nestingLevel) {
    return nestingLevel % 2 === 0 ? "ul" : "ol";
  }
  
  function rgbToHex(rgb) {
    const r = Math.round((rgb.red || 0) * 255);
    const g = Math.round((rgb.green || 0) * 255);
    const b = Math.round((rgb.blue || 0) * 255);
    return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
  }
  