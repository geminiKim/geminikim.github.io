import { serializeStructuredData } from '../src/lib/serialize-structured-data.mjs';

const payload = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: 'Explaining </script><script>alert(1)</script>',
};
const serialized = serializeStructuredData(payload);

if (serialized.includes('<') || serialized.includes('</script>')) {
  console.error('Structured-data serialization must escape HTML tag openers');
  process.exit(1);
}
if (JSON.parse(serialized).headline !== payload.headline) {
  console.error('Structured-data serialization must preserve the original JSON value');
  process.exit(1);
}

console.log('Structured-data serialization contract passed');
