import { requireDeprecationAcknowledgement } from "../../lib/server/deprecation";
import { getCommandersApi } from "../../lib/server/legacy_api";

export default requireDeprecationAcknowledgement(getCommandersApi);
