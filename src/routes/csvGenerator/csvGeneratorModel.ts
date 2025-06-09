import { z } from '@asteasolutions/zod-to-openapi';

// This defines the expected structure of the incoming request body.
export const CsvGeneratorRequestBodySchema = z.object({
  headers: z.array(z.string()).describe('An array of strings for the header row.'),
  data: z.array(z.array(z.string())).describe('An array of arrays, where each inner array represents a row of string data.'),
});

// This defines the structure of a successful response (the CSV file itself).
export const CsvGeneratorResponseSchema = z.string().describe('The CSV file content.').openapi({
  contentType: 'text/csv',
});
