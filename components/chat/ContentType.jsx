import React from 'react';
import Image from 'next/image';

export default function ContentType({ message }) {
  if (!message?.contentType) return null; // Handle undefined contentType

  switch (message.contentType) {
    case 'text/plain':
      return (
        <pre className="whitespace-pre-wrap text-sm">
          {message.content}
        </pre>
      );

    case 'image':
      return (
        <div className="w-48 h-48 relative">
          <Image
            src={message.content}
            alt="image"
            layout="fill"
            className="object-cover rounded-md"
          />
        </div>
      );

    case 'video':
      return (
        <video
          controls
          className="w-64 h-40 rounded-md"
          src={message.content}
        />
      );

    case 'document':
      return (
        <a
          href={message.content}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          View Document
        </a>
      );

    default:
      return <p className="text-gray-500">Unsupported content type</p>;
  }
}
