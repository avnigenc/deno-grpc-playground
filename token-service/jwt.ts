import {
  create,
  // decode,
  getNumericDate,
  verify,
} from "https://deno.land/x/djwt@v2.8/mod.ts";

const key = await crypto.subtle.generateKey(
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["sign", "verify"],
);

export async function GenerateToken(sub: string): Promise<string> {
  const jti = crypto.randomUUID();

  return await create(
    { alg: "HS512", typ: "JWT" },
    {
      jti,
      sub,
      exp: getNumericDate(60 * 60),
    },
    key,
  );
}

export async function ValidateToken(token: string): Promise<boolean> {
  try {
    await verify(token, key);
    return true;
  } catch (e) {
    console.error(`[ERROR] | ValidateTokenException: ${e.message}\n${token}\n`);
    return false;
  }
}
