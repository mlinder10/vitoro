export async function GET(req: Request) {
  // get query param: "key"
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  return new Response(`${key}: ${process.env[key ?? ""]}`);
}
