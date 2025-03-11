export function getSimulatedStreamResponse(data: string) {
  const chunks = data.split(' ');

  return new ReadableStream({
    async start(controller) {
      // eslint-disable-next-line no-restricted-syntax
      for (const chunk of chunks) {
        const bytes = new TextEncoder().encode(`${chunk} `);
        controller.enqueue(bytes);
        await new Promise((r) =>
          setTimeout(
            r,
            // get a random number between 10ms and 50ms to simulate a random delay
            Math.floor(Math.random() * 40) + 10
          )
        );
      }
      controller.close();
    },
  });
}
