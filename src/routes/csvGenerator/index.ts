import { FastifyPluginAsync } from 'fastify';

// Define the structure of the "work order" we expect from the AI.
interface RequestBody {
  headers: string[];
  data: string[][];
}

const csvGenerator: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // This sets up the "/csvGenerator" endpoint.
  // The 'schema' part tells the AI exactly what kind of data we expect.
  fastify.post<{ Body: RequestBody }>(
    '/',
    {
      schema: {
        body: {
          type: 'object',
          required: ['headers', 'data'],
          properties: {
            headers: { type: 'array', items: { type: 'string' } },
            data: { type: 'array', items: { type: 'array', items: { type: 'string' } } },
          },
        },
      },
    },
    // This is the function that runs when the AI calls our plugin.
    async function (request, reply) {
      const { headers, data } = request.body;

      // --- This is our simple "Interpreter" ---
      const headerRow = headers.join(',');
      const dataRows = data.map(row => row.join(','));
      const csvContent = [headerRow, ...dataRows].join('\n');
      // --- End of the Interpreter ---

      // --- This is the "Shipping Dock" ---
      reply.header('Content-Type', 'text/csv');
      reply.header('Content-Disposition', 'attachment; filename="export.csv"');
      reply.send(csvContent);
    }
  );
};

export default csvGenerator;
