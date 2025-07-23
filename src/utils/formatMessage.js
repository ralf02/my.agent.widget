import React from 'react';

// Common image extensions to detect
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
const IMAGE_URL_REGEX = new RegExp(
  `(https?:\\/\\/.*\\.(${IMAGE_EXTENSIONS.join('|')})(?:[?\\w=]*)?)`, 
  'gi'
);

// Markdown regex patterns
const MARKDOWN = {
  bold: /\*\*(.*?)\*\*/g,
  italic: /\*(.*?)\*|_(.*?)_/g,
  code: /`([^`]+)`/g,
  codeBlock: /```(?:\w+\n)?([\s\S]*?)```/g,
  newLine: /\n/g,
};

/**
 * Check if a URL points to an image
 * @param {string} url - The URL to check
 * @returns {boolean} - True if the URL points to an image
 */
const isImageUrl = (url) => {
  if (!url) return false;
  return IMAGE_EXTENSIONS.some(ext => 
    url.toLowerCase().endsWith(`.${ext}`) || 
    url.toLowerCase().includes(`.${ext}?`)
  );
};

/**
 * Process text with markdown formatting
 * @param {string} text - The text to process
 * @returns {Array} - Array of React elements and strings
 */
const processMarkdown = (text) => {
  if (!text) return [];
  
  // First, handle code blocks
  const parts = [];
  let lastIndex = 0;
  let match;
  
  // Process code blocks first
  while ((match = MARKDOWN.codeBlock.exec(text)) !== null) {
    // Add text before the code block
    if (match.index > lastIndex) {
      parts.push(...processInlineMarkdown(text.substring(lastIndex, match.index)));
    }
    
    // Add the code block
    parts.push(
      <pre key={`code-${match.index}`} className="message-code-block">
        <code>{match[1]}</code>
      </pre>
    );
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text after the last code block
  if (lastIndex < text.length) {
    parts.push(...processInlineMarkdown(text.substring(lastIndex)));
  }
  
  return parts.length > 0 ? parts : [...processInlineMarkdown(text)];
};

/**
 * Process inline markdown (bold, italic, code)
 * @param {string} text - The text to process
 * @returns {Array} - Array of React elements and strings
 */
const processInlineMarkdown = (text) => {
  if (!text) return [];
  
  const parts = [];
  let lastIndex = 0;
  let match;
  
  // Process bold text
  while ((match = MARKDOWN.bold.exec(text)) !== null) {
    // Add text before the bold section
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    
    // Add the bold text
    parts.push(<strong key={`bold-${match.index}`}>{match[1]}</strong>);
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text after the last bold section
  let remainingText = lastIndex < text.length ? text.substring(lastIndex) : '';
  lastIndex = 0;
  
  // Process italic text
  while ((match = MARKDOWN.italic.exec(remainingText)) !== null) {
    // Add text before the italic section
    if (match.index > lastIndex) {
      parts.push(remainingText.substring(lastIndex, match.index));
    }
    
    // Add the italic text (match[1] for *text*, match[2] for _text_)
    const italicText = match[1] || match[2];
    parts.push(<em key={`italic-${match.index}`}>{italicText}</em>);
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text after the last italic section
  remainingText = lastIndex < remainingText.length ? remainingText.substring(lastIndex) : '';
  lastIndex = 0;
  
  // Process inline code
  while ((match = MARKDOWN.code.exec(remainingText)) !== null) {
    // Add text before the code section
    if (match.index > lastIndex) {
      parts.push(remainingText.substring(lastIndex, match.index));
    }
    
    // Add the code
    parts.push(<code key={`code-${match.index}`} className="message-inline-code">{match[1]}</code>);
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add any remaining text
  if (lastIndex < remainingText.length) {
    parts.push(remainingText.substring(lastIndex));
  }
  
  return parts.length > 0 ? parts : [text];
};

/**
 * Formats message text to handle markdown-like syntax for links, images, and line breaks
 * @param {string} text - The message text to format
 * @returns {JSX.Element} - A React fragment with the formatted message
 */
export const formatMessage = (text) => {
  if (!text) return null;

  // Check for code blocks first
  if (MARKDOWN.codeBlock.test(text)) {
    return (
      <div className="message-content">
        {processMarkdown(text)}
      </div>
    );
  }

  // Split text by lines for regular processing
  const lines = text.split('\n');
  
  return (
    <>
      {lines.map((line, i) => {
        // Skip empty lines
        if (!line.trim() && i > 0 && i < lines.length - 1) {
          return <br key={`br-${i}`} />;
        }
        
        // First, check if the whole line is just an image URL
        const trimmedLine = line.trim();
        if (isImageUrl(trimmedLine)) {
          return (
            <div key={`img-${i}`} className="message-image-container">
              <img 
                src={trimmedLine} 
                alt="Imagen del chat" 
                className="message-image"
                onError={(e) => {
                  // Fallback to link if image fails to load
                  e.target.outerHTML = `<a href="${trimmedLine}" target="_blank" rel="noopener noreferrer">${trimmedLine}</a>`;
                }}
              />
            </div>
          );
        }

        // Handle markdown-style links [text](url) and detect image URLs
        const linkRegex = /\[(.*?)\]\((https?:\/\/[^\s)]+)\)/g;
        const parts = [];
        let lastIndex = 0;
        let match;
        
        // Process each line for markdown links and image URLs
        const processText = (text) => {
          if (!text) return [];
          
          const result = [];
          let lastPos = 0;
          let imgMatch;
          
          // Find all image URLs in the text
          while ((imgMatch = IMAGE_URL_REGEX.exec(text)) !== null) {
            // Add text before the image with markdown processing
            if (imgMatch.index > lastPos) {
              const beforeText = text.substring(lastPos, imgMatch.index);
              result.push(...processMarkdown(beforeText));
            }
            
            // Add the image
            const imgUrl = imgMatch[0];
            result.push(
              <div key={`img-${imgMatch.index}`} className="message-image-container">
                <img 
                  src={imgUrl}
                  alt="Imagen del chat" 
                  className="message-image"
                  onError={(e) => {
                    // Fallback to link if image fails to load
                    e.target.outerHTML = `<a href="${imgUrl}" target="_blank" rel="noopener noreferrer">${imgUrl}</a>`;
                  }}
                />
              </div>
            );
            
            lastPos = imgMatch.index + imgMatch[0].length;
          }
          
          // Add remaining text after the last image with markdown processing
          if (lastPos < text.length) {
            const remainingText = text.substring(lastPos);
            result.push(...processMarkdown(remainingText));
          }
          
          return result.length > 0 ? result : [...processMarkdown(text)];
        };
        
        // Process markdown links first
        while ((match = linkRegex.exec(line)) !== null) {
          // Add text before the match
          if (match.index > lastIndex) {
            const beforeText = line.substring(lastIndex, match.index);
            parts.push(...processText(beforeText));
          }
          
          // Check if the link is an image
          if (isImageUrl(match[2])) {
            const imageUrl = match[2];
            const altText = match[1] || 'Imagen del chat';
            
            parts.push(
              <div key={`img-${i}-${match.index}`} className="message-image-container">
                <img 
                  src={imageUrl} 
                  alt={altText}
                  className="message-image"
                  onError={(e) => {
                    // Fallback to link if image fails to load
                    e.target.outerHTML = `<a href="${imageUrl}" target="_blank" rel="noopener noreferrer">${altText || imageUrl}</a>`;
                  }}
                />
              </div>
            );
          } else {
            // Add regular link
            parts.push(
              <a 
                key={`link-${i}-${match.index}`} 
                href={match[2]} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#007bff', textDecoration: 'underline' }}
              >
                {match[1] || match[2]}
              </a>
            );
          }
          
          lastIndex = match.index + match[0].length;
        }
        
        // Add remaining text after the last match
        if (lastIndex < line.length) {
          const remainingText = line.substring(lastIndex);
          parts.push(...processText(remainingText));
        }
        
        // If no special formatting was applied, use the original line
        const content = parts.length > 0 ? parts : [line];
        
        return (
          <React.Fragment key={`line-${i}`}>
            {content}
            {i < lines.length - 1 && <br />}
          </React.Fragment>
        );
      })}
    </>
  );
};
