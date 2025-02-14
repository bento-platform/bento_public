// See https://github.com/Microsoft/TypeScript/issues/3496#issuecomment-128553540

export type JSONType = string | number | boolean | null | JSONObject | JSONArray;

interface JSONObject {
  [x: string]: JSONType;
}

// Cleaner name, need to use interfaces for circular referencing - see above
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface JSONArray extends Array<JSONType> {}
