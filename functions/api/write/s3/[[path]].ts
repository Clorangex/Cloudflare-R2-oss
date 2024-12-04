import { S3Client } from "@/utils/s3";
import {get_auth_status} from "@/utils/auth";

export async function onRequest(context) {
  const { request, env } = context;
  if(!get_auth_status(context)){
    var header = new Headers()
    header.set("WWW-Authenticate",'Basic realm="需要登录"')
    return new Response("没有操作权限", {
        status: 401,
        headers: header,
    });
   }
  const client = new S3Client(env.AWS_ACCESS_KEY_ID, env.AWS_SECRET_ACCESS_KEY);
  const forwardUrl = request.url.replace(
    /.*\/api\/write\/s3\//,
    `https://${env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com/`
  );

  return client.s3_fetch(forwardUrl, {
    method: request.method,
    body: request.body,
    headers: request.headers,
  });
}
