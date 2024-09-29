import { NextApiHandler } from "next";

export function requireDeprecationAcknowledgement(
  handler: NextApiHandler,
): NextApiHandler {
  return function handlerWrapper(req, res) {
    if (req.headers["x-deprecation-acknowledgement"] !== "acknowledged") {
      res.status(403);
      res.send(
        "This API is deprecated. If still in use please contact EDHTop16 admins.",
      );

      return;
    }

    handler(req, res);
  };
}
