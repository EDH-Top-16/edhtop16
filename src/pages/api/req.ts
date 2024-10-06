import { requireDeprecationAcknowledgement } from "../../lib/server/deprecation";
import { reqApi } from "../../lib/server/legacy_api";

export default requireDeprecationAcknowledgement(reqApi);
