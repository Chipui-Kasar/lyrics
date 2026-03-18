// Create a new file: components/StructuredData.tsx
import React from "react";

interface StructuredDataProps {
  data: Record<string, any> | null | undefined;
}

export default function StructuredData({ data }: StructuredDataProps) {
  if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
    return null;
  }

  try {
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(data, null, 0),
        }}
      />
    );
  } catch (error) {
    console.error("Error generating structured data script:", error);
    return null;
  }
}

// Alternative: If you want to keep it in utils, make it a pure function that returns a string
// Add this to your utils file instead:

export function generateStructuredDataJSON(
  structuredData: Record<string, any> | null | undefined
): string | null {
  if (
    !structuredData ||
    typeof structuredData !== "object" ||
    Object.keys(structuredData).length === 0
  ) {
    return null;
  }

  try {
    return JSON.stringify(structuredData, null, 0);
  } catch (error) {
    console.error("Error serializing structured data:", error);
    return null;
  }
}
