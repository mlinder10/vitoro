export async function GET() {
  return new Response(process.env.JWT_KEY);
}
