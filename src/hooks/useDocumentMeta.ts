import { useEffect } from 'react';
import { CONFIG } from '@/lib/config';

function setMeta(selector: string, attr: string, value: string): void {
  const node = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(selector);
  if (node) node.setAttribute(attr, value);
}

/** Title / description / canonical для страниц SPA. */
export function useDocumentMeta(title: string, description: string, path = '/'): void {
  useEffect(() => {
    document.title = title;
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('link[rel="canonical"]', 'href', `${CONFIG.siteUrl}${path}`);
    setMeta('meta[property="og:url"]', 'content', `${CONFIG.siteUrl}${path}`);
  }, [title, description, path]);
}
