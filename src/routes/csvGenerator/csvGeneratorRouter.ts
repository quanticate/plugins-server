import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';

import { createApiRequestBody } from '@/api-docs/openAPIRequestBuilders';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { CsvGeneratorRequestBodySchema, CsvGeneratorResponseSchema } from './csvGeneratorModel';

// 1. CREATE THE OpenAPI REGISTRY FOR DOCUMENTATION
export const csvGeneratorRegistry = new OpenAPIRegistry();
csvGeneratorRegistry.register('CsvGenerator', CsvGeneratorResponseSchema);
csvGeneratorRegistry.registerPath({
  method: 'post',
  path: '/csv-generator/generate',
  tags: ['CSV Generator'],
  request: {
    body: createApiRequestBody(CsvGeneratorRequestBodySchema, 'application/json'),
  },
  responses: createApiResponse(CsvGeneratorResponseSchema, 'Success'),
});


// 2. CREATE THE EXPRESS ROUTER
export const csvGeneratorRouter: Router = (() => {
  const router = express.Router();

  router.post('/generate', (req: Request, res: Response) => {
    try {
      const { headers, data } = CsvGeneratorRequestBodySchema.parse(req.body);

      const headerRow = headers.join(',');
      const dataRows = data.map(row => row.join(','));
      const csvContent = [headerRow, ...dataRows].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="export.csv"');
      res.status(200).send(csvContent);

    } catch (error) {
      console.error('[CSV Generator Error]', error);
      res.status(400).json({ status: 'error', message: 'Invalid request body or an unexpected error occurred.' });
    }
  });

  return router;
})();
