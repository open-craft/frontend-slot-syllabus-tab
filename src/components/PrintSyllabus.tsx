import * as React from 'react';
import { useRef, useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button } from '@openedx/paragon';
import messages from '../messages';
import { type BlockResponse } from '../types';

const buildSyllabusForPrint = (intl, blocks, rootBlock) => {
  const makeList = (items: string[] | null) => {
    if (!items) {
      return '';
    }
    const itemsList = items.filter(item => !!item).join('</li><li>');
    return itemsList
      ? `<ul><li>${items.filter(item => !!item).join('</li><li>')}</li></ul>`
      : '';
  };
  const syllabusList = makeList(rootBlock.children.map(sectionId => `<h1>${blocks[sectionId].display_name}</h1>${
    makeList(blocks[sectionId].children.map(subsectionId => `<h2>${blocks[subsectionId].display_name}</h2>${
      makeList(blocks[subsectionId].children.map(unitId => `<h3>${blocks[unitId].display_name}</h3>${
        makeList(blocks[unitId].children.flatMap((blockId) => (
          blocks[blockId]?.links?.map(link => link.text)
        )))}`))}`))}`));

  const srcdoc = `<html>
  <head>
      <title>${intl.formatMessage(messages.syllabusTitle)}</title>
      <style>
          body > ul {
              padding: 0.125rem;
              margin: 0;
              list-style: none;
          }

          body > ul > li {
              border: 1px solid black;
              margin: 0.5rem 0;
              padding: 0 0.5rem;
          }

          body > ul > li > ul {
              break-after: auto;
              list-style: none;
          }

          body ul ul ul ul li:before {
              content: '\\01F517';
              margin-right: 0.5rem;
          }

          body ul ul ul ul {
              list-style: none;
              padding-left: 0;
          }

          body ul > li ul {
              break-after: auto;
          }

          li {
              break-inside: avoid;
          }

          ul {
              margin: 0;
              padding-left: 1rem;
              break-after: auto;
          }
      </style>
  </head>
  <body>
  ${syllabusList}
  </body>
  </html>
  `;
  return srcdoc;
};

export const PrintSyllabus = ({ blockData }: { blockData: BlockResponse }) => {
  const intl = useIntl();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [srcdoc, setSrcdoc] = useState('');

  const printSyllabus = () => {
    const blocks = blockData?.blocks;
    const rootBlock = blockData?.blocks[blockData.root];
    const srcdoc = buildSyllabusForPrint(intl, blocks, rootBlock);
    const iframe = document.createElement('iframe');
    iframe.setAttribute("style", "display:none");
    document.body.appendChild(iframe);
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(srcdoc);
    iframe.contentWindow.document.close();
    iframe.contentWindow.print();
  };

  return (
    <div className="d-flex justify-content-end my-2">
      <iframe
        srcDoc={srcdoc}
        ref={iframeRef}
        className="d-none"
        title={intl.formatMessage(messages.syllabusTitle)}
      />
      {iframeRef.current?.contentWindow && (
      <Button
        variant="outline-primary"
        onClick={() => printSyllabus()}
      >
          {intl.formatMessage(messages.print)}
      </Button>
      )}
    </div>
  );
};
