// lib/ats/sanitizer.ts
import sanitizeHtml from "sanitize-html";

/**
 * Sanitizes HTML descriptions using the strict allow-list from Section 11.3 step 3:
 * Allows: p, ul, ol, li, strong, em, a, h2, h3, br
 * Strips: scripts, styles, iframes, inline event handlers, and custom formatting
 */
export function sanitizeJobDescription(rawHtml: string): string {
  if (!rawHtml) return "";

  return sanitizeHtml(rawHtml, {
    allowedTags: ["p", "ul", "ol", "li", "strong", "em", "a", "h2", "h3", "br", "b", "i"],
    allowedAttributes: {
      a: ["href", "rel", "target"],
    },
    transformTags: {
      a: (tagName, attribs) => {
        // Enforce safe external link attributes
        return {
          tagName: "a",
          attribs: {
            ...attribs,
            rel: "noopener noreferrer nofollow",
            target: "_blank",
          },
        };
      },
    },
    disallowedTagsMode: "discard",
  });
}
