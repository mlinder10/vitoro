import systems from "./systems.json";

export async function GET() {
  let types: Record<string, Record<string, Record<string, boolean>>> = {};
  for (const system of systems) {
    for (const category of system.categories) {
      for (const subcategory of category.subcategories) {
        if (!types[system.name]) {
          types[system.name] = {};
        }
        if (!types[system.name][category.name]) {
          types[system.name][category.name] = {};
        }
        types[system.name][category.name][subcategory] = true;
      }
    }
  }
  return new Response(JSON.stringify(types));
}
