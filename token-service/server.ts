import { GrpcServer } from "https://deno.land/x/grpc_basic@0.4.6/server.ts";

import {
  BoolResult,
  GenerateTokenRequest,
  GenerateTokenResponse,
  RevokeTokenRequest,
  Token,
  ValidateTokenRequest,
} from "./token.d.ts";

import { GenerateToken, ValidateToken } from "./jwt.ts";
import { del, get, set } from "./redis.ts";

const port = 50051;
const server = new GrpcServer();
const protoPath = new URL("./token.proto", import.meta.url);
const protoFile = await Deno.readTextFile(protoPath);

const TokenService: Token = {
  async GenerateToken(
    request: GenerateTokenRequest,
  ): Promise<GenerateTokenResponse> {
    const { sub = "unknown" } = request;
    await Promise.all([]);
    const token = await GenerateToken(sub);
    await set(token, sub, 60 * 60);
    return { token };
  },
  async ValidateToken(
    request: ValidateTokenRequest,
  ): Promise<BoolResult> {
    const { token = "unknown" } = request;
    const isExists = await get(token);
    if (!isExists) return { result: false };
    const result = await ValidateToken(token);
    return { result };
  },
  async RevokeToken(request: RevokeTokenRequest): Promise<BoolResult> {
    const { token = "unknown" } = request;
    await del(token);
    return { result: true };
  },
};

server.addService<Token>(protoFile, { ...TokenService });

console.log(`[INFO] | gRPC server listen on port: ${port}`);

for await (const conn of Deno.listen({ port })) {
  server.handle(conn);
}
