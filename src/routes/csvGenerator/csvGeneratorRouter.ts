import { OpenAPIHono } from '@hono/zod-openapi';
import { CsvGeneratorRequestBodySchema, CsvGeneratorResponseSchema } from './csvGeneratorModel';

// Create a new router instance for our plugin
const app = new OpenAPIHono();

// Define the API endpoint
app.openapi(
  {
    method: 'post',
    path: '/csv-generator/generate',
    request: {
      body: {
        content: {
          'application/json': {
            schema: CsvGeneratorRequestBodySchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'The CSV file to be downloaded.',
        content: {
          'text/csv': {
            schema: CsvGeneratorResponseSchema,
          },
        },
      },
    },
  },
  // This is the function that runs when the AI calls our plugin
  (c) => {
    const { headers, data } = c.req.valid('json');

    const headerRow = headers.join(',');
    const dataRows = data.map(row => row.join(','));
    const csvContent = [headerRow, ...dataRows].join('\n');

    c.header('Content-Type', 'text/csv');
    c.header('Content-Disposition', 'attachment; filename="export.csv"');
    
    return c.body(csvContent, 200);
  }
);

export const csvGeneratorRouter = app;
