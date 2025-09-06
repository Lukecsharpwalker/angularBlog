import { Injectable } from '@angular/core';
import hljs from 'highlight.js';

@Injectable({
  providedIn: 'root',
})
export class ContentProcessorService {
  processContent(htmlContent: string): string {
    let processedContent = this.extractAndHighlightHTML(htmlContent);
    processedContent = this.extractAndHighlightTS(processedContent);
    return processedContent;
  }

  insertStringAtIndex(originalString: string, index: number, stringToInsert: string): string {
    return [
      ...originalString.slice(0, index),
      ...stringToInsert,
      ...originalString.slice(index),
    ].join('');
  }

  private extractAndHighlightHTML(htmlContent: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    const codeBlocksHTML = tempDiv.querySelectorAll('pre[data-language="xml"]');
    codeBlocksHTML.forEach(block => {
      const language = 'xml';
      const codeElement = document.createElement('code');
      codeElement.className = language;
      codeElement.innerHTML = hljs.highlight(block.textContent || '', {
        language,
      }).value;
      block.innerHTML = '';
      block.appendChild(codeElement);
    });

    return tempDiv.innerHTML;
  }

  private extractAndHighlightTS(htmlContent: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    const codeBlocksTS = tempDiv.querySelectorAll('pre[data-language="typescript"]');
    codeBlocksTS.forEach(block => {
      const language = 'typescript';
      const codeElement = document.createElement('code');
      codeElement.className = language;
      codeElement.innerHTML = hljs.highlight(block.textContent || '', {
        language,
      }).value;
      block.innerHTML = '';
      block.appendChild(codeElement);
    });

    return tempDiv.innerHTML;
  }
}
