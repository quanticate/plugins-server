import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

// Schema for the request body from the AI
export const CsvGeneratorRequestBodySchema = z.object({
  headers: z.array(z.string()).openapi({
    description: 'An array of strings for the header row.',
  }),
  data: z.array(z.array(z.string())).openapi({
    description: 'An array of arrays, where each inner array represents a row of string data.',
  }),
});

// Schema for the successful response (the raw CSV text)
export const CsvGeneratorResponseSchema = z.string().openapi({
  description: 'The raw CSV file content.',
  contentType: 'text/csv', // Note: We declare the content type here for the documentation
});

// We export the types for use in our router file
export type CsvGeneratorRequestBody = z.infer<typeof CsvGeneratorRequestBodySchema>;
export type CsvGeneratorResponse = z.infer<typeof CsvGeneratorResponseSchema>;
